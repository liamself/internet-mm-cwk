payment = function() {
    var bRef;
    $(document).ready(function () {
        bRef = getObject("bRef");
        getPaymentDetails();
    });

    //expose public functions
    return {
        processPayment: processPayment,
        updatePrice: updatePrice
    };

    function getPaymentDetails() {
        $.ajax({
            url: "/admin_payment_details",
            type: "POST",
            data: JSON.stringify({
                bref: bRef
            }),
            success: function (rt) {
                var json = JSON.parse(rt); // the returned data will be an array
                //Clear table
                formatPage(json[0]);
            }
        });
    }

    function formatPage(data) {
        var cardNo = data.c_cardno;
        var hidden = "************"
        var visible = cardNo.slice(cardNo.length - 4);
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

    function processPayment() {
        updateOutstanding().then(function() {
            $.ajax({
                url: "/process_payment",
                type: "POST",
                data: JSON.stringify({
                    bRef: bRef
                }),
                success: function (rt) {
                    getPaymentDetails();
                },
                error(msg) {
                    alert(msg);
                }
            });
        })
    }

    function updateOutstanding() {
        var newOutstanding = parseFloat($('#total').text());
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "/update_price",
                type: "POST",
                data: JSON.stringify({
                    bRef: bRef,
                    outstanding: newOutstanding
                }),
                success: function (rt) {
                    resolve();
                },
                error(msg) {
                    reject("msg");
                }
            });
        });
    }
}();
