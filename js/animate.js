
function PngAnimate(img, count, interval, offsetX, offsetY)
{
	this.img = img;
	this.frameCount = count;
	this.interval = interval;
	
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	
	this.frameWidth = quickRound((this.img.width / count - this.offsetX));
	this.frameHeight = quickRound((this.img.height - this.offsetY) ) ;
		
	this.canvas = null;
	
	this.initial = function()
	{
		if(arguments.length == 0)
		{
			this.canvas = document.createElement('canvas');  
			this.canvas.width = this.frameWidth * this.frameCount; 
			this.canvas.height = this.frameHeight; 
			var context = this.canvas.getContext('2d'); 
			
			for(var i=0; i<this.frameCount; i++)
			{
				var sx = i * this.img.width / this.frameCount + this.offsetX;
				var dx = i * this.frameWidth;
				context.drawImage(this.img, sx, offsetY, this.frameWidth, this.frameHeight, dx, 0, this.frameWidth, this.frameHeight);
			}
		}
		else if(arguments.length == 1) //Alpha
		{
			this.canvas = document.createElement('canvas');  
			this.canvas.width = this.frameWidth * this.frameCount; 
			this.canvas.height = this.frameHeight; 
			var context = this.canvas.getContext('2d'); 
			context.save();
			context.globalAlpha = arguments[0];
			context.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height);
			context.restore();
		}
		else if(arguments.length == 2)
		{
			this.canvas = document.createElement('canvas');  
			this.canvas.width = this.frameCount*BLOCK_W*2; //this.img.width / arguments[0]; 
			this.canvas.height = BLOCK_H * 2; //this.img.height / arguments[1];  
			this.frameWidth = BLOCK_W*2; //this.img.width / (this.frameCount*arguments[0]);
			this.frameHeight = BLOCK_H*2; //this.img.height / arguments[1];
			var context = this.canvas.getContext('2d'); 
			context.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height);
		}
	};
}


function PngAnimate2(animatePara)
{
	this.para = animatePara;
	this.canvas = null;
	
	//To fit AnimatePlayer
	this.frameCount = animatePara.frameCount;
	this.interval = animatePara.interval;
	
	this.offsetX = animatePara.offsetX;
	this.offsetY = animatePara.offsetY;
	
	this.frameWidth = animatePara.width;
	this.frameHeight = animatePara.height ;

	this.initial = function(list)
	{
		this.canvas = document.createElement('canvas');  
		this.canvas.width = this.para.width * this.para.frameCount; 
		this.canvas.height = this.para.height; 
		var context = this.canvas.getContext('2d'); 
		
		for(var i=0; i<this.para.frameCount; i++)
		{
			var dx = i * this.para.width;
			context.drawImage(list[this.para.imageIndexes[i]].obj, 0, 0, this.para.width, this.para.height, dx, 0, this.para.width, this.para.height);
		}
	};
}


function PngAnimate3(animatePara)
{
	this.para = animatePara;
	this.canvas = null;
	
	//To fit AnimatePlayer
	this.frameCount = animatePara.frameCount;
	this.interval = animatePara.interval;
	
	this.offsetX = animatePara.offsetX;
	this.offsetY = animatePara.offsetY;
	
	this.frameWidth = animatePara.width;
	this.frameHeight = animatePara.height ;

	this.initial = function(list)
	{
		this.canvas = document.createElement('canvas');  
		this.canvas.width = this.para.width * this.para.frameCount; 
		this.canvas.height = this.para.height; 
		var context = this.canvas.getContext('2d'); 
		
		for(var i=0; i<this.para.frameCount; i++)
		{
			var dx = i * this.para.width;
			//[{id:56, x:0, y:0},{id:57, x:0, y:0},],
			var framePara = this.para.frames[i];
			for(var j=0; j<framePara.length; j++)
			{
				context.save();
				var part = framePara[j];
				var matrix = part.matrix;
				if(part.matrix!=null)
					context.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
				if(part.alpha!=null)
					context.globalAlpha = part.alpha;
					
				context.drawImage(list[part.id].obj, dx+part.x, part.y);
				context.restore();
			}
		}
	};
}

