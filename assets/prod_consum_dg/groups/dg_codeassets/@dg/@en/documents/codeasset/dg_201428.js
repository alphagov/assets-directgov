var keynoteInterceptLikelihood = 0.2;

var keynoteInterceptTaskKey = 'DCED4EB8DC7C4E988D0A077888E64B13intercept1';

var keynoteInterceptType = 'Layer';

function HandleKeynoteIntercept()

{

try {

if (Math.random() >= (keynoteInterceptLikelihood*5)) return;

var s = document.createElement('script');

s.src = 'http://webeffective.keynote.com/applications/intercept/filter_page.asp?inv=' + keynoteInterceptTaskKey + '&type=' + keynoteInterceptType + '&rate=' + keynoteInterceptLikelihood + '&domain=' + window.location.hostname + '&max=5';

document.body.insertBefore(s, document.body.firstChild);

window.keynoteConnectorWindow = 'primary';

}

catch(e){}

}

if (window.attachEvent) window.attachEvent('onload',HandleKeynoteIntercept);

else window.addEventListener('load',HandleKeynoteIntercept,false);
