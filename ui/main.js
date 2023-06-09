import './style.css'
import "video.js/dist/video-js.css";
import videojs from "video.js";
import axios from 'axios';
import _ from 'underscore';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import DeviceDetector from "device-detector-js";
var data = {
    session_id : finguard(),
    "report_name" : "hls",
    "report_type" : "hls",
    payload:{
        client_info:{
            device:{},
            ipinfo:{}
        },
        player_data:{},
        gotipath_video:{},
        gpcdn_video:{},
        gc_gotipath_video:{},
        gc_gpcdn_video:{},
        networking:{}
    }
};

document.querySelector("#session_id").innerHTML = data.session_id;

let gpcdnPlayer = videojs("gpcdn_video", {
    html5: {
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        vhs: {
            debug: true,
            overrideNative: true
        }
    }
});

gpcdnPlayer.ready(function () {
    this.src({
        src: "https://spnkvwlhdc.gpcdn.net/1a082fad-0e02-4964-8123-2a87ad91ff2c/playlist.m3u8",
        type: "application/x-mpegURL",
        withCredentials: false
    });
});


let gotpathPlayer = videojs("gotipath_video", {
    html5: {
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        vhs: {
            debug: true,
            overrideNative: true
        }
    }
});


gotpathPlayer.ready(function () {
    this.src({
        src: "https://videocdn.gotipath.com/1a082fad-0e02-4964-8123-2a87ad91ff2c/playlist.m3u8",
        type: "application/x-mpegURL",
        withCredentials: false
    });
});



let gc_gotipath_video = videojs("gc_gotipath_video", {
    html5: {
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        vhs: {
            debug: true,
            overrideNative: true
        }
    }
});

gc_gotipath_video.ready(function () {
    this.src({
        src: "https://gcvideo.gotipath.com/1a082fad-0e02-4964-8123-2a87ad91ff2c/playlist.m3u8",
        type: "application/x-mpegURL",
        withCredentials: false
    });
});


let gc_gpcdn_video = videojs("gc_gpcdn_video", {
    html5: {
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        vhs: {
            debug: true,
            overrideNative: true
        }
    }
});

gc_gpcdn_video.ready(function () {
    this.src({
        src: "https://videocdn.gpcdn.net/1a082fad-0e02-4964-8123-2a87ad91ff2c/playlist.m3u8",
        type: "application/x-mpegURL",
        withCredentials: false
    });
});


videojs.Vhs.xhr = _.wrap(videojs.xhr, function(fn, options, callback) {
    var wrapped_callback = _.wrap(callback, function(cb_fn, error, response) {
        var args = _.rest(arguments, 1);
        var report = response;
        data.payload.player_data = report;
        document.querySelector("#console").innerHTML =  JSON.stringify(report, null, 2);
        var res = cb_fn.apply(this, args);
        return res;
    });

return fn.apply(this, [options, wrapped_callback]);
});


// gpcdn

axios.get("https://spnkvwlhdc.gpcdn.net/1a082fad-0e02-4964-8123-2a87ad91ff2c/playlist.m3u8").then((res)=>{
    var report = {
        url : res.config.url,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers.toJSON(),
        requestHeaders : res.config.headers.toJSON(),
    }

    data.payload.gpcdn_video = report;
    document.querySelector("#gpcdn_http_report_hls").innerHTML = JSON.stringify(report, null, 2)
})
.catch((err)=>{
    var report = {
        url : err.config.url,
        status: err.status,
        statusText: err.statusText,
        message: err.message,
        axiosError : err.toJSON(),
    }
    data.payload.gpcdn_video = report;
    document.querySelector("#gpcdn_http_report_hls").innerHTML = JSON.stringify(report, null, 2)
 }).finally(()=>{ console.log("Finally") })


