// --------- High Charts --------- //
// -- AUTHOR: Ahmad Merii + Azza Hajjar --//
// ------- DESCRIPTION ------- //
//  All scripts that utilise the high chart and any subsidiary libraries.


//  Bar chart - Currently unused.
$(function () {
    $('#hc-container').highcharts({
        chart: {
            type: 'bar'
        },
        colors: ['#797D62', '#9B9B7A', '#D9AE94', '#F1DCA7', 'D08C60', 'ae9e90'],
        title: {
            text: 'Tree Types'
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
                text: 'Trees by Height'
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
            data: [310, 476, 576, 666, 778, 580, 856, 698, 721, 1314, 556, 1045, 773, 386, 449, 922, 463, 550, 148]
        }, {
            name: '10-20',
            data: [309, 248, 295, 478, 455, 562, 500, 572, 602, 1071, 385, 390, 681, 319, 390, 642, 415, 278, 48]
        }, {
            name: '20-30',
            data: [56, 240, 51, 81, 37, 150, 125, 59, 95, 280, 340, 34, 79, 83, 124, 214, 100, 9, 9]
        }, {
            name: '30-40',
            data: [2, 42, 0, 1, 0, 0, 0, 1, 0, 4, 8, 0, 1, 30, 15, 8, 1, 0, 0]
        }
            , {
            name: '40+',
            data: [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }

        ]
    });
});


//  Pie Chart ...