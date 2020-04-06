var extid=localStorage.extId,videoNames=[],max=0,handle=-1,randid;
var title=document.querySelector('.tit,.media-title').innerText;
function getCommand(list,mut){
	var cmd='\n';
	if(mut){
		cmd+='cd ..\n'+`mkdir "${title}"`+'\ncd tmpVideo';
		list.forEach(ele=>{
			if(!ele[1])cmd+='\n'+`ffmpeg -i "${ele[0]}.mp4" -i "${ele[0]}.mp3" -c:v copy -c:a copy -strict experimental  -y "../${title}/${ele[0]}.mp4"`;
			else cmd+='\n'+`ffmpeg -i "${ele[0]}.flv" -c copy -y "../${title}/${ele[0]}.mp4"`;
		});
	}else{
		list.forEach(ele=>{
			if(!ele[1])cmd+='\n'+`ffmpeg -i "${ele[0]}.mp4" -i "${ele[0]}.mp3" -c:v copy -c:a copy -strict experimental  -y "../${ele[0]}.mp4"`;
			else cmd+='\n'+`ffmpeg -i "${ele[0]}.flv" -c copy -y "../${ele[0]}.mp4"`;
		});
	}
	cmd+='\ncd ..\nrmdir /s /q tmpVideo\n';
	cmd+='\necho 完成啦！！\npause';
	return cmd.replace(/tmpVideo/g,'tmpVideo'+randid);
}
function showCommand(cmd){
	function createNode(type,css,val){
		var tag=document.createElement(type);
		tag.style=css;
		tag.innerText=tag.value=val;
		return tag;
	}
	var style=['border: #9fd6e8 solid 3px;text-align: center;position: fixed;margin: auto;top: calc(50% - 150px);left: calc(50% - 150px);z-index: 100;background: white;width: 300px;height: 300px;',
	'font-size:30px;',"background: black;margin: 10px 30px;color: white;overflow-x: auto;overflow-y: auto;font-size: 15px;white-space: pre;text-align: initial;padding: 5px 20px;height: 170px;"];
	var tg1=createNode('div',style[0],'');
	var tg2=createNode('span',style[1],'下载完成啦!!');
	var tg3=createNode('textarea',style[2],cmd);
	var tg4=createNode('button','','复制代码');
	var tg5=createNode('h5','','在文件夹已经有.cmd文件，可直接运行');
	var tg6=createNode('button','margin-left:30px;','关闭');
	tg4.onclick=function(){
	    this.previousElementSibling.select();
	    var text=this.previousElementSibling.value;
	    document.execCommand('cut');
	    alert('复制成功！');
	    this.previousElementSibling.value=text;
	}
	tg6.onclick=function(){
		this.parentElement.outerHTML='';
	}
	document.body.append(tg1);
	tg1.append(tg2);
	tg1.append(tg5);
	tg1.append(tg3);
	tg1.append(tg4);
	tg1.append(tg6);
}
function getId(str){
	str=str.slice(0,str.indexOf('?'));
	str=str.slice(str.lastIndexOf('/'));
	str=str.slice(str.lastIndexOf('-')+1,-4);
	return str;
}
async function download(mut,idx){
	var list=urls,pname='',idx,sendData={},isFlv=false;
	var data=[];
	if(mut&&idx==-1){
		idx=document.querySelector('.cur-page,.ep-list-progress').innerText;
		idx=Number(idx.slice(0,idx.indexOf('/')));
	}
	if(list.filter(ele=>{return /^[^?]+\.flv/g.exec(ele)!==null}).length){
		list=list.filter(ele=>{return /^[^?]+\.flv/g.exec(ele)!==null});
		list=list.sort();
		list=new Set(list);
		var nlist=[];
		list.forEach(ele=>nlist.push(ele));
		list=nlist;
		var blo=await fetch(list[0]);
		var blo=await blo.blob();
		var ur=window.URL.createObjectURL(blo);
		sendData.href = ur;
		if(mut){
			var pat=`.ep-item:nth-child(${idx}),.list-box>li:nth-child(${idx})`;
			var ele=document.querySelector(pat);
			pname=idx+'_ '+ele.innerText;
		}
		sendData.download=title+pname+'.flv';
		sendData=[sendData];
		isFlv=1;
	}
	else if(list.filter(ele=>{return /^[^?]+\.m4s/g.exec(ele)!==null}).length){
		list=list.filter(ele=>{return /^[^?]+\.m4s/g.exec(ele)!==null});
		if(list==[])window.location.reload();
		list=list.sort();
		list=new Set(list);
		var nlist=[];
		list.forEach(ele=>nlist.push(ele));
		list=nlist;
		for(var i=0;i<list.length;i++){
			var res,ab;
			res=await fetch(list[i]);
			ab=await res.arrayBuffer();
			data.push([getId(list[i]),ab]);
		};
		data=data.sort((a,b)=>a[0]-b[0]);
		var tg1={},tg2={};
		tg1.href=data[0][1],tg2.href=data[data.length-1][1];
		tg1.href=window.URL.createObjectURL(new Blob([tg1.href],{type:'video/mp4'}));
		tg2.href=window.URL.createObjectURL(new Blob([tg2.href],{type:'video/mp3'}));
		if(mut){
			var pat=`.ep-item:nth-child(${idx}),.list-box>li:nth-child(${idx})`;
			var ele=document.querySelector(pat);
			pname=idx+'_ '+ele.innerText;
		}
		tg1.download=title+pname+'.mp4',tg2.download=title+pname+'.mp3';
		sendData=[tg1,tg2];
	}else{
		handle=setTimeout(download,10000,true,idx);
		return;
	}
	chrome.runtime.sendMessage(extid,{type:'additem',data:[sendData,randid]})
	videoNames.push([sendData[0].download.slice(0,-4),isFlv]);
	if(mut){
		var link=document.URL;
		if(idx==max){
			var cmd=getCommand(videoNames,mut)
			chrome.runtime.sendMessage(extid,{type:'downcmd',data:[cmd,randid]});
			showCommand(cmd);
			chrome.runtime.sendMessage(extid,{type:'finish',data:[]});
			return;
		}else{
			idx++;
			var pat=`.ep-item:nth-child(${idx}),.list-box>li:nth-child(${idx})`;
			var nxtEle=document.querySelector(pat);
			urls=[];
			handle=setTimeout(download,10000,true,idx);
			nxtEle.click();
		}
	}else {
		var cmd=getCommand(videoNames,mut);
		showCommand(cmd);
		chrome.runtime.sendMessage(extid,{type:'downcmd',data:[cmd,randid]});
		chrome.runtime.sendMessage(extid,{type:'finish',data:[]});
	}
}
function start(rand){
	alert('开始下载！');
	randid=rand;
	var mut=(document.querySelector('.cur-page,.ep-list-progress')!==null);
	if(mut){
		max=document.querySelector('.cur-page,.ep-list-progress').innerText;
		max=Number(max.slice(max.indexOf('/')+1));
	}
	handle=setTimeout(download,1500,mut,-1);
}
function end(){
	alert('停止下载！');
	if(handle<0){
		alert('下载尚未开始！');
		return;
	}
	clearTimeout(handle);
	var mut=(document.querySelector('.cur-page,.ep-list-progress')!==null);
	var cmd=getCommand(videoNames,mut);
	showCommand(cmd);
	chrome.runtime.sendMessage(extid,{type:'downcmd',data:[cmd,randid]});
	chrome.runtime.sendMessage(extid,{type:'finish',data:[]});
}