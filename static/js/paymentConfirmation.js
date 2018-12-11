paymentConfirmation = function() {
    $(document).ready(function() {
        var total =getObject("total");
        var origPrice =getObject("origPrice");
        var extras =getObject("extras");

        $("#total").text(total);
        $("#origPrice").text(origPrice);
        $("#extras").text(extras);
    });
}();