var url="https://s1.hdslb.com/bfs/static/player/main/*.js?v=*";
var urlReg=/https:\/\/s1\.hdslb\.com\/bfs\/static\/player\/main\/.*\.js\?v=.*/g;
chrome.webRequest.onBeforeRequest.addListener(
    function(details){
        return {redirectUrl: details.url.replace( urlReg, chrome.runtime.getURL('fake.js'))};
    },
    {
        urls: [
            url
        ]
    },
    ["blocking"]
);
chrome.runtime.onMessageExternal.addListener((msg)=>{
	if(!msg.type)return;
	if(msg.type=='additem'){
		msg.data[0].forEach(ele=>{
			// alert(ele.download);
			chrome.downloads.download({
				url:ele.href,
				filename: 'tmpVideo/'+ele.download
			},id=>{localStorage.last=id;});
		});
	}else if(msg.type=='downcmd'){
		var url=URL.createObjectURL(new Blob([msg.data[0]],{type:'plain/text'}));
		chrome.downloads.download({
			url:url,
			filename: 'tmpVideo/donttouchme.txt'
		});
		url=URL.createObjectURL(new Blob(['\nchcp 65001\n\nfor /f "delims=" %%i in (donttouchme.txt) do %%i'],{type:'text/cmd'}));
		chrome.downloads.download({
			url:url,
			filename: 'tmpVideo/runme.cmd'
		});
	}else{
		setTimeout(()=>{
			chrome.downloads.show(Number(localStorage.last));
			alert('下载完毕！');
		},2000);
	}
})