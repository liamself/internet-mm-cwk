$(document).ready(function() {
   var bRef = getObject("bRef");
   getPaymentDetails(bRef);
});

function getPaymentDetails(bRef) {
    $.ajax({
        url: "http://127.0.0.1:55554/admin_payment_details",
        type: "POST",
        data: JSON.stringify({
            bref: bRef
        }),
        success: function(rt) {
            var json = JSON.parse(rt); // the returned data will be an array
            //Clear table
            formatPage(json[0]);
        }
    });
}

function formatPage(data) {
    var cardNo = data.c_cardno;
    var hidden = "************"
    var visible  = cardNo.slice(cardNo.length - 4);
    cardNo = hidden + visible;


    $("#booking-no").text(data.b_ref);
    $("#cardno").text(cardNo);
    $("#cardtype").text(data.c_cardtype);
    $("#cardexp").text(data.c_cardexp);
    $("#outstanding").text(data.b_outstanding);
    $("#total").text(data.b_outstanding);


}

function updatePrice() {
    var outstanding = parseFloat($("#outstanding").text());
    var extra = parseFloat($("#extras").val());

    var total = outstanding + extra;
    $("#total").text(total);

}