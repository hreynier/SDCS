// --------- Google Maps --------- //
// -- AUTHOR: Harvey Reynier --//
// ------- DESCRIPTION ------- //

//  All functions + scripts associated with the googlemap API and libraries.
//  Styling located in JS/gmapStyle.js
//  Functions located at bottom of document.

//  GLOBAL VARIABLES
//	Declare empty variables for use later.
var map;
var heatmap 		;
var dataMap			;

var markerArray = [];
var dataArray 	= [];
var heatArray	= [];

var count		= 1	;
var dCount 		= 0	;

var coeffMin 	= Number.MAX_VALUE;
var coeffMax 	= Number.MIN_VALUE;

var infowindow 	= new google.maps.InfoWindow({ maxWidth: 300 });


//  jQuery script
//  Requires DOM to load.
$(document).ready(function() {

    // Init Map, gets data and styles.
    function initialise() {

        // The location of Camden.
        var camden_cds = { lat: 51.554756, lng: -0.164345 };

        // Map Options
        var mapOptions = {
            center:             camden_cds,
            zoom:               13,
            minZoom:            12,
            styles:             retroMap,
            disableDefaultUI:   true,
            zoomControl:        true
        };

        //  Init new google map, centered on Camden Town.
        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        //  Loads tree point data for map markers.
        getData(map.getCenter().lat(), map.getCenter().lng());

        //	Init new google map data layer.
        dataMap = new google.maps.Data();
        //  Load Camden boundary geoJSON from database.
        dataMap.loadGeoJson('http://dev.spatialdatacapture.org:8703/data/boundary', {idPropertyName : 'name'});

        //	Init heatmap layer.
        heatmap = new google.maps.visualization.HeatmapLayer({
            //Data through function.
            data: getHeatmap()
        });
    }

    //    Gets every tree point for marker map.
    function getData(lat, lng) {
        //  Clear map.
        setAllMap(null);
        //  Clear marker array.
        markerArray = [];

        //  Determine latitude + longitude values.
        var lat = lat.toFixed(2);       //    Changes to 2 decimal places.
        var lng = lng.toFixed(3);       //    Changes to 3 decimal places.
        //  Determine radius to get data from.
        var radius = 2000;              //    Radius of 2km.

        console.log("Getting Data: " + lat + ", " + lng);


        //  URL = API Endpoint that gets the data. Check "http://dev.spatialdatacapture.org:8703/" for more info.
        var url = "http://dev.spatialdatacapture.org:8703/data/" + lat + "/" + lng + "/" + radius;
        console.log("API Endpoint :" + url);

        //  jQuery gets data through API Endpoint
        $.getJSON(url, function (data) {
            //  Declare variables
            var latitude;
            var longitude;

            //Loops through each row, extracts coordinates, and generates marker on map.
            $.each(data, function (key, value) {
                latitude = value["Lat"];
                longitude = value["Lon"];

                //console.log("lat: " + latitude + ", lon: " + longitude); //   Uncomment for testing purposes.

                //  Generate new google map coord object + store.
                var latlng = new google.maps.LatLng(latitude, longitude);
                dataArray.push(latlng);

                //  Make new marker on map.
                var marker = new google.maps.Marker({
                    position: latlng,
                    customInfo: value.id,
                    icon: "./img/icon.png",
                    map: map
                });

                //  Display statistics describing specific tree
                google.maps.event.addListener(marker, 'click', function () {
                    return function () {
                        infowindow.setContent("");

                        //  On click recenter and zoom map.
                        map.setCenter(new google.maps.LatLng(value.coords.y, value.coords.x));
                        map.setZoom(16);

                        //  get statistics data from API Endpoint, and display on click.
                        $.getJSON("http://dev.spatialdatacapture.org:8703/data/treeDescription/" + this.customInfo, function (data) {
                            var dateInspected = new XDate((data[0].Date)).toString("MMM d, yyyy HH:mm:ss");
                            var dateUploaded = new XDate((data[0].Uploaded)).toString("MMM d, yyyy HH:mm:ss");
                            var content = "<b> Tree ID: </b>" + value.id + "<br/> <br/><b> Common Name:</b>" + data[0].Com_Name +
                                " <br/> <br/><b>Height (m): </b>" + data[0].Height_M + " <br/> <br/><b>Spread (m): </b>" + data[0].Spread_M +
                                "<br/> <br/><b> Diameter (cm): </b>" + data[0].Diameter_CM + " <br/> <br/><b>Maturity: </b>" + data[0].Maturity +
                                "<br/> <br/><b> Health: </b>" + data[0].Condition + "<br/> <br><b> Location: </b>" + value.coords.y + ", " + value.coords.x +
                                "<br/> <br><b> Date Inspected: </b>" + dateInspected + "<br/> <br><b> Date Uploaded: </b>" + dateUploaded;

                            infowindow.setContent(content)
                        })

                        infowindow.open(map, this);
                    }
                }(""));
                // Push to marker array.
                markerArray.push(marker);


            });
            //  clear map of markers so that the map starts empty.
            clearMarkers();
        });

    }
    //  Gets data for the heatmap layer.
    function getHeatmap() {
        //  SUGGESTION: ADD USER INPUT FEATURE (DROPDOWN MENU)

        //Store input variable
        var wgt = "Pollution_Year_grams";
        console.log("Getting weighted location data: " + wgt);

        //  Clear data array.
        heatArray = [];

        //    URL = API ENDPOINT to get spatial weighted data. Check "http://dev.spatialdatacapture.org:8703/" for more.
        var url = "http://dev.spatialdatacapture.org:8703/data/sust/" + wgt;
        console.log("API Endpoint: " + url);

        //    jQuery to grab data through endpoint
        $.getJSON(url, function (data) {
            //  Declare local variables.
            var latitude;
            var longitude;
            var weight;

            //  Loop through json, extract point data and weight value.
            $.each(data, function (key, value) {
                latitude = value["Lat"];
                longitude = value["Lon"];
                weight = value[wgt];
                //console.log("lat:" + latitude + ", lon: " + longitude + ", " + wgt + ": " + weight); //	Uncomment for testing purposes.

                //  New google map  coord object.
                var loc = new google.maps.LatLng(latitude, longitude);
                //  Format for heatmap.
                var object = { location: loc, weight: weight };
                //  Push to array.
                heatArray.push(object);
            })
        })
        //  Returns the array so that function can be called.
        return heatArray;
    }


    //	Toggles map layers on button click.
    $("#btn-heatmap").click(toggleHeatmap);

    $("#btn-markers").click(toggleMarkers);

    $("#btn-data").click(toggleData);

    //	Start map with initialise function, loads map with markers.
    //	Delay of 10 seconds to reduce lag on animation.
    function initdata() {
        setTimeout(function(){
            console.log("initiating initialise function.");
            initialise();
        },4000);
    }

    google.maps.event.addDomListener(window, 'load', initdata);
});

