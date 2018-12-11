bookingDetails = function() { //Wrap in function to avoid global variables
    var bRef;
    $(document).ready(function () {
        bRef = getObject("bRef");
        refreshDetails();
    });

    function refreshDetails() {
        $.ajax({
            url: "/admin_booking_details",
            type: "POST",
            data: JSON.stringify({
                bref: bRef
            }),
            success: function (rt) {
                var json = JSON.parse(rt); // the returned data will be an array
                //Clear table
                formatPage(json);
            }
        });
    }

    function onClickCheckOutAll() {
        $.ajax({
            url: "/check_out_all",
            type: "POST",
            data: bRef.toString(),
            success: function (rt) {
                refreshDetails();
            }
        });
    }

    function onClickCheckInAll() {
        $.ajax({
            url: "/check_in_all",
            type: "POST",
            data: bRef.toString(),
            success: function (rt) {
                refreshDetails();
            }
        });
    }

    function checkInRoom(roomNo) {
        var data = {
            roomID: roomNo,
            status: 'O'
        };
        $.ajax({
            url: "/change_status",
            type: "POST",
            data: JSON.stringify(data),
            success: function (rt) {
                refreshDetails();
            }
        });
    }

    function checkOutRoom(roomNo) {
        var data = {
            roomID: roomNo,
            status: 'C'
        };
        $.ajax({
            url: "/change_status",
            type: "POST",
            data: JSON.stringify(data),
            success: function (rt) {
                refreshDetails();
            }
        });
    }



    function formatPage(rooms) {
        if (rooms.length > 0) {
            var name = rooms[0].c_name;
            var bRef = rooms[0].b_ref;
            var price = rooms[0].b_cost;
            var outstanding = rooms[0].b_outstanding;
            var notes = rooms[0].b_notes; //todo

            $("#booking-no").text(bRef);
            $("#booking-name").text(name);
            $("#booking-price").text(price);
            $("#booking-outstanding").text(outstanding);
            $("#booking-notes").text(notes);

            var table = $("#room-body");
            //Populate with new data
            table.empty();
            $.each(rooms, function (rowIndex, r) {
                var row = $("<tr/>");
                row.append($("<td/>").text(r.r_no));
                row.append($("<td/>").text(roomClassToString(r.r_class)));
                row.append($("<td/>").text(r.r_status));
                row.append($("<td/>").text(r.checkin));
                row.append($("<td/>").text(r.checkout));
                row.append($("<td/>").text(r.r_notes));

                //Get correct button
                if (r.r_status === 'A') {
                    row.append($("<td/>")
                        .append($('<a />', {
                            class: 'btn btn-light',
                            onclick: 'bookingDetails.checkInRoom(' + r.r_no +')',
                            text: "Check in"
                        })));
                } else if (r.r_status === 'O') {
                    row.append($("<td/>")
                        .append($('<a />', {
                            class: 'btn btn-light',
                            onclick: 'bookingDetails.checkOutRoom(' + r.r_no +')',
                            text: "Check out"
                        })));
                } else { // Show no button
                    row.append($("<td/>"));
                }

                table.append(row);
            });
        }
    }

    //Public functions
    return {
        onclickCheckOutAll: onClickCheckOutAll,
        onclickCheckInAll: onClickCheckInAll,
        checkInRoom: checkInRoom,
        checkOutRoom: checkOutRoom
    }
}();