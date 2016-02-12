//Hexagon map
//Create and draw hexagon map

var HEXAGON_R = 30;
var MAP_COLS = 10;
var MAP_ROWS = 10;

var H_INTERVAL = 1.5 * HEXAGON_R;
var V_INTERVAL = 1.732 * HEXAGON_R;

var HEXAGON_X0 = HEXAGON_R + 30;
var HEXAGON_Y0 = V_INTERVAL / 2 + 30;

function getHexagonCenter(col, row)
{
	var cx = HEXAGON_X0 + col * H_INTERVAL;
	var cy = HEXAGON_Y0 + row * V_INTERVAL;
	if(col % 2 != 0) //当坐标X为奇数时，Y多加一个b值
		cy = cy - V_INTERVAL / 2;
		
	return {'cx':cx, 'cy':cy};
}

function getHexagonVertex(col, row)
{
	var cx = HEXAGON_X0 + col * H_INTERVAL;
	var cy = HEXAGON_Y0 + row * V_INTERVAL;
	// if(row % 2 != 0)
		// cy = cy - V_INTERVAL;
	if(col % 2 != 0) //当坐标X为奇数时，Y多加一个b值
		cy = cy - V_INTERVAL / 2;
		
	var x0 = cx - HEXAGON_R / 2;
	var y0 = cy - 0.866 * HEXAGON_R;
	var x1 = cx + HEXAGON_R / 2;
	var y1 = y0;
	var x2 = cx + HEXAGON_R;
	var y2 = cy;
	var x3 = x1;
	var y3 = cy + 0.866 * HEXAGON_R;
	var x4 = x0;
	var y4 = y3;
	var x5 = cx - HEXAGON_R;
	var y5 = cy;
	return {'x0':x0, 'y0':y0, 'x1':x1, 'y1':y1, 'x2':x2, 'y2':y2, 
			'x3':x3, 'y3':y3, 'x4':x4, 'y4':y4, 'x5':x5, 'y5':y5};
}

function drawHexagonTest(ctx, lineColor, lineWidth)
{
	ctx.save();
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = lineWidth;

	for(var i = 0; i < MAP_COLS; i++)
	{
		for(var j=0; j<MAP_ROWS; j++)
		{
			var vertex = getHexagonVertex(i, j);
			ctx.beginPath();
			ctx.moveTo(vertex.x0, vertex.y0);
			ctx.lineTo(vertex.x1, vertex.y1);
			ctx.lineTo(vertex.x2, vertex.y2);
			ctx.lineTo(vertex.x3, vertex.y3);
			ctx.lineTo(vertex.x4, vertex.y4);
			ctx.lineTo(vertex.x5, vertex.y5);
			ctx.closePath();	
			ctx.stroke();
		}
	}
	
	ctx.restore();
}

function drawHexByPos(ctx, col, row, fillColor, lineColor, lineWidth)
{
	ctx.save();
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = lineWidth;
	ctx.fillStyle = fillColor;
	
	var vertex = getHexagonVertex(col, row);
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