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

    var pluginName = 'defaultPluginName',
        defaults = {
            propertyName: "value"
        };

    function Plugin( element, options ) {
    	console.count('construct');
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
        
        return this;
    };

    Plugin.prototype.init = function () {
    	console.count('init');
    };
    
    Plugin.prototype.funcaoNova = function () {
    	funcaoPrivate();
    	console.info(this.element);
    	console.count('funcaoNova');
    };
    
    var funcaoPrivate = function () {
    	console.count('Private', this);
    };

    $.fn[pluginName] = function ( options ) {
    	
    	this.each(function(){
    		var plugin = $.data(this, 'plugin_' + pluginName);
        	if(!plugin){
        		plugin = new Plugin( this, options );
        	}
        	
    	});
    	
    };

})( jQuery, window, document );