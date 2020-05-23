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

var Min0 	= Number.MAX_VALUE;
var Max0 	= Number.MIN_VALUE;

var Min1 	= Number.MAX_VALUE;
var Max1 	= Number.MIN_VALUE;

var Min2 	= Number.MAX_VALUE;
var Max2 	= Number.MIN_VALUE;

var Min3 	= Number.MAX_VALUE;
var Max3 	= Number.MIN_VALUE;

var Min4 	= Number.MAX_VALUE;
var Max4 	= Number.MIN_VALUE;

var Min5 	= Number.MAX_VALUE;
var Max5 	= Number.MIN_VALUE;

var Min6 	= Number.MAX_VALUE;
var Max6 	= Number.MIN_VALUE;

let layerNo;


//  jQuery script
//  Requires DOM to load.
$(document).ready(function() {

    //  Init the gMap.
    function initialise() {

        // The location of Camden.
        let camden_cds = { lat: 51.5431464, lng: -0.1581557 };

        // Map Options
        let mapOptions = {
            center:             camden_cds,
            zoom:               13,
            minZoom:            13,
            maxZoom:            13,
            styles:             retroMap,
            disableDefaultUI:   true,
            zoomControl:        false,
            panControl:         false,
            draggable:          false 
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
            $.predictData();
            layerNo = 'pol_0';
            dataMap.setStyle(styleFeature);
            
            dataMap.addListener('mouseover', $.mouseInWard);
            dataMap.addListener('mouseout', mouseOutWard);
            dataMap.setMap(map);
        },1000);
    }



    google.maps.event.addDomListener(window, 'load', initialise);
    
});




//	Gets data for the ward clustering data layer.
jQuery.predictData = function predictData(){
    //	URL = API Endpoint to get JSON data for wards on data layer.
    var url = "http://dev.spatialdatacapture.org:8703/data/predict-ward";
    console.log("API Endpoint: " + url);

    //	jQuery to grab data through endpoint.
    $.getJSON(url, function(data){

        // Declare local variables.
        let ward_name;
        let pol0;
        let pol1;
        let pol2;
        let pol3;
        let pol4;
        let pol5;
        let change;

        //	Loops through each row of the retrieved JSON.
        $.each(data, function (key, value){
            //      Stores name of ward and clustering coefficient value that
            //      has been assigned to that ward.
            ward_name 	= value["Ward_Name"];
            pol0 		= parseFloat(value["Actual_Pollution_Year_grams"]);
            pol1 		= parseFloat(value["change1"]);
            pol2 		= parseFloat(value["change2"]);
            pol3 		= parseFloat(value["change3"]);
            pol4 		= parseFloat(value["change4"]);
            pol5 		= parseFloat(value["change5"]);
            change 		= parseFloat(value["Pollution_Removal_in_5_years"]);


            //console.log("Ward: " + ward_name + ", Value: " + coeff);      //  Uncomment for testing purposes.

            //	Get feature/ward of GeoJSON by ward_name and assign to variable.
            var feat = dataMap.getFeatureById(ward_name)
            if (feat != undefined) {
                console.log("Feature exists!");
                feat.setProperty('polNow', pol0);	//	Set property of ward to be value.
                feat.setProperty('pol1', pol1);
                feat.setProperty('pol2', pol2);
                feat.setProperty('pol3', pol3);
                feat.setProperty('pol4', pol4);
                feat.setProperty('pol5', pol5);
                feat.setProperty('change5', change);
                console.log("Property set");
            }

            //	Determines the minimum and maximum value of the coefficients for use in the legend.

            if (pol0 < Min0){
                Min0 = pol0;
                //console.log("New Min: " + coeffMin);
            }
            if (pol0 > Max0){
                Max0 = pol0;
                //console.log("New Max: " + coeffMax);*/
            }

            if (pol1 < Min1){
                Min1 = pol1;
                //console.log("New Min: " + coeffMin);
            }
            if (pol1 > Max1){
                Max1 = pol1;
                //console.log("New Max: " + coeffMax);*/
            }

            if (pol2 < Min2){
                Min2 = pol2;
                //console.log("New Min: " + coeffMin);
            }
            if (pol2 > Max2){
                Max2 = pol2;
                //console.log("New Max: " + coeffMax);*/
            }

            if (pol3 < Min3){
                Min3 = pol3;
                //console.log("New Min: " + coeffMin);
            }
            if (pol3 > Max3){
                Max3 = pol3;
                //console.log("New Max: " + coeffMax);*/
            }

            if (pol4 < Min4){
                Min4 = pol4;
                //console.log("New Min: " + coeffMin);
            }
            if (pol4 > Max4){
                Max4 = pol4;
                //console.log("New Max: " + coeffMax);*/
            }

            if (pol5 < Min5){
                Min5 = pol5;
                //console.log("New Min: " + coeffMin);
            }
            if (pol5 > Max5){
                Max5 = pol5;
                //console.log("New Max: " + coeffMax);*/
            }

            if (change < Min6){
                Min6 = change;
                //console.log("New Min: " + coeffMin);
            }
            if (change > Max6){
                Max6 = change;
                //console.log("New Max: " + coeffMax);*/
            }
          
        });
        console.log("Min: " + Min0 + ", Max: " + Max0);
    });
    console.log("Success: Clustering Data received.");
}

