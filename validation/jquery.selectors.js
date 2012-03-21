/* ============================================================
 * jquery.selectors.js v0.1.1 
 * ============================================================
 * Copyright 2011 DLBCA, Inc.
 * ============================================================ */

(function($){
	$.expr[":"].date = function(obj){
		if($(obj).attr("type") == "date"){
			return true;
		}
		return false;
	};
	$.expr[":"].range = function(obj){
		if($(obj).attr("type") == "range"){
			return true;
		}
		return false;
	};
	$.expr[":"].count = function(obj){
		if($(obj).data("count") !== undefined){
			return true;
		}
		return false;
	};
	
	$.expr[":"].vgroup = function(obj, index, meta, stack){
		if($(obj).data("validationgroup") !== undefined && ($(obj).attr('type') != 'button' && $(obj).attr('type') != 'submit')){
			if ( $.inArray(meta[3], $(obj).data("validationgroup").split(',')) != -1 ){
				return true;	
			}
		}
		return false;
	};
})(jQuery);