document.onreadystatechange=()=>{
	var filter=["*://www.bilibili.com/video/*","*://www.bilibili.com/*/play/*"];
	document.getElementById('start').onclick=()=>{
		chrome.tabs.query({url:filter},tabs=>{
			if(tabs.length==0){
				chrome.tabs.query({active:true},tabs=>{
					var str='没有检测到合适页面，无法开始！';
					chrome.tabs.executeScript(tab.id,{code:'alert("'+str+'")'});
				});
				return;
			}
		})
	};
	document.getElementById('stop').onclick=()=>{
		chrome.tabs.query({url:filter},tabs=>{
			if(tabs.length==0){
				chrome.tabs.query({active:true},tabs=>{
					tab=tabs[0];
					var str='没有检测到合适页面，无法结束！';
					chrome.tabs.executeScript(tab.id,{code:'alert("'+str+'")'});

				});
				return;
			}
			tabs.forEach(tab=>{chrome.tabs.sendMessage(tab.id,{type:'stop',data:[]});});
		})
	};
}