function updateLegend(layerMin, layerMax){
    //	Updates legend with the min/max data.

    document.getElementById('data-min').textContent =
        (layerMin.toLocaleString() + "%");
    document.getElementById('data-max').textContent =
        (layerMax.toLocaleString() + "%");
}




//  Styles data cluster layer using maths!
function styleFeature(feature) {

    //  Colours of the min and max datum in HSL.
    var low 	= 	[49,70,54];
    var high 	=	[118,41,51];

    let label;
    let min;
    let max;

    switch(layerNo){
        case 'pol_0':
            label = 'polNow';
            min   = Min0;
            max   = Max0;
            break;
        case 'pol_1':
            label = 'pol1';
            min   = Min1;
            max   = Max1;
            break;
        case 'pol_2':
            label = 'pol2';
            min   = Min2;
            max   = Max2;
            break;
        case 'pol_3':
            label = 'pol3';
            min   = Min3;
            max   = Max3;
            break;
        case 'pol_4':
            label = 'pol4';
            min   = Min4;
            max   = Max4;
            break;
        case 'pol_5':
            label = 'pol5';
            min   = Min5;
            max   = Max5;
            break;
        case 'pol_change':
            label = 'change';
            min   = Min6;
            max   = Max6;
            break;    
    }

    updateLegend(min, max);

    //	Delta represents ratio of where the data value sits between min and max.
    var delta = (feature.getProperty(label) - min) / (max - min);

    //console.log("delta: " + delta);
    //console.log("data: " + feature.getProperty('data'));   //     Uncomment for test purposes.


    //	Assign colour based on ratio between min and max datum, and thus min and max color.
    var colour = [];
    for ( var i = 0; i < 3; i++ ) {
        colour[i] = (high[i] - low[i]) * delta + low[i];
    }

    //	If data property of ward/feature doesnt exist, do not show feature.
    var showRow = true;
    if ( feature.getProperty(label) == null  || isNaN(feature.getProperty(label))) {
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

    let label;
    let min;
    let max;

    switch(layerNo){
        case 'pol_0':
            label = 'polNow';
            min   = Min0;
            max   = Max0;
            break;
        case 'pol_1':
            label = 'pol1';
            min   = Min1;
            max   = Max1;
            break;
        case 'pol_2':
            label = 'pol2';
            min   = Min2;
            max   = Max2;
            break;
        case 'pol_3':
            label = 'pol3';
            min   = Min3;
            max   = Max3;
            break;
        case 'pol_4':
            label = 'pol4';
            min   = Min4;
            max   = Max4;
            break;
        case 'pol_5':
            label = 'pol5';
            min   = Min5;
            max   = Max5;
            break;
        case 'pol_change':
            label = 'change';
            min   = Min6;
            max   = Max6;
            break;    
    }
    //	Set hover state so that styleFeature func can change border styles.
    e.feature.setProperty('state', 'hover');

    //	Calculate percentage - where the data value is within distribution of all data values.
    var percent = (e.feature.getProperty(label) - min)/
        (max - min) * 100;


    //	Update the legend with the data of the ward.
    document.getElementById('data-label').textContent 	=
        e.feature.getProperty('name');
    document.getElementById('data-value').textContent 	=
        (e.feature.getProperty(label).toLocaleString() + "%");

    //	Update legend and moves data point along it.
    document.getElementById('data-box2').style.display 	= 'block';
    document.getElementById('data-point').style.display = 'block';
    document.getElementById('data-point').style.paddingLeft = percent + '%';
}

//  Functions that triggers when mouse exits ward/feature on cluster map.
//  Opposite of mouseInWard function shown above.
function mouseOutWard(e) {
    //	Reset hover state.
    e.feature.setProperty('state', 'normal');
}



function setPredict(sliderValue){
    sliderValue = parseFloat(sliderValue);
    
    switch(sliderValue){
        case 1:
            layerNo = 'pol_0';
            break;
        case 2:
            layerNo = 'pol_1';
            break;
        case 3:
            layerNo = 'pol_2';
            break;
        case 4:
            layerNo = 'pol_3';
            break;
        case 5:
            layerNo = 'pol_4';
            break;
        case 6:
            layerNo = 'pol_5';
            break;
    }
    console.log("layer no:" + layerNo);

    dataMap.setMap(null);
    dataMap.setStyle(styleFeature);        
    dataMap.addListener('mouseover', $.mouseInWard);
    dataMap.addListener('mouseout', mouseOutWard);
    dataMap.setMap(map);
}