function generateOccupancyReport() {
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
            formatOccupancyTable(JSON.parse(rt));
        }
    });
}

function generateSalesReport() {
    var dateFrom = $('#sales-date-from').val();
    var dateTo = $('#sales-date-to').val();

    if (dateFrom >= dateTo) {
        $('#salesErrorMsg').text("Date from must be before date to");
        return;
    }

    var data = {
        dateFrom: dateFrom,
        dateTo:dateTo
    };

    $.ajax({
        url: "/Sales_report",
        type: "POST",
        data: JSON.stringify(data),
        success: function (rt) {
            formatSalesTable(JSON.parse(rt));
        }
    });
}

function formatOccupancyTable(data) {
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

function formatSalesTable(data) {
    var table = $("#sales-table");
    //Populate with new data
    table.empty();
    $.each(data, function (rowIndex, r) {
        var row = $("<tr/>");
        row.append($("<td/>").text(r.b_ref));
        row.append($("<td/>").text(date_ddmmyyyy(r.checkout)));
        row.append($("<td/>").text("£" + r.b_cost));

        table.append(row);
    });

    //Update summary
    var totalCost = 0;
    var totalBookings = data.length;

    for (var i = 0; i < data.length; i++) {
        totalCost += parseFloat(data[i].b_cost);
    }
    $('#total-bookings').text(totalBookings);
    $('#total-sales').text("£" + totalCost);
}

//Form date buttons
function occupancy1Week() {
    var dateFromStr = $('#date-from').val();
    if (dateFromStr !== "") {
        var dateTo = moment(dateFromStr);
        dateTo.add(1, 'week');
        $('#date-to').val(dateTo.format("YYYY-MM-DD"));
    }
}
function occupancy2Weeks() {
    var dateFromStr = $('#date-from').val();
    if (dateFromStr !== "") {
        var dateTo = moment(dateFromStr);
        dateTo.add(2, 'week');
        $('#date-to').val(dateTo.format("YYYY-MM-DD"));
    }
}
function occupancy1Month() {
    var dateFromStr = $('#date-from').val();
    if (dateFromStr !== "") {
        var dateTo = moment(dateFromStr);
        dateTo.add(1, 'month');
        $('#date-to').val(dateTo.format("YYYY-MM-DD"));
    }
}
function occupancy1Year() {
    var dateFromStr = $('#date-from').val();
    if (dateFromStr !== "") {
        var dateTo = moment(dateFromStr);
        dateTo.add(1, 'year');
        $('#date-to').val(dateTo.format("YYYY-MM-DD"));
    }
}
function sales1Week() {
    var dateFromStr = $('#sales-date-from').val();
    if (dateFromStr !== "") {
        var dateTo = moment(dateFromStr);
        dateTo.add(1, 'week');
        $('#sales-date-to').val(dateTo.format("YYYY-MM-DD"));
    }
}
function sales2Weeks() {
    var dateFromStr = $('#sales-date-from').val();
    if (dateFromStr !== "") {
        var dateTo = moment(dateFromStr);
        dateTo.add(2, 'week');
        $('#sales-date-to').val(dateTo.format("YYYY-MM-DD"));
    }
}
function sales1Month() {
    var dateFromStr = $('#sales-date-from').val();
    if (dateFromStr !== "") {
        var dateTo = moment(dateFromStr);
        dateTo.add(1, 'month');
        $('#sales-date-to').val(dateTo.format("YYYY-MM-DD"));
    }
}
function sales1Year() {
    var dateFromStr = $('#sales-date-from').val();
    if (dateFromStr !== "") {
        var dateTo = moment(dateFromStr);
        dateTo.add(1, 'year');
        $('#sales-date-to').val(dateTo.format("YYYY-MM-DD"));
    }
}