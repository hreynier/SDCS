// --------- Google Maps --------- //
// -- AUTHOR: Harvey Reynier --//
// ------- DESCRIPTION ------- //

//  All functions + scripts associated with the googlemap API for the predictive analytical tool shown in,
//  regression.html. For details on the API used, refer : http://dev.spatialdatacapture.org:8703/
//  Styling located in JS/gmapStyle.js
//  Functions located at bottom of document.

//  GLOBAL VARIABLES
//	

let map;
let dataMap;
let predictArray = [];
let infoWindow = new google.maps.InfoWindow({
    maxWidth: 500
});
let current_pol;
let pol_1;
let pol_2;
let pol_3;
let pol_4;
let pol_5;
let pol_change;


//  jQuery script
//  Requires DOM to load.
$(document).ready(function() {

    //  Init the gMap.
    function initialise() {

        // The location of Camden.
        let camden_cds = { lat: 51.554756, lng: -0.164345 };

        // Map Options
        let mapOptions = {
            center:             camden_cds,
            zoom:               12,
            minZoom:            12,
            styles:             retroMap,
            disableDefaultUI:   true,
            zoomControl:        true
        };

        //  Init new google map, centered on Camden Town.
        map = new google.maps.Map(document.getElementById('predictionMap'), mapOptions);

        //	Init new google map data layer.
        dataMap = new google.maps.Data();

        //  Load Camden boundary geoJSON from database.
        dataMap.loadGeoJson('http://dev.spatialdatacapture.org:8703/data/boundary', {idPropertyName : 'name'});


        //	Init heatmap layer.
        /*heatmap = new google.maps.visualization.HeatmapLayer({
            //Data through function.
            data: getPrediction()
        });*/

        setTimeout(function(){
            dataMap.setMap(map);
        },500);
    }

    function getPrediction(){
        
       

        //  Clear array.
        predictArray = [];
        let now;
        let yr1;
        let yr2;
        let yr3;
        let yr4;
        let yr5;
        let lat;
        let long;
        
        console.log("getting prediction data from API");

        //    URL = API ENDPOINT to get predicted results. Check "http://dev.spatialdatacapture.org:8703/" for more.
        var url = "http://dev.spatialdatacapture.org:8703/data/predict";
        console.log("API Endpoint: " + url);

        //    jQuery to grab data through endpoint
        $.getJSON(url, function (data) {
            //  Loop through json, extract point data and weight value.
            $.each(data, function (key, value) {
                lat  = value["lat"];
                long = value["lon"];
                now  = value["Actual_Pollution_Year_grams"];
                yr1  = value["Pollution_Removal_in_1_year"];
                yr2  = value["Pollution_Removal_in_2_years"];
                yr3  = value["Pollution_Removal_in_3_year"];
                yr4  = value["Pollution_Removal_in_4_years"];
                yr5  = value["Pollution_Removal_in_5_years"];

                console.log("lat:" + lat + ", lon: " + long + ", " + "wgt: " + now+yr1+yr2+yr3+yr4+yr5); //	Uncomment for testing purposes.

                //  New google map  coord object.
                var location = new google.maps.LatLng(lat, long);
                //  Format for heatmap.
                var object = { location: location, weight: (now) };
                //  Push to array.
                predictArray.push(object);
            })
        })
        //  Returns the array so that function can be called.
        return predictArray;
    }


    google.maps.event.addDomListener(window, 'load', initialise);
    /*setTimeout(function(){
        heatmap.setMap(map);
    }, 1000);*/
    
});


