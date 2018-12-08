
function saveBookingForm(){

	var BookingData = {}; 							
	BookingData.c_name = $('#c_name').val();
	BookingData.c_email = $('#c_email').val();
	BookingData.c_address = $('#c_address').val();	
	BookingData.c_cardtype = $('#c_cardtype').val();
	BookingData.c_cardexp = $('#c_cardexp').val();
	BookingData.c_cardno = $('#c_cardno').val();
	
	// check we're getting what we hope for
	console.log('Customer Name =', BookingData.c_name);
	console.log('Customer Email =', BookingData.c_email);
	console.log('Customer Address =', BookingData.c_address);
	// Delete once tested:
	console.log('Card Type =', BookingData.c_cardtype);
	console.log('Card Exp =', BookingData.c_cardexp);
	console.log('Card Number =', BookingData.c_cardno);
	
	setObject('BookingData', BookingData);    // store the data locally
	//var storedBookingData = getObject('BookingData');		// retrieve data
	//console.log('Booking Name =', storedBookingData.c_name);	// second check
};

function postBookingDetails(disp_id){
	var storedBookingData;
    saveBookingForm(); // save the form again just in case
	storedAvailabilityData = getObject('AvailabilityData');
    storedBookingData = getObject('BookingData');
	var allData = {availabilityData: storedAvailabilityData, bookingData:storedBookingData};
	post('http://localhost:8081/get_booking', allData, disp_id);
};

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
        },
        error: function(){
            alert("error");
        }
    });
};

//change to confirmation page

function showConfirmation(){
	
	$('#CustomerDetails').empty();
	$('#CustomerDetails').append('Thank you for booking! Your Booking Reference is:');

};


