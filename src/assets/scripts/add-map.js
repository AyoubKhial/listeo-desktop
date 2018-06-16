function addMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}
var map;
var infowindow;
var pyrmont;
var marker
function initMap(position) {
    pyrmont = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        scrollwheel: false,
        zoom: 15
    });
    google.maps.event.addListener(map, "click", function (e) {
        if (marker) {
            marker.setPosition(e.latLng);
        } else {
            marker = new google.maps.Marker({
                position: e.latLng,
                map: map,
                draggable: true
            });
        }
        geocodePosition(marker.getPosition());
        google.maps.event.addListener(marker, 'dragend', function () {
            geocodePosition(marker.getPosition());
        });
    });
}

function geocodePosition(pos) {
    document.getElementById("longitude").value = pos.lng();
    document.getElementById("latitude").value = pos.lat();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        latLng: pos
    }, function (responses) {
        //console.log(responses[0]);
        document.getElementById("listing-address").value = responses[0].formatted_address;
        document.getElementById("listing-address").focus();
        
    });
}

function changeMap(city) {
    var address = city;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var Lat = results[0].geometry.location.lat();
            var Lng = results[0].geometry.location.lng();
            map.setCenter(new google.maps.LatLng(Lat, Lng))
        } else {
            alert("Something got wrong " + status);
        }
    });
}