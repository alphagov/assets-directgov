/*******************************************************************
Script written for Survey Popup functionality for DG website.
This script is included with SurveyPopup.html page.
SurveyPopup.html is launched when survey business rules fulfills.

Author: Sunit Seth

********************************************************************/

/***********Configurations variables are defined here***************/

//Change Survey Incidence Rate here
var surveyIncidenceRate = 20;

//This is to hide the invitation window for 5 minutes. Please change the value with your own timeout. The value is in minutes.
var hideInvitationWindowTime = 5;

//dgSurveyCookie will be expired after 30 days. Please change the value to expire cookie. The value is in days.
var cookieToExpireInDays = 30;

/*Set the survey URL here without parameters here.
The hidden parameters are defined in SurveyPopup.html checkParticipation function participateFormValue == YES if condition.
*/
var surveyUrl = "https://survey.efmfeedback.com/se.ashx?s=705E3F1F40A8F8B6";

/*Please put the complete URL of SurveyPopup.html.
The SurveyPopup.html should reside in same domain as of DG Consumption domain (such as anywhere in direct.gov.uk for prod)
*/
var surveyPopupHTMLUrl = "http://www.direct.gov.uk/prod_consum_dg/DGFragmentsCode/SurveyPopup.htm";

//Transactional Links to be defined here. Please do not delete Directgov website, just change the text for links not mentioned below.
var arrTransactionalLinks = ["Directgov website",
	"http://www.taxdisc.direct.gov.uk/EvlPortalApp/", "DVLA Tax Disc tool",	
	"http://www.direct.gov.uk/studentfinancecalculator", "Student Loans Calculator", 
	"https://driverpracticaltest.direct.gov.uk/selectcategory.aspx", "DVLA Practical Driving test application tool", 
	"http://theorytest.direct.gov.uk/dsa/book", "DVLA Theory Driving test application tool", 
	"https://www.dwpe-services.direct.gov.uk/en/jobseekersallowanceclaim", "Jobseekers Allowance tool", 
	"http://dvlaregistrations.direct.gov.uk", "DVLA Online Registration tool", 
	"http://directgov.transportdirect.info/Web2", "Journey Planner", 
	"https://passports.ips.gov.uk/epa1r1a/index.aspx", "Online Passport Application tool", 
	"https://forms.direct.gov.uk/forms/form/4/en/request_a_passport_application_form_to_be_sent_to_you_in_the_post", "Online Request Passport Application", 
	"http://jobseekers.direct.gov.uk", "Online Jobs and Skills tool"
	];
	
/*Participate Form hidden settings global array length defined here.
This is the length of participateFormSettings array which stores hidden parameters passed to the survey URL when survey is launched.
Change this value if hidden paramters for survey increases or decreases than current value 2.
Change the parameters to participateFormSettings inside $("a").click(function(event) in this js file.
Also, make the change in survey parameters defined in SurveyPopup.html checkParticipation function participateFormValue == YES if condition.
*/
var participateFormLength = 2;

//Popup width and height
var popupWidth, popupHeight;
//If browser is IE
if (navigator.appName == 'Microsoft Internet Explorer') {
	popupWidth = 498;
	popupHeight = 476;
//If any other browser than IE
} else { 
	popupWidth = 540;
	popupHeight = 430;
}

//Survey Popup specifications such as width, height, hide menu, status bars etc.
var surveyPopupSpecs = "directories=no,height=" + popupHeight + "px,location=no,menubar=no,resizable=yes,scrollbars=no,status=no,titlebar=no,toolbar=no,width=" + popupWidth + "px";

/***********Configurations variables defined ends here**************/

/*****************Global variables are defined here*****************/

//Timer variable to schedule time to relaunch the invitation window
var timer, timer1;

//Participate form hidden settings global array defined here
var participateFormSettings = new Array(participateFormLength);

//Generate a random number between 1 and the incidence rate inclusive.
var randomNum = Math.floor(Math.random()*surveyIncidenceRate)+1;

//Variable to store dgSurveysDone cookie value
var dgSurveysDone;

//dgSurveysDone array variable defined globally 
var dgSurveysDoneArr;

//Variable to store dgSurveyCookie value
var dgSurveyCookieStr;

//By default no timeout is set for survey popup invitation window launch
var surveyTimeout = "never";

//dgSurveyCookie array variable defined globally
var dgSurveyCookieArr;

//This is used to save if cookies are enabled or not
var cookieEnabled;

/*****************Global variables ends here*****************/

