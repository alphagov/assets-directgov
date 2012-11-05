function setActiveStyleSheet(title) {
	var i, a, main;
	for ( i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
			if(a.getAttribute("title") == title) a.disabled = false;
		}
	}
	var sizeLoc = document.getElementById("Resize");
	if (sizeLoc == null) {
		return false;
	}
	else {
		var anchors = new Array();
		anchors = sizeLoc.getElementsByTagName("a");	
		for (var i=0; i < anchors.length; i++) {
			var links = anchors[i];
			links.className = '';
		}
		switch (title) {
			case 'Standard':
				anchors[2].className="active";
			break;
			case 'Larger':
				anchors[1].className="active";
			break;
			case 'Largest':
				anchors[0].className="active";
			break;
			case 'null':
				anchors[2].className="active";
			break;
			default:
				anchors[2].className="active";
		}
	}
}
function getActiveStyleSheet() {
	var i, a;
	for (i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
	}
	return null;
}
function getPreferredStyleSheet() {
	var i, a;
	for (i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel").indexOf("style") != -1
			&& a.getAttribute("rel").indexOf("alt") == -1
			&& a.getAttribute("title")
		) 
		return a.getAttribute("title");
	}
	return null;
}
function createCookie(name,value) {
	document.cookie = name+"="+value+"; path=/";
}
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function startUp() {
	var cookie = readCookie("style");
	var title = cookie ? cookie : getPreferredStyleSheet();
	setActiveStyleSheet(title);
}
function shutDown() {
	var title = getActiveStyleSheet();
	createCookie("style", title);
}
plusEvent(window, 'load', startUp);
plusEvent(window, 'load', init);
plusEvent(window, 'unload', shutDown);
var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
function TakesCookies() {
	var GetsCookie = (navigator.cookieEnabled);
	if(typeof navigator.cookieEnabled=="undefined" && !cookieEnabled) {
		document.cookie = "SampleCookie";
		GetsCookie = (document.cookie.indexOf("SampleCookie")!=-1)
	}
	return GetsCookie;
}
function init() {
	var global_controls = document.getElementById("dgr08");
	if(TakesCookies() && global_controls){
		var html = document.getElementsByTagName("html");
		html = html[0];
		var language = html.getAttribute("lang");
		var loc = document.getElementById("GlobControl");
		if (!(loc)) {
			$('#dgr08').prepend('<ul id="GlobControl"></ul>');
			var loc = document.getElementById("GlobControl");
		}
		switch (language) {
			case 'cy':						
				var aaa = '';
				aaa += "<li id=\"Resize\"><div>";
				aaa += "<ul>";
				aaa += "	<li class='large'><a tabindex=\"97\" href=\"#largest\" onclick=\"setActiveStyleSheet('Largest'); return false; \"><span><span class='access'>Chyfnewid destun faint at 'n fwyaf</span>A</span></a></li>";
				aaa += "	<li class='medium'><a tabindex=\"96\" href=\"#larger\" onclick=\"setActiveStyleSheet('Larger'); return false;\"><span><span class='access'>Chyfnewid destun faint at 'n fwy</span>A</span></a></li>";
				aaa += "	<li><a tabindex=\"95\" href=\"#standard\" onclick=\"setActiveStyleSheet('Standard'); return false;\"><span><span class='access'>Chyfnewid destun faint at lluman</span>A</span></a></li>";
				aaa += "</ul></div></li>";			
			break;
			case 'en':
				var aaa = '';			
				aaa += "<li id=\"Resize\"><div>";
				aaa += "<ul>";
				aaa += "	<li class='large'><a tabindex=\"97\" href=\"#largest\" onclick=\"setActiveStyleSheet('Largest'); return false; \"><span><span class='access'>Resize text to largest </span>A</span></a></li>";
				aaa += "	<li class='medium'><a tabindex=\"96\" href=\"#larger\" onclick=\"setActiveStyleSheet('Larger'); return false;\"><span><span class='access'>Resize text to larger </span>A</span></a></li>";
				aaa += "	<li><a tabindex=\"95\" href=\"#standard\" onclick=\"setActiveStyleSheet('Standard'); return false;\"><span><span class='access'>Resize text to standard </span>A</span></a></li>";
				aaa += "</ul></div></li>";
			break;
		}
		$(loc).prepend(aaa);
		var sizeLoc = document.getElementById("Resize");
		var anchors = new Array();
		anchors = sizeLoc.getElementsByTagName("a");	
		for (var i=0; i < anchors.length; i++) {
			var links = anchors[i];
			links.className = '';
		}
		switch (title) {
			case 'Standard':
				anchors[2].className="active";
			break;
			case 'Larger':
				anchors[1].className="active";
			break;
			case 'Largest':
				anchors[0].className="active";
			break;
			default:
				anchors[2].className="active";
		}
	}	
}