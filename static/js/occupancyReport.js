function generateReport() {
    var dateFrom = $('#date-from').val();
    var dateTo = $('#date-to').val();

    if (dateFrom >= dateTo) {
        $('#errorMsg').text("Date from must be before date to");
        return;
    }

    var data = {
        dateFrom: dateFrom,
        dateTo:dateTo
    };

    $.ajax({
        url: "/occupancy_report",
        type: "POST",
        data: JSON.stringify(data),
        success: function (rt) {
            formatTable(JSON.parse(rt));
        }
    });
}

function formatTable(data) {
    var table = $("#room-breakdown-table");
    //Populate with new data
    table.empty();
    $.each(data, function (rowIndex, r) {
        var row = $("<tr/>");
        row.append($("<td/>").text(r.r_no));
        row.append($("<td/>").text(roomClassToString(r.r_class)));
        row.append($("<td/>").text(r.c_name));
        row.append($("<td/>").text(date_ddmmyyyy(r.checkin)));
        row.append($("<td/>").text(date_ddmmyyyy(r.checkout)));

        table.append(row);
    });
}