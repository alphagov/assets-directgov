function changeExample(selectedRadio, exampleId, exampleText, titleText)
{
	if (document.getElementById && document.createTextNode)
	{
		var exampleDisplay = document.getElementById(exampleId);
		if (exampleDisplay != null)
		{
			var exampleTextNode = document.createTextNode(exampleText);
			if (exampleDisplay.firstChild != null)
			{
				exampleDisplay.replaceChild(exampleTextNode, exampleDisplay.firstChild);
			}
			else
			{
				exampleDisplay.appendChild(exampleTextNode);
			}
		}
		
		var textField = document.getElementById('text');
		
		if (textField != null)
		{
			textField.title=titleText;
		}
	}
}

function initializeExample(initialId, exampleId, exampleText, titleText)
{
	if (document.getElementById)
	{
		var initialButton = document.getElementById(initialId);
		if (initialButton != null)
		{
			if (!initialButton.checked)
			{
				initialButton.checked = true;
			}
			changeExample(initialButton, exampleId, exampleText);
		}
		
		var textField = document.getElementById('text');
		if (textField != null)
		{
			textField.title=titleText;
		}
	}
}