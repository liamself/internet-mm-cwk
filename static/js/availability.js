function saveForm(enquiry){
	setObject('AvailabilityData', enquiry);    // store the data locally
	//var storedData = getObject('AvailabilityData');		// retrieve data
	//console.log('Arrival Date =', storedData.arrive);	// second check
}

function onSubmitBookingForm() {
	var enquiry = {
		arrival: $('#arrive').val(),
		departure: $('#departure').val(),
		DStno: $('#DStno').val(),
		DSuno: $('#DSuno').val(),
		TStno: $('#TStno').val(),
		TSuno: $('#TSuno').val()
	};
	if (validateBookingEnquiry(enquiry, 'msg')) {
		postBookingDetails(enquiry, 'msg');
	}
}

function onSubmitMobileForm() {
	var enquiry = {
		arrival: $('#arrive-mob').val(),
		departure: $('#departure-mob').val(),
		DStno: $('#DStno-mob').val(),
		DSuno: $('#DSuno-mob').val(),
		TStno: $('#TStno-mob').val(),
		TSuno: $('#TSuno-mob').val()
	};
	if (validateBookingEnquiry(enquiry, 'res-mob')) {
		postBookingDetails(enquiry, 'res-mob');
	}
}

function validateBookingEnquiry(enquiry, disp_id) {
	if (enquiry.arrival === "")
	{
		$('#'+disp_id).text("Please enter date of arrival");
		return false;
	}
	if(Date.parse(enquiry.arrival) < Date.now()) {
		$('#'+disp_id).text("Arrival date must be in the future");
		return false;
	}
	if (enquiry.departure === "")
	{
		$('#'+disp_id).text("Please enter date of departure");
		return false;
	}
	if (enquiry.arrival >= enquiry.departure)
	{
		$('#'+disp_id).text("Arrival date must be earlier than departure");
		return false;
	}
	if (enquiry.DStno + enquiry.DSuno + enquiry.TStno + enquiry.TSuno < 1)
	{
		$('#'+disp_id).text("At least one room must be selected");
		return false;
	}

	return true;
}

function postBookingDetails(enquiry, disp_id) {
	var storedData;
    saveForm(enquiry);
    storedData = getObject('AvailabilityData');
	post('/get_form', storedData, disp_id);
}

// submit data for storage using AJAX
function post(path, data, disp_id) {

    // convert the parameters to a JSON data string
    var json = JSON.stringify(data);
	console.log(json);
	console.log(path);
    $.ajax({
        url: path,
        type: "POST",
        data: json,
        success: function(rt) {
            console.log(rt); // returned data
			var availability = JSON.parse(rt);
			//Check if rooms were available
			if (availability.roomsAvailable) {
				window.location.href="booking.html";
			}
			else { $('#'+disp_id).text("Unfortunately we cannot fulfil your request on these dates. Over the dates you have selected, the following rooms are available: " +
				availability.stdD + " Double Standard, " + availability.supD + " Double Superior, " + availability.stdT + " Twin Standard, " + availability.supT + " Twin Superior.");
			}
           },
        error: function(error){
            alert(error.statusMessage);
        }
    });
}


