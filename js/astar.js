//A*路径搜索算法

// 1，把起始格添加到开启列表。

// 2，重复如下的工作：
// a) 寻找开启列表中F值最低的格子。我们称它为当前格。
// b) 把它切换到关闭列表。
// c) 对当前格相邻的8格中的每一个:
// * 如果它不可通过或者已经在关闭列表中，略过它。反之如下。
// * 如果它不在开启列表中，把它添加进去。把当前格作为这一格的父节点。记录这一格的F（F=G+H）值。
// * 如果它已经在开启列表中，用G值为参考检查新的路径是否更好。更低的G值意味着更好的路径。(H为一样的）如果是这样，就把这一格的父节点改成当前格，并且重新计算这一格的G和F值。如果你保持你的开启列表按F值排序，改变之后你可能需要重新对开启列表排序。
// d) 停止，当你
// * 把目标格添加进了开启列表，这时候路径被找到，或者
// * 没有找到目标格，开启列表已经空了。这时候，路径不存在。

// 3.保存路径。从目标格开始，沿着每一格的父节点移动直到回到起始格。这就是你的路径。

//
// F = G + H

// 这里：
// * G = 从起点A，沿着产生的路径，移动到网格上指定方格的移动耗费。
// * H = 从网格上那个方格移动到终点B的预估移动耗费。这经常被称为启发式的，可能会让你有点迷惑。这样叫的原因是因为它只是个猜测。我们没办法事先知道路径的长度，因为路上可能存在各种障碍(墙，水，等等)。
// 虽然本文只提供了一种计算H的方法，但是你可以在网上找到很多其他的方法。
// H = ABS(ENDX- CURRX) + ABS(ENDY- CURRY)


var regionList = [];
var openList = [];

var REGION_ROWS = 10;
var REGION_COLS = 10;

var G_VALUE1 = 10;
var G_VALUE2 = 14;

var startRow = 0;
var startCol = 0;
var endRow = 0;
var endCol = 0;

//Flag -1 unuse, 0: open, 1: close, 2: start, 3: end
function initAstar(col, row)
{
	for(var i=0; i<row; i++)
	{
		var regionRow = [];	
		for(var j=0; j<col; j++)
		{
			regionRow[j] = {col:j, row:i, flag:-1, value:0};
		}
		regionList.push(regionRow);
	}
}

function setRegionFlag(col, row, flag)
{
	regionList[row][col].flag = flag;
	if(flag == 2) //Start point 
	{
		//Clear open list and add start point
		openList = [];
		openList.push(regionList[row][col]); 
		
		startRow = row;
		startCol = col;

	}
	else if(flag == 3) //Record end point
	{
		endRow = row;
		endCol = col;
	}
}

function showPath() //Show path from parent pointer
{
	var str = endRow + ',' + endCol + ';  ';
	var node = regionList[endRow][endCol];
	while(1)
	{
		str = str + node.parent.pr + ',' + node.parent.pc + ';  ';
		var newNode = regionList[node.parent.pr][node.parent.pc];
		
		if( (node.parent.pr == startRow) && (node.parent.pc == startCol) )
			break;
			
		node = newNode;
	}
	alert(str);
}

function checkOpenList()
{
	if((startRow == endRow) &&　(startCol==endCol))
	{
		alert('Start and end at same point!');
		return;
	}
	
	if(openList.length == 0)
	{
		alert('No path found!');
		return;
	}
	else
	{
		//Get min F
		var minRegion =  openList[0];
		var minIndex = 0;
		for(index in openList)
		{
			var region = openList[index];
			if(region.value < minRegion.value)
			{
				minRegion = region;
				minIndex = index;
			}
		}
		
		//Set min F in open list as current point and set as close point
		openList[minIndex] = openList[openList.length-1];
		openList.length = openList.length - 1;
		minRegion.flag = 1; //Add to close

		var ret = findOpenRegion(minRegion.col, minRegion.row, endCol, endRow);
		if(ret == 1)
		{
			alert('Find path');
			//showPath();
			showAStarPath();
		}	
		else
			checkOpenList();
	}
}

