$(document).ready(function(){
    receptionBookingRefresh();
});
/*
function receptionRoomRefresh() {
    $.ajax({
        url: "http://127.0.0.1:8081/get_rooms",
        type: "POST",
        data: "",
        success: function(rt) {
            var json = JSON.parse(rt); // the returned data will be an array
            //Clear table
            $("#room-body").empty();
            //Populate with new data
            var table = $("#room-body");
            $.each(json, function(rowIndex, r) {
                var row = $("<tr/>");
                row.append($("<td/>").text(r.r_no));
                row.append($("<td/>").text(roomClassToString(r.r_class)));
                row.append($("<td/>").text(r.r_status));

                var btnDisabled = (r.r_status === 'X' || r.r_status === 'C');
                var roomBtn = $('<button />', {
                    class: 'btn btn-light'
                });
                roomBtn.prop('disabled', btnDisabled);
                if (r.r_status === 'O') {
                    roomBtn.text("Check Out");
                    roomBtn.attr('onclick', 'onClickCheckOutRoom(' + r.r_no + ')');
                } else {
                    roomBtn.text("Check In");
                    roomBtn.attr('onclick', 'onClickCheckInRoom(' + r.r_no + ')');
                }

                row.append($("<td/>")
                    .append(roomBtn));
                table.append(row);
            });
        },
        error: function(err){
            alert(err.message);
        }
    });
}*/

function receptionBookingRefresh()
{
    $.ajax({
        url: "http://127.0.0.1:8081/get_current_bookings",
        type: "POST",
        data: "",
        success: function(rt) {
            var json = JSON.parse(rt); // the returned data will be an array
            var table = $("#booking-body");
            //Clear table
            table.empty();
            //Populate with new data
            $.each(json, function(rowIndex, r) {
                var row = $("<tr/>");
                row.append($("<td/>").text(r.b_ref));
                row.append($("<td/>").text(r.c_name));
                row.append($("<td/>").text(r.checkin));
                row.append($("<td/>").text(r.checkout));

                var roomBtn = $('<button />', {
                    class: 'btn btn-light',
                    text: "Details"
                });
                roomBtn.attr('onclick', 'onClickViewBookingDetails(' + r.b_ref + ')');

                row.append($("<td/>")
                    .append(roomBtn));
                table.append(row);
            });
        },
        error: function(err){
            alert(err.message);
        }
    });
}

function onClickViewBookingDetails(bRef) {
    setObject("bRef", bRef);
    window.location.href = 'reception_booking_details.html';
}

function onClickCheckOutRoom(roomId, ) {
    changeStatus(roomId, "C")
}

function onClickCheckInRoom(roomId) {
    changeStatus(roomId, "O")
}

function changeStatus(roomId, status) {
    $.ajax({
        url: "http://127.0.0.1:8081/change_status",
        type: "POST",
        data: JSON.stringify({
            roomID: roomId,
            status: status
        }),
        success: function(rt) {
            receptionRoomRefresh();
        },
        error: function(err){
            alert(err.message);
        }
    });
}


function refreshCheckIn() {
    $.ajax({
        url: "http://127.0.0.1:8081/get_checkin_bookings",
        type: "POST",
        data: "",
        success: function(rt) {
            var json = JSON.parse(rt); // the returned data will be an array
            //Clear table
            var table = $("#checkin-body");
            //Populate with new data
            table.empty();
            $.each(json, function(rowIndex, r) {
                var row = $("<tr/>");
                $.each(r, function(colIndex, c) {
                    row.append($("<td/>").text(c));
                });
                row.append($("<td/>")
                    .append($('<a />', {
                        class: 'btn btn-light',
                        text: "Check in"
                    })));
                table.append(row);
            });
        },
        error: function(err){
            alert(err.message);
        }
    });
}