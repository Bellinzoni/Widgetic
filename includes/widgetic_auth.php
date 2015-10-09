<?php

function updateRefreshToken($token) {
	$authToken = json_decode($token, true);
	update_option('widgetic_refresh_token', $authToken['refresh_token'], true);
}

function get_authToken()
{
	if(!function_exists('curl_version')){
		return false;
	}

	$client_id = esc_attr(get_option('widgetic_api_key'));
	$client_secret = esc_attr(get_option('widgetic_secret'));
	$refresh_token = esc_attr(get_option('widgetic_refresh_token'));
	$path = '/oauth/v2/token?client_id='.$client_id.'&client_secret='.$client_secret.'&refresh_token='.$refresh_token.'&grant_type=refresh_token';
	$url = 'https://widgetic.com'.$path;

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_REFERER, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	$result = curl_exec($ch);
	curl_close($ch);

	updateRefreshToken($result);

	return $result;
}

function wdtcToken(){
	echo get_authToken();die;
}

add_action( "wp_ajax_nopriv_wdtcToken", "wdtcToken" );
add_action( "wp_ajax_wdtcToken", "wdtcToken" );