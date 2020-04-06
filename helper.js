var ele=document.createElement('script');
ele.src=chrome.runtime.getURL('ajaxListener.js');
localStorage.extId=chrome.runtime.id;
document.body.appendChild(ele);
chrome.runtime.onMessage.addListener((msg)=>{
	var tag=document.createElement('script');
	if(msg.type=='start'){
		tag.innerText='start('+msg.data[0]+')';
	}else{
		tag.innerText='end()';
	}
	document.body.appendChild(tag);
})