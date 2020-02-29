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
/*
it can't use because of its vedio is swf !!!
*/