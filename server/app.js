var http = require('http');

// the quick and dirty trick which prevents crashing.
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

var app = http.createServer(function (req, res) {
    console.log(req.url);
    console.log(req.method);

    // Website you wish to allow to connect
    // add this line to address the cross-domain XHR issue.
    res.setHeader('Access-Control-Allow-Origin', '*');


    switch (req.url) {
        case '/admin_payment_details':
            var body = '';
            if (req.method === 'POST') {
                req.on('data', function (data) {
                    body += data;
                    console.log("Partial body: " + body);
                }).on('end', async function () {
                    var json = JSON.parse(body);
                    var result = await getPaymentDetails(json.bref);
                    res.end(result);
                });
            }
            break;
        case '/admin_booking_details':
            var body = '';
            if (req.method === 'POST') {
                req.on('data', function (data) {
                    body += data;
                    console.log("Partial body: " + body);
                }).on('end', async function () {
                    var json = JSON.parse(body);
                    var result = await getBookingDetails(json.bref);
                    res.end(result);
                });
            }
            break;
        case '/get_current_bookings': //Gets a list of all bookings with a checkout date after (or equal to) current day
            if (req.method === 'POST') {
                console.log("POST");
                var body = '';
                req.on('data', function (data) {
                    body += data;
                    console.log("Partial body: " + body);
                });
                req.on('end', async function () {

                    const {Client} = require('pg');
                    const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';

                    const client = new Client({
                        connectionString: connectionString,
                    });
                    await client.connect(); // create a database connection
                    await client.query("SET search_path TO 'hotelbooking';");

                    const text = 'SELECT * FROM(SELECT DISTINCT ON (roombooking.b_ref) roombooking.b_ref, customer.c_name, roombooking.checkin, roombooking.checkout FROM roombooking, booking, customer\n' +
                        'WHERE roombooking.b_ref=booking.b_ref AND customer.c_no=booking.c_no\n' +
                        'AND roombooking.checkout >= NOW()\n' +
                        'ORDER BY roombooking.b_ref) bookings ORDER BY checkout;';
                    const res1 = await client.query(text);
                    console.log("Query finished");
                    console.log(res1);
                    await client.end();
                    var json = res1.rows;
                    var json_str_new = JSON.stringify(json);

                    res.end(json_str_new);
                });
            }
            break;
        case '/get_form':
            if (req.method == 'POST') {
                console.log("POST");
                var body = '';
                req.on('data', function (data) {
                    body += data;
                    console.log("Partial body: " + body);
                });
                req.on('end', async function () {
                    console.log("Body: " + body);
                    var json = JSON.parse(body);
                    console.log("name is " + json.studentName); // get name

                    const {Client} = require('pg');
                    const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';

                    const client = new Client({
                        connectionString: connectionString,
                    });
                    await client.connect(); // create a database connection

                    // the below is an insertion SQL command template
                    const text = 'INSERT INTO people(name, course, adviser) VALUES($1, $2, $3) RETURNING *';
                    const values = [json.studentName, json.course, json.adviser];

                    // here we execute the data insertion command
                    const res1 = await client.query(text, values);

                    // after the insertion, we return the complete table.
                    const res2 = await client.query('SELECT * FROM people');
                    await client.end();
                    json = res2.rows;
                    var json_str_new = JSON.stringify(json);
                    console.log(json_str_new);
                    res.end(json_str_new);
                });
            }
            break;
        case '/get_rooms':
            if (req.method === 'POST') {
                console.log("POST");
                var body = '';
                req.on('data', function (data) {
                    body += data;
                    console.log("Partial body: " + body);
                });
                req.on('end', async function () {

                    const {Client} = require('pg');
                    const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';

                    const client = new Client({
                        connectionString: connectionString,
                    });
                    await client.connect(); // create a database connection
                    await client.query("SET search_path TO 'hotelbooking';");

                    // the below is an insertion SQL command template
                    const text = 'SELECT * FROM hotelbooking.room ORDER BY r_no;';
                    const res1 = await client.query(text);
                    await client.end();
                    json = res1.rows;
                    var json_str_new = JSON.stringify(json);

                    //console.log(json_str_new);
                    res.end(json_str_new);
                });
            }
            break;

        case '/change_status':
            if (req.method === 'POST') {
                console.log("POST");
                var body = '';
                req.on('data', function (data) {
                    body += data;
                    console.log("Partial body: " + body);
                });
                req.on('end', async function () {
                    console.log("Changing room  " + body);
                    var json = JSON.parse(body);
                    //console.log(json);
                    var roomId = json.roomID;
                    var status = json.status;

                    const {Client} = require('pg');
                    const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';

                    const client = new Client({
                        connectionString: connectionString,
                    });
                    await client.connect(); // create a database connection

                    const text = "UPDATE hotelbooking.room SET r_status = $1 WHERE r_no = $2 RETURNING *;";
                    const values = [status, roomId];

                    // here we execute the data insertion command
                    const res1 = await client.query(text, values);


                    await client.end();
                    console.log(res1);
                    json = res1.rows;
                    var json_str_new = JSON.stringify(json);
                    console.log(json_str_new);
                    res.end(json_str_new);
                });
            }
            break;
        default:
            console.log("req.url");
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('error');
    }
});

