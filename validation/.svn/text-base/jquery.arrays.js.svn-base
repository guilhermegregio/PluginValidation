/* ============================================================
 * jquery.array.js v0.1.1 
 * ============================================================
 * Copyright 2011 DLBCA, Inc.
 * ============================================================ */

(function($){
	$.extend({
		popIndex: function(array, index) { 
	    	return $.grep(array, function(v,i){
	    		return i != index;
	    	});
	    },
	    popValue: function(array, value) { 
	    	return $.grep(array, function(v,i){
	    		return v != value;
	    	});
	    },
	    popObjId: function(array, id) { 
	    	return $.grep(array, function(v,i){
	    		return v.id != id;
	    	});
	    },
	    popObjUnique: function(array) {
	    	var oldName = [];
	    	array = $.grep(array, function(v,i){
	    		if($.inArray(v.id, oldName) == -1){
	    			oldName.push(v.id);
	    			return true;
	    		}				
	    		return false;
	    	});
	    	return array;
	    }
	});
})(jQuery);