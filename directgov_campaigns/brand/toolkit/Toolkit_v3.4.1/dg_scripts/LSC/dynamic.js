window.onload = function(e) {
 fixposition(460);
}

function fixposition(margin) {
	objectsize = $(".gridwrap").width();
		
	if (objectsize < 703) {
		$(".gridright").css({"margin-left":"0","clear":"left"});
	}
	else {
		$(".gridright").css({"margin-left":margin+"px","clear":"none"});
	}
}
	
$(window).resize(function(){
	fixposition(460);
});