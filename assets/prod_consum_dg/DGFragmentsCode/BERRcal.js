function createCookie(name,value) {
	if (window.opera) {value = value.replace(/"/g,'');} // Opera only
	document.cookie = name+'='+value+'; path=/';
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function formError(initial, final) {
	var newLoc = YAHOO.util.Dom.getFirstChild('Error')
	YAHOO.util.Dom.addClass('Error', 'errorBox');
	var errorEle = document.createElement('p');
  	errorEle.setAttribute('class', 'error');
  	errorEle.setAttribute('id', 'CalError');
  	errorEle.innerHTML = 'Please choose a date between '+initial.toLocaleDateString()+' and '+final.toLocaleDateString()+'.';
	YAHOO.util.Dom.insertBefore(errorEle, newLoc);
}
		
function loadCal() {
	function calCal(startDay, startMonth, startYear) {
		if (BERRcfg.IE) {calCalLoader.show();}
		var location = document.getElementById('CalError');
		if (location != null) {	
			YAHOO.util.Dom.removeClass('Error', 'errorBox');
			location.parentNode.removeChild(location);
		}
		if (startDay != 'select') {
			var date = new Date();
			date.setFullYear(startYear, startMonth, startDay);
			var displayMonth = date.getMonth() + 1; 
			var displayYear = date.getFullYear(); 
			var displayDate = date.getDate();
			var dateBegin = new Date();
			var dateEnd = new Date();
			if (BERRcfg.calendarType == 'maternity' || BERRcfg.calendarType == 'maternityAdopt') {
				dateBegin.setFullYear(dates[14], dates[13] - 1, dates[12]);
				dateEnd.setFullYear(dates[2], dates[1] - 1, dates[0]);
			}
			switch (BERRcfg.calendarType) {
				case 'paternity':
					switch (dates[13]) {
							case 0:
							var patMonth = 0; 
						break;
							default:
							var patMonth = dates[13] - 1; 	
					}
					dateEnd.setFullYear(dates[14], patMonth, dates[12]);	
					dateEnd.setDate(dateEnd.getDate() + 61);
					dateBegin.setFullYear(dates[11], dates[10] - 1, 1);
				break;
				case 'paternityAdopt':
					switch (dates[13]) {
							case 0:
							var adoptMonth = 0; 
						break;
							default:
							var adoptMonth = dates[13] - 1; 	
					}
					dateEnd.setFullYear(dates[14], adoptMonth, dates[12]);
					dateEnd.setDate(dateEnd.getDate() + 182);
					dateBegin.setFullYear(dates[11], dates[10] - 1, 1);
				break;
			}
					
			var DateMath = YAHOO.widget.DateMath;
			var valid = DateMath.between(date, dateBegin , dateEnd);
			if (!(valid)) {	
				formError(dateBegin, dateEnd);
				calCalLoader.hide();
				return false;
			}
		}
		else {
			var arrDates = this.getSelectedDates(); 
			var date = arrDates[0];
			var displayMonth = date.getMonth() + 1; 
			var displayYear = date.getFullYear(); 
			var displayDate = date.getDate();
		}
		setTimeout(function() {
			var period = BERRcfg.period;
			var newMaternityEndDate = new Date();			
			newMaternityEndDate.setFullYear(displayYear, date.getMonth(), displayDate);
			newMaternityEndDate.setDate(newMaternityEndDate.getDate()+period);	
			var newDisplayMonth = newMaternityEndDate.getMonth() + 1; 
			var newDisplayYear = newMaternityEndDate.getFullYear(); 
			var newDisplayDate = newMaternityEndDate.getDate(); 				
			var newAddMaternityStartDate = new Date();
			newAddMaternityStartDate.setFullYear(newDisplayYear, newMaternityEndDate.getMonth(), newDisplayDate);
			newAddMaternityStartDate.setDate(newAddMaternityStartDate.getDate() + 1);	
			var addDisplayMonth = newAddMaternityStartDate.getMonth() + 1; 
			var addDisplayYear = newAddMaternityStartDate.getFullYear(); 
			var addDisplayDate = newAddMaternityStartDate.getDate();
			var newAddMaternityEndDate = new Date();
			newAddMaternityEndDate.setFullYear(newDisplayYear, newMaternityEndDate.getMonth(), newDisplayDate);
			newAddMaternityEndDate.setDate(newAddMaternityEndDate.getDate()+period);	
			var endDisplayMonth = newAddMaternityEndDate.getMonth() + 1; 
			var endDisplayYear = newAddMaternityEndDate.getFullYear(); 
			var endDisplayDate = newAddMaternityEndDate.getDate();
			writeMaternityEndDate = new Date();
			writeMaternityEndDate.setFullYear(newDisplayYear, newMaternityEndDate.getMonth(), newDisplayDate);
			setTimeout(function() {
				clearStyle('RangeStyle');
				addStyle(calMonthRange(displayDate, displayMonth, displayYear, newDisplayDate, newDisplayMonth, newDisplayYear, '#ffd700'), 'RangeStyle'); // Maternity Range
				if (BERRcfg.calendarType == 'maternity' || BERRcfg.calendarType == 'maternityAdopt') {
					addStyle(calMonthRange(addDisplayDate, addDisplayMonth, addDisplayYear, endDisplayDate, endDisplayMonth, endDisplayYear, '#00ff00'), 'RangeStyle');// Additional Leave Range
				}
				if (BERRcfg.calendarType == 'paternity' || BERRcfg.calendarType == 'paternityAdopt') {
					addStyle(' .y'+displayYear+' .m'+displayMonth+' .d'+displayDate+' {background:#ff00ff!important;}', 'RangeStyle');
				}
				calCalLoader.hide();
			}, 0);
			if (BERRcfg.calendarType == 'maternity' || BERRcfg.calendarType == 'maternityAdopt') {
				var ordRange = date.toLocaleDateString()+' to '+writeMaternityEndDate.toLocaleDateString();
				var addRange = newAddMaternityStartDate.toLocaleDateString()+' to '+newAddMaternityEndDate.toLocaleDateString();
				document.getElementById("OrdMat").innerHTML = ordRange;
				document.getElementById("AddMat").innerHTML = addRange;
			}
			if (BERRcfg.calendarType == 'paternity' || BERRcfg.calendarType == 'paternityAdopt') {
				var ordRange = date.toLocaleDateString();
				newAddMaternityStartDate.setDate(newAddMaternityStartDate.getDate() - 1);
				var addRange = newAddMaternityStartDate.toLocaleDateString();
				document.getElementById("OrdMat").innerHTML = ordRange;
				document.getElementById("AddMat").innerHTML = addRange;				
			}

			var newMaternityStartDate = displayDate+'/'+displayMonth+'/'+displayYear;
			var revMaternityEndDate = newDisplayDate+'/'+newDisplayMonth+'/'+newDisplayYear;
			MaternityRange = newMaternityStartDate+'-'+revMaternityEndDate;
			var addMaternityStartDate = addDisplayDate+'/'+addDisplayMonth+'/'+addDisplayYear
			var addMaternityEndDate = endDisplayDate+'/'+endDisplayMonth+'/'+endDisplayYear;
			AdditionalLeaveRange = addMaternityStartDate+'-'+addMaternityEndDate;
			
			createCookie("newMaternityStartDate", newMaternityStartDate);
			createCookie("revMaternityEndDate", revMaternityEndDate);
			createCookie("ordinaryLeave", MaternityRange);
			createCookie("additionalLeave", AdditionalLeaveRange);
			createCookie("addMaternityEndDate", addMaternityEndDate);
		}, 0);

		if (BERRcfg.calendarType == 'maternity' || BERRcfg.calendarType == 'maternityAdopt') {
			switch (BERRcfg.calendarType) {
				case "maternity":
				var payPeriod = 41; // 6 weeks
			break;
				case "maternityAdopt":
				var payPeriod = 272; // 39 weeks
			break;
			}
			var startPayPeriod = new Date();
			startPayPeriod.setFullYear(displayYear, date.getMonth(), displayDate);
			var endPayPeriod = new Date();
			endPayPeriod.setFullYear(displayYear, date.getMonth(), displayDate);
			endPayPeriod.setDate(endPayPeriod.getDate() + payPeriod); 
			var payRange = startPayPeriod.toLocaleDateString()+' to '+endPayPeriod.toLocaleDateString();
			document.getElementById("FirstPay").innerHTML = payRange;
		}
		
		if (BERRcfg.calendarType == 'maternity') {
			var startAddPay = new Date();
			startAddPay.setFullYear(displayYear, date.getMonth(), displayDate);
			startAddPay.setDate(startAddPay.getDate() + 42);	
			var endAddPay = new Date();
			endAddPay.setFullYear(displayYear, date.getMonth(), displayDate);
			endAddPay.setDate(endAddPay.getDate() + 42);
			endAddPay.setDate(endAddPay.getDate() + 230);			
			var addPayRange = startAddPay.toLocaleDateString()+' to '+endAddPay.toLocaleDateString();
			document.getElementById("SecondPay").innerHTML = addPayRange;
		}
	}
	
	function addStyle(style, id) {
		var ss1 = document.getElementById(id);
		if (ss1.styleSheet) { // IE only
			var def = ss1.styleSheet.cssText;
			def+=style;
			ss1.styleSheet.cssText = def;
		} else {
			var def = style;			
			var tt1 = document.createTextNode(def);
			ss1.appendChild(tt1);
		}
	}
	
	function clearStyle(id) {
		var ss1 = document.getElementById(id);													  
		if (ss1.styleSheet) {
			ss1.styleSheet.cssText = '';
		}
		else {
			if (!ss1) return;
			for (var i= ss1.childNodes.length -1; i > 0; i--) {
				ss1.removeChild(ss1.childNodes[i]);			
			}
		}
	}
	
	// Genesis
	function calMonthRange(startday, startmonth, startyear, endday, endmonth, endyear, color) {
		var months = '';
		var days = '';
		if (startyear === endyear) {
			var i_startmonth = parseInt(startmonth)+1;
			for (var i = i_startmonth; i < endmonth; i++) { 
				months+='.y'+startyear+' .m'+i+' td'+', ';
			}
		}
		else {
			var i_startmonth = parseInt(startmonth)+1;
			for (var i = i_startmonth; i < 13; i++) { 
				months+='.y'+startyear+' .m'+i+' td'+', ';
			}
			var i_endmonth = parseInt(endmonth)-1;
			for (var i = i_endmonth; i > 0; i--) { 
				months+='.y'+endyear+' .m'+i+' td'+', ';
			}			
		}
		if (startmonth === endmonth) {
			var i_endday = parseInt(endday)+1;
			for (var i = startday; i < i_endday; i++) { 
				if (i != endday) {
					months+='.y'+startyear+' .m'+startmonth+' .d'+i+', ';
				}
				else {
					months+='.y'+startyear+' .m'+startmonth+' .d'+i+' '; // No comma
				}				
			}
		}
		else {
			for (var i = startday; i < 32; i++) { 
				days+='.y'+startyear+' .m'+startmonth+' .d'+i+', ';
			}
			for (var i = endday; i > 0; i--) { 
				if (i != 1) {
					days+='.y'+endyear+' .m'+endmonth+' .d'+i+', ';
				}
				else {
					days+='.y'+endyear+' .m'+endmonth+' .d'+i+' '; // No comma
				}
			}			
		}
		days+=' {background:'+color+';}';
		var range = months+days;
		return range;
	}
	
	BERRcfg.IE = false;
	BERRcfg.timeOut = 0;
	if (YAHOO.env.ua.ie > 0){
		BERRcfg.IE = true;
		if (YAHOO.env.ua.ie > 6) {
			BERRcfg.timeOut = 300;
		}
		else {
			BERRcfg.timeOut = 3000;
		}
	}
	
	YAHOO.util.Event.on("formButton", "click", function(e) {
		YAHOO.util.Event.stopEvent(e);                  
		var day = document.inlineForm.Day.value;
		var month = document.inlineForm.Month.value;
		var year = document.inlineForm.Year.value;
		calCal(day, month, year);
	});  	
	
	if (BERRcfg.cookieOff) {
		switch (BERRcfg.calendarType) {
			case 'maternity':
				var cookieString = 'pinkday="+6+"&pinkmonth="+8+"&pinkyear="+2008+"&bluestartday="+3+"&bluestartmonth="+8+"&bluestartyear="+2008+"&blueendday="+9+"&blueendmonth="+8+"&blueendyear="+2008+"&redday="+26+"&redmonth="+4+"&redyear="+2008+"&cyantday="+18+"&cyanmonth="+5+"&cyanyear="+2008+"&yellowleaveendday="+15+"&yellowleaveendmonth="+11+"&yellowleaveendyear="+2008+"&greenstartday="+16+"&greenstartmonth="+11+"&greenstartyear="+2008+"&greenendday="+16+"&greenendmonth="+5+"&greenendyear="+2009+"&yellowstartday="+19+"&yellowstartmonth="+5+"&yellowstartyear="+2008';
			break;
			case 'maternityAdopt':
				var cookieString = 'pinkday="+6+"&pinkmonth="+8+"&pinkyear="+2008+"&bluestartday="+null+"&bluestartmonth="+null+"&bluestartyear="+null+"&blueendday="+null+"&blueendmonth="+null+"&blueendyear="+null+"&redday="+13+"&redmonth="+5+"&redyear="+2008+"&cyantday="+23+"&cyanmonth="+7+"&cyanyear="+2008+"&yellowleaveendday="+3+"&yellowleaveendmonth="+2+"&yellowleaveendyear="+2009+"&greenstartday="+4+"&greenstartmonth="+2+"&greenstartyear="+2009+"&greenendday="+4+"&greenendmonth="+8+"&greenendyear="+2009+"&yellowstartday="+7+"&yellowstartmonth="+8+"&yellowstartyear="+2008';
			break;
			case 'paternity':
				var cookieString = 'pinkday="+null+"&pinkmonth="+null+"&pinkyear="+null+"&bluestartday="+3+"&bluestartmonth="+8+"&bluestartyear="+2008+"&blueendday="+9+"&blueendmonth="+8+"&blueendyear="+2008+"&redday="+26+"&redmonth="+4+"&redyear="+2008+"&cyantday="+6+"&cyanmonth="+8+"&cyanyear="+2008+"&yellowleaveendday="+30+"&yellowleaveendmonth="+9+"&yellowleaveendyear="+2008+"&greenstartday="+null+"&greenstartmonth="+null+"&greenstartyear="+null+"&greenendday="+null+"&greenendmonth="+null+"&greenendyear="+null+"&yellowstartday="+10+"&yellowstartmonth="+8+"&yellowstartyear="+2008';
			break;
			case 'paternityAdopt':
				var cookieString = 'pinkday="+null+"&pinkmonth="+null+"&pinkyear="+null+"&bluestartday="+null+"&bluestartmonth="+null+"&bluestartyear="+null+"&blueendday="+null+"&blueendmonth="+null+"&blueendyear="+null+"&redday="+16+"&redmonth="+5+"&redyear="+2008+"&cyantday="+6+"&cyanmonth="+8+"&cyanyear="+2008+"&yellowleaveendday="+30+"&yellowleaveendmonth="+9+"&yellowleaveendyear="+2008+"&greenstartday="+null+"&greenstartmonth="+null+"&greenstartyear="+null+"&greenendday="+null+"&greenendmonth="+null+"&greenendyear="+null+"&yellowstartday="+7+"&yellowstartmonth="+8+"&yellowstartyear="+2008';
			break;
		}
		createCookie("url", cookieString);
	}
	var x = readCookie("url");
	var dates = x.split("&");
	for (var i=0; i < dates.length; i++) {
		dates[i] = dates[i].replace(/[^0-9]/g,"");
	}
	
	var DueDate = dates[0]+'/'+dates[1]+'/'+dates[2];	
	var EarlyLeaveDate = dates[12]+'/'+dates[13]+'/'+dates[14];
	var earDate = '1'+'/'+dates[10]+'/'+dates[11];
	var YahooBase = dates[10]+'/'+dates[11];		
	var DirectgovCalendar = new YAHOO.widget.CalendarGroup("cal1","cal1Container");
	DirectgovCalendar.cfg.setProperty("MDY_DAY_POSITION", 1); 
	DirectgovCalendar.cfg.setProperty("MDY_MONTH_POSITION", 2); 
	DirectgovCalendar.cfg.setProperty("MDY_YEAR_POSITION", 3); 	 
	DirectgovCalendar.cfg.setProperty("MD_DAY_POSITION", 1); 
	DirectgovCalendar.cfg.setProperty("MD_MONTH_POSITION", 2); 
	DirectgovCalendar.cfg.setProperty("pagedate", YahooBase, false);
	DirectgovCalendar.cfg.setProperty("pages", BERRcfg.numberOfCals, false);

	switch (BERRcfg.calendarType) {
		case 'paternity':
			switch (dates[13]) {
					case 0:
					var patMonth = 0; 
				break;
					default:
					var patMonth = dates[13] - 1; 	
			}
			var maxPat = new Date();
			maxPat.setFullYear(dates[14], patMonth, dates[12]);	
			maxPat.setDate(maxPat.getDate() + 61);
			DirectgovCalendar.cfg.setProperty("minDate", earDate, false);
			DirectgovCalendar.cfg.setProperty("maxdate", maxPat, false);
		break;
		case 'paternityAdopt':
			switch (dates[13]) {
					case 0:
					var adoptMonth = 0; 
				break;
					default:
					var adoptMonth = dates[13] - 1; 	
			}
			var maxAdopt = new Date();
			maxAdopt.setFullYear(dates[14], adoptMonth, dates[12]);	
			maxAdopt.setDate(maxAdopt.getDate() + 182);
			DirectgovCalendar.cfg.setProperty("minDate", earDate, false);
			DirectgovCalendar.cfg.setProperty("maxdate", maxAdopt, false);
		break;
	}

	if (BERRcfg.calendarType == 'maternityAdopt' || BERRcfg.calendarType == 'maternity') {
		DirectgovCalendar.cfg.setProperty("minDate", EarlyLeaveDate, false);
		DirectgovCalendar.cfg.setProperty("maxdate", DueDate, false);
	}
	
	// Opera only 
	setTimeout(function() {
		if (window.opera) {DirectgovCalendar.renderEvent.unsubscribe(DirectgovCalendar._fixWidth, DirectgovCalendar, true);}
		DirectgovCalendar.render();	
		DirectgovCalendar.selectEvent.subscribe(calCal, DirectgovCalendar, true);
	}, BERRcfg.timeOut);
	
	YAHOO.util.Event.onAvailable('cal1Container', function() {
		setTimeout(function() {addStyle(' .y'+dates[11]+' .m'+dates[10]+' .d'+dates[9]+' {background:#ff0000;}', 'Style')}, 0); // Red Date
		if (BERRcfg.calendarType == 'maternity' || BERRcfg.calendarType == 'paternity') {
			setTimeout(function() {addStyle(calMonthRange(dates[3], dates[4], dates[5], dates[6], dates[7], dates[8], '#a8a9ff'), 'Style')}, 0); // Blue Range
		}
		setTimeout(function() {addStyle(calMonthRange(dates[24], dates[25], dates[26], dates[15], dates[16], dates[17], '#ffd700'), 'RangeStyle')}, 0); // Yellow Range
		if (BERRcfg.calendarType == 'maternity' || BERRcfg.calendarType == 'maternityAdopt') {
			setTimeout(function() {addStyle(calMonthRange(dates[18], dates[19], dates[20], dates[21], dates[22], dates[23], '#00ff00'), 'RangeStyle')}, 0); // Green Range
		}
		setTimeout(function() {addStyle(' .y'+dates[14]+' .m'+dates[13]+' .d'+dates[12]+' {background:#00ffff;}', 'Style')}, 0); // Cyan Date
		if (BERRcfg.calendarType == 'maternity' || BERRcfg.calendarType == 'maternityAdopt') {
			setTimeout(function() {addStyle(' .y'+dates[2]+' .m'+dates[1]+' .d'+dates[0]+' {background:#ff00ff;}', 'Style')}, 0); // Pink Date
		}
	});
	
	if (BERRcfg.IE) {
		var calCalLoader;
		calCalLoader = new YAHOO.widget.Overlay ("loading", {
			fixedcenter : true, 
			visible: false, 
			width: "300px",
			zIndex: 15
		}); 
		calCalLoader.render(document.body);
	}
}