//  gotipath.com cdn
 axios.get("https://videocdn.gotipath.com/1a082fad-0e02-4964-8123-2a87ad91ff2c/playlist.m3u8").then((res)=>{
    var report = {
        url : res.config.url,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers.toJSON(),
        requestHeaders : res.config.headers.toJSON(),
    }
    //response header
    data.payload.gotipath_video = report;
    document.querySelector("#gotipath_http_report_hls").innerHTML = JSON.stringify(report, null, 2)
})
.catch((err)=>{
    var report = {
        url : err.config.url,
        status: err.status,
        statusText: err.statusText,
        message: err.message,
        axiosError : err.toJSON(),
    }
    data.payload.gotipath_video = report;
    document.querySelector("#gotipath_http_report_hls").innerHTML = JSON.stringify(report, null, 2)
 }).finally(()=>{ console.log("Finally") })


 //  gc_gotipath_video
 axios.get("https://gcvideo.gotipath.com/1a082fad-0e02-4964-8123-2a87ad91ff2c/playlist.m3u8").then((res)=>{
    var report = {
        url : res.config.url,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers.toJSON(),
        requestHeaders : res.config.headers.toJSON(),
    }
    //response header
    data.payload.gc_gotipath_video = report;
    document.querySelector("#gc_gotipath_http_report_hls").innerHTML = JSON.stringify(report, null, 2)
})
.catch((err)=>{
    var report = {
        url : err.config.url,
        status: err.status,
        statusText: err.statusText,
        message: err.message,
        axiosError : err.toJSON(),
    }
    data.payload.gc_gotipath_video = report;
    document.querySelector("#gc_gotipath_http_report_hls").innerHTML = JSON.stringify(report, null, 2)
 }).finally(()=>{ console.log("Finally") })



  //  gc_gpcdn_http_report_hls
  axios.get("https://videocdn.gpcdn.net/1a082fad-0e02-4964-8123-2a87ad91ff2c/playlist.m3u8").then((res)=>{
    var report = {
        url : res.config.url,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers.toJSON(),
        requestHeaders : res.config.headers.toJSON(),
    }
    //response header
    data.payload.gc_gpcdn_video = report;
    document.querySelector("#gc_gpcdn_http_report_hls").innerHTML = JSON.stringify(report, null, 2)
})
.catch((err)=>{
    var report = {
        url : err.config.url,
        status: err.status,
        statusText: err.statusText,
        message: err.message,
        axiosError : err.toJSON(),
    }
    data.payload.gc_gpcdn_video = report;
    document.querySelector("#gc_gpcdn_http_report_hls").innerHTML = JSON.stringify(report, null, 2)
 }).finally(()=>{ console.log("Finally") })


// first, find all the div.code blocks
document.querySelectorAll('div.code').forEach(el => {
    // then highlight each
    hljs.highlightElement(el);
});

function UserInfo(params) {
    const deviceDetector = new DeviceDetector();
    const userAgent = window.navigator.userAgent;
    const device = deviceDetector.parse(userAgent);
    var report = {
        device : device,
        ip : null
    };

    axios.get("https://ipinfo.nusratech.com").then((res)=>{
        document.querySelector("#user_ipinfo").innerHTML = JSON.stringify(res.data, null, 2)
        data.payload.client_info.ipinfo = res.data;
    }).catch((err)=>{
        console.log(err);
        document.querySelector("#error").innerHTML = JSON.stringify(err, null, 2)
    }).finally(()=>{ console.log("ip") })
    data.payload.client_info.device = device;
    document.querySelector("#user_info").innerHTML = JSON.stringify(report, null, 2)
}
UserInfo();

// https://monitoring.gotipath.com/cdn/insights
function createReport(){
    axios.post("https://monitoring.gotipath.com/cdn/insights", data).then((res)=>{
        console.log(res);
    }).catch((err)=>{})
}


/* ----------------------------------------
// call finguard() in your app // output will be something like this -->  "0821orak0821539ds999.6933.0.76"
 ---------------------------------------- */
function finguard() {
    function r(r, e) {
        return (e + 9845 + window.screen.width + r + window.screen.width).split("").reverse().join("")
    }
    var e = {};
    (o = (a = navigator.userAgent.toLowerCase()).match(/msie ([\d.]+)/)) ? e.ie = o[1]: (o = a.match(/firefox\/([\d.]+)/)) ? e.firefox = o[1] : (o = a.match(/chrome\/([\d.]+)/)) ? e.chrome = o[1] : (o = a.match(/opera.([\d.]+)/)) ? e.opera = o[1] : (o = a.match(/version\/([\d.]+).*safari/)) && (e.safari = o[1]);
    var a, o;
    e = {};
    return (o = (a = navigator.userAgent.toLowerCase()).match(/msie ([\d.]+)/)) ? e.ie = o[1] : (o = a.match(/firefox\/([\d.]+)/)) ? e.firefox = o[1] : (o = a.match(/chrome\/([\d.]+)/)) ? e.chrome = o[1] : (o = a.match(/opera.([\d.]+)/)) ? e.opera = o[1] : (o = a.match(/version\/([\d.]+).*safari/)) && (e.safari = o[1]), e.ie ? r("itne", e.ie) : e.firefox ? r("fyfo", e.firefox) : e.chrome ? r("karo", e.chrome) : e.opera ? r("orpr", e.opera) : e.safari ? r("sfri", e.safari) : "zefo43.454.43"
}
const c = window.navigator.connection;
console.log(c);

function NewWorkingInfo(params) {
    if (window.navigator && window.navigator.connection){
        const c = window.navigator.connection;
        var report = {
            type : c.type,
            effectiveType : c.effectiveType,
            downlink : c.downlink,
            downlinkMax : c.downlinkMax,
            rtt : c.rtt,
            saveData : c.saveData,
        }
        data.payload.networking = report;

    }
}

NewWorkingInfo()

window.addEventListener("load", (event) => {
    let timeOut = setTimeout(function() {
        createReport()
    }, 1000 * 2);

});

getInfoInfo();

function getInfoInfo() {
    axios.get("https://ipinfo.nusratech.com").then((res)=>{
       document.querySelector("#ip").innerHTML= res.data.ip;
    }).catch((err)=>{
        document.querySelector("#error").innerHTML = JSON.stringify(err, null, 2)
    }).finally(()=>{ console.log("ip") })
}
