function init(){

	$.myPlugin({}, $('#form1, #form2'));

	$.myPlugin({}, $('#form1, #form2'));
	$('#form2').myPlugin({'padao':2});
	$('#form1').myPlugin({'padao':3});
	$('#form2').myPlugin({'padao':2});
	$('#form1').myPlugin({'padao':3});
	$('#form2').myPlugin({'padao':2});
	$('#form1').myPlugin({'padao':3});
	
	console.info($('#form1').myPlugin(),$('#form2').myPlugin());
	//var pl = $('body').myPlugin();
	 
	 
	 //console.info('pl1', pl);
	 
	//var myPlugin = $('body, #body').defaultPluginName();
	//console.info(myPlugin);
	
	
};

$(document).ready(init);