//	Gets data for the ward clustering data layer.
jQuery.clusterData = function clusterData(measure){
    //	URL = API Endpoint to get JSON data for wards on data layer.
    var url = "http://dev.spatialdatacapture.org:8703/data/clusters";
    console.log("API Endpoint: " + url);

    //	jQuery to grab data through endpoint.
    $.getJSON(url, function(data){

        // Declare local variables.
        var ward_name;
        var coeff;

        //	Loops through each row of the retrieved JSON.
        $.each(data, function (key, value){
            //      Stores name of ward and clustering coefficient value that
            //      has been assigned to that ward.
            ward_name 	= value["ward_name"];
            coeff 		= parseFloat(value[measure]);

            //console.log("Ward: " + ward_name + ", Value: " + coeff);      //  Uncomment for testing purposes.

            //	Get feature/ward of GeoJSON by ward_name and assign to variable.
            var feat = dataMap.getFeatureById(ward_name)
            if (feat != undefined) {
                //console.log("Feature exists!");
                feat.setProperty('data', coeff);	//	Set property of ward to be value.
                //console.log("Property set");
            }

            //	Determines the minimum and maximum value of the coefficients for use in the legend.
            if (coeff < coeffMin){
                coeffMin = coeff;
                //console.log("New Min: " + coeffMin);
            }
            if (coeff > coeffMax){
                coeffMax = coeff;
                //console.log("New Max: " + coeffMax);
            }
        });
        //console.log("coeff Min: " + coeffMin + ", coeff Max: " + coeffMax);

        //	Updates legend with the min/max data.
        document.getElementById('data-min').textContent =
            coeffMin.toLocaleString();
        document.getElementById('data-max').textContent =
            coeffMax.toLocaleString();
    });
    console.log("Success: Clustering Data received.")
}



