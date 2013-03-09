<?php
$myServer = "localhost";
$myUser = "root";
$myPass = "grisko1";
$myDB = "logikkriger"; 

//connection to the database
$dbhandle = mysql_connect($myServer, $myUser, $myPass)
  or die("Couldn't connect to SQL Server on $myServer"); 

//select a database to work with
$selected = mysql_select_db($myDB, $dbhandle)
  or die("Couldn't open database $myDB"); 

//mssql_close($dbhandle);
?>
