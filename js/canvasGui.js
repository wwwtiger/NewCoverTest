
////////////////////////////////////////////////////////////////////////////////////////
function getCtrlByPos(ctrlList, x, y)
{
	for(var j=ctrlList.length-1; j>=0; j--)
	{
		var ctrl = ctrlList[j];
		if(ctrl.round==1) 
		{
			var dist = (x - ctrl.cx) * (x - ctrl.cx) + (y - ctrl.cy) * (y - ctrl.cy);
			if(dist < ctrl.r * ctrl.r)
				return ctrl;
		}  
		else if( x>ctrl.x && x<(ctrl.x + ctrl.w) && y>ctrl.y && y<(ctrl.y + ctrl.h) )
			return ctrl;
	}
	return null;
}



function CanvasWindow()
{
	this.bkCanvas = null;
	this.canvas = null;
	this.ctrlList = [];
	//this.x_s = 1;
	//this.y_s = 1;
	
	this.setBkGrid = function(startX, startY, gridW, gridH, row, col, lineWidth, lineColor)
	{
		var ctx = this.bkCanvas.getContext('2d'); 
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = lineWidth;
		
		ctx.beginPath();
		for(var i = row; i>=0; i--) //Horizontal
		{
			ctx.moveTo(startX, startY + gridH * i);
			ctx.lineTo(startX + gridW * col, startY + gridH * i);
		}
		for(var j = col; j>=0; j--) //Vertical
		{
			ctx.moveTo(startX + gridW * j, startY);
			ctx.lineTo(startX + gridW * j, startY + gridH * row);
		}
		ctx.stroke();
		
		for(var j = col; j>=0; j--) //Vertical
		{
			ctx.font = "bold 20px Arial";
			ctx.fillStyle = "black";
			ctx.fillText(j, startX + gridW * j, startY + gridH * row + 20);
		}
	}
	
	this.setBkImg = function(imgObj, x, y, w, h)
	{
		var context = this.bkCanvas.getContext('2d'); 
		//context.drawImage(images[imgId], 0, 0, this.bkCanvas.width, this.bkCanvas.height);
		context.drawImage(imgObj, x, y, w, h);
	}
	
	this.getCtx = function()
	{
		if(this.canvas == null)
			return null;
			
		var context = this.canvas.getContext('2d'); 
		return context;
	}
	
	this.initial = function(x, y, w, h){
		//Background
		this.bkCanvas = document.createElement('canvas');  
		this.bkCanvas.style.position = "absolute"; 
		this.bkCanvas.setAttribute("width",w);
		this.bkCanvas.setAttribute("height",h);
		//this.bkCanvas.style.width = window.innerWidth + 'px';
		//this.bkCanvas.style.height = window.innerHeight + 'px';
		
		//Real canvas
		this.canvas = document.createElement('canvas');  
		this.canvas.style.position = "absolute"; 
		this.canvas.setAttribute("width",w);
		this.canvas.setAttribute("height",h);
		//this.canvas.style.width = window.innerWidth + 'px';
		//this.canvas.style.height = window.innerHeight + 'px';
		
		
		var context = this.bkCanvas.getContext('2d'); 
		context.globalAlpha = 0.6;
		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		context.globalAlpha = 1;
		
		//Add mouse and touch event here
		this.addEvent(this);
	};	
		
	this.show = function()
	{
		document.body.appendChild(this.bkCanvas);
		document.body.appendChild(this.canvas);
		setCanvasStyleSize();
		
		//document.body.appendChild(this.input);
		this.visible = 1;
		this.drawCtrl(1);
		
		var self = this;
		loopFunc.unshift(function(){self.drawCtrl(0);});
	};
	
	this.close = function()
	{
		loopFunc.shift();
		this.removeEvent();
		document.body.removeChild(this.bkCanvas);
		document.body.removeChild(this.canvas);
		//document.body.removeChild(this.input);
		
		for(index in this.ctrlList)
		{
			var ctrl = this.ctrlList[index];
			ctrl.close();
			ctrl = null;
		}
			
		this.visible = 0;
		this.canvas = null;
		this.bkCanvas = null;
	};
	
	this.drawCtrl = function(flag) //Flag 0:draw animate ctrl only, 1: draw all(at first time)
	{
		if(this.canvas == null)
			return 0;
			
		var start = new Date().getTime();
			
		var context = this.canvas.getContext('2d'); 
		
		for(index in this.ctrlList)
		{
			var ctrl = this.ctrlList[index];
			if(ctrl.animate || flag)
			{
				//ctrl.clear(context);
				ctrl.show(context);
			}
		}
	
		//if(this.visible)
		//{
			//var self=this;
			//setTimeout(function(){self.drawCtrl(0);},15);
		//}
		
		var loopUse = new Date().getTime() - start;
		return loopUse;
	}
	
	this.addCtrl = function(c)
	{
		c.parentWindow = this;
		this.ctrlList.push(c);
		
		//if(this.canvas == null)
		//	return;
			
		//var context = this.canvas.getContext('2d'); 
		//context.drawImage(images[c.imgId],c.x, c.y, c.w, c.h);
		
		//context.font = "bold 25px Arial";
		//context.fillStyle = "black";
		//context.fillText(c.text, c.x + 10, c.y + 30);
	};
	
	this.processMouseDown = function(cx, cy)
	{
		var ctrl = getCtrlByPos(this.ctrlList, cx*x_s, cy*y_s);
		if(ctrl != null)
			ctrl.processMouseDown(cx*x_s, cy*y_s);
	};
	
	this.processMouseMove = function(cx, cy)
	{
		var ctrl = getCtrlByPos(this.ctrlList, cx*x_s, cy*y_s);
		if(ctrl != null && ctrl.processMouseMove != null)
			ctrl.processMouseMove(cx*x_s, cy*y_s);
	};
	
	this.processMouseUp = function(cx, cy)
	{
		var ctrl = getCtrlByPos(this.ctrlList, cx*x_s, cy*y_s);
		if(ctrl != null)
			ctrl.processMouseUp(cx*x_s, cy*y_s);
	};
	
	this.processTouchstart = function(cx, cy)
	{
		var ctrl = getCtrlByPos(this.ctrlList, cx*x_s, cy*y_s);
		if(ctrl != null)
			ctrl.processTouchstart(cx*x_s, cy*y_s);
	};
	
	this.processTouchmove = function(cx, cy)
	{
		var ctrl = getCtrlByPos(this.ctrlList, cx*x_s, cy*y_s);
		if(ctrl != null && ctrl.processTouchmove != null)
			ctrl.processTouchmove(cx*x_s, cy*y_s);
	};
	
	this.processTouchend = function(cx, cy)
	{
		var ctrl = getCtrlByPos(this.ctrlList, cx*x_s, cy*y_s);
		if(ctrl != null)
			ctrl.processTouchend(cx*x_s, cy*y_s);
	};
	
	this.removeEvent = function()
	{
		this.canvas.onmousedown = null;
		this.canvas.onmouseup = null;
		this.canvas.ontouchstart = null;
		this.canvas.ontouchend = null;
	};
	
	this.addEvent = function(callBack)
	{
		this.canvas.onmousedown = function(ev){ 
			var offsets = findPos(this);
			var cx = ev.pageX - offsets.left;
			var cy = ev.pageY - offsets.top;
			
			callBack.processMouseDown(cx, cy);
			
		};
		
		this.canvas.onmousemove = function(ev){ 
			var offsets = findPos(this);
			var cx = ev.pageX - offsets.left;
			var cy = ev.pageY - offsets.top;
			
			callBack.processMouseMove(cx, cy);
			
		};
		
		this.canvas.onmouseup = function(ev){ 
			var offsets = findPos(this);
			var cx = ev.pageX - offsets.left;
			var cy = ev.pageY - offsets.top;
			
			callBack.processMouseUp(cx, cy);
			
		};
		
		this.canvas.ontouchstart = function(ev){
			ev.preventDefault();
			
			var offsets = findPos(this);
			var cx = ev.targetTouches[0].pageX - offsets.left;
    			var cy = ev.targetTouches[0].pageY - offsets.top;
			callBack.processTouchstart(cx, cy);
		};
		
		this.canvas.ontouchmove = function(ev){
			ev.preventDefault();
			
			var offsets = findPos(this);
			var cx = ev.targetTouches[0].pageX - offsets.left;
    			var cy = ev.targetTouches[0].pageY - offsets.top;
			callBack.processTouchmove(cx, cy);
		};
		
		this.canvas.ontouchend = function(ev){
			ev.preventDefault();
			
			var offsets = findPos(this);
			var cx = ev.changedTouches[0].pageX - offsets.left;
    			var cy = ev.changedTouches[0].pageY - offsets.top;
			callBack.processTouchend(cx, cy);
		};
	}
}

