<?php
/**
 * Plugin Name: Passport Comment Reports
 * Plugin URI: http://www.mattchristensen.net
 * Description: Show most commented posts
 * Version: 1.0
 * Author: Matt Christensen
 * Author URI: http://www.mattchristensen.net
 */

/*
	Creates the submenu page under comments
*/
function register_passport_comment_reporting_page(){
	add_comments_page( 'Comment Reports', 'Comment Reporting', 'read', 'Reporting', 'passport_comment_reporting_page');
}
function passport_comment_reporting_page($content){
	$filename = __DIR__."\\app\\templates\\templates.html";
	$handle = fopen($filename, "rb");
	$contents = fread($handle, filesize($filename));
	fclose($handle);
	echo $contents;
}
add_action('admin_menu', 'register_passport_comment_reporting_page');

/*
	Adds the proper javascripts scripts to the comment reporting page
*/
function passport_backbone_comment_reporting(){
	global $pagenow;
	if($pagenow == 'edit-comments.php'){
		wp_enqueue_script( 'backbone', get_template_directory_uri() . '/js/vendor/backbone-1.1.0.js' );
		//wp_enqueue_script( 'backboneyo', get_template_directory_uri() . '/js/vendor/backbone-1.1.0.min.js' );
		wp_enqueue_script( 'backbone_comment_reporting',  plugins_url('passport-comment-reporting/app/scripts/backbone_comments_report.js'));
	}
}
add_action('admin_enqueue_scripts', 'passport_backbone_comment_reporting', 11);
?>