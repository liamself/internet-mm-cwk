function saveForm(){
	var AvailabilityData = {
		arrive :$('#arrive').val(),
		departure: $('#departure').val(),
		DStno: $('#DStno').val(),
		DSuno: $('#DSuno').val(),
		TStno: $('#TStno').val(),
		TSuno: $('#TSuno').val()
	};

	setObject('AvailabilityData', AvailabilityData);    // store the data locally
	//var storedData = getObject('AvailabilityData');		// retrieve data
	//console.log('Arrival Date =', storedData.arrive);	// second check
}

function postBookingDetails(disp_id){
	var storedData;
    saveForm();
    storedData = getObject('AvailabilityData');
	post('http://localhost:8081/get_form', storedData, disp_id);
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


