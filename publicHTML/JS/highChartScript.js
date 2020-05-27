// --------- High Charts --------- //
// -- AUTHOR: Ahmad Merii, Azza Hajjar + Harvey Reynier --//
// ------- DESCRIPTION ------- //
//  All scripts that utilise the high chart and any subsidiary libraries.

//  Highcharts defer animation until shown on screen. Adapted from @Torstein_Hønsi.

(function (H) {

  var pendingRenders = [];

  // https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
  function isElementInViewport(el) {

      var rect = el.getBoundingClientRect();

      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (
              document.documentElement.clientHeight*1.2 //Startts when chart is 80% in view.
          ) &&
          rect.right <= (
              window.innerWidth ||
              document.documentElement.clientWidth
          )
      );
  }

  H.wrap(H.Series.prototype, 'render', function deferRender(proceed) {
      var series = this,
          renderTo = this.chart.container.parentNode;

      // It is appeared, render it
      if (isElementInViewport(renderTo) || !series.options.animation) {
          proceed.call(series);

      // It is not appeared, halt renering until appear
      } else  {
          pendingRenders.push({
              element: renderTo,
              appear: function () {
                  proceed.call(series);
              }
          });
      }
  });

  function recalculate() {
      pendingRenders.forEach(function (item) {
          if (isElementInViewport(item.element)) {
              item.appear();
              H.erase(pendingRenders, item);
          }
      });
  }

  if (window.addEventListener) {
      ['DOMContentLoaded', 'load', 'scroll', 'resize']
          .forEach(function (eventType) {
              addEventListener(eventType, recalculate, false);
          });
  }

}(Highcharts));

let hc1Plane 	= 	[];
let hc2Plane 	=	[];
let hc1Lime		=	[];
let hc2Lime		=	[];
let hc1Maple  	=	[];
let hc2Maple 	=	[];
let hc1Other	=	[];
let hc2Other	=	[];

