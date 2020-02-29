// var urls=[];
var fr=[],haveAu=false,haveVi=false;
var title=document.getElementsByTagName('title')[0].innerText.slice(0,15);
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
	if(list.filter(ele=>{return /\.flv/g.exec(ele)!==null}).length==1){
		var url=list.filter(ele=>{return /\.flv/g.exec(ele)!==null});
		var tag = document.createElement('a');
		tag.href = url;
		tag.download=title+'.flv';
		tag.click();
		return ;
	}
	list=list.filter(ele=>{return /\.m4s/g.exec(ele)!==null});
	list=new Set(list);
	list=list.toJSON();
	for(var i=0;i<list.length;i++){
		var res,blo;
		res=await fetch(list[i]);
		blo=await res.blob();
		var ur=window.URL.createObjectURL(blo);
		var tag = document.createElement('a');
		tag.href = ur;
		fr.push(new FileReader());
		fr[i].readAsArrayBuffer(blo);
		fr[i].onload=function(event){
			if(haveVi&&haveAu)return;
			var tri;
			if(new Uint8Array(event.target.result).toString().indexOf("34,109,111,111,118")!==-1){
				tri=title+'.mp3';
				haveAu=1;
			}
			else{
				tri=title+'.mp4';
				haveVi=1;
			}
			tag.download=tri;
			tag.click();
			window.URL.revokeObjectURL(ur);
		}
	}
}
setTimeout(download,10000);