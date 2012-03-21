/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

	var pluginName = 'myPlugin',
		pluginVersion = 0.1,
		
		// Funções Private
		nroElements = function($el){
			var nroItens = $el.length;
			// se nada for selecionado, retornar nada.
			if (!nroItens) {
				if (options && options.debug && window.console) {
					console.warn( "nothing selected, can't validate, returning nothing" );
				}
				return;
			}
			return nroItens;
		};
	
	$.fn[pluginName] = function(options){
		
		// Se existir mais de um elemento efetua o loop
		if(nroElements(this) > 1){
			this.each(function(){
				this[pluginName](options);
			});
			return;
		}
		
		// Verifica se o plugin ja foi criado para este elemento.
		var validator = $.data(this[0], pluginName);
		if ( validator ) {
			return validator;
		}
		
		// Inicia o plugin.
		validator = new $[pluginName]( options, this );
		
		return validator;
	};
	
	$[pluginName] = function(options, element) {
		
		// Se existir mais de um elemento efetua o loop
		if(nroElements(element) > 1){
			element.each(function(){
				$(this)[pluginName](options);
			});
			return;
		}
		
		this.options = options;
		this.$el = element;
		this.uid = Math.random();
		
		$.data(this.$el[0], pluginName, this);
		
		$[pluginName].version();
		
		return this;
	};
	
	$[pluginName].prototype.gui = function(){
		console.info('gui');		
	};
	
	$[pluginName].version = function() {
		console.count('Version-' + pluginVersion);
	};
	
})( jQuery, window, document );