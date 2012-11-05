(function($){  
	$.fn.enableSuggest = function(url, options) {

		var defaults = {
			format: "default",
			queryParameter: "q",
			suggestBoxClass: "suggestContainer",
			closeButtonClass: "close",
			itemSelectedClass: "selected",
			itemHighlightedClass: "highlighted",
			closeLabel: "close",
			bodyHideControlsClass: null,//used to hide controls for IE6
			delay: 100 ,
            suggestionLabel: "Suggestions" //Used to internationalize the suggestion,
		}
		var options = $.extend(defaults, options);
		
		var buildSuggestBox = function(suggestContext) {
			
			var box = $('<div style="display:none"/>').addClass(options.suggestBoxClass);
            box.append('<div class="suggestionHeading">'+options.suggestionLabel+'</div>');
			box.append($('<a href="#" />').addClass(options.closeButtonClass).text(options.closeLabel));
			box.append($('<ul />'));
			
			suggestContext.suggestBox = $(suggestContext.input).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().prepend(box).find("div."+options.suggestBoxClass).get(0);
			$(suggestContext.suggestBox).find("a."+options.closeButtonClass).bind(
					"click", suggestContext, closeSuggestBox);
		}

		var getSuggestions = function(suggestContext,onSuccessCallback) {

			var thisRequest = ++suggestContext.suggestRequests;
			
			if(suggestContext.input.value == "") {
				suggestContext.suggestUpdate = thisRequest;
				suggestContext.suggestions = [];
				onSuccessCallback(suggestContext);
				return;
			}
			
			var parameters = {};
			parameters[options.queryParameter] = suggestContext.input.value; 
			$.getJSON(url, parameters,
					function(data){
						//update only with suggestions newer 
						//than the ones displayed
						if(thisRequest < suggestContext.suggestUpdate)
							return;
						suggestContext.suggestUpdate = thisRequest;
						suggestContext.suggestions = suggestContext.extractSuggestions(data);
						onSuccessCallback(suggestContext);
				    });
		}

		var extractSuggestionsFromDefault = function(data){
			
			return data;
		}
		
		
		var extractSuggestionsFromGoogleFormat = function(data){
			
			var suggestions = new Array();
			for(i = 0; i < data[1].length; ++i) {
				suggestions.push(data[1][i][0]);
			}
			return suggestions;
		}

		var renderSuggestions = function(suggestions) {
			var suggestionsItems =  $('<ul />');
			$(suggestions).each(function(){
				suggestionsItems.append($('<li />').text(""+this));
			});
			return suggestionsItems.html();
		}

		var closeSuggestBox = function(event) {
			var suggestContext = event.data;
			if(suggestContext.options.bodyHideControlsClass && $(document.body).hasClass("ie6"))
				$(document.body).removeClass(suggestContext.options.bodyHideControlsClass);
			$(suggestContext.suggestBox).hide();
			return false;
		}

		var displaySuggestions = function(suggestContext) {
			
			if(options.delay == 0) {
				getSuggestions(suggestContext, updateSuggestions);
			}
			else if(!suggestContext.inDelay){

				suggestContext.inDelay = true;
				window.setTimeout(function(){
						suggestContext.inDelay = false;
						return getSuggestions.call(this, suggestContext, updateSuggestions);
					}, options.delay);
			}
		}

		var updateSuggestions = function(suggestContext) {
			if(suggestContext.suggestions.length == 0) {
				if(suggestContext.options.bodyHideControlsClass && $(document.body).hasClass("ie6"))
					$(document.body).removeClass(suggestContext.options.bodyHideControlsClass);
				$(suggestContext.suggestBox).hide();
			}
			else {
				if(suggestContext.options.bodyHideControlsClass && $(document.body).hasClass("ie6"))
					$(document.body).addClass(suggestContext.options.bodyHideControlsClass);
				$(suggestContext.suggestBox).show();
			}
			var ulElt = $(suggestContext.suggestBox).find("ul");
			ulElt.html(renderSuggestions(suggestContext.suggestions));
			configureSuggestionItems(suggestContext.input, ulElt);
		}

		var configureSuggestionItems = function(input, ulElt) {
			ulElt.find("li").each(function(){
				$(this).bind("click", input, onSuggestItemClicked);
				$(this).bind("mouseenter", this, onMouseEnterSuggestItem);
				$(this).bind("mouseleave", this, onMouseLeaveSuggestItem);
			});
		}
		
		var onSuggestItemClicked = function(event) {
			var input = event.data;
			setInputFromLi(input, this);
			$(input).closest("form").submit();
		}

		var onMouseEnterSuggestItem = function(event) {
			$(this).addClass(options.itemHighlightedClass);
		}

		var onMouseLeaveSuggestItem = function(event) {
			$(this).removeClass(options.itemHighlightedClass);
		}

		var selectNextSuggestion = function(input) {
			var getNextWhenNoSelection = function(list) {
				return list.get(0);
			}
			var getNext = $.fn.next;
			_selectSuggestion(input, getNextWhenNoSelection, getNext);
		}

		var selectPreviousSuggestion = function(input) {
			var getNextWhenNoSelection = function(list) {
				return list.get(list.length-1);
			}
			var getNext = $.fn.prev;
			_selectSuggestion(input, getNextWhenNoSelection, getNext);
		}

		var _selectSuggestion = function(suggestContext, getNextWhenNoSelection, getNext) {
			
			var suggestions = $(suggestContext.suggestBox).find("li");
			if(suggestions.length == 0) {
				return;
			}
			if($(suggestContext.suggestBox).is(":hidden")){
				//skip first select if the box is hidden
				if(suggestContext.options.bodyHideControlsClass && $(document.body).hasClass("ie6"))
					$(document.body).addClass(suggestContext.options.bodyHideControlsClass);
				$(suggestContext.suggestBox).show();
				return;
			}
			var selectedSuggestion = suggestions.filter("."+options.itemSelectedClass);
			if(selectedSuggestion.length == 1) {
				var nextSugg = getNext.call(selectedSuggestion);
				selectedSuggestion.removeClass(options.itemSelectedClass);
				if(nextSugg.get(0) != undefined) {
					setInputFromLi(suggestContext.input, nextSugg.get(0));
					nextSugg.addClass(options.itemSelectedClass);
				}
				else {
					suggestContext.input.value = suggestContext.previousInputValue;
				}
			}
			else {
				var nextSugg = getNextWhenNoSelection(suggestions);
				$(nextSugg).addClass(options.itemSelectedClass);
				setInputFromLi(suggestContext.input, nextSugg); 
			}
		}

		var setInputFromLi = function(input, li) {
			input.value = $(li).text();
		}

		var onKeyUp = function(event) {

			var suggestContext = event.data;
			
			if(suggestContext.disabled)
				return;

			var code = event.which;
			if(code == 27 || code == 38 || code == 40 || code == 13)//13 : RETURN
				return;
			
			if(suggestContext.previousInputValue && this.value == suggestContext.previousInputValue){
				suggestContext.previousInputValue = this.value;
				return;
			}
			suggestContext.previousInputValue = this.value;
			displaySuggestions(suggestContext);
		}

		var onKeyDown = function(event) {

			var suggestContext = event.data;
			
			if(suggestContext.disabled)
				return;
			
			switch(event.which) {
				//ESC
				case 27:
					if(suggestContext.options.bodyHideControlsClass && $(document.body).hasClass("ie6"))
						$(document.body).removeClass(suggestContext.options.bodyHideControlsClass);
					$(suggestContext.suggestBox).hide();
					break;
				//UP
				case 38:
					selectPreviousSuggestion(suggestContext);
					break;
				//DOWN
				case 40:
					selectNextSuggestion(suggestContext);
					break;
			}
		}
		
		
		return this.map(function() {

			if(this.nodeType != 1 || this.tagName != "INPUT" || this.type != "text")
				return;
			
			var suggestContext = {
				options: options,
				input: this,
				previousInputValue: null,
				suggestBox: null,
				suggestRequests: 0,
				suggestUpdate: 0,
				suggestions: [],
				inDelay: false,
				extractSuggestions: null,
				disabled: false
			};
			
			switch(options.format){
				case "google":
					suggestContext.extractSuggestions = extractSuggestionsFromGoogleFormat;
					break;
				default:
					suggestContext.extractSuggestions = extractSuggestionsFromDefault;
					break;
			}

			buildSuggestBox(suggestContext);

			$(this).attr("autocomplete", "off");
			$(this).bind("keyup", suggestContext, onKeyUp);
			$(this).bind("keydown", suggestContext, onKeyDown);
			
			return {
				off: function() {
					$(suggestContext.suggestBox).hide();
					if(suggestContext.options.bodyHideControlsClass && $(document.body).hasClass("ie6"))
						$(document.body).removeClass(suggestContext.options.bodyHideControlsClass);
					suggestContext.disabled = true;
				},
				on: function() {
					suggestContext.disabled = false;
				}
			};
		})
	}
})(jQuery);

