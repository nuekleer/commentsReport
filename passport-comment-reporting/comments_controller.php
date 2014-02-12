<?php

if($_REQUEST['report'] == 'total'){
	$res2 = $wpdb->get_results("SELECT COUNT(wpc.comment_ID) as total_count from wp_comments wpc WHERE wpc.comment_date BETWEEN CAST( '$startDate' AS DATE ) AND CAST( '$endDate' AS DATE ) ", ARRAY_A);
	echo json_encode($res2);
}
if($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['startDate']) && isset($_GET['endDate'])){
	$startDate = $_GET['startDate'];
	$endDate = $_GET['endDate'];
	$path = $_SERVER['DOCUMENT_ROOT'];
	include_once $path . '/wp-load.php';
	global $wpdb;
	$res = $wpdb->get_results("SELECT wpp.ID, wpp.post_title, count(DISTINCT(wpc.comment_ID)) as count FROM wp_posts wpp JOIN wp_comments wpc ON wpp.ID = wpc.comment_post_ID WHERE wpc.comment_date BETWEEN CAST( '$startDate' AS DATE ) AND CAST( '$endDate' AS DATE ) GROUP BY wpp.ID ORDER BY count desc", ARRAY_A);
	echo json_encode($res);
}
?>