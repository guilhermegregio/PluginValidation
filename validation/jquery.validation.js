/* ============================================================
 * jquery.4data.0.1.js v0.1.1
 
 * ============================================================
 * Copyright 2011 DLBCA, Inc.
 * Utilização:
 * <form action="/pagina" method="POST" id="myForm">
 * 	<div id="nome">
 * 		<label>Nome:</label>
 * 		<input type="text" name="nome" required="required" data-message="Campo requerido"/>
 * 	</div>
 * 	<input type="submit" value="ok" />
 * </form>
 * 
 * $("#myForm").validacao();
 * ============================================================ */

// Inserir componentes do jQuery UI
(function($){
	$.datepicker.regional['pt-BR'] = {
		closeText: 'Fechar',
		prevText: '&#x3c;Anterior',
		nextText: 'Pr&oacute;ximo&#x3e;',
		currentText: 'Hoje',
		monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
		'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
		'Jul','Ago','Set','Out','Nov','Dez'],
		dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
		dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['pt-BR']);
	
	$(":count").each(function(){
		var $el = $(this);
		var id = $el.data("count");
		
		if($("#"+id)[0] === undefined){
			$("<p/>",{style:"margin:0;",text:"Caracteres: "}).append($("<span/>",{class:"count"})).insertAfter($el);
		}
		
		$el.bind("change, keyup, keydown", function(){
			var contagem = $(this).val().length + 1;
			if($("#"+id)[0] !== undefined){
				$("#"+id).html(contagem);
			}else{
				$(this).parent().find(".count").html(contagem);					
			}
		});
	});
	
	$(":date").each(function(){
		$(this).data("old-type",$(this).attr("type"));
		this.setAttribute("type","text");
		$(this).datepicker( {autoSize: true} );
	});
	$(":range").each(function(){
		$range = $(this);
		$r_step = $range.attr("step");
		$r_min = $range.attr("min");
		$r_max = $range.attr("max");
		$("<div/>").insertBefore($range).slider({step:parseInt($r_step), min:parseInt($r_min), max:parseInt($r_max),change: function(event, ui) {
			$(this).parent().find("input").val(ui.value);
		}});
		$range.hide();
	});
})(jQuery);

