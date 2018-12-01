var http = require('http');

// the quick and dirty trick which prevents crashing.
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

var app = http.createServer(function (req, res) {
    console.log(req.url)
    console.log(req.method)

    // Website you wish to allow to connect
    // add this line to address the cross-domain XHR issue.
    res.setHeader('Access-Control-Allow-Origin', '*');

    switch (req.url) {
        case '/get_checkout_bookings':
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
                    const text = 'SELECT DISTINCT ON(roombooking.b_ref) roombooking.b_ref, customer.c_name, roombooking.checkin, roombooking.checkout FROM room, roombooking, booking, customer \n' +
                        '\tWHERE \troom.r_no=roombooking.r_no \n' +
                        '\t\tAND roombooking.b_ref=booking.b_ref\n' +
                        '\t\tAND\tbooking.c_no=customer.c_no\n' +
                        '\t\tAND room.r_status=\'C\';';
                    const res1 = await client.query(text);
                    await client.end();
                    json = res1.rows;
                    var json_str_new = JSON.stringify(json);

                    //console.log(json_str_new);
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
                    var json = JSON.parse(body)
                    console.log("name is " + json.studentName) // get name

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
        default:
            console.log("req.url");
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('error');
    }
});
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port)
});
