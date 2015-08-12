;(function($){
	var $form = $('form[name="wdtc-plugin-form"]'),
		$secret = $form.find('.widgetic_secret'),
		$public = $form.find('.widgetic_api_key'),
		$refresh = $form.find('.widgetic_refresh_token');
		$accept = $form.find('.widgetic_accept'),
		$userEmail = $form.find('.widgetic_user_email'), 
		$widgeticWrap = $('.widgetic-wrap');
	$form.on('submit', function(e){
		e.preventDefault();
		Widgetic.init($public.val(), basePath+'/wp-content/plugins/widgetic/assets/wdtc-proxy.html');
		Widgetic.auth(true).then(function(tokens){
			$refresh.val(tokens['refreshToken']);
			$form.unbind('submit');
			$form.submit();
		}).fail(function(){
			var error = '<p class="error">Please make sure you filled at least one URL on Widgetic and that you copied the correct keys.</p>'
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

	var $user_email = $('.wdtc-email').text();
	Widgetic.api('users/me')
		.then(function(user) {
			if($user_email !=  user.username){
				updateUser(user);
			}
		})
	
	function updateUser(user){
		jQuery.ajax({
			url: basePath + '/wp-admin/admin-ajax.php',
			type: 'POST',
			dataType: 'json',
			cache: true, 
			data: {
				action: 'wdtc_updateUser',
				test: '1234532', 
				email: user.username
			}
		}).success(function(data) {
			$('.wdtc-email').text(user.username);
		});
	}
})(jQuery);