async function checkInRoom(roomID) {
    const {Client} = require('pg');
    const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';

    const client = new Client({
        connectionString: connectionString,
    });
    await client.connect(); // create a database connection
    await client.query("SET search_path TO 'hotelbooking';");

    // the below is an insertion SQL command template
    const text = 'SELECT * FROM hotelbooking.room;';
    const res1 = await client.query(text);
    await client.end();
    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    return json_str_new;
}

async function getBookingDetails(bRef) {
    const {Client} = require('pg');
    const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';

    const client = new Client({
        connectionString: connectionString,
    });
    await client.connect(); // create a database connection
    await client.query("SET search_path TO 'hotelbooking';");
    var query = "SELECT room.r_no, r_class, r_status, r_notes, c_name, checkin, checkout, booking.b_ref, b_cost, b_outstanding FROM room \n" +
        "JOIN roombooking ON room.r_no=roombooking.r_no\n" +
        "JOIN booking ON roombooking.b_ref=booking.b_ref\n" +
        "JOIN customer ON customer.c_no=booking.c_no\n" +
        "WHERE booking.b_ref=" + bRef + ";";
    console.log(query);
    const res1 = await client.query(query);
    console.log(res1);
    await client.end();
    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    return json_str_new;
}

async function getPaymentDetails(bRef) {
    const {Client} = require('pg');
    const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';

    const client = new Client({
        connectionString: connectionString,
    });
    await client.connect(); // create a database connection
    await client.query("SET search_path TO 'hotelbooking';");
    var query = "SELECT customer.c_no, c_name, c_cardtype, c_cardexp, c_cardno, b_ref,  b_cost, b_outstanding\n" +
        "FROM customer, booking WHERE customer.c_no=booking.c_no AND b_ref=" + bRef + ";";
    console.log(query);
    const res1 = await client.query(query);
    console.log(res1);
    await client.end();
    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    return json_str_new;
}

async function processPayment(bRef) {
    const {Client} = require('pg');
    const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';

    const client = new Client({
        connectionString: connectionString,
    });
    await client.connect(); // create a database connection
    await client.query("SET search_path TO 'hotelbooking';");
    var query = "SELECT customer.c_no, c_name, c_cardtype, c_cardexp, c_cardno, b_ref,  b_cost, b_outstanding\n" +
        "FROM customer, booking WHERE customer.c_no=booking.c_no AND b_ref=" + bRef + ";";
    console.log(query);
    const res1 = await client.query(query);
    console.log(res1);
    await client.end();
    json = res1.rows;
    var json_str_new = JSON.stringify(json);
    return json_str_new;
}

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port)
});
