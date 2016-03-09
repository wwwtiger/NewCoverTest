//从复杂到简单的放置顺序
var piorityIndex = [6, 7, 8, 3, 4, 1, 2, 0, 9, 10, 11, 5];

var brainPuzzleBlocks = [
				{name:'A', color:'#FF7F00', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:2, y:0, },
						{ x:2, y:-1, },]},
						
				{name:'B', color:'#FF3030', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:2, y:0, },
						{ x:1, y:-1, },
						{ x:2, y:-1, },]},
				
				{name:'C', color:'Purple', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:2, y:0, },
						{ x:3, y:0, },
						{ x:3, y:-1, },]},
						
				{name:'D', color:'Pink', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:2, y:0, },
						{ x:3, y:0, },
						{ x:2, y:-1, },]},	
						
				{name:'E', color:'DarkGreen', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:2, y:0, },
						{ x:2, y:-1, },
						{ x:3, y:-1, },]},
																										
				{name:'F', color:'lightYellow', 
				points:[
						{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:1, y:-1, },
						]
						}, //Three blocks : only 1
						
				{name:'G', color:'lightBlue', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:2, y:0, },
						{ x:2, y:-1, },
						{ x:2, y:-2, },]},
			
				{name:'H', color:'#FF3E96', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:1, y:-1, },
						{ x:2, y:-1, },
						{ x:2, y:-2, },]},
				
				{name:'I', color:'Yellow', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:2, y:0, },
						{ x:0, y:-1, },
						{ x:2, y:-1, },]},	
															
				{name:'J', color:'Navy', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:2, y:0, },
						{ x:3, y:0, },]},
						
				{name:'S', color:'#ADFF2F', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:2, y:0, },
						{ x:1, y:-1, },]},
						
			
				{name:'R', color:'#8B0000', 
				points:[{ x:0, y:0, }, 
						{ x:1, y:0, },
						{ x:1, y:-1, },
						{ x:2, y:-1, },]}, //Four block : 4
					
			]; 

var VALID = 0;
var INVALID = 1;
var OCCUPIED = 2;
var BLOCK_SIZE = 35;
var GRID_SIZE = BLOCK_SIZE + 1;

var Valid_Points = [];			
			
/*
例1 绕任意点C=［Cx Cy］的旋转变换。图2.28总的变换可通过三个基本变换复合而成。先进行平移交换，平移量为-Cx和-Cy，然后绕原点旋转θ角，最后再进行平移量为Cx和Cy的平移变换。因此，任一点P经过逐次变换后的齐次坐标为


1 0 cx		cos  -sin 0    1 0 -cx
0 1 cy		sin  cos  0    0 1 -cy	=
0 0 1		0    0    1    0 0 1


cos -sin -cos*cx+sin*cy+cx
sin cos  -sin*cx-cos*cy+cy
0    0    1

*/
//测试放置是否合法，如果合法，返回放置位置点的列表
function testBlock(block, angle, grids, col, row) //测试将方块旋转angle后，放置在grid的COL,ROW处是否合法
{
	var ret = {r:false, o:[]};
	
	//console.log('Test place ' + block.name + ' with angle ' + angle + ' at col:' + col + ', row:' + row);
	var count = block.points.length;
	var org = block.points[0];
	//console.log('Point 0 at col:' + org.x + ', row:' + org.y);
	if(grids[col][row] != VALID)
	{
			//console.log('Invalid at col:' + col+ ', row:' + row);
			return ret;
	}
	//else
	//	console.log('Valid at col:' + col + ', row:' + row);
	
	ret.o.push({col:col, row:row});
	
	for(var i=1; i<count; i++)
	{
		var pt = block.points[i];
		//console.log('Point ' + i + ' at col:' + pt.x + ', row:' + pt.y);
		var offset = rotateByPoint(pt.x, pt.y, org.x, org.y, angle);
		//console.log('Offset point ' + i + ' at col:' + offset.x + ', row:' + offset.y);
		
		var newCol = col+offset.x;
		var newRow = row+offset.y;
		
		if((newCol > 9) || (newRow > 9) || (newCol < 0) || (newRow < 0))
		{
			//console.log('Out of range at col:' + newCol + ', row:' + newRow);
			return ret;
		}
			
		if(grids[newCol][newRow]!= VALID)
		{
			//console.log('Invalid at col:' + newCol + ', row:' + newRow);
			return ret;
		}
		//else
		//	console.log('Valid at col:' + newCol + ', row:' + newRow);
		
		ret.o.push({col:newCol, row:newRow});
	}
	
	//Test connection, find seperate region with only one/two block
	
	
	ret.r = true;
	return ret;
}


