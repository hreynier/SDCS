// Camden Tree Data API Server
// Author: Harvey Reynier
// Description: This API Server allows users to connect to the Camden openAPI, request data, 
// and format the data to be presented on a map.

//This API assumes that the following functions are defined on MySQL,
//      Distance etc.

//And the following packages are installed on the server:
//              moment,     mysql,      node,       jsdom,
//              jquery,     express,    forever (to run sever forever.)

var moment = require('moment');

var portNumber = 8703;

var mysql = require('mysql');

var path = require('path');

const util = require('util');   //  For promisify to deal with call-back errors.

//const fastcsv = require('fast-csv');

//const fs = require('fs');

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
    //Not sure if needed as now importing manually.
    /*var sql = `CREATE TABLE IF NOT EXISTS camden_tree(
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
    })*/
});

//  Setup the Express Server
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

//  Provides the static folders we have added in the project to the web server.
app.use(express.static(__dirname + '/js'))
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/data'));

//Default API Endpoint - returns the index.ejs landing / docu page.
app.get('/', function(req, res) {
    return res.render('index');
})

//  API EndPoint to get spatial data for all trees in camden. Latitude/Longitude : 51.5390/0.1426 Radius : 30.
app.get('/data/:lat/:lon/:radius', function (req, res) {

    // Allows data to be downloaded from the server with security concerns
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
    // If all the variables are provided connect to the database
    if(req.params.lat != "" && req.params.lon != "" && req.params.radius != ""){
             
              // Parse the values from the URL into numbers for the query
              var Lat = parseFloat(req.params.lat);
              var Lon = parseFloat(req.params.lon);
              var radius = parseFloat(req.params.radius);


              // SQL Statement to run
              var sql = "SELECT * FROM tree_locations WHERE DISTANCE(coords, POINT("+Lon+","+Lat+") ) <= " + radius;
              
              // Log it on the screen for debugging
              console.log(sql);

              // Run the SQL Query
              connection.query(sql, function(err, rows, fields) {
                      if (err) console.log("Err:" + err);
                      if(rows != undefined){
                              // If we have data that comes bag send it to the user.
                              res.send(rows);
                      }else{
                              res.send("");
                      }
              });
      }else{
              // If all the URL variables are not passed send an empty string to the user
              res.send("");
      }
});

//  API Endpoint to get descriptional data on a specific tree. i.e. height, species etc..
app.get('/data/treeDescription/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
    if(req.params.id != ""){
              var id = parseInt(req.params.id);
          
              var sql = "SELECT * FROM tree_data where id = " + id; 

              console.log(sql);
              connection.query(sql, function(err, rows, fields) {
                      if (err) console.log("Err:" + err);
                      if(rows != undefined){
                              res.send(rows);
                      }else{
                              res.send("");
                      }
              });
      }else{
              res.send("");
      }
});

//  API Endpoint to get all the trees of one species/common name.
app.get('/data/tree/:commonname', function (req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
    if(req.params.commonname != ""){
        //Parse the variables from url, making sure to precent SQL injection.
        var name = mysql_real_escape_string(req.params.commonname);

        //SQL statement
        var sql = "SELECT * FROM tree_data WHERE name_common like '%"+name+"%'";
        //Debuggin
        console.log(sql);

        //Run the query
        connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if (rows != undefined){
                res.send(rows);
            }else{
                res.send("");
            }
        })
    }else{
        res.send("");
    }
});

//  API EndPoint to get spatial & sustainability (carbon, pollution etc) data for all trees in camden.
app.get('/data/sust/:weight', function (req, res) {

    // Allows data to be downloaded from the server with security concerns
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
    // If all the variables are provided connect to the database
    if(req.params.weight != ""){
             
              // Parse the values from the URL into numbers for the query
              //var Lat = parseFloat(req.params.lat);
              //var Lon = parseFloat(req.params.lon);
              var weight = mysql_real_escape_string(req.params.weight);


              // SQL Statement to run
              var sql = "SELECT l.id, l.Lat, l.Lon, s."+weight+" FROM tree_locations l INNER JOIN sust_data s ON l.id = s.id;"
              
              // Log it on the screen for debugging
              console.log(sql);

              // Run the SQL Query
              connection.query(sql, function(err, rows, fields) {
                      if (err) console.log("Err:" + err);
                      if(rows != undefined){
                              // If we have data that comes bag send it to the user.
                              res.send(rows);
                      }else{
                              res.send("");
                      }
              });
      }else{
              // If all the URL variables are not passed send an empty string to the user
              res.send("");
      }
});