function report(url, msg) {
	if(!url || !msg)
		return;
	var parameters = {};
	
	for(key in msg) {
		parameters[key] = msg[key];
	}
	$.get(url,parameters);
}

(function($){  
	$.fn.enableReportOpenDoc = function(url, origin, hitInfos, options) {
		
		var defaults = {
			hitOpenDocumentLinkClass:"openDocLink",
			hitPreviewLinkClass:"previewLink"
		}
		var options = $.extend(defaults, options);
		
		return this.each(function(hitIndex) {
			
			if(this.nodeType != 1)
				return;
			
			$openDocumentLinks = $(this).find("a."+options.hitOpenDocumentLinkClass);
			$previewLinks = $(this).find("a."+options.hitPreviewLinkClass);
			if($openDocumentLinks.length == 0 && $previewLinks.length == 0) {
				return;
			}
			
			var reportOpenDoc = function() {
				var hitInfo = hitInfos[hitIndex];
				
				var msg = {'url':hitInfo.url,'source':hitInfo.source,'index':hitInfo.index, 'origin':origin, 'type':"document"};
				report(url,msg);
			}
			var reportPreview = function() {
				var hitInfo = hitInfos[hitIndex];
				
				var msg = {'url':hitInfo.url,'source':hitInfo.source,'index':hitInfo.index, 'origin':origin, 'type':"preview"};
				report(url,msg);
			}
			
			$openDocumentLinks.click(reportOpenDoc);
			$previewLinks.click(reportPreview);
			
		})
	}
})(jQuery);

