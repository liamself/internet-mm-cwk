function saveForm(){

	var AvailabilityData = {}; 							
	AvailabilityData.arrive = $('#arrive').val();
	AvailabilityData.departure = $('#departure').val();
	AvailabilityData.DStno = $('#DStno').val();
	AvailabilityData.DSuno = $('#DSuno').val();	
	AvailabilityData.TStno = $('#TStno').val();
	AvailabilityData.TSuno = $('#TSuno').val();
	
	// check we're getting what we hope for
	console.log('Arrive =', AvailabilityData.arrive);
	console.log('Departure =', AvailabilityData.departure);
	console.log('Number of Double Standard =', AvailabilityData.DStno);
	console.log('Number of Double Superior =', AvailabilityData.DSuno);
	console.log('Number of Twin Standard =', AvailabilityData.TStno);
	console.log('Number of Twin Superior =', AvailabilityData.TSuno);
	
	setObject('AvailabilityData', AvailabilityData);    // store the data locally
	//var storedData = getObject('AvailabilityData');		// retrieve data
	//console.log('Arrival Date =', storedData.arrive);	// second check
};

function postBookingDetails(disp_id){
	var storedData;
    saveForm(); // save the form again just in case
    storedData = getObject('AvailabilityData');
	post('http://localhost:8081/get_form', storedData, disp_id);
};

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
            $('#'+disp_id).html(rt);
            window.location.href="booking.html";
        },
        error: function(error){
            alert(error.statusMessage);
        }
    });
};


