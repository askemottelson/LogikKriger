<?php

include_once('sql.php');

$ip = $_SERVER['REMOTE_ADDR'];

$sql = "INSERT INTO visitor (ip) values ('$ip')";
mysql_query($sql);

?>
