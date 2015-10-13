;(function($){
	var $form            = $('form[name="wdtc-plugin-form"]'),
		$secret          = $form.find('.widgetic_secret'),
		$public          = $form.find('.widgetic_api_key'),
		$refresh         = $form.find('.widgetic_refresh_token');
		$accept          = $form.find('.widgetic_accept'),
		$userEmail       = $form.find('.widgetic_user_email'), 
		$userAccountPlan = $form.find('.widgetic_user_account_plan'),
		$widgeticWrap    = $('.widgetic-wrap');
	$form.on('submit', function(e){
		e.preventDefault();
		$widgeticWrap .find('p.widgetic_error').remove()
		Widgetic.init($public.val(), basePath+'/wp-content/plugins/widgetic/proxy/wdtc-proxy.html');
		Widgetic.auth(true, ["email", "skins", "compositions", "usage", "account_details"]).then(function(tokens){
			$refresh.val(tokens['refreshToken']);
			$form.unbind('submit');
			$form.submit();
		}).fail(function(){
			$widgeticWrap .find('p.widgetic_error').remove()
			var error = '<p class="widgetic_error">Please make sure you added "'+window.location.hostname+'" as redirect URL on your Widgetic <a href="https://widgetic.com/account/settings" target="_blank">Settings page</a> and that you copied the correct keys.</p>'
			$widgeticWrap.prepend(error);
		});
	});

	$('.wdtc_accept').bind('click', function(ev){
		ev.preventDefault();
		jQuery.ajax({
			url: basePath + '/wp-admin/admin-ajax.php',
			type: 'POST',
			dataType: 'json',
			cache: true, 
			data: {
				action: 'wdtc_accept',
				test: '1234532', 
			}
		}).success(function(data) {
			window.location = window.location.href
		});
	})

	$('.wdtc_disconnect').bind('click', function(){
		jQuery.ajax({
			url: basePath + '/wp-admin/admin-ajax.php',
			type: 'POST',
			dataType: 'json',
			cache: true, 
			data: {
				action: 'wdtc_disconnect',
				test: '1234532', 
			}
		}).success(function(data) {
			window.location = window.location.href
		});
	})

	var $user_email = $('.wdtc-email').text().toLowerCase();
	var $user_account_plan = $('.wdtc-account-plan span').text();

	if(apiKey.length > 0 && widgeticAuthToken) {
		Widgetic.api('users/me')
			.then(function(user) {
				if($user_email !=  user.username || $user_account_plan != user.subscription.plan.name){
					updateUser(user);
				}
			})
	}
	
	function updateUser(user){
		jQuery.ajax({
			url: basePath + '/wp-admin/admin-ajax.php',
			type: 'POST',
			dataType: 'json',
			cache: true, 
			data: {
				action: 'wdtc_updateUser',
				test: '1234532', 
				email: user.username, 
				account_type: user.subscription.plan.name
			}
		}).success(function(data) {
			$('.wdtc-email').text(user.username);
			$('.wdtc-account-plan span').text(user.subscription.plan.name);

		});
	}
})(jQuery);