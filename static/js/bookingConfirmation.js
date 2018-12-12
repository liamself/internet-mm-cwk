$(document).ready(function() {
    var data = getObject("confirmation");
    var ref = getObject("bookingRef");
    var price = getObject('totalPrice');
    $("#bRef").text(ref);
    $("#checkin").text(date_ddmmyyyy(data.availabilityData.arrival));
    $("#checkout").text(date_ddmmyyyy(data.availabilityData.departure));
    $("#price").text("£" + price);
    $("#notes").text(data.bookingData.b_notes);

    //Room breakdown
    var roomList=$('#rooms');

    if (data.availabilityData.DStno > 0) {
        roomList.append("<li>" + data.availabilityData.DStno + " Double Standard" + "</li>");
    }
    if (data.availabilityData.DSuno > 0) {
        roomList.append("<li>" + data.availabilityData.DSuno + " Double Superior " + "</li>");
    }
    if (data.availabilityData.TStno > 0) {
        roomList.append("<li>" + data.availabilityData.TStno + " Twin Standard " + "</li>");
    }
    if (data.availabilityData.TSuno > 0) {
        roomList.append("<li>" + data.availabilityData.TSuno + " Twin Superior " + "</li>");
    }

    $("#name").text(data.bookingData.c_name);
    $("#address").text(data.bookingData.c_address);
    var cardtype;
    switch(data.bookingData.c_cardtype) {
    case "V":
        cardtype = "Visa";
        break;
    case "MC":
        cardtype = "Mastercard";
        break;
    case "A":
        cardtype = "American Express";
        break;
    default:
        cardtype = "Other Card";
        break;
    }
    $("#cardtype").text(cardtype);
    $("#cardno").text(data.bookingData.c_cardno.slice(-4));
});