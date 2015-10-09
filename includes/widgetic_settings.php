<?php

add_action('admin_menu', 'widgetic_setup_menu');
 
function widgetic_setup_menu(){
	add_menu_page('Widgetic', 'Widgetic', 'administrator', __FILE__, 'widgetic_plugin_settings_page', plugins_url('widgetic/images/wig-logo.png'));
	//call register settings function
	add_action( 'admin_init', 'register_widgetic_plugin_settings' );
}
function register_widgetic_plugin_settings() {
	//register our settings
	register_setting( 'widgetic-plugin-settings-group', 'widgetic_api_key');
	register_setting( 'widgetic-plugin-settings-group', 'widgetic_secret');
	register_setting( 'widgetic-plugin-settings-group', 'widgetic_refresh_token');
	register_setting( 'widgetic-plugin-settings-group', 'widgetic_accept');
	register_setting( 'widgetic-plugin-settings-group', 'widgetic_user_email');
	register_setting( 'widgetic-plugin-settings-group', 'widgetic_logged_in');


}
function wdtc_accept(){
	update_option('widgetic_accept', true, true);
}
add_action( "wp_ajax_nopriv_wdtc_accept", "wdtc_accept" );
add_action( "wp_ajax_wdtc_accept", "wdtc_accept" );

function wdtc_updateUser(){
	update_option('widgetic_user_email', $_POST['email'], true);
	update_option('widgetic_user_account_plan', $_POST['account_type'], true);

}
add_action( "wp_ajax_nopriv_wdtc_updateUser", "wdtc_updateUser" );
add_action( "wp_ajax_wdtc_updateUser", "wdtc_updateUser" );

function wdtc_disconnect(){
	update_option('widgetic_refresh_token', '', true);
	update_option('widgetic_api_key', '', true);
	update_option('widgetic_secret', '', true);
	update_option('widgetic_user_email', '', true);
	update_option('widgetic_accept', '', true);
	update_option('widgetic_user_account_plan', '', true);
}
add_action( "wp_ajax_nopriv_wdtc_disconnect", "wdtc_disconnect" );
add_action( "wp_ajax_wdtc_disconnect", "wdtc_disconnect" );


function widgetic_plugin_settings_page() {
	?>
	<h2>Widgetic</h2>
	<div class="wrap widgetic-wrap">
	<?php
	if(get_option('widgetic_refresh_token') && get_option('widgetic_accept') == true){
	?>
		<table class="form-table">
			<tr valign="top">
				<th scope="row">Email:</th>
				<td class="wdtc-email"><?php echo esc_attr(get_option('widgetic_user_email')); ?></td>
			</tr>
			<tr valign="top">
				<th scope="row">Account Type:</th>
				<td class="wdtc-account-plan">
					<span style="text-transform: capitalize;"><?php echo esc_attr(get_option('widgetic_user_account_plan')); ?> </span><?php if(strcmp(esc_attr(get_option('widgetic_user_account_plan')), 'basic') == 0){ ?> (<a href="https://widgetic.com/plans/">upgrade</a>) <?php } ?>
				</td>
			</tr>
		</table>
		<p class="submit"><button class="wdtc_disconnect button-primary" style="margin-right:75px;">Disconnect</button></p>

	<?php
	} else {
		if(get_option('widgetic_refresh_token')){
		?>
			<p>For Basic users, our widgets will display a small Widgetic branding.</p>
			<a href="#" class="wdtc_accept button-primary" style="margin-right:75px;">It’s fine, I like free stuff</a>
			<a href="https://widgetic.com/plans/"target="_blank">Oh noes, remove Branding</a>        
		
		<?php
		} else {
		?>
			<p>If you don't have an API key sign in and generate one in your <a href="https://widgetic.com/account/settings" target="_blank">Settings page</a>.</p>
			<form method="post" name="wdtc-plugin-form" action="options.php" >
				<?php settings_fields( 'widgetic-plugin-settings-group' ); ?>
				<?php do_settings_sections( 'widgetic-plugin-settings-group' ); ?>
				<table class="form-table">
					<tr valign="top">
						<th scope="row">Public Key</th>
						<td><input type="text" name="widgetic_api_key" class="regular-text widgetic_api_key" value="<?php echo esc_attr(get_option('widgetic_api_key') ); ?>" /></td>
					</tr>
					<tr valign="top">
						<th scope="row">Secret Key</th>
						<td><input type="text" name="widgetic_secret" class="regular-text widgetic_secret" value="<?php echo esc_attr(get_option('widgetic_secret') ); ?>" /></td>
					</tr>
					<tr valign="top">
						<td colspan="2" style="padding:0;"><input type="hidden" name="widgetic_refresh_token" class="regular-text widgetic_refresh_token" value="<?php echo esc_attr(get_option('widgetic_refresh_token')); ?>" /></td>
					</tr>
					<tr valign="top">
						<td colspan="2" style="padding:0;"><input type="hidden" name="widgetic_accept" class="regular-text widgetic_accept" value="<?php echo esc_attr(get_option('widgetic_accept')); ?>" /></td>
					</tr>
					<tr valign="top">
						<td colspan="2" style="padding:0;"><input type="hidden" name="widgetic_user_email" class="regular-text widgetic_user_email" value="<?php echo esc_attr(get_option('widgetic_user_email')); ?>" /></td>
					</tr>

					<tr valign="top">
						<td colspan="2" style="padding:0;"><input type="hidden" name="widgetic_user_account_plan" class="regular-text widgetic_user_account_plan" value="<?php echo esc_attr(get_option('widgetic_user_account_plan')); ?>" /></td>
					</tr>
					
				</table>
				<input type="submit" class="button button-primary" value="Save Changes">
			</form>
		<?php 
		}
	}?>
	</div>
	<?php

} 
?>