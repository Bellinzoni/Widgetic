<?php
/**
* Plugin Name: Widgetic
* Plugin URI: https://widgetic.com/
* Description: Widgetic for WordPress makes it easy to create responsive widgets for your site.
* Version: 1.0.3
* Author: Widgetic
* Author URI: https://widgetic.com/
* License: GPLv2 or later
*/


/* 
 * Plugin settings 
 */
include_once('includes/widgetic_settings.php');

/**
 * 
 */
include_once('includes/widgetic_auth.php');

/*
 * 
 */
add_action('init', 'widgetic_setup');

function widgetic_setup(){
	add_action('admin_init', 'widgetic_admin_init');
	add_shortcode('widgetic', 'widgetic_shortcode');

}
function widgetic_admin_init(){
	add_action('admin_head', 'widgetic_add_button');
	add_action('print_media_templates', 'widgetic_shortcode_print_templates');
}


/*
 * Inject Widgetic SDK to <head></head> (front-end)
 */
add_action('wp_enqueue_scripts', 'widgetic_sdk');
add_action('wp_head', 'widgetic_sdk');
add_action('admin_head', 'widgetic_sdk');
function widgetic_sdk(){
	wp_register_script('sdk', 'https://widgetic.com/sdk/sdk.js', false, '1.0', false);
	wp_enqueue_script('sdk');
}


function getBasePath(){
	$basePath = get_site_url();
	echo '<script type="text/javascript"> var basePath = "'.$basePath.'";</script>';
}
add_action('admin_head', 'getBasePath');


function getApiKey(){
	$apiKey = esc_attr(get_option('widgetic_api_key'));
	$widgetic_refresh_token = esc_attr(get_option('widgetic_refresh_token'));
	echo '<script type="text/javascript"> 
			var apiKey = "'.$apiKey.'",
				widgetic_refresh_token = "'.$widgetic_refresh_token.'";
		</script>';
}
add_action('admin_head', 'getApiKey');


function settingsScripts(){
	wp_register_script('wdtc-plugin-settings', plugins_url( '/js/wdtc-plugin-settings.js', __FILE__ ), false, '1.0', false);
	wp_enqueue_script('wdtc-plugin-settings');

	wp_register_script('wdtc-init-sdk', plugins_url( '/js/wdtc-init-sdk.js', __FILE__ ), false, '1.0', false);
	wp_enqueue_script('wdtc-init-sdk');
}
add_action('admin_head', 'settingsScripts');

function authToken(){
	$access_token = '';
	$refresh_token = '';
	if($response = get_authToken()){
		$authToken = json_decode($response, true);
		$access_token = $authToken['access_token'];
		$refresh_token = $authToken['refresh_token'];
	}
	echo '<script type="text/javascript">
		var widgeticAuthToken = "'.$access_token.'";
		var widgeticRefreshToken = "'.$refresh_token.'";
	</script>';
}
add_action('admin_head', 'authToken');

/*
 * Include plugin css file 
 */
function widgetic_css() {
	wp_enqueue_style('widgetic', plugins_url('/css/style.css', __FILE__));
}
add_action('admin_enqueue_scripts', 'widgetic_css');




function widgetic_add_button() {
	global $typenow;
	// check user permissions
	if ( !current_user_can('edit_posts') && !current_user_can('edit_pages') ) {
	return;
	}
	// check if WYSIWYG is enabledz
	if ( get_user_option('rich_editing') == 'true') {
		add_filter("mce_external_plugins", "widgetic_add_tinymce_plugin");
		add_filter('mce_buttons', 'widgetic_register_button');
	}
}


/* 
 * Register widgetic button
 */
function widgetic_register_button($buttons) {
	array_push($buttons, "widgetic");
	return $buttons;
}

/*
 * Add widgetic external plugin for tinymce editor
 */
function widgetic_add_tinymce_plugin($plugin_array) {
	$plugin_array['widgetic'] = plugins_url( '/js/widgetic_tinymce_plugin.js', __FILE__ ); // CHANGE THE BUTTON SCRIPT HERE
	return $plugin_array;
}



/*
 * Create visual template
 */
function widgetic_shortcode_print_templates(){
	if(!isset(get_current_screen()->id) || (get_current_screen()->base != 'post' && get_current_screen()->base != 'page'))
		return;

	?>
	<script type="text/html" id="tmpl-editor-widgetic_view">
		<div class="widgetic-item-preview">
			<div class="widgetic-item-preview-content">
				<div class="widgetic-item-preview-logo"></div>
				<p class="widgetic-item-preview-details">{{data.wname}} &#8226;<span> {{data.cname}}</span></p>
				<p class="widgetic-item-preview-link">Click to edit</p>
			</div>
			<a href="{{data.url}}" data-sh="btn" data-sh-href="{{data.url}}" data-sh-classes="widgetic-composition" data-sh-data-id="{{data.id}}" data-sh-dataWidth="{{data.width}}" data-sh-dataHeight="{{data.height}}" data-sh-dataResize="{{data.resize}}" class="{{data.classes}}"><i class="{{data.ic_classes}}"></i></a>
		</div>
	</script>
	<?php
 }

/*
 * Return shortcode output
 */
function widgetic_shortcode($atts, $content = null){
	$output = false;
	extract(shortcode_atts(array(
		'url'=>'#',
		'id' => '',
		'width' => '',
		'height' => '',
		'resizemode' => '', 
		'wname' => '', 
		'cname' => '',
	), $atts));
	$output .= '<a href="'.$url.'" class="widgetic-composition" data-id="'.$id.'" data-width="'.$width.'" data-height="'.$height.'" data-resize="'.$resizemode.'">';
	
	$output .= '</a>'; 
	return $output;
}
 
function widgetic_add_editor_styles() {
	add_editor_style(plugins_url('/css/style.css', __FILE__));
}
add_action( 'admin_init', 'widgetic_add_editor_styles' );


/*
 * Get media
 */
function getMedia(){
	$type = $_POST['type'];
	$query_media_args = array(
		'post_type' => 'attachment', 'post_mime_type' => $type, 'post_status' => 'inherit', 'posts_per_page' => -1,
	);

	$query_media = new WP_Query( $query_media_args );

	$media_array = array();
	foreach ( $query_media->posts as $media) {
		$media_array[]= array(
			'id'   => $media->ID,
			'name' => $media->post_title,
			'url'  => wp_get_attachment_url($media->ID), 
			'type' => $type
		);
	}
	die(json_encode($media_array));
}
add_action( "wp_ajax_nopriv_getMedia", "getMedia" );
add_action( "wp_ajax_getMedia", "getMedia" );

?>