(function($) {
	
	var validationgroup = "";
	// Method validation
	$.fn.validation = function(){
		this.validate = subMethodsValidation.validate;
		this.addCustomValidate = subMethodsValidation.addCustomValidate;
		this.addMask = subMethodsValidation.addMask;
		this.teste = subMethodsValidation.teste;
		
		return this;
	};
	
	// Lib messages lang
	var libMessages = {
		'ptbr' : {
			'default'		: 'Campo preenchido incorretamente.',
			'required'		: 'Campo requerido.',
			'min'			: 'Valor menor do que o exigido.',
			'max'			: 'Valor máximo excedido.',
			'minLength'		: 'Não atingiu o mínimo de caracteres.',
			'maxLength'		: 'Ultrapassou o limite de caracteres.',
			'checkboxGroup'	: 'Selecione algum item.',
			'date'			: 'Data inválida.',
			'datetime'		: 'Data e hora inválida.', 
			'email'			: 'E-mail inválido.',
			'number'		: 'Numero inválido.',
			'range'			: 'Range inválido.',
			'tel'			: 'Telefone inválido.',
			'time'			: 'Hora inválida.',
			'url'			: 'Endereço url inválido.',
			'pattern'		: 'Padrão inválido.'
		},
		'en' : {
			'default'		: 'Field populated incorrectly.',
			'required'		: 'This field is required.',
			'min'			: 'Value less than required.',
			'max'			: 'Maximum exceeded.',
			'minLength'		: 'Not reached the minimum length.',
			'maxLength'		: 'Exceeded the character limit.',
			'checkboxGroup'	: 'Select an item.',
			'date'			: 'Invalid Date.',
			'datetime'		: 'Invalid date and time.', 
			'email'			: 'E-mail is invalid.',
			'number'		: 'Invalid number.',
			'range'			: 'Invalid range.',
			'tel'			: 'Invalid phone.',
			'time'			: 'Invalid time.',
			'url'			: 'Invalid url.',
			'pattern'		: 'Invalid pattern.'
		}
	};

	// Methods de Setup
	$.validation = {
		version : '0.3',
		addLang : function(obj) { 
			libMessages = $.extend(libMessages,obj);
		}
	};
	
	// Sub Methods in Validation
	var subMethodsValidation = {
		validate : function(options){
			return $(this).each(function(){
			// Namespace to functions
			var fn = {};
			// Initialization of variables
			var $elements = [], $form = {};
			
			// Nickname for the form
			$form = $(this);
			// Get all elements of the form
			$elements = $form.find('input, textarea, select');
			
			// Validate attributes of the form
			if ($form[0] === undefined) {
				$.error("Form inválido.");
			} else if ($form[0].nodeName != 'FORM') {
				$.error($form[0].nodeName + "#" + $(this).attr("id")
						+ " não é um form.");
			} else if ($form.attr('action') === undefined) {
				$.error("Form não contem action.");
			}
			
			$form.data('methods', {validation: function(){
					return fn.validateGeneric();
			 	}
			});
			
			// Settings Default
			$form.data('settings',$.extend({
				'errors' : [],
				'action' : $form.attr("action"),
				'method' : $form.attr("method"),
				'success' : function(data, textStatus, jqXHR) {
					alert("Sucesso");
				},
				'error404' : function(action) {
					$.error("Pagina: " + action + " não encontrada.");
				},
				'error400' : function(data, textStatus, jqXHR) {
					var json = JSON.parse(data.responseText);
					
					fn.removeMessages();
					$.each(json.errors, function() {
						fn.addErrorServer(this.category, this.message);
					});
					fn.isErrors();
				},
				'error500' : function(data, textStatus, jqXHR) {
					var json = JSON.parse(data.responseText);
					$.each(json.errors, function() {
						fn.addErrorServer(this.category, this.message);
					});
					fn.isErrors();
				},
				'divErrorPosition' : 'top',
				'showErrorsIn' : 'fields',
				'buttonSubmit' : $form.find("input:submit"),
				'fileCss' : 'validation/jquery.4data.0.1',
				'customValidations' : [],
				'lang' : 'ptbr'
			}, $form.data('settings'),options));
			// Shortcurt for data settings
			var $settings = $form.data('settings');
			// Includes CSS file that will be used by the plugin.
			fn.includeFileCss = function(_file){
				$('<link/>',{"rel":"stylesheet","type":"text/css","href": "/fourData/static/libs/jquery/" + _file + ".css"})
				.appendTo("head");
			};
			// View messages the form
			fn.viewMessages = function() {
				// Create element div
				var $div = $("<div/>", {"class" : "allErrors validateError"}).append("<ul/>");
				
				// Insert div element in the form, conform configuration.
				if ($settings.divErrorPosition == 'top') {
					$form.prepend($div);
				} else {
					$form.append($div);
				}
				
				$settings.errors = $.popObjUnique($settings.errors);
				
				// Loop in errors
				$.each($settings.errors, function() {
					$li = $("<li/>",{'text': this.id + " : " + this.message});
					$span = $("<span/>",{'class':'validateError', 'text': this.message});
					// Add message in the div element if not found name element
					// in form
					if($settings.showErrorsIn == 'fields'){
						if ($form.find($('[name="' + this.id + '"]')).parent().length == 0) {
							$form.find(".allErrors ul").append($li);
						}
					}
					// Add all errors in DIV errors.
					if($settings.showErrorsIn == 'centralization' || $settings.showErrorsIn == 'both'){
						$form.find(".allErrors ul").append($li);
					}
					// Add message in input element.
					if($settings.showErrorsIn == 'fields' || $settings.showErrorsIn == 'both'){
						$span.insertAfter($('[name="' + this.id + '"]'));
						//$form.find($('[name="' + this.id + '"]')).append($span);
					}
				});
				if($form.find(".allErrors ul li").size() > 0){
					$form.find(".allErrors").css("display", "block");
				}
			};
			
			// Select a message priority
			fn.selectMessage = function(input, type, message){
				if ($(input).data("message") !== undefined) {
					msg = $(input).data("message");
				} else {
					if (message !== undefined) {
						msg = message;
					} else {
						if(libMessages[$settings.lang][type] !== undefined){
							msg = libMessages[$settings.lang][type];						
						}else{
							msg = libMessages[$settings.lang]['default'];
						}
						
					}
				}
				return msg;
			};
			
			// Validate field of the form.
			fn.validateField = function(input) {

				var $el = $(input);

				if ($el.attr("required") !== undefined) {
					fn.addError(fn.validate.required($el), fn.selectMessage($el, 'required'), $el);
				}

				// Validate only if it is filled
				if($el.val().trim().length != 0){
					if ($el[0].nodeName == "INPUT") {
						if ($el.attr('type') == "email") {
							fn.addError(fn.validate.email($el), fn.selectMessage($el, 'email'), $el);
						} else if ($el.attr('type') == "number") {
							fn.addError(fn.validate.number($el), fn.selectMessage($el, 'number'), $el);
						} else if ($el.data('old-type') == "date") {
							fn.addError(fn.validate.date($el), fn.selectMessage($el, 'date'), $el);
						} else if ($el.attr('type') == "datetime") {
							fn.addError(fn.validate.datetime($el), fn.selectMessage($el, 'datetime'), $el);
						} else if ($el.attr('type') == "url") {
							fn.addError(fn.validate.url($el), fn.selectMessage($el, 'url'), $el);
						} else if ($el.attr('type') == "time") {
							fn.addError(fn.validate.time($el), fn.selectMessage($el, 'time'), $el);
						} else if ($el.attr('type') == "tel") {
							fn.addError(fn.validate.tel($el), fn.selectMessage($el, 'tel'), $el);
						}
					}

					if ($el.attr("min") !== undefined) {
						fn.addError(fn.validate.min($el), fn.selectMessage($el, 'min'), $el);
					}

					if ($el.attr("max") !== undefined) {
						fn.addError(fn.validate.max($el), fn.selectMessage($el, 'max'), $el);
					}
					
					if ($el.attr('minlength') !== undefined){
						fn.addError(fn.validate.minLength($el), fn.selectMessage($el, 'minLength'), $el);
					}
					
					if ($el.attr('maxlength') !== undefined){
						fn.addError(fn.validate.maxLength($el), fn.selectMessage($el, 'maxLength'), $el);
					}
					
					if ($el.attr('step') !== undefined){
						fn.addError(fn.validate.range($el), fn.selectMessage($el, 'range'), $el);
					}

					if ($el.data("equal") !== undefined) {
						fn.addError(fn.validate.equal($el), fn.selectMessage($el, 'equal'), $el);
					}
					
					if ($el.attr("pattern") !== undefined) {
						fn.addError(fn.validate.pattern($el), fn.selectMessage($el, 'pattern'), $el);
					}
				}
			};
			
			// Validate form.
			fn.validateGeneric = function() {
				// Initialization variables locals
				var chRequires = [], $el;
				
				// Clean the messages in view of the form.
				fn.removeMessages();
				// Loop in all elements of the form.
				$elements.each(function() {
					// Set nickname to element
					$el = $(this);
					
					// Validate element by element
					fn.validateField($el);
					
					// Verify if exists groups of the checkbox required
					if ($el.data('required-group') !== undefined) {
						chRequires.push($el.data('required-group'));
					}
				});
				// Validate groups required
				chRequires = $.unique(chRequires);
				$(chRequires).each(function(key, value) {
					$check = $elements.filter("[data-required-group='" + value + "']");
					fn.addError(fn.validate.requiredGroup($check, 1), fn.selectMessage($check[0], 'equal'), $check[0]);
				});
				
				// Validate with custom customValidations
				var $objValidation = {};
				$.each($settings.customValidations, function(){
					$objValidation = this;
					$.each($objValidation.vgroup, function(k,v){
						if ($.inArray(v, validationgroup) != -1){
							fn.addError($objValidation.test(), $objValidation.message);	
						}
					});
				});
				delete $objValidation;
				return !fn.isErrors();
			};
			
			// General function to validate fields of the form.
			// The returns of the functions has boolean value:
			fn.validate = {
				// required
				required : function($input) {
					var valor = $input.val().trim();
					
					if ($input.attr("type") == 'checkbox' || $input.attr("type") == 'radio') {
						return $input.is(':checked');
					} else {
						var er = /^[^\b]+$/;
						return er.test(valor);
					}
				},
				// min
				min : function($input){
					var valor = $input.val().trim();
					return !(parseInt(valor) < parseInt($input.attr("min")));
				},
				// max
				max : function($input){
					var valor = $input.val().trim();
					return !(parseInt(valor) > parseInt($input.attr("max")));
				},
				// minLength
				minLength : function($input){
					var valor = $input.val().trim();
					return !(parseInt(valor.length) < parseInt($input.attr("minlength")));
				},
				// maxLength
				maxLength : function($input){
					var valor = $input.val().trim();
					return !(parseInt(valor.length) > parseInt($input.attr("maxlength")));
				},
				// checkboxGroup
				requiredGroup : function($inputs, min) {
					return $inputs.filter(":checked").size() >= min ? true : false;
				},
				// date
				date : function($input) {
					var valor = $input.val().trim();
					var er = /^((0[1-9]|[12]\d)\/(0[1-9]|1[0-2])|30\/(0[13-9]|1[0-2])|31\/(0[13578]|1[02]))\/\d{4}$/;
					return er.test(valor);
				},
				// datetime
				datetime : function($input) {
					var valor = $input.val().trim();
					var er = /^((0[1-9]|[12]\d)\/(0[1-9]|1[0-2])|30\/(0[13-9]|1[0-2])|31\/(0[13578]|1[02]))\/\d{4} (([0-1][0-9]|[0-2][0-3]):[0-5][0-9])$/;
					return er.test(valor);
				},
				// email
				email : function($input) {
					var valor = $input.val().trim();
					var er = /^[\w-]+(\.[\w-]+)*@(([\w-]{2,63}\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])$/;
					return er.test(valor);
				},
				// number
				number : function($input) {
					var valor = $input.val().trim();
					var er = /^\d+$/;
					return er.test(valor);
				},
				// range
				range : function($input){
					var valor = $input.val().trim();
					return (parseInt(valor) % parseInt($input.attr('step')) == 0);
				},
				// tel
				tel : function($input){
					var valor = $input.val().trim().replace(/[^\d+]/gi, "");
					return valor.length, valor.length >= 7 && valor.length <= 12;
				},
				// time
				time : function($input){
					var valor = $input.val().trim();
					var er = /^(([0-1][0-9]|[0-2][0-3]):[0-5][0-9])$/;
					return er.test(valor);
				},
				// url
				url : function($input){
					var valor = $input.val().trim();
					var er = /^((https?|ftp|gopher|telnet|file|notes|ms-help):((\/\/)|(\\\\))+[\w\d:#@%\/;$()~_?\+-=\\\.&]*)$/;
					return er.test(valor);
				},
				// pattern
				pattern : function($input) {
					var valor = $input.val().trim();
					var er = new RegExp($input.attr("pattern"),"gi");
					return er.test(valor);
				},
				// Equal
				equal : function($input){
					var valor = $input.val().trim(),
						valor2 = $form.find("[name='"+$input.data("equal")+"']").val().trim();
					return valor == valor2;
				}
			};
			
			// Remove messages errors and clean view of the form.
			fn.removeMessages = function() {
				$settings.errors = [];
				$form.find(".validateError").remove();
			};
			
			// Standard function for form submission.
			fn.defaultSubmit = function() {
				if (fn.validateGeneric()) {
					$form.submit();
				}
				return false;
			};
			
			// Request Ajax, using JQuery.
			fn.req = function() {
				$.ajax({
					url : $settings.action,
					// contentType: 'application/json',
					dataType : "json",
					type : $settings.method,
					data : $form.serialize(),
					success : function(data, textStatus, jqXHR) {
						$settings.success(data, textStatus, jqXHR);
					},
					statusCode : {
						404 : function() {
							$settings.error404($settings.action);
						},
						400 : function(data, textStatus, jqXHR) {
							$settings.error400(data, textStatus, jqXHR);
						},
						500 : function(data, textStatus, jqXHR) {
							$settings.error500(data, textStatus, jqXHR);
						} 
					}
				});
			};	
			
			// Verify if exists errors in array of the errors in the settings.
			fn.isErrors = function() {
				if ($settings.errors.length == 0) {
					return false;
				} else {
					fn.viewMessages();
					return true;
				}
			};	
			
			// Add error messages from the server.
			fn.addErrorServer = function(name, message) {
				var erro = {
					'id' : name,
					'message' : message
				};
				$settings.errors.push(erro);
			};
			
			// Add error messages from the client
			fn.addError = function(test, message, input) {
				var name;
				
				if(input === undefined){
					name = "Atenção";
				}else{
					name = $(input).attr("name");
				}
				// Sets the object to be inserted into the array configuration
				// errors.
				var erro = {
					'id' : name,
					'message' : message
				};
				
				// If error equals zero, then insert in array of the errors.
				if (test == false) {
					$settings.errors.push(erro);
				}
			};	
			
			// Start Function
			fn.init = function(){
				// Including the CSS file dynamically
				fn.includeFileCss($settings.fileCss);
				// Click event of the submit button
				// If more than one button, all call the same function
				
				// Event of the .submit
				$form.find("input.submit, button.submit").off("click");
				$form.find("input.submit, button.submit").on("click", function() {
					validationgroup = $(this).data("validationgroup") !== undefined ? $(this).data("validationgroup").split(',') : [];
					
					if($(this).data("validationgroup") != undefined){
						
						var str = [];
						$.each($(this).data("validationgroup").split(','), function(k,v){
							str.push(':vgroup('+v+')');
						});
						$elements = $(str.join(','));
					}else{
						$elements = $form.find('input, textarea, select');
					}
					
					return fn.defaultSubmit();
				});
				
				// Event of the custom button
				if ($($settings.buttonSubmit).size() == 1) {
					// $($settings.buttonSubmit).click(fn.defaultSubmit);
				}
				
				// Event of the send form.
				$form.off("submit");
				$form.on("submit", function() {
					fn.req();
					return false;
				});
			};
			// Start
			 fn.init();
			 return this; 
			});
		},
		
		teste: function(){
			console.info("TrueOrFalse" );
			return this;
		},
		
		addCustomValidate : function(call, message, vgroup){
			// Shortcurt for data settings
			var $settings = $(this).data('settings');
			if ($settings !== undefined){
				if(typeof(call) != 'function'){
					$.error("addCustomValidation: não recebeu uma function como parametro.");
				}else if(typeof(message) != 'string'){
					$.error("addCustomValidation: não recebeu uma message string como parametro.");
				}
				var obj = {
					'test' : call,
					'message' : message,
					'vgroup' : vgroup 
				};
				$settings.customValidations.push(obj);
			}else{
				$.error("Validate não foi instanciado.");
			}
			return this;
		},
		addMask : function(input, mascara){
			var inputsNames = [];
			$.each(this.find("input"), function(){
				inputsNames.push($(this).attr("name"));
			});
			if(typeof(input) == 'object'){
				$.each(input, function(k, v){
					if($.inArray(k, inputsNames ) != -1){
						$('[name="'+k+'"]').mask(v);						
					}
				});
			}else if (typeof(input) == 'string'){
				if($.inArray(input, inputsNames ) != -1){
					$('[name="'+input+'"]').mask(mascara);						
				}
			}
			return this;
		}
	};
})(jQuery);