//  API Endpoint to get the Camden Ward Boundary Spatial GeoJSON from the server.
app.get('/data/boundary', function (req, res) {

    //  Allows data to be downloaded from the server with security concerns.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
    
    var options = {
        root: path.join(__dirname, '/data')
    };
    console.log("/data/boundary . . . Sending data.")
    res.sendFile('Camden_Ward_Boundary.geojson', options ,function (err){
        if (err)    {
            console.log(err);
        }   else    {
            console.log("Sent: Camden Ward Boundaries");
        }
    });
})

//  API Endpoint to get clustering data results.
app.get('/data/clusters/', function (req, res){

    //  Allows data to be dwnloaded from the server with security concerns.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Acces-Control-Allow-Headers", "X-Requested-WithD");

    //  SQL statement.
    var sql = "SELECT ward_name, Amenity_Gi, Pollution_Gi FROM clusters ORDER BY ward_name;"
    //  Log it.
    console.log("SQL: " + sql);

    //  Run the query.
    connection.query(sql, function(err, rows){
        if (err) console.log("Err: " + err);
        if (rows != undefined){
            res.send(rows);
        }   else    {
            res.send("");
        }
    })
})

//  API Endpoint to get counts of tree types for pie chart.
app.get('/data/tree-types', function (req, res) {

    //  Allows data to be dwnld from the server with security concerns to bypass CORS policy.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-WithD");

    //  Drop tables if exist.

    var sql = "DROP TABLE IF EXISTS temp_bot, temp_top;"
    connection.query(sql, function(err){
        if (err) console.log("Err: " + err);
        else console.log("Dropping temporary tables...")
    })

    //  SQL Statement - Create temporary table that gets the top 10 most common trees and bottom X (n-10) common trees.
    var sql = "CREATE TEMPORARY TABLE temp_bot SELECT Com_Name, count(Com_Name) AS count FROM tree_data GROUP BY Com_Name ORDER BY count limit 285;"

    //  Log.
    console.log("Creating temporary table...");
    console.log(sql);

    //  Run the query.
    connection.query(sql, function(err){
        if (err) console.log("Error: " + err);
        else console.log("Successfully created temporary table 1.")
    })

  
    //  Top 10.
    var sql = "CREATE TEMPORARY TABLE temp_top SELECT Com_Name, count(Com_Name) AS count FROM tree_data GROUP BY Com_Name Order BY count DESC limit 10;"

    //  Log
    console.log("Creating temporary table...");
    console.log(sql);

    connection.query(sql, function(err){
        if (err) console.log("Error: " + err);
        else console.log("Successfully create temporary table 2.")
    })

    //  Calc sum of bottom 285 trees.
    var sql = "INSERT INTO temp_top (Com_Name, count) VALUES ('Other', (SELECT SUM(count) FROM temp_bot));"

    // Log.
    console.log("Merging tables...");
    console.log(sql);

    //Query
    connection.query(sql,function(err){
        if (err) console.log("Error: " + err);
        else console.log("Successfully merged temp tables.")     
    })

    //  Get the final data.
    var sql = "SELECT * FROM temp_top;"

    //  Log.
    console.log("Getting Data: " + sql);

    //  Query
    connection.query(sql, function(err, rows){
        if (err) console.log("Error: " + err);
        if (rows != undefined){
            res.send(rows);
            console.log("Successfully delivered data.")
        }   else   {
            console.log("rows undefined.")
            res.send("");
        }
    })
})


// Setup the server and print a string to the screen when server is ready
var server = app.listen(portNumber, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
})

//  Function to prevent SQL injection on string API requests.
function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}




