$(document).ready(function(){
    var bRef = getObject("bRef");
    getDetails(bRef);
});

function getDetails(bRef) {
    $.ajax({
        url: "/admin_booking_details",
        type: "POST",
        data: JSON.stringify({
                bref: bRef
        }),
        success: function(rt) {
            var json = JSON.parse(rt); // the returned data will be an array
            //Clear table
            formatPage(json);
        }
    });
}

function formatPage(rooms)
{
    if (rooms.length > 0)
    {
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
        $.each(rooms, function(rowIndex, r) {
            var row = $("<tr/>");
            row.append($("<td/>").text(r.r_no));
            row.append($("<td/>").text(roomClassToString(r.r_class)));
            row.append($("<td/>").text(r.r_status));
            row.append($("<td/>").text(r.checkin));
            row.append($("<td/>").text(r.checkout));
            row.append($("<td/>").text(r.r_notes));
            row.append($("<td/>")
                .append($('<a />', {
                    class: 'btn btn-light',
                    text: "Check in"
                })));
            table.append(row);
        });
    }
}