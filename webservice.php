<?php
require_once("conf/conf.php");

$error = 0;
if( isset($_POST['type']) ) $type = $_POST['type']; else $error = 1;
if( isset($_POST['time']) ) $time = $_POST['time']; else $error = 1;

if( $error == 1 ) die("error");

$sql = mysql_connect( DB_HOST, DB_USER, DB_PASS );
$pid = mysql_select_db( DB_BASE, $sql );

$query_insert = "INSERT INTO nanny_time ('id','datetime','type','hour') VALUES ('', NOW(), '".$type."', '".$time."')";
$res_insert = mysql_query( $query_insert, $sql );

if( $res_insert ) echo "ok";
else echo "ko";

mysql_close( $sql );
?>