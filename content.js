const script = document.createElement('script');
script.src = chrome.extension.getURL('script.js');
document.documentElement.appendChild(script);