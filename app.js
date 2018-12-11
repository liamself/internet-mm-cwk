//var http = require('http');
const express = require('express');

const expressApp = express();
const port = 55554;

// the quick and dirty trick which prevents crashing.
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});


expressApp.use(express.static('static', {index:false, extensions:['html']}));

expressApp.use('/', express.static('static'));
expressApp.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

expressApp.post('/get_booking', function(req, res) {
    var bRef = "";
    req.on('data', function(data) {
        bRef = data;
    }).on('end', async function() {
        var booking = await getBooking(bRef);
        res.end(booking);
    });
});

expressApp.post('/admin_payment_details', function(req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
        console.log("Partial body: " + body);
    }).on('end', async function () {
        var json = JSON.parse(body);
        var result = await getPaymentDetails(json.bref);
        res.end(result);
    });
});

expressApp.post('/admin_booking_details', function(req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
        console.log("Partial body: " + body);
    }).on('end', async function () {
        var json = JSON.parse(body);
        var result = await getBookingDetails(json.bref);
        res.end(result);
    });
});

expressApp.post('/get_current_bookings', function(req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
        console.log("Partial body: " + body);
    });
    req.on('end', async function () {
        res.end(await queryDB('SELECT * FROM(SELECT DISTINCT ON (roombooking.b_ref) roombooking.b_ref, customer.c_name, roombooking.checkin, roombooking.checkout FROM roombooking, booking, customer\n' +
            'WHERE roombooking.b_ref=booking.b_ref AND customer.c_no=booking.c_no\n' +
            'AND roombooking.checkout >= NOW()\n' +
            'ORDER BY roombooking.b_ref) bookings ORDER BY checkout;'));
    });
});
expressApp.post('/get_form', function(req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
        console.log("Partial body: " + body);
    });
    req.on('end', async function () {
        console.log("Body: " + body);
        var json = JSON.parse(body);
        //console.log("name is " + json.studentName) // get name
        //json.studentName = json.studentName + "_changed";
        //json_str_new = JSON.stringify(json)
        const {Client} = require('pg');
        const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';
        const client = new Client({connectionString: connectionString});
        await client.connect();
        // ISSUE OCCURRING
        //var para = [json.arrive, json.departure, json.DStno, json.DSuno, json.TStno, json.TSuno];

        // Check Availability SQL Queries
        var check_1;
        var check1 = await client.query("SELECT COUNT(*) from hotelbooking.room WHERE r_no NOT IN(SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.arrive + "' AND checkout <= '" + json.departure + "') AND r_class = 'std_d'");

        const check_1_rows = check1.rows;

        for(let i = 0; i < check_1_rows.length; i++) {
            check_1 = check_1_rows[i].count;
        }
        var check_2;
        var check2 = await client.query("SELECT COUNT(*) from hotelbooking.room WHERE r_no NOT IN (SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.arrive + "' AND checkout <= '" + json.departure + "') AND r_class = 'sup_d'");
        const check_2_rows = check2.rows;

        for(let i = 0; i < check_2_rows.length; i++) {
            check_2 = check_2_rows[i].count;
        }

        var check_3;
        var check3 = await client.query("SELECT COUNT(*) from hotelbooking.room WHERE r_no NOT IN (SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.arrive + "' AND checkout <= '" + json.departure + "') AND r_class = 'std_t'");
        const check_3_rows = check3.rows;

        for(let i = 0; i < check_3_rows.length; i++) {
            check_3 = check_3_rows[i].count;
        }

        var check_4;
        var check4 = await client.query("SELECT COUNT(*) from hotelbooking.room WHERE r_no NOT IN(SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.arrive + "' AND checkout <= '" + json.departure + "') AND r_class = 'sup_t'");
        const check_4_rows = check4.rows;

        for(let i = 0; i < check_4_rows.length; i++) {
            check_4 = check_4_rows[i].count;
        }

        await client.end();
        var result;
        // Availability Room Finder
        if (json.DStno <= check_1 && json.DSuno <= check_2 && json.TStno <= check_3 && json.TSuno <= check_4){
            result = {
                roomsAvailable: true,
                stdD: check1.rows[0].count,
                supD: check2.rows[0].count,
                stdT: check3.rows[0].count,
                supT: check4.rows[0].count
            }
        }
        else
        {
            result = {
                roomsAvailable: false,
                stdD: check1.rows[0].count,
                supD: check2.rows[0].count,
                stdT: check3.rows[0].count,
                supT: check4.rows[0].count
            };
        }
        res.end(JSON.stringify(result));
    });
});
expressApp.post('/get_rooms', function(req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
        console.log("Partial body: " + body);
    });
    req.on('end', async function () {
        res.end(await queryDB('SELECT r_no, r_status FROM room ORDER BY r_no;'));
    });
});
expressApp.post('/process_booking', function(req, res) {
    var body = "";
    req.on('data', function (data) {
        console.log(data);
        body += data;
        console.log("Partial body: " + body);
    });
    req.on('end', async function () {
        console.log("Body: " + body);
        var json = JSON.parse(body)
        console.log(json);
        const {Client} = require('pg');
        const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';
        const client = new Client({connectionString: connectionString});
        await client.connect();
        // Check Availability SQL Queries
        var check_1;
        var check1 = await client.query("SELECT COUNT(*) from hotelbooking.room WHERE r_no NOT IN(SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.availabilityData.arrive + "' AND checkout <= '" + json.availabilityData.departure + "') AND r_class = 'std_d'");

        const check_1_rows = check1.rows;

        for(let i = 0; i < check_1_rows.length; i++) {
            check_1 = check_1_rows[i].count;
        }

        var check_2;
        var check2 = await client.query("SELECT COUNT(*) from hotelbooking.room WHERE r_no NOT IN (SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.availabilityData.arrive + "' AND checkout <= '" + json.availabilityData.departure + "') AND r_class = 'sup_d'");

        const check_2_rows = check2.rows;

        for(let i = 0; i < check_2_rows.length; i++) {
            check_2 = check_2_rows[i].count;
        }

        var check_3;
        var check3 = await client.query("SELECT COUNT(*) from hotelbooking.room WHERE r_no NOT IN (SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.availabilityData.arrive + "' AND checkout <= '" + json.availabilityData.departure + "') AND r_class = 'std_t'");

        const check_3_rows = check3.rows;

        for(let i = 0; i < check_3_rows.length; i++) {
            check_3 = check_3_rows[i].count;
        }

        var check_4;
        var check4 = await client.query("SELECT COUNT(*) from hotelbooking.room WHERE r_no NOT IN(SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.availabilityData.arrive + "' AND checkout <= '" + json.availabilityData.departure + "') AND r_class = 'sup_t'");

        const check_4_rows = check4.rows;

        for(let i = 0; i < check_4_rows.length; i++) {
            check_4 = check_4_rows[i].count;
        }


        // Availability Room Finder
        if (json.availabilityData.DStno <= check_1 && json.availabilityData.DSuno <= check_2 && json.availabilityData.TStno <= check_3 && json.availabilityData.TSuno <= check_4){

            //List of Rooms
            var room_type_1_list = [];
            var room_type_2_list = [];
            var room_type_3_list = [];
            var room_type_4_list = [];
            var totalcosts = [];


            //Booking Reference
            var bookingref = "";
            var booking_ref = await client.query('SELECT MAX(b_ref)+1 as ref from hotelbooking.booking');
            const booking_rows = booking_ref.rows;
            for (let i = 0; i < booking_rows.length; i++) {
                console.log('Booking Ref: ' + booking_rows[i].ref);
                bookingref = booking_rows[i].ref;
            }
            console.log("BOOKING REF IS " + bookingref);

            var customerno;
            var customer_no = await client.query('SELECT MAX(c_no)+1 as cno from hotelbooking.customer');
            const customer_rows = customer_no.rows;
            for (let i = 0; i < customer_rows.length; i++) {
                console.log('Customer No: ' + customer_rows[i].cno);
                customerno = customer_rows[i].cno;
            }

            const res1a = await client.query("INSERT INTO hotelbooking.customer(c_no, c_name, c_email, c_address, c_cardtype, c_cardexp, c_cardno) VALUES ( " + customerno + ", '" + json.bookingData.c_name + "', '" + json.bookingData.c_email + "', '" + json.bookingData.c_address + "', '" + json.bookingData.c_cardtype + "', '" + json.bookingData.c_cardexp + "', '" + json.bookingData.c_cardno + "')");
            const res1b = await client.query("INSERT INTO hotelbooking.booking(b_ref, c_no, b_notes) VALUES(" + bookingref + ", " + customerno + ", '" + json.bookingData.b_notes + "')");


            if(json.availabilityData.DStno > 0){

                var roomtype_1_query = "SELECT r_no from hotelbooking.room WHERE r_no NOT IN (SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.availabilityData.arrive + "' AND checkout <= '" + json.availabilityData.departure + "') AND r_class = 'std_d' limit " + json.availabilityData.DStno;

                const room_type_1 = await client.query(roomtype_1_query);
                const{rows} = room_type_1;

                for (let i = 0; i< rows.length; i++){
                    room_type_1_list.push(rows[i].r_no);
                    console.log("Double Standard Rooms: " + rows[i].r_no);
                }

                for (let i = 0; i< room_type_1_list.length; i++){

                    const res1 = await client.query("INSERT INTO hotelbooking.roombooking(r_no, b_ref, checkin, checkout) VALUES( " + room_type_1_list[i] + ", " + bookingref + ", '" + json.availabilityData.arrive + "', '" +  json.availabilityData.departure + "')");
                }
            }

            if(json.availabilityData.DSuno > 0){

                var roomtype_2_query = "SELECT r_no from hotelbooking.room WHERE r_no NOT IN (SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.availabilityData.arrive + "' AND checkout <= '" + json.availabilityData.departure + "') AND r_class = 'sup_d' limit " + json.availabilityData.DSuno;

                const room_type_2 = await client.query(roomtype_2_query);
                const{rows} = room_type_2;

                for (let i = 0; i< rows.length; i++){
                    room_type_2_list.push(rows[i].r_no);
                    console.log("Double Superior Rooms: " + rows[i].r_no);
                }

                for (let i = 0; i< room_type_2_list.length; i++){

                    const res2 = await client.query("INSERT INTO hotelbooking.roombooking(r_no, b_ref, checkin, checkout) VALUES( " + room_type_2_list[i] + ", " + bookingref + ", '" + json.availabilityData.arrive + "', '" +  json.availabilityData.departure + "')");
                }
            }

            if(json.availabilityData.TStno > 0){

                var roomtype_3_query = "SELECT r_no from hotelbooking.room WHERE r_no NOT IN (SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.availabilityData.arrive + "' AND checkout <= '" + json.availabilityData.departure + "') AND r_class = 'std_t' limit " + json.availabilityData.TStno;

                const room_type_3 = await client.query(roomtype_3_query);
                const{rows} = room_type_3;

                for (let i = 0; i< rows.length; i++){
                    room_type_3_list.push(rows[i].r_no);
                    console.log("Twin Standard Rooms: " + rows[i].r_no);
                }

                for (let i = 0; i< room_type_3_list.length; i++){

                    const res3 = await client.query("INSERT INTO hotelbooking.roombooking(r_no, b_ref, checkin, checkout) VALUES( " + room_type_3_list[i] + ", " + bookingref + ", '" + json.availabilityData.arrive + "', '" +  json.availabilityData.departure + "')");
                }
            }

            if(json.availabilityData.TSuno > 0){

                var roomtype_4_query = "SELECT r_no from hotelbooking.room WHERE r_no NOT IN (SELECT r_no FROM hotelbooking.roombooking WHERE checkin >= '" + json.availabilityData.arrive + "' AND checkout <= '" + json.availabilityData.departure + "') AND r_class = 'sup_t' limit " + json.availabilityData.TSuno;

                const room_type_4 = await client.query(roomtype_4_query);
                const{rows} = room_type_4;

                for (let i = 0; i< rows.length; i++){
                    room_type_4_list.push(rows[i].r_no);
                    console.log("Twin Superior Rooms: " + rows[i].r_no);
                }

                for (let i = 0; i< room_type_4_list.length; i++){

                    const res4 = await client.query("INSERT INTO hotelbooking.roombooking(r_no, b_ref, checkin, checkout) VALUES( " + room_type_4_list[i] + ", " + bookingref + ", '" + json.availabilityData.arrive + "', '" +  json.availabilityData.departure + "')");
                }
            }

            var total_Costs_Query = "SELECT b.b_ref, (rb.checkout-rb.checkin) as noofnights, count(rb.r_no) as noofrooms, sum(rt.price*(rb.checkout-rb.checkin)) as total FROM hotelbooking.booking b, hotelbooking.rates rt, hotelbooking.roombooking rb, hotelbooking.room rm WHERE b.b_ref=rb.b_ref and rb.r_no=rm.r_no and rm.r_class=rt.r_class and b.b_ref = " + bookingref + " group by b.b_ref, noofnights";

            const total_Costs = await client.query(total_Costs_Query);
            const{rows} = total_Costs;

            for (let i = 0; i< rows.length; i++){

                totalcosts.push(rows[i].total);
            }

            for (let i = 0;  i< totalcosts.length; i++){

                const insertCosts = await client.query ("UPDATE hotelbooking.booking SET b_cost = " + totalcosts[i] + ", b_outstanding = " + totalcosts[i] + " WHERE b_ref = (" + bookingref + ")");

                console.log("TOTAL COSTS " + totalcosts[i]);
            }

        }
        await client.end();
        console.log("Ending with ref " + bookingref);
        res.end(bookingref.toString());

    });
});
expressApp.post('/change_status', function(req, res) {
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

        const text = "UPDATE hotelbooking.room SET r_status = $1 WHERE r_no = $2 RETURNING *;";
        const values = [status, roomId];

        // here we execute the data insertion command
        res.end(await queryDBWithValues(text, values));
    });
});

expressApp.listen(port, () => console.log(`Example app listening on port ${port}!`));


async function checkInRoom(roomID) {
    return await queryDB('SELECT * FROM hotelbooking.room;');
}

async function getBookingDetails(bRef) {
    return await queryDB("SELECT room.r_no, r_class, r_status, r_notes, c_name, checkin, checkout, booking.b_ref, b_cost, booking.b_notes, b_outstanding FROM room \n" +
        "JOIN roombooking ON room.r_no=roombooking.r_no\n" +
        "JOIN booking ON roombooking.b_ref=booking.b_ref\n" +
        "JOIN customer ON customer.c_no=booking.c_no\n" +
        "WHERE booking.b_ref=" + bRef + ";");
}

async function getPaymentDetails(bRef) {
    return await queryDB("SELECT customer.c_no, c_name, c_cardtype, c_cardexp, c_cardno, b_ref,  b_cost, b_outstanding\n" +
        "FROM customer, booking WHERE customer.c_no=booking.c_no AND b_ref=" + bRef + ";");
}

async function processPayment(bRef) {
    return await queryDB("SELECT customer.c_no, c_name, c_cardtype, c_cardexp, c_cardno, b_ref,  b_cost, b_outstanding\n" +
        "FROM customer, booking WHERE customer.c_no=booking.c_no AND b_ref=" + bRef + ";");
}

async function getBooking(bRef) {
    return await queryDB("SELECT * FROM booking WHERE b_ref='" + bRef + "';");
}

async function queryDB(query, client) {
    var _client;
    if (client == null) _client = await getConnection();
    await _client.query("SET search_path TO 'hotelbooking';");
    const result = await _client.query(query);
    var rows = result.rows;
    if (client === null) await _client.end();
    return JSON.stringify(rows);
}

async function queryDBWithValues(query, values, client) {
    var _client;
    if (client == null) {
        _client = await getConnection();
    }
    await _client.query("SET search_path TO 'hotelbooking';");
    const result = await _client.query(query, values);
    var rows = result.rows;
    if (client === null) await _client.end();
    return JSON.stringify(rows);
}

//Connects to the database and returns a client to process queries.
//Client connection should be ended within each calling function.
async function getConnection() {
    const {Client} = require('pg');
    const connectionString = 'postgresql://groupdk:groupdk@cmp-18stunode.cmp.uea.ac.uk/groupdk';
    const client = new Client({
        connectionString: connectionString,
    });
    await client.connect(); // create a database connection
    return client;
}