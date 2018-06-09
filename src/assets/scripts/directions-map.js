var infoBox_ratingType = 'star-rating';
function directionsMap() {
    (function ($) {
        "use strict";
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(singleListingMap);
            }
            else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        getLocation()
        var drivingPolyline = {
            strokeColor: '#ff0000',   // grey'ish
            strokeOpacity: 1.0,
            strokeWeight: 2
        }
        var walkingPolyline = {
            strokeColor: '#3B5998',
            strokeOpacity: 0,
            strokeWeight: 2,
            icons: [{
                icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 2
                },
                offset: '0',
                repeat: '15px'
            }]
        };
        var directionsService = new google.maps.DirectionsService();
        var single_map;
        var myLatlng;
        var locationLatlng;
        var map_style = [{
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#747474",
                "visibility": "off"
            }, {
                "lightness": "23"
            }]
        }, {
            "featureType": "poi.attraction",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#f38eb0"
            }]
        }, {
            "featureType": "poi.government",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ced7db"
            }]
        }, {
            "featureType": "poi.medical",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffa5a8"
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#c7e5c8"
            }]
        }, {
            "featureType": "poi.place_of_worship",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#d6cbc7"
            }]
        }, {
            "featureType": "poi.school",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#c4c9e8"
            }]
        }, {
            "featureType": "poi.sports_complex",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#b1eaf1"
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{
                "lightness": "100"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }, {
                "lightness": "100"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffd4a5"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffe9d2"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [{
                "weight": "3.00"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [{
                "weight": "0.30"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#747474"
            }, {
                "lightness": "36"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#e9e5dc"
            }, {
                "lightness": "30"
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "on"
            }, {
                "lightness": "100"
            }]
        }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "color": "#d2e7f7"
            }],
            "featureType": "poi",
            "stylers": [
                { "visibility": "off" }
            ]
        }];
        function singleListingMap(position) {
            myLatlng = new google.maps.LatLng({
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            });
            locationLatlng = new google.maps.LatLng({
                lng: parseFloat($('#singleListingMap').data('longitude')),
                lat: parseFloat($('#singleListingMap').data('latitude')),
            });
            single_map = new google.maps.Map(document.getElementById('singleListingMap'), {
                zoom: 17,
                center: myLatlng,
                scrollwheel: false,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                panControl: false,
                navigationControl: false,
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: map_style
            });
            var ib = new InfoBox();
            direction();
            $('#streetView').click(function (e) {
                e.preventDefault();
                single_map.getStreetView().setOptions({
                    visible: true,
                    position: myLatlng
                });
            });
            var zoomControlDiv = document.createElement('div');
            var zoomControl = new ZoomControl(zoomControlDiv, single_map);
            function ZoomControl(controlDiv, single_map) {
                zoomControlDiv.index = 1;
                single_map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(zoomControlDiv);
                controlDiv.style.padding = '5px';
                var controlWrapper = document.createElement('div');
                controlDiv.appendChild(controlWrapper);
                var zoomInButton = document.createElement('div');
                zoomInButton.className = "custom-zoom-in";
                controlWrapper.appendChild(zoomInButton);
                var zoomOutButton = document.createElement('div');
                zoomOutButton.className = "custom-zoom-out";
                controlWrapper.appendChild(zoomOutButton);
                google.maps.event.addDomListener(zoomInButton, 'click', function () {
                    single_map.setZoom(single_map.getZoom() + 1);
                });
                google.maps.event.addDomListener(zoomOutButton, 'click', function () {
                    single_map.setZoom(single_map.getZoom() - 1);
                });
            }
            var singleMapIco = "<i class='im im-icon-Business-Man'></i>";
            var singleMapIco2 = "<i class='im im-icon-Hamburger'></i>";
            var x = new CustomMarker(myLatlng, single_map, {
                marker_id: '1'
            }, singleMapIco);
            var y = new CustomMarker(locationLatlng, single_map, {
                marker_id: '2'
            }, singleMapIco2);

        }

        function direction() {
            var request = {
                origin: myLatlng,
                destination: locationLatlng,
                travelMode: google.maps.TravelMode.DRIVING,
            };
            var request2 = {
                origin: myLatlng,
                destination: locationLatlng,
                travelMode: google.maps.TravelMode.WALKING,
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var drivingDirectionsDisplay = new google.maps.DirectionsRenderer({
                        suppressMarkers: true,
                        polylineOptions: drivingPolyline,
                        map: single_map
                    });
                    drivingDirectionsDisplay.setDirections(response);
                    var distance_driving = response.routes[0].legs[0].distance.text;
                    var duration_driving = response.routes[0].legs[0].duration.text;
                    directionsService.route(request2, function (response2, status2) {
                        if (status2 == google.maps.DirectionsStatus.OK) {
                            var walkingDirectionsDisplay = new google.maps.DirectionsRenderer({
                                suppressMarkers: true,
                                polylineOptions: walkingPolyline,
                                map: single_map
                            });
                            var distance_walking = response2.routes[0].legs[0].distance.text;
                            var duration_walking = response2.routes[0].legs[0].duration.text;
                            walkingDirectionsDisplay.setDirections(response2);


                            document.getElementById('tab1b').innerHTML = "<i class='im im-icon-Road-3' style='font-size: 18px;vertical-align: sub;font-weight: 800'></i> " + distance_walking + " <i class='fa fa-clock-o'></i> " + duration_walking;
                            document.getElementById('tab2b').innerHTML = "<i class='im im-icon-Road-3'></i> " + distance_driving + " <i class='fa fa-clock-o'></i> " + duration_driving;
                        }

                    });
                }
            });
        }

        function CustomMarker(latlng, map, args, markerIco) {
            this.latlng = latlng;
            this.args = args;
            this.markerIco = markerIco;
            this.setMap(map);
        }
        CustomMarker.prototype = new google.maps.OverlayView();
        CustomMarker.prototype.draw = function () {
            var self = this;
            var div = this.div;
            if (!div) {
                div = this.div = document.createElement('div');
                div.className = 'map-marker-container';
                div.innerHTML = '<div class="marker-container">' +
                    '<div class="marker-card">' +
                    '<div class="front face">' + self.markerIco + '</div>' +
                    '<div class="back face">' + self.markerIco + '</div>' +
                    '<div class="marker-arrow"></div>' +
                    '</div>' +
                    '</div>'
                google.maps.event.addDomListener(div, "click", function (event) {
                    $('.map-marker-container').removeClass('clicked infoBox-opened');
                    google.maps.event.trigger(self, "click");
                    $(this).addClass('clicked infoBox-opened');
                });
                if (typeof (self.args.marker_id) !== 'undefined') {
                    div.dataset.marker_id = self.args.marker_id;
                }
                var panes = this.getPanes();
                panes.overlayImage.appendChild(div);
            }
            var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
            if (point) {
                div.style.left = (point.x) + 'px';
                div.style.top = (point.y) + 'px';
            }
        };
        CustomMarker.prototype.remove = function () {
            if (this.div) {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
                $(this).removeClass('clicked');
            }
        };
        CustomMarker.prototype.getPosition = function () {
            return this.latlng;
        };
    })(this.jQuery);
}
