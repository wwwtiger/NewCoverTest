var Sys = {};
var SYS_MUTE = 0;

function playSound(sound, loop, volume)
{
	if(SYS_MUTE)
		return;
		
	try{
		sound.loop = loop;
		sound.volume = volume;
		
		try{
			sound.currentTime = 0;
		}catch(err){}
		
		sound.play();
	}
	catch(err){}
}
	
function checkBrowserType()
{
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        //以下进行测试
        //if (Sys.ie) alert('IE: ' + Sys.ie);
        //if (Sys.firefox) alert('Firefox: ' + Sys.firefox);
        //if (Sys.chrome) alert('Chrome: ' + Sys.chrome);
        //if (Sys.opera) alert('Opera: ' + Sys.opera);
        //if (Sys.safari) alert('Safari: ' + Sys.safari);
}

function getCurrentWindowSize()
{
	var winW = 0, winH = 0;
	if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	if (document.compatMode=='CSS1Compat' &&
		document.documentElement &&
		document.documentElement.offsetWidth ) {
		winW = document.documentElement.offsetWidth;
		winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
		winW = window.innerWidth;
		winH = window.innerHeight;
	}
	alert(winW + "," + winH);
}

 function quickRound(num)
 {
	// With a bitwise or.  
	var rounded = (0.5 + num) | 0;  
	// A double bitwise not.  
	rounded = ~~ (0.5 + num);  
	// Finally, a left bitwise shift.  
	rounded = (0.5 + num) << 0;  
	return rounded;
}
 
 
 function requestAnimationFrameSupport() {

    if (window.requestAnimationFrame)

        return true;

    else if (window.msRequestAnimationFrame)
    {
	window.requestAnimationFrame = window.msRequestAnimationFrame;
        return true;
    }

    else if (window.webkitRequestAnimationFrame)
    {
	window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        return true;
    }

    else if (window.mozRequestAnimationFrame)
    {
	window.requestAnimationFrame = window.mozRequestAnimationFrame;
        return true;
    }

    else if (window.oRequestAnimationFrame)
    {
	window.requestAnimationFrame = window.oRequestAnimationFrame;
        return true;
    }

    else 
	return false;
}

 
 
//检测2个物体是否碰撞
function CheckIntersect(object1, object2, overlap)
{
	//    x-轴                      x-轴
	//  A1------>B1 C1              A2------>B2 C2
	//  +--------+   ^              +--------+   ^
	//  | object1|   | y-轴         | object2|   | y-轴
	//  |        |   |              |        |   |
	//  +--------+  D1              +--------+  D2
	//
 	//overlap是重叠的区域值
	A1 = object1.x + overlap;
	B1 = object1.x + object1.image.width - overlap;
	C1 = object1.y + overlap;
	D1 = object1.y + object1.image.height - overlap;
 
	A2 = object2.x + overlap;
	B2 = object2.x + object2.image.width - overlap;
	C2 = object2.y + overlap;
	D2 = object2.y + object2.image.width - overlap;
 
	//假如他们在x-轴重叠
	if(A1 > A2 && A1 < B2
	   || B1 > A2 && B1 < B2)
	{
		//判断y-轴重叠
		if(C1 > C2 && C1 < D1
	   || D1 > C2 && D1 < D2)
		{
			//碰撞
			return true;
		}
 
	}
	return false;
}

function getDeviceScreen(){
	var screenW = window.screen.width;
	var screenH = window.screen.height;
	var availWidth = window.screen.availWidth;
	var availHeight = window.screen.availHeight;
	alert("Screen size is " + screenW + "*" + screenH + "\n" + "Usable screen size is " + availWidth + "*" + availHeight);
}

//FOR IE: PAGE - CUR = LayerXY 
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return {left:curleft,top:curtop};
}

exportTime = (function(){
  if (typeof window !== 'undefined'){
    // 浏览器
    if (typeof window.performance !== 'undefined' && typeof performance.now !== 'undefined'){
      // support hrt
	  //console.log("support hrt");
      return function(){
        return performance.now();
      };
    }else{
      //console.log("Not support hrt");
      return function(){
        return (new Date()).getTime();
      };
    }
  }else{
    // node.js
    return function(){
      var diff = process.hrtime();
      return (diff[0] * 1e9 + diff[1]) / 1e6; // nano second -> ms
    };
  }
})();
