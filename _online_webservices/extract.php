<?php
require_once("conf/conf.php");

$error = 0;
if( isset($_GET['from']) ) $from = $_GET['from']; else $error = 1;
if( isset($_GET['to']) ) $to = $_GET['to']; else $error = 1;

if( $error == 1 ) die("error");

$sql = mysql_connect( DB_HOST, DB_USER, DB_PASS );
$pid = mysql_select_db( DB_BASE, $sql );

$query_select = "SELECT check_time, type FROM nanny_time WHERE check_time > '$from 00:00:01' AND check_time < '$to 23:59:59' ORDER BY check_time ASC";
$res_select = mysql_query( $query_select, $sql );

if( $res_select ) echo "ok<br>";
else echo "ko";

while( $row = mysql_fetch_assoc( $res_select ) )
{
	$date_str = $row["check_time"];
	$type = $row["type"];
	
	$time_format = strtotime( $date_str );
	
	$day_date = date("Y-m-d (D)", $time_format);
	$hour_date = date("H:i", $time_format);
	
	echo "- $day_date $hour_date ($type)<br>";
}

mysql_close( $sql );
?>