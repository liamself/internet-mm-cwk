$(document).ready(function() {
	var bookingData = getObject('AvailabilityData');
	$("#checkin").text(bookingData.arrive);
	$("#checkout").text(bookingData.departure);
	if (bookingData.DStno > 0) {
		$('#stdD').text(bookingData.DStno);
	} else $('#stdD-p').hide();
	if (bookingData.DSuno > 0) {
		$('#supD').text(bookingData.DSuno);
	} else $('#supD-p').hide();
	if (bookingData.TStno > 0) {
		$('#stdT').text(bookingData.TStno);
	} else $('#stdT-p').hide();
	if (bookingData.TSuno > 0) {
		$('#supT').text(bookingData.TSuno);
	} else $('#supT-p').hide();
});

function checkValidity(){
	var cardError = $("#card-msg");
	var customerError = $("#details-msg");
	//Clear error messages
	cardError.empty();
	customerError.empty();

	var bookingData = {
		c_name: $('#c_name').val().trim(),
		c_email: $('#c_email').val().trim(),
		c_address: $('#c_address').val().trim(),
		b_notes: $("#b_notes").val(),
		c_cardtype: $('#c_cardtype').val().trim(),
		c_cardexp: $('#c_cardexp').val().trim(),
		c_cardno: $('#c_cardno').val().trim()
	};

	//Check validity
	var valid = true;
	if (bookingData.c_name === "" || bookingData.c_email === "" || bookingData.c_address === "") {
		customerError.text("Please fill in all fields and try again");
		valid=false;
	}


	var expRegex = /(01|02|03|04|05|06|07|08|09|10|11|12)\/\d\d/;
	if (bookingData.c_cardno === "" || bookingData.c_cardexp === "" || bookingData.c_cardtype === "") {
		cardError.text("Please fill in all fields and try again");
		valid=false;
	} else if (! expRegex.test(bookingData.c_cardexp)) {
		cardError.text("Expiry date should be in MM/YY format");
		valid=false;
	}



	setObject('BookingData', bookingData);    // store the data locally
	return valid;
	//var storedBookingData = getObject('BookingData');		// retrieve data
	//console.log('Booking Name =', storedBookingData.c_name);	// second check
}

function postBookingDetails(disp_id){
	var storedBookingData;
    if (checkValidity()) { // save the form
		var storedAvailabilityData = getObject('AvailabilityData');
		storedBookingData = getObject('BookingData');
		var allData = {availabilityData: storedAvailabilityData, bookingData: storedBookingData};
		post('/get_booking', allData, disp_id);
	}
}

// submit data for storage using AJAX
function post(path, data, disp_id) {
    // convert the parameters to a JSON data string
    var json = JSON.stringify(data);

    $.ajax({
        url: path,
        type: "POST",
        data: json,
        success: function(rt) {
            console.log(rt); // returned data
            $('#'+disp_id).html(rt);
            setObject("confirmation", data);
            setObject("bookingRef", rt);
            window.location.href=("confirmation.html");
        },
        error: function(){
            alert("error");
        }
    });
}

//change to confirmation page

function showConfirmation(){
	
	$('#CustomerDetails').empty();
	$('#CustomerDetails').append('Thank you for booking! Your Booking Reference is ' + bRef);

}