(function($){  
	$.fn.enableThumbnailPreviewLink = function() {
		return this.each(function() {
			
			var $hit = $(this);
			var $thumb = $hit.find("img.thumbnail");
			if($thumb.length == 0)
				return;
		
			var enableLink = function() {
				
				if($thumb.attr("width") > 1) {
					
					var $previewLink = $hit.find("a.thumbnailPreviewLink");
					if($previewLink.length > 0) {
						$previewLink.append($thumb);
						$previewLink.show();
					}
					else {
						$thumb.addClass("thumbnail-nolink");
					}
				}
			}
			var done = false;
			$(this).find("img.thumbnail").load(function(event){
				if(!done) {
					enableLink();
				}
			});
			done = $thumb.attr("complete");
			if(done) {
				enableLink();
			}
		})
	}	
})(jQuery);


$.fn.selectTextRange = function(start, end) {
    return this.each(function() {
        if(this.setSelectionRange) {
            //move to the end if the content is longer than the input field
        	try {//does not work with chrome / safari
            	// whitespace
                var event = document.createEvent("KeyboardEvent")
                event.initKeyEvent("keypress", true, true, null, false, false, false, false, 32, 32);
                this.dispatchEvent(event);
                // backspace
                var event = document.createEvent("KeyboardEvent")
                event.initKeyEvent("keypress", true, true, null, false, false, false, false, 8, 0);
                this.dispatchEvent(event);        		
        	}
        	catch(e){}
            this.setSelectionRange(start, end);
        } else if(this.createTextRange) {//IE
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

function ASRenderContext() {
	
	this.searchForm = null;
	this.container = null;
	this.options = null;
}

function ASColumnLayout(columns) {
	
	this.columns = columns;
	
	this.render = function(context) {
		
		$(columns).each(function(index, column){
			
			var elt = $('<div/>').addClass('column');
			context.container.append(elt);
			
			var newContext = new ASRenderContext();
			newContext.searchForm = context.searchForm;
			newContext.options = context.options;
			newContext.container = elt;
			
			column.render(newContext);
		});
	}
}

function ASColumn(sections, elementClass) {
	
	this.sections = sections;
	
	this.render = function(context) {
		
		$(sections).each(function(index,section){
			
			section.render(context);
		});
	}
}

function ASSection(title, items, elementClass) {
	
	this.title = title;
	this.items = items;
	
	this.render = function(context) {
		
		var html = $('<div/>').addClass('section');
		html.append($('<div/>').addClass('sectionTitle').html(title));
		html.append($('<ul/>'));
		context.container.append(html);
		
		var newContext = new ASRenderContext();
		newContext.searchForm = context.searchForm;
		newContext.options = context.options;
		newContext.container = html.find("ul");
		
		$(items).each(function(index,item){
			item.render(newContext);
		});
	}
}

// search expression can contain a place holder "%@" for the selected text
function ASStandardItem(linkLabel, sampleLabel, searchExpression, selectedText, documentation) {
	
	this.linkLabel = linkLabel;
	this.sampleLabel = sampleLabel;
	this.searchExpression = searchExpression;
	this.selectedText = selectedText;
	this.documentation = documentation;
	
	this.render = function(context) {
		var html = $('<li/>').addClass("standard");
		html.append($('<a href="#" />').html(linkLabel).attr("title", documentation ? documentation : ""));
		html.append($('<span/>').addClass('sample').html(sampleLabel));
		context.container.append(html);
		var link = context.container.find("li a").last();
		
		var appendText = this.appendText;
		$(link).bind("click", this, function(event){
			event.preventDefault();
			var item = event.data;
			appendText(context, item.searchExpression, item.selectedText);
			return false;
		});

	};
}

function ASSelectItem(defaultlabel, valueLabels, sampleLabel, searchExpression, values) {
	
	this.defaultlabel = defaultlabel;
	this.valueLabels = valueLabels;
	this.sampleLabel = sampleLabel;
	this.searchExpression = searchExpression;
	this.values = values;
	
	this.render = function(context) {
		var select = $('<select />');
		select.append($('<option/>').html(defaultlabel));
		
		for(var i = 0; i < valueLabels.length; i++) {
			select.append($('<option/>').html(valueLabels[i]).attr("value", values[i]))
		}
		
		var html = $('<li/>').addClass("select").append(select).append($('<span/>').addClass('sample').html(sampleLabel));
		
		context.container.append(html);
		select = context.container.find("li select").last();
		
		var appendText = this.appendText;
		
		$(select).bind("change", this, function(event){
			var item = event.data;
			appendText(context, item.searchExpression, this.value);
			this.selectedIndex = 0;
			return false;
		});
	};
}


var appendText = function(context, expression, selectedText) {
	var $searchForm = $(context.searchForm);
	var $input = $searchForm.find(context.options.inputRelativeSelector);
	var input = $input.get(0);
	
	//fill the place holder and compute the range
	var start = expression.indexOf("%@");
	var end = start;
	if(start > -1) {
		expression = expression.substring(0, start) + selectedText + expression.substring(start+2);
		end += selectedText.length;
	}
	
	var inputValue = input.value;
	var newValue = "" + inputValue;
	if(inputValue.length != 0 && inputValue[inputValue.length-1] != ' ') {
		newValue += " ";
	}
	var offset = newValue.length;
	newValue += expression;
	input.value = newValue;
	start += offset;
	end += offset;
	//select text
	$input.selectTextRange(start, end);
	$input.focus();
};

ASStandardItem.prototype.appendText = appendText;
ASSelectItem.prototype.appendText = appendText;

(function($){  
	$.fn.enableAdvancedSearchOptions = function(layout, suggests, options) {
		
		var defaults = {
			panelClass:"advancedSearchPanel",
			closeLabel: "close",
			panelLabel: "Build your query using advanced syntax",
			inputRelativeSelector: "#searchInput",
			inputWrapperRelativeSelector: "#page",
			advancedSearchLinkRelativeSelector:"a.advancedSearchLink",
			bodyHideControlsClass: null
		};
		var options = $.extend(defaults, options);

		var hidePanel = function(event) {
			event.preventDefault();
			if(suggests) {
				$(suggests).each(function(){
					this.on();
				});
			}
			if(options.bodyHideControlsClass && $(document.body).hasClass("ie6"))
				$(document.body).removeClass(options.bodyHideControlsClass);
			$(event.data).hide();
			return false;
		}
		
		var showPanel = function(event) {
			event.preventDefault();
			if(suggests) {
				$(suggests).each(function(){
					this.off();
				});
			}
			if(options.bodyHideControlsClass && $(document.body).hasClass("ie6"))
				$(document.body).addClass(options.bodyHideControlsClass);
			$(event.data).show();
			return false;
		}
		
		var hideORShowPanel = function(event) {
			var $panel = $(event.data);
			if($panel.is(":hidden")) {
				showPanel(event);
			}
			else {
				hidePanel(event);
			}
			return false;
		}
		
		var buildPanel = function(container) {
			var panel = $('<div style="display:none" />').addClass(options.panelClass).append($('<a href="#" />').html(options.closeLabel).addClass('close'));
			panel.append($('<div />').addClass('panelTitle').html(options.panelLabel));
			panel = container.prepend(panel).find("div."+options.panelClass);
            /*var tmp = container.context.id;
            alert("advancedSearchAttached :" +tmp.toString());*/
			panel.find("a.close").bind("click", panel, hidePanel);
			return panel;
		}
		
		return this.each(function() {
			
			if(this.nodeType != 1)
				return;
			
			var panel = buildPanel($(this).find(options.inputWrapperRelativeSelector));
			
			var context = new ASRenderContext();
			context.searchForm = this;
			context.container = panel;
			context.options = options;

			layout.render(context);

			$(this).find(options.advancedSearchLinkRelativeSelector).bind("click", panel, hideORShowPanel).show();
		});
	}
})(jQuery);

function addDebugInfoToHitIfAvailable(hit, info) {
	
	if(!info.debugInfo)
		return;
		
	var ulGeneralList = $('<ul />').addClass('general');
	var names = ["slice", "did", "mask", "collapsed"];
	for(var i = 0; i < names.length; i++) {
		var item = $('<li />');
		item.append($('<span />').addClass('key').html(names[i]+':'));
		item.append($('<span />').addClass('value').html(info[names[i]]));
		ulGeneralList.append(item);
	}
	
	var ulScoreList = $('<ul />').addClass('score');
	var scoreItem = $('<li />');
	scoreItem.append($('<span />').addClass('key').html("score"+':'));
	scoreItem.append($('<span />').addClass('value').html(info.score));
	ulGeneralList.append(scoreItem);
	var names = ["query_score", "prox_score", "static_score"];
	for(var i = 0; i < names.length; i++) {
		var item = $('<li />');
		item.append($('<span />').addClass('key').html(names[i]+':'));
		item.append($('<span />').addClass('value').html(info.debugInfo[names[i]]));
		ulScoreList.append(item);
	}
	
	
	var buildScoreDetails = function(container) {
		
		var ulWordList = $('<ul />').addClass('scoreDetails');
		var words = info.debugInfo.words;
		
		if(!words || words.length == 0) {
			var item = $('<li />').html("No score details for this query");
			ulWordList.append(item);
			container.append(ulWordList);
			return;
		}
		
		for(var i = 0; i < words.length; i++) {
			var item = $('<li />');
			var ulWordDetail = $('<ul />').addClass('word');
			
			for(var prop in words[i]) {
				var subItem = $('<li />');
				subItem.append($('<span />').addClass('key').html(prop+':'));
				
				if(prop == "positions") {
					var positions = words[i][prop];
					var value = "";
					var notFirst = false;
					for(var j = 0; j < positions.length; j++) {
						if(notFirst || !(notFirst = true)) {
							value += ", ";
						}
						value += positions[j];
					}
					subItem.append($('<span />').addClass('value').html(value));
				}
				else {
					subItem.append($('<span />').addClass('value').html(words[i][prop]));
				}
				
				ulWordDetail.append(subItem);
			}
			item.append(ulWordDetail);
			
			ulWordList.append(item);
		}
		container.append(ulWordList);
	}
	
	var hideShowScoreDetails = function(event) {
		var hitDebugDiv = $(hit).find(".hitContent .hitDebug");
		var scoreDetails = hitDebugDiv.find(".scoreDetails");
		if(scoreDetails.length == 0) {
			buildScoreDetails(hitDebugDiv);
			scoreDetails = hitDebugDiv.find(".scoreDetails");
			return false;
		}
		if(scoreDetails.is(":hidden")) {
			scoreDetails.show();
		}
		else {
			scoreDetails.hide();
		}
		
		return false;
	}
	
	var scoreDetailsLink = $('<a />').addClass('scoreDetailsLink').attr("href", "#").html("show score details");
	ulScoreList.append($('<li />').html(scoreDetailsLink));
	
	var hitDebug = $('<div />').addClass('hitDebug');
	hitDebug.append(ulGeneralList);
	hitDebug.append(ulScoreList);
	$(hit).find(".hitContent").append(hitDebug).find(".scoreDetailsLink").click(hideShowScoreDetails);
	
}

$(document).ready(function(){
       $("div#searchOptions").css('visibility','visible');
});