//Check if cookies are enabled or not
setCookie('testcookie','testcookiedata',1);
cookieEnabled=(document.cookie.indexOf("testcookie")!=-1)? true : false;

//If cookies are enabled then only survey functionality will work else it will not work
if (cookieEnabled == true) {
	//Delete the testcookie
	setCookie('testcookie','testcookiedata',-1);

	//Get the value of Survey's "done" cookie to determine whether it has been completed.
	dgSurveysDone = getCookie ('dgSurveysDone');

	if (dgSurveysDone != null){
		dgSurveysDoneArr = dgSurveysDone.split(",");
	} else {
		dgSurveysDoneArr = ["no survey added"];
	}

	//Read the dgSurveyCookie
	dgSurveyCookieStr = getCookie('dgSurveyCookie');
		
	if (dgSurveyCookieStr != null){	
		dgSurveyCookieArr = dgSurveyCookieStr.split(",");
		surveyTimeout = dgSurveyCookieArr[0];
		//Initiate the timer to check the response from SurveyPopup.html
		timer1 = setTimeout("checkCookieRegInt()",100);
	} else {
		/*Initiate the timer to check the if SurveyPopup.html has been launched or not. If launched then get the value of dgSurveyCookie.
		Time is just 30 sec less than hideInvitationWindowTime to improve performance of page and avoid any unnecessary infinite loops.*/
		timer1 = setTimeout("checkCookieRegInt()",(hideInvitationWindowTime - 0.5) * 60 * 1000);
	}
	
	/*If random number generated is 1 and surveyTimeout option not selected as 5 MINS.
	If popup is already opened the onclick event is not associated to the "a" tag. 
	This is done to avoid any data corruption for any popup that is already opened.
	The code below is called if no survey has previously been completed*/
	if(randomNum == 1 && surveyTimeout != '5 MINS'){
		//If survey is not declined or launched earlier
		if (jQuery.inArray(surveyUrl,dgSurveysDoneArr) == -1) {			
			$(window).ready(function() {
				//Inititate the on click event
				$("a").click(function(event) {
					//Read the cookie value to know the response of SurveyPopup.html
					dgSurveyCookieStr = getCookie('dgSurveyCookie');
					if (dgSurveyCookieStr != null){
						var dgSurveyCookieArr = dgSurveyCookieStr.split(",");
						surveyTimeout = dgSurveyCookieArr[0];					
					}
					//If survey popup has sent a response then do not launch the survey popup again
					if (surveyTimeout != 'FINISHED' && surveyTimeout != '5 MINS') {
						var urlText = window.location.href;
						var hrefText = $(this).attr("href");
						var trans = getTransactionalLinkVal(hrefText);	

						//Form hidden settings to set here
						participateFormSettings[0] = trans;
						participateFormSettings[1] = encodeURIComponent(hrefText);
	
						var targetALink = $(this).attr("target");
					
						if (targetALink == "_blank" && hrefText.indexOf("mailto:") == -1) {
							//If the URL is complete then open the URL directly in new window
							if (hrefText.indexOf("http") > -1){
								window.open(hrefText);
							//Else form the URL considering the relative URL href text given in a link
							} else {
								var windowLocHref = window.location.href;
								var httpIndex = windowLocHref.indexOf("http://");
								var httpsIndex = windowLocHref.indexOf("https://");
								if (httpIndex > -1) {
									var hostNameStr = windowLocHref.substring(7);
									hostNameStr = hostNameStr.substring(0, hostNameStr.indexOf("/")+1);									
									window.open ("http://" + hostNameStr + hrefText);
								}
								else if (httpsIndex > -1) {
									var hostNameStr = windowLocHref.substring(8);
									hostNameStr = hostNameStr.substring(0, hostNameStr.indexOf("/")+1);		
									window.open ("https://" + hostNameStr + hrefText);
								}
							}
							//Launch the popup after opening the a href link
							launchPopupWin();
							//Return false so that a link does not open by itself
							return false;
						//Else if target is not blank open the popup and a link will open by itself
						} else {
							//Launch the popup after opening the a href link
							launchPopupWin();
						}						
					}
				}); 	
			}); 			 
		}	
	}
}

/***************Custom Functions are defined here*******************/

//General function to set cookie. Please do not change.
function setCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";	
	document.cookie = name+"="+value+expires+"; path=/";
}

//General function to get cookie. Please do not change.
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

