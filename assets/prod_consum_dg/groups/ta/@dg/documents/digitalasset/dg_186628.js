// JavaScript Document

var winOpen; 

function openDSAwin(theURL,winName,features){
 
 
winOpen = window.open(theURL,winName,features);
 
if (window.focus){
winOpen.focus()
}
 
}
