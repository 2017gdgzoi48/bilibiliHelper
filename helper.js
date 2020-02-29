var scr=document.createElement('script');
scr.src=chrome.runtime.getURL('ajaxListener.js');
document.body.insertBefore(scr,document.body.firstElementChild);