var toolOn = "toolbar=yes, menubar=yes, location=yes,";
var toolOff = "toolbar=no, menubar=no, location=no,";
var left800 = (screen.width-600)/2;
var top800 = (screen.height-(800 + 110))/2;
var left640 = (screen.width-480)/2;
var top640 = (screen.height-(640 + 110))/2;
var screenPos800 = " left="+left800+", top="+top800;
var screenPos640 = " left="+left640+", top="+top640;
var width800 = " scrollbars=yes, status=no, resizable=yes, width=800, height=600,";
var width640 = " scrollbars=yes, status=no, resizable=yes, width=640, height=480,";
function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}
function setOpen() {	
	var myEls = getElementsByClass("popWin", document, "a");
	for (i=0; i < myEls.length; i++) {
		winArr = myEls[i];
		var addText = "<span class='access'> - opens new window</span>"
		var orgnText = winArr.innerHTML;
		myEls[i].innerHTML = orgnText+addText;
		winArr.onclick = function()	{
			var windowSize = this.attributes.getNamedItem("rel").value;
			var destination = this.attributes.getNamedItem("href").value;
			switch (windowSize) {	
				case "width800":
					window.open(destination, 'NewWindow', toolOn+width800+screenPos800);
				break;
				case "width640":
					window.open(destination, 'NewWindow', toolOn+width640+screenPos640);
				break;
				case "width800_ntb":
					window.open(destination, 'NewWindow', toolOff+width800+screenPos800);
				break;
				case "width640_ntb":
					window.open(destination, 'NewWindow', toolOff+width640+screenPos640);
				break;
			}
			return false;
		}
	}	
}
plusEvent(window, 'load', setOpen);
function maxlength(e) {
	if (e.getAttribute && e.value.length > 500) {
		e.value = e.value.substring(0,500);
	}
	var elm = $(e).next().children('span');
	$(elm).text(500 - e.value.length);
	if (parseInt($(elm).text()) < 0) {
		$(elm).text('0');
	}
}
function COTAtoggle(e) {
	$('#COTA').toggle();
	if ($('#COTA').css('display') == 'block') {
		$(e).addClass('max');
	}
	else {
		$(e).removeAttr('class');
	}	
}
$(document).ready(function() {
	var dg_lang = $('html').attr('lang');
	if ($('.cota').length > 0) {
		if (dg_lang === 'en') {
			$('.cota .count').html('<span>500</span> characters left');
		}
		else {
			$('.cota .count').html('<span>500</span> nod ar &ocirc;l');
		}
		$('.cota form').submit( function() {
			radio = $("input[type='radio']:checked",this).val();
			if (radio) {
				return true;
			}
			else {
				if ($('.submitcont .error',this).length === 0) {
					$('legend',this).prepend('<span>'+COTAmsg()+' - </span>');
					$('.submitcont',this).append('<div class="error">'+COTAmsg()+'</div>');
				}
				return false;
			}
		});
		$('.question ul').hide();
		$('.question h4').wrapInner('<a href="" onclick="COTAtoggle(this);return false;"></a>');
	}
	if ($('.poll').length > 0) {
		$('.poll form').submit( function() {
			radio = $("input[type='radio']:checked",this).val();
			if (radio) {
				return true;
			}
			else {
				if (error_msg = $('.error',this).length === 0) {
					$('legend',this).prepend('<span>'+Pollmsg()+' - </span>');
					$('fieldset',this).after('<div class="error">'+Pollmsg()+'</div>');
				}
				return false;					
			}
		});
	}
});