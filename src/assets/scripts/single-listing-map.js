var infoBox_ratingType = 'star-rating';
function singleListingMap() {
    var latlng = new google.maps.LatLng({
        lng: parseFloat($('#singleListingMap').data('longitude')),
        lat: parseFloat($('#singleListingMap').data('latitude')),
    });
    var single_map = new google.maps.Map(document.getElementById('singleListingMap'), {
        zoom: 16,
        center: latlng,
        scrollwheel: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        panControl: false,
        navigationControl: false,
        streetViewControl: false,
        styles: [{
            "featureType": "poi",
            "stylers": [
                { "visibility": "off" }
            ]
        }]
    });
    /*$('#streetView').click(function (e) {
        e.preventDefault();
        single_map.getStreetView().setOptions({
            visible: true,
            position: latlng
        });
    });*/
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
    var singleMapIco = "<i class='" + $('#singleListingMap').data('map-icon') + "'></i>";
    new CustomMarker(latlng, single_map, {
        marker_id: '1'
    }, singleMapIco);
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