function findOpenRegion(startCol, startRow, endCol, endRow)
{
	var orgRegion = regionList[startRow][startCol];
		
	for(var row = startRow-1; row<= startRow+1; row++)
	{
		if((row < 0) || (row >= REGION_ROWS))
			continue;
			
		for(var col = startCol-1; col<=startCol+1; col++)
		{
			if((col < 0) || (col >= REGION_COLS))
				continue;
				
			var region = regionList[row][col];
			if(region != null)
			{
				var newValue = 0;
				if(row == startRow || col == startCol)
					newValue = G_VALUE1;
				else
				{
					var region1 = regionList[startRow][col];
					var region2 = regionList[row][startCol];
					if((region1.flag == 1) || (region2.flag == 1))
						continue;
					newValue = G_VALUE2;
				}

				//F = G + H
				newValue = newValue + orgRegion.value + Math.abs(endCol - startCol) + Math.abs(endRow - startRow);
					
				if(region.flag == -1) //Add unuse node to open list
				{
					region.flag = 0;
					region.parent = {pc:startCol, pr:startRow};
					region.value = newValue;
					openList.push(region);
				}
				else if(region.flag == 0) //Recount node value
				{
					if(newValue < region.value)
					{
						region.parent = {pc:startCol, pr:startRow};
						region.value = newValue;
					}
				}
				else if(region.flag == 3) //Reach end point!
				{
					region.parent = {pc:startCol, pr:startRow};
					return 1; //Find path
				}
			}
		}
	}
	return 0; //Need continue
}

function astarTest()
{
	initAstar(REGION_COLS, REGION_ROWS);
	setRegionFlag(0, 0, 2); //Start
	setRegionFlag(5, 4, 3);  //End
	setRegionFlag(4, 4, 1);  //Obstacle
	setRegionFlag(4, 5, 1);  //Obstacle
	setRegionFlag(3, 3, 1);  //Obstacle
	setRegionFlag(2, 2, 1);  //Obstacle
	checkOpenList();
}

////////////////////////////////////////////////////////////
function drawGrid(ctx, lineColor, lineWidth)
{
	ctx.save();
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = lineWidth;

	for(var i=0; i<REGION_COLS; i++)
	{
		for(var j=0; j<REGION_ROWS; j++)
		{
			ctx.rect(i*50 + 30, j*50 + 30, 50, 50);
			ctx.stroke();
		}
	}
	
	ctx.restore();
}	

function updateGrid(ctx, col, row, type)
{
	ctx.save();
	ctx.beginPath();
	if(type == 1)
	{
		ctx.fillStyle = 'grey';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
	}
	else if(type == 2)
	{
		ctx.fillStyle = 'red';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
	}
	else if(type == 3)
	{
		ctx.fillStyle = 'green';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
	}
	ctx.rect(col*50 + 30, row*50 + 30, 50, 50);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}	

function showAStarPath() //Show path from parent pointer
{
	var str = endRow + ',' + endCol + ';  ';
	var node = regionList[endRow][endCol];
	while(1)
	{
		str = str + node.parent.pr + ',' + node.parent.pc + ';  ';
		var newNode = regionList[node.parent.pr][node.parent.pc];
		
		//Draw line between start and end region
		var x0 = 30 + node.col * 50 + 25;
		var y0 = 30 + node.row * 50 + 25;
		var x1 = 30 + node.parent.pc * 50 + 25;
		var y1 = 30 + node.parent.pr * 50 + 25;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = 'yellow';
		ctx.lineWidth = 3;
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	
		if( (node.parent.pr == startRow) && (node.parent.pc == startCol) )
			break;
		
		node = newNode;
	}
	alert(str);
}