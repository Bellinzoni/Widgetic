(function() {
	var wpIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAASCAYAAADlhqZNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0VEMkQyQjIzNDQwMTFFNTg1NTBCMkY4NjYxMUVFQjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUUyMUJCOUEzNDNEMTFFNTg1NTBCMkY4NjYxMUVFQjEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUUyMUJCOTIzNDNEMTFFNTg1NTBCMkY4NjYxMUVFQjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUUyMUJCOTMzNDNEMTFFNTg1NTBCMkY4NjYxMUVFQjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Exz6iAAACa0lEQVR42ryXXYhNURiGz5xwI2JMBxciMo1IiBTuxPGTaGL8FUkSaa7kilxIosjFJJLxU0zK3/hJRw2KC3HnYjAXFMWQlCHC5Hi+ek997c6E2Wvtr572Wmvvtff7rr32t9auKZfLOYtisZirElthJRRgkNp+wQe4Bi3JDqVSKZdR/Le2AX3caDach+9wA+5Al85NgIWwBZphPTzJZRf91lbN7Bpog/2wu8r5t/AA9uimj6AJLmdgNJW2pNlZcA7Gw6t/eHgN5OGSRvVlRKOptSXNXodnMB22wQGYpm+jS51HwSkZO+H63oJJEc2m1pZ3DfN08VS9dvvYf8B7jeZROAJDoQd64b76foIGWB7JaBBt3myzRuC16k/hG3TCYvitdhvFbpU3uv43YUMks0G0ebNTJLZD9X2JB7bpuMu12cPvQq2uL0QyG0SbNztQr/yi6hNhsjt/QUebTnNc+zt4AY9hcCSzQbR5s5WpYLuCnyo3JUa3EqtdeSy0/mXdThtBtHmztpWaofIVt65VRnYEXFV9lUvvw+E41EU0G0SbN/sFGlU+qWO9bma7ls+wVu2jYZimTI/YrCwZI4Jo82ZPwyaV7cP+6KaLpfw3SvedbmQXQbvq27WNixFBtHmzx2CIy2hndTwMc900aXUZcSkc1KhacjgUyWwQbfnETZfogpmwU20jlQm/ql55e3W6eUHZcFnkfXFqbUmzDzVd7E9hHdxTctjrrul265pNoeewQ38fMSO1tmrZ84y+gRZtsyzGuIEZpyllMV+/Ubcz+r1Lpa2vpaJDm3pLAAuUIPwssIV6hUsAWUa/tf0RYADvJd872rNAywAAAABJRU5ErkJggg';
	var widgetic = 'widgetic', 
		media = wp.media,
		shortcode_widgetic = 'widgetic',
		shortcode_string = 'widgetic',
		myButton = null,
		saveToken = function(token) {
			window.widgeticAuthToken = token.access_token;
			Widgetic.auth.token(widgeticAuthToken);
		},
		tryAuth = function(){
			return jQuery.ajax({
				url: basePath + '/wp-admin/admin-ajax.php',
				type: 'GET',
				dataType: 'json',
				cache: true, 
				data: {action: 'wdtcToken'}
			}).success(saveToken);
		};
	var	frame;
	if(apiKey.length > 0) {
		Widgetic.init(
			apiKey,
			basePath+'/wp-content/plugins/widgetic/proxy/wdtc-proxy.html'
		);
		window.widgeticAuthToken || tryAuth();
	}



	tinymce.PluginManager.add(widgetic, function( editor ) {
		// Add a button that opens a window
		editor.addButton(widgetic, {
			title: 'Widgetic',
			icon: 'icon widgetic-own-icon',
			onclick:  function(){
				widgeticBox(null);
			}
		});

		function widgeticBox(opts){
			if(apiKey.length && widgetic_refresh_token.length) {
				if(!widgeticAuthToken) {
					return tryAuth().then(widgeticBox);
				}

				popup = editor.windowManager.open( {
					title: 'Widgetic',
					width: window.innerWidth-60,
					height: window.innerHeight-60-37,
					resizable: true,
					buttons: []
				});
				var showPlugin = wigetic_plugin.bind(null, jQuery('#'+popup._id+'-body')[0], opts);
				showPlugin()
			} else {
				window.location.href="admin.php?page=widgetic/includes/widgetic_settings.php"
			}
		}

		function loadMediaContent(plugin, opts) {
			jQuery.ajax({
				url: basePath + '/wp-admin/admin-ajax.php',
				type: 'POST',
				dataType: 'json',
				cache: true, 
				data: {
					action: 'getMedia',
					test: '1234532', 
					type: opts['content-type'][0]
				}
				
			}).success(function(data) {
			 	plugin.addEditorContent({
					editorId: opts.editorId,
					source: opts.source.toLowerCase(),
					data: data
				});
			});
		}

		function openMedia (plugin, opts) {
			if ( frame ) {
				frame.open();
				return;
			}
			frame = wp.media.frames.frame = wp.media({
				multiple: 'add',
				library : { type: opts['content-type'][0]},	
			});

			frame.on('select', function(){
				var selection = frame.state().get('selection');
				var attachments = selection.map( function( attachment ) {
					attachment = attachment.toJSON();
					return {
						'id': attachment.id,
						'name' : attachment.title, 
						'url'  : attachment.url,
						'type': opts['content-type'][0]
					}
				});

			 	plugin.addEditorContent({
					editorId: opts.editorId,
					source: opts.source.toLowerCase(),
					data: attachments
				});
			});

			frame.open();
		}

		function insertWidget(opts) {
			var s = '[' + widgetic;
			for (var p in opts) {
				if (opts.hasOwnProperty(p)) {
					s += ' ' +  p + '=\'' + opts[p] + '\'';
				}
			}
			s += ']';
			s += '[/' + widgetic + ']';
			editor.insertContent(s);

			editor.windowManager.close();
		} 

		function wigetic_plugin(body, opts){
			var loaded = false;
			if(opts){opts.resizeMode = opts.resizemode;}

			var plugin = Widgetic.UI.plugin.create({
				holder: body,
				composition: opts,
				editor: {
					sources: {
						wordpress: {
							options: {
								pos: 2,
								icon: wpIcon,
								colors: {light: '#517fa6', dark: '#497295 '},
								connectButton: {label: 'Wordpress'}
							}
						}
					}
				},
			})
			.on('embed', function(opts){
				console.log('Plugin notify embed: ', opts);
				insertWidget(opts)
				plugin.close();
			})
			.on('open-library', function(opts){
				console.log('Plugin notify embed: ', opts);
				if(!loaded){
					loadMediaContent(plugin, opts);
					loaded = true;
				}
				if(opts.interactive) {
					openMedia(plugin, opts)
				}
			})
			.on('close', function(){
				console.log('Plugin notify closed');
			});
		}
		

		wp.mce.widgetic_view = {
			shortcode_data: {},
			template: media.template('editor-widgetic_view' ),
			getContent: function() {
					var options = this.shortcode.attrs.named;
					return this.template(options);
			},
			View: {
				// before WP 4.2:
				template: media.template( 'editor-widgetic_view' ),
				postID: jQuery('#post_ID').val(),
				initialize: function( options ) {
					this.shortcode = options.shortcode;
					wp.mce.widgetic.shortcode_data = this.shortcode;
				},
				getHtml: function() {
					var options = this.shortcode.attrs.named;
					return this.template(options);
				}
			}, 
			edit: function( data, update) {
				var shortcode_data = wp.shortcode.next(shortcode_string, data);
				var values = shortcode_data.shortcode.attrs.named;
				widgeticBox(values)
				
			},

		};
		wp.mce.views.register(shortcode_widgetic, wp.mce.widgetic_view);
		
	});
	
})();