<?php

$browser = $_POST["browser"];
$exp = $_POST["expression"];
$bug = $_POST["bug"];

mail("aske@mottelson.dk", "logic bug", "<strong>$browser</strong><br>$exp<br>$bug");

echo "File bugged";


?>
