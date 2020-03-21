// var urls=[];
var haveAu=false,haveVi=false;
var title=document.getElementsByTagName('title')[0].innerText.slice(0,document.getElementsByTagName('title')[0].innerText.indexOf('哔')-1);
// function changeAjax(){
// 	tmp1=XMLHttpRequest.prototype.send;
// 	function tmpSend (data) {
// 		tmp1.call(this,data);
// 		if(this.onreadystatechange!=null&&this.onreadystatechange.ifSet===undefined)
// 			tmp2=this.onreadystatechange;
// 		else {
			
// 		}
// 		function tmpChange(data){
// 			if(this.readyState==4){
// 				urls.push(this.responseURL);
// 			}			
// 			if(tmp2!==null)tmp2();
// 		}
// 		tmpChange.isSet=1;
// 		this.onreadystatechange=tmpChange;	
// 	}
// 	XMLHttpRequest.prototype.send=tmpSend;
// 	tmp3=fetch;
// 	function tmpFetch(url,init){
// 		urls.push(url);
//     	return tmp3(url,init);
// 	}
// 	fetch=tmpFetch;
// }
// changeAjax();
// run it in fake.js
async function download(){
	var list=urls;
	var data=[];
	if(list.filter(ele=>{return /\.flv/g.exec(ele)!==null}).length){
		list=list.filter(ele=>{return /^[^?]+\.flv/g.exec(ele)!==null});
		list=list.sort();
		list=new Set(list);
		var nlist=[];
		list.forEach(ele=>nlist.push(ele));
		list=nlist;
		var tag = document.createElement('a');
		var blo=await fetch(list[0]);
		var blo=await blo.blob();
		var ur=window.URL.createObjectURL(blo);
		tag.href = ur;
		tag.download=title+'.flv';
		tag.click();
		return ;
	}
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
		var ur=window.URL.createObjectURL(new Blob([ab]));
		var tag = document.createElement('a');
		tag.href = ur;
		data.push([ab.byteLength,tag]);
	}
	data=data.sort((a,b)=>a[0]-b[0]);
	var t1=data[0][1];
	var t2=data[data.length-1][1];
	t1.download=title+'.mp3',t2.download=title+'.mp4';
	t1.click();
	t2.click();
}
setTimeout(download,15000);