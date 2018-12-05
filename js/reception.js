$(document).ready(function(){
    receptionRoomRefresh();
});

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

                var btnDisabled = r.status === 'X';
                var roomBtn = $('<button />', {
                    class: 'btn btn-light'
                });
                roomBtn.prop('disabled', btnDisabled);
                if (r.r_status === 'C') {
                    roomBtn.text("Check In");
                    roomBtn.attr('onclick', 'onClickCheckInRoom(' + r.r_no + ')');
                } else {
                    roomBtn.text("Check Out");
                    roomBtn.attr('onclick', 'onClickCheckOutRoom(' + r.r_no + ')');
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
}

function onClickCheckOutRoom(roomId) {
    $.ajax({
        url: "http://127.0.0.1:8081/change_status",
        type: "POST",
        data: JSON.stringify({
            roomID: roomId,
            status: 'C'
        }),
        success: function(rt) {
            receptionRoomRefresh();
        },
        error: function(err){
            alert(err.message);
        }
    });
}

function onClickCheckInRoom(roomId) {
    $.ajax({
        url: "http://127.0.0.1:8081/change_status",
        type: "POST",
        data: JSON.stringify({
            roomID: roomId,
            status: 'A'
        }),
        success: function(rt) {
            receptionRoomRefresh();
        },
        error: function(err){
            alert(err.message);
        }
    });
}

function roomClassToString(status) {
    switch (status) {
        case "sup_d":
            return "Superior Double";
        case "std_d":
            return "Standard Double";
        case "sup_t":
            return "Standard Twin";
        case "std_t":
            return "Standard Twin";
        default:
            return status;
    }
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