function rotateByPoint(x, y, cx, cy, theta)
{
	var cos = Math.cos(theta);
	var sin = Math.sin(theta);
	var a = cos;
	var b = 0 - sin;
	var c = -cos*cx+sin*cy+cx;
	var d = sin;
	var e = cos;
	var f = -sin*cx-cos*cy+cy;
	
	return {x:Math.round(a*x+b*y), y:Math.round(d*x+e*y)};
}	


function initBrainPuzzleGrids()
{
	var grids = [];
	for(var i=0; i<10; i++)
	{
		var gridRow = [];
		for(var j=0; j<10; j++)
		{
			gridRow.push(INVALID);
		}
		grids.push(gridRow);
	}
	
	for(var i=4; i>=0; i--)
	{
		var startIndex = 4 - i;
		var count = i * 2 + 1;
		for(var j=startIndex; j<(count + startIndex); j++)
		{
			Valid_Points.push({col:i, row:j});
			grids[i][j] = VALID;
		}
	}
	
	for(var i=5; i<10; i++)
	{
		var startIndex = i - 4;
		var count = (9 - i) * 2 + 1;
		for(var j=startIndex; j<(count + startIndex); j++)
		{
			Valid_Points.push({col:i, row:j});
			grids[i][j] = VALID;
		}
	}
	
	return grids;
}	

function hasSinglePoint(tempGrids, pos)
{
	for(var i=0; i<pos.length; i++)
	{
		tempGrids[pos[i].col][pos[i].row] = INVALID;
	}
	
	for(var i=0; i<Valid_Points.length; i++)
	{
		var col = Valid_Points[i].col;
		var row = Valid_Points[i].row;
		if(tempGrids[col][row] == VALID)
		{
			var neighbourCount = 0;
			var nCol, nRow;
			if((row<(10-1)) && (tempGrids[col][row+1] == VALID)) 
			{
				neighbourCount++;
				nCol = col; nRow = row+1;
			}
			if((col<(10-1)) && (tempGrids[col+1][row] == VALID))
			{
				neighbourCount++;
				nCol = col+1; nRow = row;
			}
			if((row>0) &&  (tempGrids[col][row-1] == VALID)) 
			{
				neighbourCount++;
				nCol = col; nRow = row-1;
			}
			if((col>0) && (tempGrids[col-1][row] == VALID)) 
			{
				neighbourCount++;
				nCol = col-1; nRow = row;
			}
			
			if(neighbourCount == 0)
				return true;
			else if(neighbourCount == 1)	//Check only two block region
			{
				tempGrids[col][row] = INVALID;
				col = nCol; row = nRow;
				if(((row<(10-1)) && (tempGrids[col][row+1] == VALID)) || 
					((col<(10-1)) && (tempGrids[col+1][row] == VALID)) ||
					((row>0) &&  (tempGrids[col][row-1] == VALID))  ||
					((col>0) && (tempGrids[col-1][row] == VALID)) )
					continue;
				else
					return true;
			}
		}
	}
	return false;
}


function Block()
{
	this.type = 'A';
	this.rotateFlag = 0;
	this.svgObj = null;
}