// Camden Tree Data API Server
// Author: Harvey Reynier
// Description: This API Server allows users to connect to the Camden openAPI, request data, 
// and format the data to be presented on a map.

//This API assumes that the following functions are defined on MySQL,
//      Distance, XXX etc.

var moment = require('moment');

var portNumber = 8703;

var mysql = require('mysql');

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

// MySQL Connection Variables
var connection = mysql.createConnection({
    host     : 'dev.spatialdatacapture.org',
    user     : 'ucfnhre',
    password : 'cujereveze',
    database : 'ucfnhre'
});

connection.connect(function(err){
    if (err) console.log(err);
    console.log("Connected to MySQL Database");
    var sql = `CREATE TABLE IF NOT EXISTS camden_tree(
        id INT AUTO_INCREMENT PRIMARY KEY,
        number_of_trees INT,
        sequence INT,
        site_name VARCHAR(255),
        contract_area VARCHAR(255),
        scientific_name VARCHAR(255),
        common_name VARCHAR(255),
        inspection_date DATETIME,
        inspection_due_date VARCHAR(255),
        height_in_metres INT,
        spread_in_metres INT,
        diameter_in_centimetres_at_breast_height INT,
        maturity VARCHAR(255),
        physiological_condition VARCHAR(255),
        tree_set_to_be_removed VARCHAR(255),
        removal_reason VARCHAR(255),
        newly_planted VARCHAR(255),
        outstanding_job_count VARCHAR(255),
        outstanding_job_code VARCHAR(255),
        outstanding_job_description VARCHAR(255),
        capital_asset_value_for_amnity_trees INT,
        carbon_storage_in_kilograms INT,
        gross_carbon_sequestration_per_year_in_kilograms INT,
        pollution_removal_per_year_in_grams INT,
        ward_code VARCHAR(255),
        ward_name VARCHAR(255),
        easting VARCHAR(255),
        northing VARCHAR(255),
        longitude VARCHAR(255),
        latitude VARCHAR(255),
        location VARCHAR(255),
        identifier VARCHAR(255),
        spatial_accuracy VARCHAR(255),
        last_uploaded DATETIME,
        organisation_uri VARCHAR(255),
        computed_region_hxwp_gyfc VARCHAR(255),
        computed_region_6i9a_26nj VARCHAR(255)
    )`;
    connection.query(sql, function(err, result) {
        if (err) console.log(err);
        console.log("Table Created.")
    })
});

//  Setup the Express Server
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

//  Provides the static folders we have added in the project to the web server.
app.use(express.static(__dirname + '/js'))
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));

//Default API Endpoint - returns the index.ejs landing / docu page.
app.get('/', function(req, res) {
    return res.render('index');
})

// JQuery fetch the data from the camden API
// Key Secret:  1mgcsed2w54949ao09urc92ce8tpizcxawsel92gxc170d26ur
// Key ID:      6lmy062j9slxtssj2u0vz427s
// Key Name:    treeMap 
// App TokenL   m9eU1BjvY0BO1CO4yLhpjPS26
$.ajax({
    url: "https://opendata.camden.gov.uk/resource/csqp-kdss.csv",
    type: "GET",
    data: {
      "$limit"      : 50000,
      "$$app_token" : "m9eU1BjvY0BO1CO4yLhpjPS26"
    }
}).done(function(data) {
  console.log("Retrieved " + data.length + " records from the dataset!");
  console.log("jQuery data: Fetched");
  var camdenData = data;
  if (camdenData != undefined){
    console.log("Tree Data stored as variable.")
    console.log(camdenData);
  }
  /*var sql = "INSERT INTO camden_tree VALUES ?"
  connection.query(sql, [camdenData], function(err, result){
    if (err) console.log("Data Import Error:" + err);
    console.log(result.affectedRows + " rows imported.");
  })*/
});





