var picno = 1;

function changePicN(){
	var pic= '';
	if ( picno < 4){
	picno++ 	
	pic = '<img src="images/room'+picno+'.jpg" alt="room">'; 
	$('#roomimages').empty();		
	$('#roomimages').append(pic);	
	}
	else {
	picno = 4;
	pic = '<img src="images/room'+picno+'.jpg" alt="room">';
	$('#roomimages').empty();		
	$('#roomimages').append(pic);	
	}
};

function changePicP(){
	var pic= '';
	if ( picno > 1){
	picno-- 
	pic = '<img src="images/room'+picno+'.jpg" alt="room">'; 
	$('#roomimages').empty();		
	$('#roomimages').append(pic);	
	}
	else {
	picno = 1;	
	pic = '<img src="images/room'+picno+'.jpg" alt="room">';
	$('#roomimages').empty();		
	$('#roomimages').append(pic);	
	}
};