
function fnCalculate() {
//set all ouput and error styles to nothing
document.getElementById("divTotal").innerHTML = "";
document.getElementById("divTotal").style.borderTop = "";
document.getElementById("divErr").style.display = "none";
document.getElementById("divProp").style.border = "";
document.getElementById("divRent").style.border = "";
document.getElementById("divLease").style.border = "";
document.getElementById("divStarted").style.border = "";
document.getElementById("divYears").style.border = "";
document.getElementById("divFormBottom").style.border = "";
msg = "";
//get input values
var property = document.frmCalculator.txtPropertyVal.value; 
var rent = document.frmCalculator.txtRent.value;
var lease = document.frmCalculator.txtLeaseLength.value;
var dDay = document.frmCalculator.txtDate.value;
var mMonth = document.frmCalculator.txtMon.value;
var yYear = document.frmCalculator.txtYear.value;

//run error parsing on each field
if (property != "") {
	property = property.replace(/[^0-9\.]/g, "");
	if (property != ""){
	 property = parseFloat(property).toFixed(2);
}
else {
	property = 0;
msg = "<li>Error: please enter the current value of the flat in pounds (&pound;)</li>";
document.getElementById("divProp").style.border = "solid 1px red";
document.getElementById("divProp").style.padding = "1em 0 1em 0";
}
document.getElementById("txtPropertyVal").value = property;
}
else {
msg = msg + "<li>Error: please enter the current value of the flat</li>";
document.getElementById("divProp").style.border = "solid 1px red";
document.getElementById("divProp").style.padding = "1em 0 1em 0";
}


if (rent != "") {
	rent = rent.replace(/[^0-9\.]/g, "")
	if (rent != "") {
	rent = parseFloat(rent).toFixed(2);
}
else{
	rent = 0;
	msg = msg + "<li>Error: please enter the annual ground rent in pounds (&pound;)</li>";
document.getElementById("divRent").style.border = "solid 1px red";
document.getElementById("divRent").style.padding = "1em 0 1em 0";
}
document.getElementById("txtRent").value = rent;
}
else {
msg = msg + "<li>Error: please enter the annual ground rent</li>";
document.getElementById("divRent").style.border = "solid 1px red";
document.getElementById("divRent").style.padding = "1em 0 1em 0";
}


var yLeft
var yearsLeft = 0;

yLeft = document.frmCalculator.txtYearsLeft.value;
if (yLeft != "") {
yLeft = yLeft.replace(/[^0-9]/g, "");
document.getElementById("txtYearsLeft").value = yLeft;
document.getElementById("txtDate").value = "";
document.getElementById("txtMon").value = "";
document.getElementById("txtYear").value = "";
document.getElementById("txtLeaseLength").value = "";
yearsLeft = 1;
}
else if (lease != "" && yYear != "") {
lease = lease.replace(/[^0-9]/g, "");
document.getElementById("txtLeaseLength").value = lease;
 yYear = yYear.replace(/[^0-9]/g, "");
document.getElementById("txtYear").value = yYear;

if (mMonth != "") {
mMonth = parseFloat(mMonth.replace(/[^0-9]/g, ""));
}
if (mMonth<10 && mMonth>0) {
	 mMonth = "0" + mMonth;
}

else if (mMonth < 1 || mMonth > 12 || mMonth == "") {
	mMonth = "01";
}
document.getElementById("txtMon").value = mMonth;

if (dDay != "") {
dDay = parseFloat(dDay.replace(/[^0-9]/g, ""));
}
if (dDay<10 && dDay>0) {
	 dDay = "0" + dDay;
}
else if (dDay < 1 || dDay > 31 || dDay == "") {
	dDay = "01";
}

document.getElementById("txtDate").value = dDay;
 if (yYear > 1900) {
  var mMonth2 = parseFloat(mMonth);
	 mMonth = mMonth2 - 1;
dDay = parseFloat(dDay);
	
  yYear = new Date(yYear, mMonth, dDay);
  var dDate = new Date();
  var dFullYear = dDate.getFullYear();
  var yFullYear = yYear.getFullYear();
    if (dFullYear <= yFullYear) {
	msg = msg + "<li>Error: the year the lease started cannot be the same, or later, than the current year</li>";
	document.getElementById("divStarted").style.border = "solid 1px red";
	document.getElementById("divStarted").style.padding = "1em 0 1em 0";
}
    else {
   var date2 = yYear.getTime();
   var date1 = dDate.getTime();
   var theYears = date1 - date2;
   var theYears2 = Math.ceil(theYears/(365.25*24*60*60*1000));
   yLeft = lease - theYears2;

}
}
}
else {
	msg = msg + "<li>Error: please enter the following: either the 'number of years left on lease' or 'original length of your lease' and 'date your lease started'</li>";
	document.getElementById("divFormBottom").style.border = "solid 1px red";
	document.getElementById("divStarted").style.padding = "1em 0 1em 0";
}

if (msg != "") {
	document.getElementById("divErr").innerHTML = "<div class=errorm><ul>" + msg + "</ul></div>";
	document.getElementById("divErr").style.display = "block";
	return false;
	}

//the calculation
var yearsAdjust = Math.round(1065*Math.exp(-0.0685*yLeft));
var propAdjust = property*((100+yearsAdjust)/100);
var xTermLwr = ((1-Math.pow(1.08,-yLeft))/0.08)*rent;
xTermLwr = xTermLwr.toFixed();
var xTermHgr = ((1-Math.pow(1.065,-yLeft))/0.065)*rent;
xTermHgr = xTermHgr.toFixed();
var xRevLwr = Math.pow(1.055,-yLeft)*propAdjust;
xRevLwr = xRevLwr.toFixed();
var xRevHgr = Math.pow(1.05,-yLeft)*propAdjust;
xRevHgr = xRevHgr.toFixed();


var marrValHgr = 0;
var marrValLwr = 0;
if (yLeft<80) {
	marrValHgr = (propAdjust-(parseInt(property)+parseInt(xTermHgr)+parseInt(xRevLwr)))/2;
	marrValHgr = marrValHgr.toFixed();
	if (marrValHgr<0) {
		marrValHgr = 0;
	}
	marrValLwr = (propAdjust-(parseInt(property)+parseInt(xTermHgr)+parseInt(xRevHgr)))/2;
	marrValLwr = marrValLwr.toFixed();
	if (marrValLwr<0) {
		marrValLwr = 0;
	}
	}
	//else {
	//	var yearsToMarr = yLeft-80;
	//	if (yearsToMarr == 1) {
	//	yearsToMarr = yearsToMarr + " year";
	//	}
	//	else {
	//	yearsToMarr = yearsToMarr + " years";
	//	}
//}	

//provide final cost range
var costLow = (parseInt(xTermLwr)+parseInt(xRevLwr)+parseInt(marrValHgr));
costLow = Math.round(Math.ceil(costLow/1000)*1000);
var costHigh = (parseInt(xTermHgr)+parseInt(xRevHgr)+parseInt(marrValLwr));
costHigh = Math.round(Math.ceil(costHigh/1000)*1000);

var tCost=costLow + " - &pound;" + costHigh;
if (costLow == costHigh) {
tCost = costLow;
}

//the output
if (yLeft>=60 && yLeft<80 && yearsLeft != 1){
	yLeftText = "<div class=leaseresultsheading>To add 90 years to the lease</div><div class=leaseresultsrubrik><div class=odd><p>Approximate price:</p></div><div class=even><p>&pound;" + tCost + " plus costs</p></div></div><div class=leaseresultsrubrik><div class=odd><p>Years left on lease:</p></div><div class=even><p>" + yLeft + "</p></div></div>";
	addText = "<div class=resultsbordertop><p>The price includes marriage value. This is the landlord's share of any increase in a flat's value when a lease with less than 80 years is extended.</p><p> Get a professional to work out a more accurate price if you are extending the lease or taking legal action.</p><p>You can re-calculate the price by changing the details above.</p></div>";
}
else if (yLeft>=60 && yLeft<80) {
		  yLeftText = "<div class=leaseresultsheading>To add 90 years to the lease</div><div class=leaseresultsrubrik><div class=odd><p>Approximate price:</p></div><div class=even><p>&pound;" + tCost + " plus costs</p></div></div>";
		  addText = "<div class=resultsbordertop><p>The price includes marriage value. This is the landlord's share of any increase in a flat's value when a lease with less than 80 years is extended.</p><p> Get a professional to work out a more accurate price if you are extending the lease or taking legal action.</p><p>You can re-calculate the price by changing the details above.</p></div>"
		  }
else if (yLeft<60 && yearsLeft != 1){
	yLeftText = "<div class=leaseresultsheading>Lease extension</div>";
	addText = "<div><p>The lease has " + yLeft + " year(s) left. The calculator can't work out the price of extending a lease with less than 60 years to run.</p><p>Get professional advice about the cost of extending the lease or re-calculate a price by changing the details above.</p></div>";
}
else if (yLeft<60 && yearsLeft != 0){
	yLeftText = "<div class=leaseresultsheading>Lease extension</div>";
	addText = "<div><p>The calculator can't work out the price of extending a lease with less than 60 years to run.</p><p>Get professional advice about the cost of extending the lease or re-calculate a price by changing the details above.</p></div>";
}
else if (yLeft>79 && yearsLeft != 1){
	yLeftText = "<div class=leaseresultsheading>To add 90 years to the lease</div><div class=leaseresultsrubrik><div class=odd><p>Approximate price:</p></div><div class=even><p>&pound;" + tCost + " plus costs</p></div></div><div class=leaseresultsrubrik><div class=odd><p>Years left on lease:</p></div><div class=even><p>" + yLeft + "</p></div></div>";
	addText = "<div class=resultsbordertop><p>The price can increase when there's less than 80 years left on the lease.</p><p>Get a professional to work out a more accurate price if you are extending the lease or taking legal action.</p><p>You can re-calculate the price by changing the details above.</p></div>";
}
else {
	yLeftText = "<div class=leaseresultsheading>To add 90 years to the lease</div><div class=leaseresultsrubrik><div class=odd><p>Approximate price:</p></div><div class=even><p>&pound;" + tCost + " plus costs</p></div></div>";
	addText = "<div class=resultsbordertop><p>The price can increase when there's less than 80 years left on the lease.</p><p>Get a professional to work out a more accurate price if you are extending the lease or taking legal action.</p><p>You can re-calculate the price by changing the details above.</p></div>";
}
document.getElementById("divTotal").innerHTML = "<div class=formwrap><div id=resultsoverwrite><span class=tl></span> <span class=tr></span>" + yLeftText + addText +"<span class=bl></span> <span class=br></span></div></div>";
document.getElementById("divTotal").style.padding = "1em 0 0 0";
}
