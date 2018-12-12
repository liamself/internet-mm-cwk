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
    var roomStr="";
    if (data.availabilityData.DStno > 0) {
        roomStr += data.availabilityData.DStno + " Double Standard\n";
    }
    if (data.availabilityData.DSuno > 0) {
        roomStr += data.availabilityData.DSuno + " Double Superior\n";
    }
    if (data.availabilityData.TStno > 0) {
        roomStr += data.availabilityData.TStno + " Twin Standard\n";
    }
    if (data.availabilityData.TSuno > 0) {
        roomStr += data.availabilityData.TSuno + " Twin Superior\n";
    }
    $("#rooms").text(roomStr);

    $("#name").text(data.bookingData.c_name);
    $("#address").text(data.bookingData.c_address);
    var cardtype;
    switch(data.bookingData.c_cardtype) {
    case "V":
        cardtype = "Visa";
        break;
    case "M":
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