$(document).ready(function() {
	

	let url1 		=	"http://dev.spatialdatacapture.org:8721/data/highcharts/capital_asset_value_for_amenity_trees";

	//	Get first JSON.
	$.getJSON(url1, function(data){
		//	Declare variables.
        let plane;
		let lime;
		let maple;
		let other;
		

        //	Loop through JSON, assign to variables, push to array.
        $.each(data, function (key, value){
			if(value["common_name"] == "London plane"){
				plane = parseInt(value["Val"]);
				hc1Plane.push(plane);
			}	else if (value["common_name"] == "Lime - Common"){
				lime = parseInt(value["Val"]);
				hc1Lime.push(lime);
			}	else if (value["common_name"] == "Maple - Norway"){
				maple = parseInt(value["Val"]);
				hc1Maple.push(maple);
			}	else	{
				other = parseInt(value["Val"]);
				hc1Other.push(other);
			}
			
			
			
			
        })
		console.log("Sucessfully fetched data for radial highchart.")
		
		//  Radial Chart detailing the distribution of amenity values across wards for the top 3 highest 'networth' trees.
		Highcharts.chart('radial-hc', {
			colors: ['#04738F', '#84957F', '#01B698','#A8CDA6'],
			chart: {
			type: 'column',
			inverted: true,
			polar: true,
			backgroundColor: 'transparent',
			//height: (160/100 * 100 ) + '%'
			},
			title: {
			text: 'Capital Amenity Value (£mill) across top three species per ward',
			margin: 0,
			floating: false
			},
			responsive: {
				rules:	[{
					condition:{
						minwidth: 600
					}
				}]
			},
			
			tooltip: {
			outside: true
			},
			pane: {
			size: '100%',
			innerSize: '20%',
			endAngle: 270
			},
			xAxis: {
			tickInterval: 1,
			labels: {
				align: 'right',
				useHTML: true,
				allowOverlap: true,
				step: 1,
				y: 0.3,
				padding:6,
				style: {
				fontSize: '0.75em'
				}
			},
			lineWidth: 0,
			categories: [
				'Belsize <span class="f16">' +
				'</span></span>',
				'Bloomsbury <span class="f16">' +
				'</span></span>',
				'Camden Town with Primrose Hill<span class="f16">' +
				'</span></span>',
				'Cantelowes <span class="f16">' +
				'</span></span>',
				'Fortune Green <span class="f16">' +
				'</span></span>',
				'Frognal and Fitzjohns <span class="f16">' +
				'</span></span>',
				'Gospel Oak <span class="f16">' +
				'</span></span>',
				'Hampstead Town <span class="f16">' +
				'</span></span>',
				'Haverstock <span class="f16">' +
				'</span></span>',
				'Highgate <span class="f16">' +
				'</span></span>',
				'Holborn and Covent Garden <span class="f16">' +
				'</span></span>',
				'Kentish Town <span class="f16">' +
				'</span></span>',
				'Kilburn <span class="f16">' +
				'</span></span>',
				'King Cross <span class="f16">' +
				'</span></span>',
				'Regent Park <span class="f16">' +
				'</span></span>',
				'St Pancras and Somers Town <span class="f16">' +
				'</span></span>',
				'Swiss Cottage <span class="f16">' +
				'</span></span>',
				'West Hampstead <span class="f16">' + '</span></span>',
				
			]
			},
			yAxis: {
			crosshair: {
				enabled: true,
				color: '#333'
			},
			lineWidth: 0,
			tickInterval: 3,
			reversedStacks: false,
			endOnTick: true,
			showLastLabel: true
			},
			plotOptions: {
			column: {
				stacking: 'normal',
				borderWidth: 0,
				pointPadding: 0,
				groupPadding: 0.15
			}
			},
			series: [{
			name: 'Other',
			data: hc1Other
			}, {
			name: 'Lime-Common',
			data: hc1Lime
			}, {
			name: 'Maple - Norway',
			data: hc1Maple
			}, {
			name: 'London Plane',
			data: hc1Plane
			}]
		});



	})

	let url2 		=	"http://dev.spatialdatacapture.org:8721/data/highcharts/pollution_removal_per_year_in_grams";

	//	Get first JSON.
	$.getJSON(url2, function(data){
		//	Declare variables.
        let plane;
		let lime;
		let maple;
		let other;
		

        //	Loop through JSON, assign to variables, push to array.
        $.each(data, function (key, value){
			if(value["common_name"] == "London plane"){
				console.log(value["common_name"]);
				plane = parseInt(value["Val"]);
				console.log(plane);
				hc2Plane.push(plane);
			}	else if (value["common_name"] == "Lime - Common"){
				lime = parseInt(value["Val"]);
				hc2Lime.push(lime);
			}	else if (value["common_name"] == "Maple - Norway"){
				maple = parseInt(value["Val"]);
				hc2Maple.push(maple);
			}	else	{
				other = parseInt(value["Val"]);
				hc2Other.push(other);
			}
			
			
			
			
		})
		console.log(hc2Plane);
		console.log(hc2Lime);
		console.log(hc2Maple);
		console.log(hc2Other);
		console.log("Sucessfully fetched data for bar highchart.")
		
		  //  Bar chart - Currently unused.
		$(function () {
			$('#hc-container').highcharts({
				chart: {
					type: 'bar',
					backgroundColor: 'transparent',
					//height: (9/16 * 100 ) + '%'
				},
				colors: ['#A8CDA6', '#01B698', '#84957F', '#04738F'],
				title: {
					text: 'Pollution removal per year (kg) across top three species per ward'
				},responsive: {
					rules:	[{
						condition:{
							minHeight: 400
						}
					}]
				},
				xAxis: {
					categories: [" Belsize ",
						" Bloomsbury ",
						" Camden Town with Primrose Hill ",
						" Cantelowes ",
						" Fortune Green ",
						" Frognal and Fitzjohns ",
						" Gospel Oak ",
						" Hampstead Town ",
						" Haverstock ",
						" Highgate ",
						" Holborn and Covent Garden ",
						" Kentish Town ",
						" Kilburn ",
						" King's Cross ",
						" Regent's Park ",
						" St Pancras and Somers Town ",
						" Swiss Cottage ",
						" West Hampstead ",]
				},
				yAxis: {
					min: 0,
					title: {
						text: 'Pollution removed per year (kg)'
					}
				},
				legend: {
					reversed: true
				},
				plotOptions: {
					series: {
						stacking: 'normal'
					}
				},
				series: [{
					name: 'London Plane',
					data: hc2Plane
				}, {
					name: 'Lime - Common',
					data: hc2Lime
				}, {
					name: 'Maple - Norway',
					data: hc2Maple
				}, {
					name: 'Other',
					data: hc2Other
				}
		
				]
			});
		});
		
	})

})



