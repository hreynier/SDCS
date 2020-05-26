Highcharts.chart('bubble-container', {
    chart: {
      type: 'packedbubble',
      height: '100%',
      backgroundColor: 'transparent'  
    },
    responsive: {
        rules:	[{
            condition:{
                minwidth: 600
            }
        }]
    },
    colors: ['#A8CDA6','#CB997E','#01B698', '#84957F', '#3E3E3E'],
    title: {
      text: 'Pollution Removal Increase per Ward by 2025'
    },
    tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}:</b> {point.value}%</sub>'
    },
    plotOptions: {
      packedbubble: {
        minSize: '30%',
        maxSize: '120%',
        zMin: 10,
        zMax: 1000,
        layoutAlgorithm: {
          splitSeries: false,
          gravitationalConstant: 0.02
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          filter: {
            property: 'y',
            operator: '>',
            value: 10
          },
          style: {
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal'
          }
        }
      }
    },
    series: [{
      name: 'More than 50%',
      data: [{
        name: 'Belsize',
        value: 55
      }, {
        name: "Camden Town",
        value: 52
      },
      {
        name: "Cantelowes",
        value: 50
      },
      {
        name: "Fortune Green",
        value: 59
      },
      {
        name: "Frognal and Fitzjohns",
        value: 51
      }, {
        name: "Kilburn",
        value: 51
      },
      {
        name: "West Hampstead",
        value: 69
      }]
    }, {
      name: '40% to 50%',
      data: [{
        name: "Gospel Oak",
        value: 44
      }, {
        name: "Kentish Town",
        value: 46
          }, {
        name: "Hampstead Town",
        value: 46
        },
        {
        name: "Haverstock",
        value: 43
        },
        {
        name: "Highgate",
        value: 42
        },
        {
        name: "Swiss Cottage",
        value: 47
      }]
    }, {
      name: '30% to 40%',
      data: [{
        name: "Holborn & Covent Garden",
        value: 32
        },
        {
        name: "Regent's Park",
        value: 37
      },
      {
        name: "St Pancras & Somers Town",
        value: 36
      }]
    }, {
      name: '20% to 30%',
      data: [{
        name: 'Bloomsbury',
        value: 28
        },
        {  
      }]
    }, {
      name: 'Less than 20%',
      data: [{
        name: "King's Cross",
        value: 15
      }]
    }]
  });
  