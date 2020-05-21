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


//  Radial Chart detailing the distribution of amenity values across wards for the top 3 highest 'networth' trees.
Highcharts.chart('radial-hc', {
    colors: ['#797D62', '#9B9B7A', '#D9AE94', '#F1DCA7'],
    chart: {
      type: 'column',
      inverted: true,
      polar: true,
      backgroundColor: 'transparent',
      height: (150/100 * 100 ) + '%'
    },
    title: {
      text: 'Capital Amenity Value (£mill) across top three species per ward',
      margin: -20,
      y: 60,
      floating: false
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
      name: 'London Plane',
      data: [2.7, 17.2, 5.3, 4.6, 7.1, 11.9, 5.9, 6.0, 4.3, 11.0, 22.7, 3.6, 1.6, 11.0, 12.1, 13.8, 7.3, 1.2]
    }, {
      name: 'Lime-Common',
      data: [1.9, 0.5, 0.8, 1.4, 1.2, 1.2, 2.2, 0.9, 4.1, 2.6, 4.4, 0.4, 0.8, 1.8, 0.7, 1.5, 1.7, 2.0]
    }, {
      name: 'Sycamore',
      data: [0.6, 0.08, 0.39, 0.73, 0.48, 1.5, 0.76, 0.82, 1.72, 3.20, 0.08, 0.58, 1.3, 0.14, 0.31, 0.53, 0.61, 0.02]
     }, {
      name: 'Other',
      data: [4.35, 2.70, 3.82, 6.22, 4.89, 8.5, 8.0, 6.35, 7.52, 19.73, 4.30, 6.01, 9.30, 4.1, 4.7, 8.5, 5.5, 3.8]
    }]
  });


  //  Bar chart - Currently unused.
$(function () {
  $('#hc-container').highcharts({
      chart: {
          type: 'bar',
          backgroundColor: 'transparent',
          height: (9/16 * 100 ) + '%'
      },
      colors: ['#797D62', '#9B9B7A', '#D9AE94', '#F1DCA7', 'D08C60', 'ae9e90'],
      title: {
          text: 'Pollution removal per year (kg) across top three species per ward'
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
          name: '0-10',
          data: [310, 476, 576, 666, 778, 580, 856, 698, 721, 1314, 556, 1045, 773, 386, 449, 922, 463, 550]
      }, {
          name: '10-20',
          data: [309, 248, 295, 478, 455, 562, 500, 572, 602, 1071, 385, 390, 681, 319, 390, 642, 415, 278]
      }, {
          name: '20-30',
          data: [56, 240, 51, 81, 37, 150, 125, 59, 95, 280, 340, 34, 79, 83, 124, 214, 100, 9]
      }, {
          name: '30-40',
          data: [2, 42, 0, 1, 0, 0, 0, 1, 0, 4, 8, 0, 1, 30, 15, 8, 1, 0]
      }
          , {
          name: '40+',
          data: [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }

      ]
  });
});
