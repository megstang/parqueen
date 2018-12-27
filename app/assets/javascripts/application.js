// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
// = require_tree .

$(document).ready(function() {
  $('#park-here-btn, #save-btn').click(function() {
    $('#park-here-btn').toggle()
    $('#save-btn').toggle()
  })
})

var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('api-map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 20
  });
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function getCurbLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showCurbPosition);
  }
  else {
    var loc = "0,0";
    window.location.href=`/parking?location=${loc}`;
  }
}

var curbPositionReturn;

function showCurbPosition(position) {
  var lat = position['coords']['latitude'];
  var lon = position['coords']['longitude'];
  var url = `/api/v1/parking?latitude=${lat}&longitude=${lon}`;
  fetch(url)
    .then(response => response.json())
    .then((response) => {
      curbPositionReturn = response
      return this.printCurbDetails(response)
    });
}

function postCurbPosition(){
  curbPositionReturn.data.attributes.parking['user_id'] = gon.current_user

  var url = '/api/v1/parking'
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(curbPositionReturn)
  })
  .then((response) => response.json())
  .then((res) => {
    alert(res.message)
  })
}

function printCurbDetails(response) {
  document.getElementById("curb_info").innerHTML = (response.data.attributes.message)
}