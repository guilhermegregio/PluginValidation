function init(){

	var myPlugin = $('body, #body').defaultPluginName();
	console.count(myPlugin);
	console.count($('body').defaultPluginName());
	console.count($('#body').defaultPluginName());
	
};

$(document).ready(init);