// ----     gMap Functions   ----//
//
//
//

//  Styles data cluster layer using maths!!
function styleFeature(feature) {

    //  Colours of the min and max datum in HSL.
    var low 	= 	[49,70,54];
    var high 	=	[118,41,51];

    //	Delta represents ratio of where the data value sits between min and max.
    var delta = (feature.getProperty('data') - coeffMin) / (coeffMax - coeffMin);

    //console.log("delta: " + delta);
    //console.log("data: " + feature.getProperty('data'));   //     Uncomment for test purposes.


    //	Assign colour based on ratio between min and max datum, and thus min and max color.
    var colour = [];
    for ( var i = 0; i < 3; i++ ) {
        colour[i] = (high[i] - low[i]) * delta + low[i];
    }

    //	If data property of ward/feature doesnt exist, do not show feature.
    var showRow = true;
    if ( feature.getProperty('data') == null  || isNaN(feature.getProperty('data'))) {
        showRow = false;
    }

    //	Declare line weights/z index and amplify when mouseover.
    var outlineWeight = 2, zIndex = 1;
    if ( feature.getProperty('state') === 'hover') {
        outlineWeight 	= 4;
        zIndex 			= 2;
    }

    //  Return values for use in data map styling.
    return {
        strokeWeight: outlineWeight,
        strokeColor: '#ebe5d5',
        zIndex: zIndex,
        fillColor: 'hsl(' + colour[0] + ',' + colour[1] + '%,' + colour[2] + '%)',
        fillOpacity: 0.75,
        visible: showRow
    };
}

//  Displays additional data and legend details when mouse hover over legend.
jQuery.mouseInWard = function mouseInWard(e) {

    //	Set hover state so that styleFeature func can change border styles.
    e.feature.setProperty('state', 'hover');

    //	Calculate percentage - where the data value is within distribution of all data values.
    var percent = (e.feature.getProperty('data') - coeffMin)/
        (coeffMax - coeffMin) * 100;


    //	Update the legend with the data of the ward.
    document.getElementById('data-label').textContent 	=
        e.feature.getProperty('name');
    document.getElementById('data-value').textContent 	=
        e.feature.getProperty('data').toLocaleString();

    //	Update legend and moves data point along it.
    document.getElementById('data-box').style.display 	= 'block';
    document.getElementById('data-point').style.display = 'block';
    document.getElementById('data-point').style.paddingLeft = percent + '%';
}

//  Functions that triggers when mouse exits ward/feature on cluster map.
//  Opposite of mouseInWard function shown above.
function mouseOutWard(e) {
    //	Reset hover state.
    e.feature.setProperty('state', 'normal');
}

// ----  MAP BUTTON TOGGLERS  ---- //

//  Toggles marker map.
function toggleMarkers(){
    heatmap.setMap(null);
    dataMap.setMap(null);
    dCount = 0;
    if(count == 0){
        clearMarkers();
        count = 1;
    }else{
        setAllMap(map);
        count = 0;
    }
}

//  Toggles heatmap layer.
function toggleHeatmap() {
    console.log("Clearing Map...")
    clearMarkers();
    count = 1;
    dataMap.setMap(null);
    dCount = 0;
    console.log("Starting Heatmap...")
    heatmap.setMap(heatmap.getMap() ? null : map);
}

//  Toggles cluster data layer.
function toggleData() {
    console.log("Clearing Map...")
    clearMarkers();
    count = 1;
    heatmap.setMap(null);
    console.log("Grabbing Polygons...")
    if (dCount == 0){

        $.clusterData('Amenity_Gi');
        //dataMap.setMap(map);
        //console.log(dataMap.getFeatureById('Belsize'));
        dataMap.setStyle(styleFeature);
        dataMap.addListener('mouseover', $.mouseInWard);
        dataMap.addListener('mouseout', mouseOutWard);

        dataMap.setMap(map);
        dCount = 1;
    }	else	{
        dataMap.setMap(null);
        dCount = 0;
    }
}

function createMarkers() {
    var marker = new google.maps.Marker({
        position: latlng
    });
}

function setAllMap(map) {
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(map);
    }
}

function clearMarkers() {
    setAllMap(null);
}


String.prototype.replaceAll = function (str1, str2, ignore) {
    return decodeURIComponent(this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2));
}
