$(document).ready(function(){
    housekeepingRefresh();
});


//Currently has a roomBtn - may need changing if this will cause conflicts with liam's 

function housekeepingRefresh() {
    $.ajax({
        url: "/get_rooms",
        type: "POST",
        data: "",
        success: function(rt) {
            var json = JSON.parse(rt); // the returned data will be an array
            //Clear table
            $("#housekeeping-body").empty();
            //Populate with new data
            var table = $("#housekeeping-body");
            $.each(json, function(rowIndex, r) {
                var row = $("<tr/>");
                row.append($("<td/>").text(r.r_no));
                //row.append($("<td/>").text(roomClassToString(r.r_class)));
                row.append($("<td/>").text(r.r_status));


                if (r.r_status === 'C') {
                    row.addClass("table-warning");
                } else if (r.r_status === 'X') {
                    row.addClass('table-danger');
                }

                var roomBtnDisabled = r.r_status !== 'C';
                var roomBtn = $('<button />', {
                    class: 'btn btn-light',
                    text: 'Mark as cleaned'
                });
                roomBtn.prop('disabled', roomBtnDisabled);
                roomBtn.attr('onclick', 'onClickMarkAsClean(' + r.r_no + ')');

				var makeUnavailableBtn = $('<button />', {
                    class: 'btn btn-light',
                    text: "Make Unavailable"
                });
				
				if (r.r_status === 'X'){
					makeUnavailableBtn.text("Make Available");
					makeUnavailableBtn.attr('onclick', 'onClickMarkAsClean(' + r.r_no + ')'); //If was unavailable, change back to available
                    makeUnavailableBtn.prop('disabled', false);
				} else if (r.r_status === 'C' || r.r_status === 'A'){
					makeUnavailableBtn.text("Make Unavailable");
					makeUnavailableBtn.attr('onclick', 'onClickMakeUnavailable(' + r.r_no + ')'); //If not unavailable, make unavailable
                    makeUnavailableBtn.prop('disabled', false);
				} else {
                    makeUnavailableBtn.prop('disabled', true);
                }

                row.append($("<td/>")
                    .append(roomBtn));
				row.append($("<td/>")
                    .append(makeUnavailableBtn));
                table.append(row);
            });
        },
        error: function(err){
            alert(err.message);
        }
    });
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
            housekeepingRefresh();
        },
        error: function(err){
            alert(err.message);
        }
    });
}

function onClickMakeUnavailable(roomId) {
    changeStatus(roomId, 'X');
}
//Changes to A
function onClickMarkAsClean(roomId) {
    changeStatus(roomId, 'A');
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