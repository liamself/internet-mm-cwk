$(document).ready(function(){
    receptionBookingRefresh();
});

function receptionBookingRefresh()
{
    $.ajax({
        url: "/get_current_bookings",
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
                row.append($("<td/>").text(date_ddmmyyyy(r.checkin)));
                row.append($("<td/>").text(date_ddmmyyyy(r.checkout)));

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
        url: "/change_status",
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
        url: "/get_checkin_bookings",
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