function PngAnimate4(animatePara)
{
	this.para = animatePara;
	this.canvas = null;
	
	//To fit AnimatePlayer
	this.frameCount = animatePara.frameCount;
	this.interval = animatePara.interval;
	
	this.offsetX = animatePara.offsetX;
	this.offsetY = animatePara.offsetY;
	
	this.frameWidth = animatePara.width;
	this.frameHeight = animatePara.height ;

	this.initial = function(list)
	{
		this.canvas = document.createElement('canvas');  
		this.canvas.width = this.para.width * this.para.frameCount; 
		this.canvas.height = this.para.height; 
		var context = this.canvas.getContext('2d'); 
		
		for(var i=0; i<this.para.frameCount; i++)
		{
			var dx = i * this.para.width;
			//[{id:56, x:0, y:0},{id:57, x:0, y:0},],
			var framePara = this.para.frames[i];
			for(var j=0; j<framePara.length; j++)
			{
				//Create part canvas
				var partCanvas = document.createElement('canvas');
				partCanvas.width = this.para.width; 
				partCanvas.height = this.para.height; 
				var partCtx = partCanvas.getContext('2d'); 
				
				//Get matrix and alpha
				var part = framePara[j];
				var matrix = part.matrix;
				if(matrix!=null)
					partCtx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
				if(part.alpha!=null)
					partCtx.globalAlpha = part.alpha;
				partCtx.drawImage(list[part.id].obj, part.sx, part.sy, part.sw, part.sh, part.dx, part.dy, part.dw, part.dh);
					
				context.drawImage(partCanvas, dx, 0);
				
				partCtx = null;
				partCanvas = null;
			}
		}
	};
}


function AnimatePlayer(ctx, x, y, animate, loopCount, callback)
{
	this.liveCount = 1; //Delete flag
	this.targetCtx = ctx;
	this.x = x;
	this.y = y;
	this.w = animate.frameWidth;
	this.h = animate.frameHeight;
	this.animate = animate;
	this.switchCount = animate.interval;
	this.frameIndex = 0;
	this.loopCount = loopCount; //-1: loop infinite; 0: not play; 1: play once; >1 loop
	
	this.setCtx = function(ctx)
	{
		this.targetCtx = ctx;
	}
	
	this.setPos = function(x, y) //Change animate position
	{
		this.clear();
		this.x = x;
		this.y = y;
	};
	
	this.setSize = function(w, h) //Change animate size
	{
		this.clear();
		this.w = w;
		this.h = h;
	};
	
	this.setAnimate = function(animate, loopCount)
	{
		this.clear();
		this.w = animate.frameWidth;
		this.h = animate.frameHeight;
		this.animate = animate;
		this.switchCount = animate.interval;
		this.frameIndex = 0;
		this.loopCount = loopCount; //-1: loop infinite; 0: not play; 1: play once; >1 loop
	};
		
	this.manualSwitch = function(imgIndex) //Change animate frame index
	{
		this.frameIndex = imgIndex  % (this.animate.frameCount);
		this.switchCount = this.animate.interval;
	}
	
	this.update = function(){
		
		if(this.switchCount == 0)
		{
			this.frameIndex = (this.frameIndex + 1) % (this.animate.frameCount);
			this.switchCount = this.animate.interval; //Restore switch count
			
			if( this.frameIndex == (this.animate.frameCount - 1) ) 
			{
				if(this.loopCount > 0)
				{
					this.loopCount -= 1;
					this.frameIndex = 0;
				}
				else if(this.loopCount < 0)
					this.frameIndex = 0;
			}
		}
		else
			this.switchCount--;
			
		if(this.loopCount == 0)
		{
			this.liveCount = 0; //Delete flag
			if(callback != null)
				callback();
		}
	};
	
	
	this.show =  function(){
		var offsetX = this.animate.frameWidth * this.frameIndex;
		this.targetCtx.drawImage(this.animate.canvas, offsetX, 0, this.animate.frameWidth, this.animate.frameHeight, quickRound(this.x), quickRound(this.y), this.w, this.h);
	};
	
	this.clear =  function(){
		this.targetCtx.clearRect(quickRound(this.x), quickRound(this.y), this.w, this.h);
	};
}
