$(document).ready(function(){
    $("#checkout-body").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#checkout-body tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function refreshCheckOut(bookings) {
    $.ajax({
        url: "http://127.0.0.1:8081/get_checkout_bookings",
        type: "POST",
        data: "",
        success: function(rt) {
            var json = JSON.parse(rt); // the returned data will be an array
            //Clear table
            $("#checkout-body").empty();
            //Populate with new data
            var table = $("#checkout-body");
            $.each(json, function(rowIndex, r) {
                var row = $("<tr/>");
                $.each(r, function(colIndex, c) {
                    row.append($("<td/>").text(c));
                });
                row.append($("<td/>")
                    .append($('<a />', {
                        class: 'btn btn-light',
                        text: "Check out"
                    })));
                table.append(row);
            });
        },
        error: function(err){
            alert(err.message);
        }
    });
}