//Function to check transactional link and return the transactional link value. Please do not change unless required.
function getTransactionalLinkVal(linkToCheck){
	var transactionalLinkVal = "";
	for (i = 1; i < arrTransactionalLinks.length; i = i + 2){				
		if (arrTransactionalLinks[i].indexOf(linkToCheck) > -1 || linkToCheck.indexOf(arrTransactionalLinks[i]) > -1){
			transactionalLinkVal = arrTransactionalLinks[i+1];
			break;
		}		
	}
	if (transactionalLinkVal == ""){
		transactionalLinkVal = arrTransactionalLinks[0];
	}
	return transactionalLinkVal;
}

//This function checks the cookie value after each minute to check if survey popup has been launched previously.
//If survey is set to 5 MINS then it starts the timer for launching the survey after 5 minutes.
function checkCookieRegInt(){
	//Read the dgSurveyCookie
	dgSurveyCookieStr = getCookie('dgSurveyCookie');
	
	if (dgSurveyCookieStr != null){
		dgSurveyCookieArr = dgSurveyCookieStr.split(",");
		surveyTimeout = dgSurveyCookieArr[0];					
	}
	
	//If value is 5 MINS start the timer to launch the suvery after hide.
	if (surveyTimeout == "5 MINS"){			
		//stop this timer
		clearTimeout(timer1);		
		
		//If survey is not answered previously then set the timer to launch the survey
		if (jQuery.inArray(surveyUrl,dgSurveysDoneArr) == -1) {
			//Get the Participate Form Settings value from cookie
			for (i = 2; i < participateFormLength+2; i++){
				participateFormSettings[i-2] = dgSurveyCookieArr[i];
			}
			
			//Get the survey launch time when "5 MINS" was clicked.
			var surveyReopenDate = new Date(dgSurveyCookieArr[1]);
					
			//Get current time
			var timeToOpenPopup = new Date();	
				
			//Get the time difference left to launch the survey
			timeToOpenPopup = surveyReopenDate.getTime() - timeToOpenPopup.getTime();
			
			//Start the timer to launch the survey after stipulated time
			timer = setTimeout("setCookieAfterHide()",timeToOpenPopup);
			
			//Set surveyTimeout to 5 MINS to know that survey has been set to launch after 5 MINS
			surveyTimeout = '5 MINS';
		}
	} else if (surveyTimeout == "FINISHED") {
		//If survey is closed or completed, stop this timer as there is no need to check 5 MINS option.
		clearTimeout(timer1);
	}		
	else {
		/*If value is not "5 MINS" or "FINISHED" call this function repeatedly.
		Time is just 30 sec less than hideInvitationWindowTime to improve performance of page and avoid any unnecessary infinite loops.
		This is being done to check if any popup has been launched and 5 MINS option has been selected*/
		timer1 = setTimeout("checkCookieRegInt()",(hideInvitationWindowTime - 0.5) * 60 * 1000);
	}
}

//This function is used to set dgSurveyCookie and launch the Survey Popup Window
function launchPopupWin(){							
	var participateFormSettingsStr = "";
	for (i = 0; i < participateFormLength; i++){
		participateFormSettingsStr = participateFormSettingsStr + "," + participateFormSettings[i];
	}
	
	participateFormSettingsStr = participateFormSettingsStr.substring(1);
		
	//Survey Popup Parameters are set here
	var surveyPopupParams = "?surveyUrl=" + encodeURIComponent(surveyUrl) + "&cookieToExpireInDays=" + cookieToExpireInDays + "&hideWinTime=" + hideInvitationWindowTime + "&pFormLen=" + participateFormLength + "&pFormStr=" + participateFormSettingsStr;

	//Launch the survey popup window
	window.open(surveyPopupHTMLUrl + surveyPopupParams,"surveyPopupWin",surveyPopupSpecs);
}

//This function sets the dgSurveyCookie value to "5 MINS AFTER" and launches the invitation window.
function setCookieAfterHide(){
	//Set dgSurveyCookie as 5 MINS AFTER to know that "5 MINS" has completed and survey invitation popup has been launched
	setCookie('dgSurveyCookie', '5 MINS AFTER',cookieToExpireInDays);	
	
	//Stop this timer
	clearTimeout(timer);					
	
	//Launch the survey popup window
	$(window).ready(function() {				
		surveyTimeout = "never";			
		launchPopupWin();
		timer1 = setTimeout("checkCookieRegInt()",(hideInvitationWindowTime - 0.5) * 60 * 1000);
	}); 
}

/***************Custom Functions ends here*******************/
