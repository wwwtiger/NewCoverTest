//Hexagon map
//Create and draw hexagon map

function Hexagon()
{
	this.MAP_COLS = 10;
	this.MAP_ROWS = 10;
	
	this.HEXAGON_R = 30;

	this.H_INTERVAL = 1.5 * this.HEXAGON_R;
	this.V_INTERVAL = 1.732 * this.HEXAGON_R;

	this.HEXAGON_X0 = this.HEXAGON_R + 30;
	this.HEXAGON_Y0 = this.V_INTERVAL / 2 + 30;

	this.init = function(cols, rows, r)
	{
		this.MAP_COLS = cols;
		this.MAP_ROWS = rows;
		
		this.HEXAGON_R = r;

		this.H_INTERVAL = 1.5 * this.HEXAGON_R;
		this.V_INTERVAL = 1.732 * this.HEXAGON_R;

		this.HEXAGON_X0 = this.HEXAGON_R + 30;
		this.HEXAGON_Y0 = this.V_INTERVAL / 2 + 30;
	}
	
	this.getCenter = function(col, row)
	{
		var cx = this.HEXAGON_X0 + col * this.H_INTERVAL;
		var cy = this.HEXAGON_Y0 + row * this.V_INTERVAL;
		if(col % 2 != 0) //当坐标X为奇数时，Y多加一个b值
			cy = cy - this.V_INTERVAL / 2;
			
		return {'cx':cx, 'cy':cy};
	}

	this.getVertex = function(col, row)
	{
		var center = this.getCenter(col, row);
			
		var x0 = center.cx - this.HEXAGON_R / 2;
		var y0 = center.cy - 0.866 * this.HEXAGON_R;
		var x1 = center.cx + this.HEXAGON_R / 2;
		var y1 = y0;
		var x2 = center.cx + this.HEXAGON_R;
		var y2 = center.cy;
		var x3 = x1;
		var y3 = center.cy + 0.866 * this.HEXAGON_R;
		var x4 = x0;
		var y4 = y3;
		var x5 = center.cx - this.HEXAGON_R;
		var y5 = center.cy;
		return {'x0':x0, 'y0':y0, 'x1':x1, 'y1':y1, 'x2':x2, 'y2':y2, 
				'x3':x3, 'y3':y3, 'x4':x4, 'y4':y4, 'x5':x5, 'y5':y5};
	}

	this.getGridPos = function(cx, cy)
	{
		//alert(cx + ',' + cy);
		var x0 = this.HEXAGON_X0 - this.HEXAGON_R;
		var y0 = this.HEXAGON_Y0 - this.V_INTERVAL;

		//Make virtual grid, width: HEXAGON_R/2, height: V_INTERVAL / 2
		var vcol = parseInt((cx - x0)/ this.HEXAGON_R * 2);
		var vrow = parseInt((cy - y0)/ this.V_INTERVAL * 2 );
		
		//Get grid type, 0: full, 1:  backward, 2, forward
		var gridType = 0; //'full';
		if(vrow % 2 == 0) // 0, 2, 4...
		{
			if(vcol % 3 == 0)
			{
				if((vcol / 3) % 2 == 0)
					gridType = 1; //'backward';
				else
					gridType = 2; //'forward';
			}
		}
		else
		{
			if(vcol % 3 == 0)
			{
				if((vcol / 3) % 2 == 0)
					gridType = 2; //'forward';
				else
					gridType = 1; //'backward';
			}
		}
		
		//Regard left-bottom point as grid original point
		var ox = x0 + vcol * this.HEXAGON_R / 2;
		var oy = y0 + (vrow + 1) * this.V_INTERVAL / 2;
		
		//alert(cx + ',' + cy + ',' + ox + ',' + oy);
		var dx = cx - ox;
		var dy = oy - cy;
		var upFlag = 1;
		
		if(gridType == 1)
		{ 
			var sy = (this.HEXAGON_R / 2 - dx) * 1.732;
			if(sy > dy) 
				upFlag = 0; //alert('down side in backward triangle');
		}
		else if(gridType == 2)
		{ 
			var sy =  dx * 1.732;
			if(sy > dy) 
				upFlag = 0; //alert('down side in forward triangle');
		}
		
		//Notice in this case, grid type only affect virual column, not row
		//Regard forward or backward to full 
		if((gridType == 1) && (upFlag == 1))
			vcol += 1;
		else if((gridType == 1) && (upFlag == 0))
			vcol -= 1;
		else if((gridType == 2) && (upFlag == 1))
			vcol -= 1;
		else if((gridType == 2) && (upFlag == 0))
			vcol += 1;
			
		var row = 0;
		var col = 0;
		
		col = parseInt((vcol - 1) / 3);
		if( col % 2 == 0)
		{
			if(vrow > 0)
				row = parseInt((vrow - 1) / 2);
			else 
				row = -1;
		}	
		else
			row = parseInt(vrow / 2) ;
		
		if(vcol < 0)
			col = -1;
			
		//alert(row + ',' + col);
		return [col, row];
	}
	
	this.drawAll = function (ctx, lineColor, lineWidth)
	{
		for(var i=0; i<this.MAP_COLS; i++)
		{
			for(var j=0; j<this.MAP_ROWS; j++)
			{
				this.drawGrid(ctx, i, j, 'white', lineColor, lineWidth);
			}
		}
	}

	this.drawGrid = function(ctx, col, row, fillColor, lineColor, lineWidth)
	{
		ctx.save();
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = lineWidth;
		ctx.fillStyle = fillColor;
		
		var vertex = this.getVertex(col, row);
		ctx.beginPath();
		ctx.moveTo(vertex.x0, vertex.y0);
		ctx.lineTo(vertex.x1, vertex.y1);
		ctx.lineTo(vertex.x2, vertex.y2);
		ctx.lineTo(vertex.x3, vertex.y3);
		ctx.lineTo(vertex.x4, vertex.y4);
		ctx.lineTo(vertex.x5, vertex.y5);
		ctx.closePath();	
		ctx.stroke();
		ctx.fill();	
		
		ctx.restore();
	}
	
	////////////////////////////////////////////////////////////
	this.drawAssistantLine = function(ctx)
	{
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'grey';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 0.2;
		
		for(var i = 0; i<22; i++)
		{
			var x0 = this.HEXAGON_X0 - this.HEXAGON_R;
			var y0 = this.HEXAGON_Y0 - this.V_INTERVAL + i * this.V_INTERVAL / 2;
			
			var x1 = BK_W;
			var y1 = y0;
			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
		}
		
		for(var i = 0; i<32; i++)
		{
			var x0 = this.HEXAGON_X0 - this.HEXAGON_R + i * this.HEXAGON_R / 2;
			var y0 = this.HEXAGON_Y0 - this.V_INTERVAL;
			
			var x1 = x0
			var y1 = BK_H;
			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
		}
		
		ctx.stroke();
		ctx.restore();
	}
}