function CanvasLabel(imgId, x, y, w, h, text, fontSize, fontName, fontColor)
{
	this.imgId = imgId;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.text = text;
	this.fontSize = fontSize;
	this.fontName = fontName;
	this.animate = 0;
	this.fontColor = fontColor;
	this.round = 0;
	
	this.show = function(targetCtx)
	{
		//targetCtx.drawImage(images[this.imgId],this.x, this.y, this.w, this.h);
		
		targetCtx.font = "bold " + this.fontSize + "px " + this.fontName;
		targetCtx.fillStyle = fontColor;
		targetCtx.fillText(this.text, this.x + 10, this.y + 30);
	};
	
	this.close = function(){
	};
	
	this.processMouseDown = function(x, y){
	};
	this.processMouseUp = function(x, y){
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}

function CanvasRoundButton(imgId, cx, cy, r, text, fontSize, fontName)
{
	this.imgId = imgId;
	this.cx = cx;
	this.cy = cy;
	this.r = r;
	
	this.text = text;
	this.fontSize = fontSize;
	this.fontName = fontName;
	this.animate = 1;
	this.down = 0;
	this.round = 1;
	
	this.show = function(targetCtx)
	{
		targetCtx.save();
		
		// Create a shape, of some sort
		targetCtx.beginPath();
		targetCtx.arc(this.cx, this.cy, this.r, 0, 2*Math.PI);
		targetCtx.closePath();
		
		// Clip to the current path
		targetCtx.clip();
		
		targetCtx.drawImage(images[this.imgId], this.cx - this.r, this.cy - this.r, 2*this.r, 2*this.r);
		
		targetCtx.globalAlpha = 0.5;
		targetCtx.fillStyle = 'black';
		if(this.down)
		{
			targetCtx.fillRect(this.cx - this.r, this.cy - this.r, 2*this.r, 2*this.r);
			//targetCtx.fill();
		}
		
		// Undo the clipping
		targetCtx.restore();
	};
	
	this.close = function(){
	};
	
	this.processMouseDown = function(x, y){
		this.down = 1;
	};
	this.processMouseUp = function(x, y){
		if(this.down == 0)
			return;
		this.down = 0;
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}


function CanvasButton(img, x, y, w, h, text, fontSize, fontName)
{
	this.img = img;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.text = text;
	this.fontSize = fontSize;
	this.fontName = fontName;
	this.animate = 1;
	this.down = 0;
	this.round = 0;
	
	this.show = function(targetCtx)
	{
		targetCtx.clearRect(this.x, this.y, this.w + 5, this.h + 5);
		
		var cx = this.x;
		var cy = this.y;
		if(this.down)
		{
			cx += 5;
			cy += 5;
		}
		targetCtx.drawImage(this.img, cx, cy, this.w, this.h);
		
		targetCtx.font = "bold 25px Arial";
		targetCtx.fillStyle = "black";
		targetCtx.fillText(this.text, cx + 10, cy + 30);
	};
	
	this.close = function(){
	};
	
	this.processMouseDown = function(x, y){
		this.down = 1;
	};
	this.processMouseUp = function(x, y){
		if(this.down == 0)
			return;
		this.down = 0;
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}

function CanvasCheckBox(imgId, checkImgId, checked, x, y, w, h, text, fontSize, fontName)
{
	this.imgId = imgId;
	this.checkImgId = checkImgId;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.text = text;
	this.fontSize = fontSize;
	this.fontName = fontName;
	this.animate = 1;
	this.checked = checked;
	this.down = 0;
	this.round = 0;
	
	this.show = function(targetCtx)
	{
		targetCtx.clearRect(this.x, this.y, this.w + 5, this.h + 5);
		
		var cx = this.x;
		var cy = this.y;
		if(this.down)
		{
			cx += 5;
			cy += 5;
		}
		
		targetCtx.drawImage(images[this.imgId],cx, cy, this.w, this.h);
		if(this.checked)
			targetCtx.drawImage(images[this.checkImgId],cx, cy, this.w, this.h);
		targetCtx.font = "bold 25px Arial";
		targetCtx.fillStyle = "black";
		targetCtx.fillText(this.text, cx + 10, cy + 30);
	};
	
	this.clear = function(targetCtx)
	{
		targetCtx.clearRect(this.x, this.y, this.w, this.h);
	};
	
	this.close = function(){
	};
	
	this.processMouseDown = function(x, y){
		this.down = 1;
	};
	this.processMouseUp = function(x, y){
		if(this.down == 0)
			return;
			
		this.down = 0;
		this.checked = !this.checked;
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}

/*
var optionArray = [ 
			{id:0, text:'option1', imgId:'102'},
			{id:1, text:'option2', imgId:'102'},
			{id:2, text:'option3', imgId:'102'},
		];
*/

var optionArray = [ 
			{id:0, text:'normal', 	imgId:'701'},
			{id:1, text:'cone', 	imgId:'702'},
			{id:2, text:'bucket', 	imgId:'703'},
			{id:3, text:'newspaper', imgId:'704'},
			{id:4, text:'jump', 	imgId:'705'},
		];

//Vertical option buttions				
function CanvasOptionButton(x, y, w, h, fontSize, fontName, optionArray, currentOptionId, selectImgId)
{
	this.currentOptionId = currentOptionId;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.optionArray = optionArray;
	this.fontSize = fontSize;
	this.fontName = fontName;
	this.selectImgId = selectImgId;
	this.animate = 1;
	this.round = 0;
	
	this.show = function(targetCtx)
	{
		this.clear(targetCtx);
		targetCtx.font = "bold 25px Arial";
		targetCtx.fillStyle = "black";
		
		var h = this.h / this.optionArray.length;
		var count = 0;
		for(index in this.optionArray)
		{
			var option = optionArray[index];
			targetCtx.drawImage(images[option.imgId],this.x, this.y + h*count, this.w, h);
			targetCtx.fillText(option.text, this.x + 10, this.y + h*count + h);
			
			if(this.currentOptionId == option.id)
				targetCtx.drawImage(images[selectImgId], this.x + this.w, this.y + h*count, this.w, h);
				
			count++;
		}
	};
	
	this.clear = function(targetCtx)
	{
		targetCtx.clearRect(this.x, this.y, this.w * 2, this.h);
	};
	
	this.close = function(){
	};
	
	this.processMouseDown = function(x, y){
		var h = this.h / this.optionArray.length;
		var index = parseInt((y - this.y)  / h);
		
		var selectId = 0;
		if(index > 0 && index < this.optionArray.length)
			selectId = this.optionArray[index].id;
			
		//alert(y + ", " + h + ", " +  this.y + ", " + optionId);
		if(this.currentOptionId != selectId)
		{
			this.currentOptionId = selectId;
		}
	};
	this.processMouseUp = function(x, y){
	};
	
	this.processTouchstart = function(x, y)
	{
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y)
	{
		this.processMouseUp(x, y);
	};
}

function CanvasCtrlGroup(x, y, w, h)
{
	this.ctrlList = [];
	this.animate = 1;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.clearFlag = 0;
	this.round = 0;
	
	this.addCtrl = function(c)
	{
		c.parentWindow = this.parentWindow;
		this.ctrlList.push(c);
	};
	
	this.deleteCtrl = function(index)
	{
		var ctrl = this.ctrlList.splice(index, 1);
		this.clearFlag = 1;
	};
	
	this.deleteAllCtrl = function()
	{
		this.ctrlList = [];
		this.clearFlag = 1;
	};
	
	this.show = function(targetCtx)
	{
		if(this.clearFlag)
		{
			targetCtx.clearRect(x, y, w, h);
			this.clearFlag = 0;
		}
		for(index in this.ctrlList)
		{
			var ctrl = this.ctrlList[index];
			if(ctrl.animate)
				ctrl.show(targetCtx);
		}
	};
	
	this.close = function(){
		for(index in this.ctrlList)
		{
			var ctrl = this.ctrlList[index];
			ctrl.close();
			ctrl = null;
		}
	};
	
	this.processMouseDown = function(x, y){
	};
	this.processMouseUp = function(x, y){
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}

function AnimateCanvasButton(ctx, animate, x, y, w, h, text, fontSize, fontName)
{
	this.animatePlayer = new AnimatePlayer(ctx, x, y, animate, -1, null);
	this.animatePlayer.setSize(w, h);
	
	//this.imgId = imgId;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.text = text;
	this.fontSize = fontSize;
	this.fontName = fontName;
	this.animate = 1;
	this.round = 0;
	
	this.show = function(targetCtx)
	{
		this.animatePlayer.clear();
		this.animatePlayer.update();
		this.animatePlayer.show();
		
		//if(this.text.length > 0)
		//{
		//	targetCtx.font = "bold " + this.fontSize + "px " + this.fontName;
		//	targetCtx.fillStyle = "black";
		//	targetCtx.fillText(this.text, this.x, this.y + this.h);
		//}
	};
	
	this.close = function()
	{
		this.animatePlayer = null;
	};
	
	this.processMouseDown = function(x, y){
	};
	this.processMouseUp = function(x, y){
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}

function CanvasProgressBar(x, y, w, h, full, curr)
{
	//this.imgId = imgId;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.full = full;
	this.curr = curr;
	
	this.animate = 0;
	this.round = 0;
	
	this.show = function(targetCtx)
	{
		var border = PROGRESS_BORDER;
		targetCtx.fillStyle = "red";
		targetCtx.fillRect(this.x-border, this.y-border, this.w+2*border, this.h+2*border);
		targetCtx.fillStyle = "yellow";
		targetCtx.fillRect(this.x, this.y, ((this.full-this.curr)/this.full)*this.w, this.h);
	}
	
	this.close = function()	{
	};
	
	this.processMouseDown = function(x, y){
	};
	this.processMouseUp = function(x, y){
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}


//Horizontal option buttions
function CanvasOptionButton2(x, y, w, h, fontSize, fontName, optionArray, currentOptionId, selectImgId)
{
	this.currentOptionId = currentOptionId;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.optionArray = optionArray;
	this.fontSize = fontSize;
	this.fontName = fontName;
	this.selectImgId = selectImgId;
	this.animate = 1;
	this.round = 0;
	
	this.show = function(targetCtx)
	{
		var margin = HIGHLIGHT_MARGIN;
		this.clear(targetCtx);
		
		targetCtx.save();
		
		targetCtx.lineWidth = HIGHLIGHT_LINEWIDTH;
		targetCtx.lineCap = "round";
		targetCtx.lineJoin = "round";
		targetCtx.font = "bold " + this.fontSize + "px " + this.fontName;
		targetCtx.fillStyle = "red";
		targetCtx.strokeStyle = "red";
		
		var w = this.w / this.optionArray.length;
		var count = 0;
		for(index in this.optionArray)
		{
			var option = optionArray[index];
			targetCtx.drawImage(images[option.imgId],this.x + w*count, this.y, w, this.h);
			targetCtx.fillText(option.text, this.x + w*count + w - 30, this.y + this.h - 5);
			
			if(this.currentOptionId == count)
			{
				//targetCtx.drawImage(images[selectImgId], this.x + this.w, this.y + h*count, this.w, h);
				targetCtx.strokeRect(this.x + w*count + margin, this.y + margin, w - 2*margin, this.h - 2*margin);
			}
			count++;
		}
		
		targetCtx.restore();
	};
	
	/*
	this.highlight = function(targetCtx){
		var margin = HIGHLIGHT_MARGIN;
		targetCtx.save();
		targetCtx.strokeStyle = "red";
		targetCtx.lineWidth = HIGHLIGHT_LINEWIDTH;
		targetCtx.lineCap = "round";
		targetCtx.lineJoin = "round";
		targetCtx.strokeRect(this.x + margin, this.y + margin, this.w - 2*margin, this.h - 2*margin);
		targetCtx.restore();
	};
	*/
	
	this.clear = function(targetCtx)
	{
		targetCtx.clearRect(this.x, this.y, this.w * 2, this.h);
	};
	
	this.close = function(){
	};
	
	this.processMouseDown = function(x, y){
		var w = this.w / this.optionArray.length;
		var optionId = parseInt((x - this.x)  / w);
		//alert(x + ", " + w + ", " +  this.x + ", " + optionId);
		if(this.currentOptionId != optionId)
		{
			this.currentOptionId = optionId;
		}
	};
	this.processMouseUp = function(x, y){
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}

function CanvasNumberBtn(imgId, currV, minV, maxV, step, x, y, w, h)
{
	this.imgId = imgId;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.currV = currV;
	this.minV = minV;
	this.maxV = maxV;
	this.step = step;
	
	this.animate = 1;
	this.addFlag = 0;
	this.offsetX = this.h / 2;
	this.round = 0;
	
	this.show = function(targetCtx)
	{         
		targetCtx.save();
		targetCtx.strokeStyle = "black"; 
		targetCtx.fillStyle = "red";
		targetCtx.fillRect(this.x, this.y, this.w, this.h);
		//targetCtx.drawImage(images[this.imgId],this.x, this.y, this.w - this.offsetX, this.h);
		targetCtx.drawImage(images[this.imgId],this.x, this.y, this.w, this.h);
		
		
		var centerX = this.x + this.w - this.h / 4;
		var centerY = this.y + this.h / 4;
		var radius = this.h / 4;
		var startingAngle = 0; //1.1 * Math.PI;
		var endingAngle = 2 * Math.PI;
		var counterclockwise = false;
		targetCtx.beginPath();
		targetCtx.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise); 
		var radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius); //X0, Y0, R0, X1, Y1, R1的两个圆，渐变在两个
		radialGradient.addColorStop(0, 'red');
		radialGradient.addColorStop(0.8, 'white');
		radialGradient.addColorStop(1, 'brown');
		targetCtx.fillStyle = radialGradient;
		targetCtx.fill();
		
		targetCtx.beginPath();
		centerY = this.y + this.h / 4 * 3;
		targetCtx.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise); 
		radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius); //X0, Y0, R0, X1, Y1, R1的两个圆，渐变在两个
		radialGradient.addColorStop(0, 'green');
		radialGradient.addColorStop(0.8, 'white');
		radialGradient.addColorStop(1, 'brown');
		targetCtx.fillStyle = radialGradient;
		targetCtx.fill();
		
		targetCtx.beginPath();
		targetCtx.strokeStyle = "brown"; 
		targetCtx.lineWidth = 5;
		targetCtx.moveTo(this.x + this.w - this.offsetX / 2, this.y);
		targetCtx.lineTo(this.x + this.w - this.offsetX / 2, this.y + this.h / 2);
		targetCtx.moveTo(this.x + this.w - this.offsetX, this.y + this.h / 4);
		targetCtx.lineTo(this.x + this.w, this.y + this.h / 4);
		targetCtx.moveTo(this.x + this.w - this.offsetX, this.y + this.h / 4 * 3);
		targetCtx.lineTo(this.x + this.w, this.y + this.h / 4 * 3);
		targetCtx.closePath();
		targetCtx.stroke();
		
		
		targetCtx.font = "bold 25px Arial";
		targetCtx.fillStyle = "black";
		targetCtx.fillText(this.currV, this.x + 10,  this.y + 30);
		targetCtx.restore();
	};
	
	this.close = function(){
	};
	
	this.processMouseDown = function(x, y){
		this.down = 1;
		
		if(x > (this.x + this.w - this.offsetX))
		{
			if(y > this.y + this.h / 2)
				this.addFlag = -1;
			else
				this.addFlag = 1;
		}
	};
	this.processMouseUp = function(x, y){
		if(this.down == 0)
			return;
		this.down = 0;
		
		var value = this.currV;
		if(this.addFlag == 1)
			value += this.step;
		else if(this.addFlag == -1)
			value -= this.step;
		
		this.addFlag = 0;	
		if(value > maxV || value < minV)
			return;
		else
			this.currV = value;
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}

function CanvasRoundCheckButton(imgId, checkedImgId, unCheckedImgId, checkFlag, cx, cy, r, text, fontSize, fontName)
{
	this.imgId = imgId;
	this.checkedImgId = checkedImgId;
	this.unCheckedImgId = unCheckedImgId;
	this.cx = cx;
	this.cy = cy;
	this.r = r;
	
	this.text = text;
	this.fontSize = fontSize;
	this.fontName = fontName;
	this.animate = 1;
	this.down = 0;
	this.round = 1;
	this.checked = checkFlag;
	
	this.show = function(targetCtx)
	{
		targetCtx.save();
		
		// Create a shape, of some sort
		targetCtx.beginPath();
		targetCtx.arc(this.cx, this.cy, this.r, 0, 2*Math.PI);
		targetCtx.closePath();
		
		// Clip to the current path
		targetCtx.clip();
		
		if(this.down)
			targetCtx.globalAlpha = 0.5;
		else
			targetCtx.globalAlpha = 1;
		//targetCtx.fillStyle = 'black';
		
		targetCtx.drawImage(images[this.imgId], this.cx - this.r, this.cy - this.r, 2*this.r, 2*this.r);
		if(this.checked)
			targetCtx.drawImage(images[this.checkedImgId], this.cx - this.r, this.cy - this.r, 2*this.r, 2*this.r);
		else
			targetCtx.drawImage(images[this.unCheckedImgId], this.cx - this.r, this.cy - this.r, 2*this.r, 2*this.r);
		
		// Undo the clipping
		targetCtx.restore();
	};
	
	this.close = function(){
	};
	
	this.processMouseDown = function(x, y){
		this.down = 1;
	};
	this.processMouseUp = function(x, y){
		if(this.down == 0)
			return;
		this.down = 0;
		this.checked = !this.checked;
	};
	this.processTouchstart = function(x, y){
		this.processMouseDown(x, y);
	};
	this.processTouchend = function(x, y){
		this.processMouseUp(x, y);
	};
}

/*listData = [	
		{col0:'a', col1:'b', col2:'c',}, //Caption
		{col0:'a', col1:'b', col2:'c',}, //Data
		];
*/
function CanvasListView(x, y, gridW, gridH, row, col, currentRow, listData, fontSize, fontName)
{
	this.x = x;
	this.y = y;
	this.gridW = gridW;
	this.gridH = gridH;
	this.row = row;
	this.col = col;
	
	this.w = (this.gridW +1) *  (this.col + 1);
	this.h = (this.gridH +1) * (this.row + 1);
	
	this.currentRow = currentRow;
	this.mouseRow = 0;
	
	this.listData = listData;
	this.animate = 1;
	
	this.fontSize = fontSize;
	this.fontName = fontName;
	
	this.setBkGrid = function(ctx, startX, startY, gridW, gridH, row, col, lineWidth, lineColor)
	{
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = lineWidth;
		
		ctx.beginPath();
		for(var i = row; i>=0; i--) //Horizontal
		{
			ctx.moveTo(startX, startY + gridH * i);
			ctx.lineTo(startX + gridW * col, startY + gridH * i);
		}
		for(var j = col; j>=0; j--) //Vertical
		{
			ctx.moveTo(startX + gridW * j, startY);
			ctx.lineTo(startX + gridW * j, startY + gridH * row);
		}
		ctx.stroke();
	}
	
	this.removeRows = function()
	{
		this.listData = [];
		//newList.push(listData[0]);
		//this.listData = newList;
		
		//this.row = 0;
		//this.h = (this.gridH +1) * (this.row + 1);
		
		this.currentRow = 0;
		this.mouseRow = 0;
	};
	
	this.addRow = function(item)
	{
		this.listData.push(item);
		//this.row += 1;
		//this.h = (this.gridH +1) * (this.row + 1);
	};
	
	this.show = function(targetCtx)
	{
		this.clear(targetCtx);
		this.setBkGrid(targetCtx, this.x, this.y, this.gridW, this.gridH, this.row + 1, this.col, 3, 'black');
		if(this.listData.length == 0)
			return;
			
		targetCtx.save();
		
		targetCtx.lineWidth = HIGHLIGHT_LINEWIDTH;
		targetCtx.lineCap = "round";
		targetCtx.lineJoin = "round";
		targetCtx.font = "bold " + this.fontSize + "px " + this.fontName;
		targetCtx.fillStyle = "grey";
		targetCtx.strokeStyle = "red";
		
		var pList = [];
		for(temp in this.listData[0])
		{
			pList.push(temp);
		}
		
		var count = 0;
		for(var i=0; i<=this.listData.length; i++)
		{
			//if(i > this.row)
			//	break;
				
			var item = null;
			if(i>0)
				item = this.listData[i-1];
				
			var oy = this.y + (gridH + 1) * i;
			
			for(var j=0; j<col; j++)
			{
				if(j > this.col)
					break;
					
				var ox = this.x + (gridW + 1) * j;
				
				if(i == 0)
					targetCtx.fillStyle = "yellow";
				else
				{
					targetCtx.fillStyle = "grey";
					if(this.mouseRow == i-1)
						targetCtx.fillStyle = "white";
				}
					
				targetCtx.fillRect(ox, oy, gridW, gridH);
				
				targetCtx.fillStyle = "black";
				
				if(i == 0)
					targetCtx.fillText(pList[j], ox, oy + gridH);
				else
					targetCtx.fillText(item[pList[j]], ox, oy + gridH);
			}
			
			if(this.currentRow == i-1)
				targetCtx.drawImage(images[43], this.x + this.col * this.gridW, this.y + i * this.gridH + 10, 20, 20);
		}
		
		targetCtx.restore();
		
	};
	
	this.clear = function(targetCtx)
	{
		//var w = (this.gridW + 1) * this.col;
		//var h = (this.gridH + 1) * this.row;
		targetCtx.clearRect(this.x, this.y, this.w, this.h);
	};
	
	this.close = function(){

	};
	
	this.processMouseDown = function(x, y){
		var selectRow = parseInt((y - this.y)  / (this.gridH + 1)) - 1;
		
		if(selectRow >=0 && (this.currentRow != selectRow))
		{
			this.currentRow = selectRow;
		}
	};
	
	this.processMouseMove = function(x, y){
		var selectRow = parseInt((y - this.y)  / (this.gridH + 1)) - 1;
		
		if(selectRow >=0 && (this.mouseRow != selectRow))
		{
			this.mouseRow = selectRow;
		}
	};
	this.processMouseUp = function(x, y){
	};
	this.processTouchstart = function(x, y){
	};
	this.processTouchend = function(x, y){
	};
}

function CanvasInput(x, y, w, h, value)
{
	this.animate = 1;
	this.round = 0;
	this.value = value;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	this.input = null;
	
	this.show = function(targetCtx)
	{
		if(this.input == null)
		{
			this.input = document.createElement('input');  
				
			this.input.style.position = "absolute"; 
			this.input.style.left = this.x / x_s;
			this.input.style.top = this.y / y_s;
			this.input.style.width = this.w / x_s;
			this.input.style.height = this.h / y_s;
			//this.input.setAttribute("type","number");
			//this.input.setAttribute("min","1");
			//this.input.setAttribute("max","10"); 
			document.body.appendChild(this.input);
			
			this.input.value = this.value;
		}
		else
		{
			this.input.style.left = this.x / x_s;
			this.input.style.top = this.y / y_s;
			this.input.style.width = this.w / x_s;
			this.input.style.height = this.h / y_s;
		}
		
	};
	this.close = function(){
		if(this.input != null)
			document.body.removeChild(this.input);
	};
	
	this.setValue = function(value){
		this.value = value;
		if(this.input != null)
			this.input.value = value;
	};
	
	this.getValue = function(){
		if(this.input != null)
			this.value = this.input.value;
		return this.value;
	};
	
	this.processMouseDown = function(x, y){
	};
	this.processMouseUp = function(x, y){
	};
	this.processTouchstart = function(x, y){
	};
	this.processTouchend = function(x, y){
	};
}