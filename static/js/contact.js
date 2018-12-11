function initMap(){
  
  var hotelLoc = {lat: 52.633, lng: 1.218};  
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 15, center: hotelLoc});
  var marker = new google.maps.Marker({position: hotelLoc, map: map});
}
