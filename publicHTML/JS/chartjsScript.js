// --------- High Charts --------- //
// -- AUTHOR: Harvey Reynier --//
// ------- DESCRIPTION ------- //
//  All scripts that utilise the 'chart-js' and any subsidiary libraries.

//		jQuery init and load after body.
$(document).ready(function() {

    //		Get chart element for chart.js
    var ctx 	= document.getElementById('treePie');
    var pieDataAr 	= [];
    var pieLabelAr  = [];
    var pieData			;

    //	Declare styling options.
    var opt = {
        title: {
            display: false,
            text: "Most Common Tree Species in Camden",
            fontSize: 18,
            fontFamily: "'Taviraj', 'sans-serif'",
            fontColor: "#3e3e3e",
            position: 'top',
            padding: 10
        },
        animation: {
            easing: 'easeInOutQuint',
            duration: 2000
        },
        legend: {
            display: true,
            position: 'left',
            align:	'end',
            labels: {
                padding: 15
            } 
        },
        cutoutPercentage: 30,
        plugins: {
            deferred : {
                xOffset: '100%',	//	defer animation until 100% of the chart width is in the viewport.
                yOffset: '60%',		//	defer animation until 80% of the chart height is in the viewport.
                delay: 500			//	delay of 250ms after canvas is considered in the viewport.
            }
        }
    };


    //		API Endpoint.
    var url 	= "http://dev.spatialdatacapture.org:8703/data/tree-types";

    //		jQuery get data through API.
    $.getJSON(url, function(data){

        //	Declare variables.
        var ttCount;
        var ttName;

        //	Loop through JSON, assign to variables, push to array.
        $.each(data, function (key, value){
            ttCount 	= parseInt(value["count"]);
            ttName 	= value["Com_Name"];

            pieDataAr.push(ttCount);
            pieLabelAr.push(ttName);
        })
        console.log("Sucessfully fetched chart.js data.")
        //console.log(pieDataAr);
        //console.log(pieLabelAr);

        pieData = {
            datasets: [{
                label: "Population",
                data: pieDataAr,
                backgroundColor: ["#05668D", "#04738F", "#028090", "#019493", "#00A896", "#01B698" , "#02C39A" , "#79DBAC", "#B5E7B5", "#F0F3BD", "#2F4858"]
            }],
            labels: pieLabelAr
        };
        var treePieChart = new Chart(ctx, {
            type: 'pie',
            data: pieData,
            options: opt
        })
    })
    
});