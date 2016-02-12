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

//Flag 0 unuse; 1: close/obstacle; 2: open; 3: start; 4: end

var AS_UNUSE = 0;
var AS_CLOSE = 1;
var AS_OPEN = 2;
var AS_START = 3;
var AS_END = 4;

function AStar()
{
	this.hexFlag = 0; //Block map or hex map
	this.block_rows = 0;
	this.block_cols = 0;
	
	this.regionList = [];
	this.openList = [];

	this.G_VALUE1 = 10;
	this.G_VALUE2 = 14;

	this.startRow = -1;
	this.startCol = -1;
	this.endRow = -1;
	this.endCol = -1;
	
	this.init = function (cols, rows, grids)
	{
		this.startRow = -1;
		this.startCol = -1;
		this.endRow = -1;
		this.endCol = -1;
		this.regionList = [];
		
		this.block_cols = cols;
		this.block_rows = rows;
		for(var i=0; i<rows; i++)
		{
			var regionRow = [];	
			for(var j=0; j<cols; j++)
			{
				regionRow[j] = {col:j, row:i, flag:grids[i][j], value:0};
				
				if(grids[i][j] == AS_START) //Start point 
				{
					this.startRow = i;
					this.startCol = j;
				}
				else if(grids[i][j] == AS_END) //Record end point
				{
					this.endRow = i;
					this.endCol = j;
				}
			}
			this.regionList.push(regionRow);
		}
		
	}

	//-1 error; 0: no path; 1: find path
	this.startFind = function()
	{
		if((this.startRow<0) || (this.endRow<0) ||　(this.startCol<0) || (this.endCol<0))
			return -1;
		if((this.startRow == this.endRow) &&　(this.startCol==this.endCol))
		{
			//alert('Start and end at same point!');
			return -1;
		}
		
		//Clear open list and add start point
		this.openList = [];
		this.openList.push(this.regionList[this.startRow][this.startCol]); 
		
		return this.checkOpenList();
	}

	//-1 error; 0: no path; 1: find path
	this.checkOpenList = function()
	{
		if(this.openList.length == 0)
		{
			//alert('No path found!');
			return 0;
		}
		else
		{
			//Get min F
			var minRegion =  this.openList[0];
			var minIndex = 0;
			for(index in this.openList)
			{
				var region = this.openList[index];
				if(region.value < minRegion.value)
				{
					minRegion = region;
					minIndex = index;
				}
			}
			
			//Set min F in open list as current point and set as close point
			this.openList[minIndex] = this.openList[this.openList.length-1];
			this.openList.length = this.openList.length - 1;
			minRegion.flag = AS_CLOSE; //Add to close

			var ret;
			if(this.hexFlag == 0)
				ret = this.findOpenRegion(minRegion.col, minRegion.row);
			else
				ret = this.findOpenHexRegion(minRegion.col, minRegion.row, this.hexFlag);
				
			if( (ret == -1) || (ret == 1)) // error or find
				return ret;
			else //continue
				return this.checkOpenList();
		}
	}

	//-1: error; 0: to be continue; 1: find path
	this.findOpenRegion = function(currCol, currRow)
	{
		var orgRegion = this.regionList[currRow][currCol];
			
		for(var row = currRow-1; row<= currRow+1; row++)
		{
			if((row < 0) || (row >= this.block_rows))
				continue;
				
			for(var col = currCol-1; col<=currCol+1; col++)
			{
				if((col < 0) || (col >= this.block_cols))
					continue;
					
				var region = this.regionList[row][col];
				if(region != null)
				{
					var newValue = 0;
					if(row == currRow || col == currCol) //neighbour
						newValue = this.G_VALUE1;
					else //diagonal
					{
						var region1 = this.regionList[currRow][col];
						var region2 = this.regionList[row][currCol];
						if((region1.flag == AS_CLOSE) || (region2.flag == AS_CLOSE)) //not allow diagonal obstacle path
							continue;
						newValue = this.G_VALUE2;
					}

					//F = G + H
					newValue = newValue + orgRegion.value + Math.abs(this.endCol - currCol) + Math.abs(this.endRow - currRow);
						
					if(region.flag == AS_UNUSE) //Add unuse node to open list
					{
						region.flag = AS_OPEN;
						region.parent = {pc:currCol, pr:currRow};
						if((region.row == region.parent.pr) && (region.col == region.parent.pc))
							return -1;
							
						region.value = newValue;
						this.openList.push(region);
					}
					else if(region.flag == AS_OPEN) //Open node, recount node value
					{
						if(newValue < region.value)
						{
							region.parent = {pc:currCol, pr:currRow};
							if((region.row == region.parent.pr) && (region.col == region.parent.pc))
								return -1;
							
							region.value = newValue;
						}
					}
					else if(region.flag == AS_END) //Reach end point!
					//else if((region.row == this.endRow) && (region.col == this.endCol)) //Reach end point!
					{
						region.parent = {pc:currCol, pr:currRow};
						if((region.row == region.parent.pr) && (region.col == region.parent.pc))
							return -1;
							
						return 1; //Find path
					}
				}
			}
		}
		return 0; //Need continue
	}
	
	this.getPath = function() //Show path from parent pointer
	{
		var path = [];
		var str = this.endRow + ',' + this.endCol + ';  ';
		var node = this.regionList[this.endRow][this.endCol];
		
		path.push({row:this.endRow, col:this.endCol});
		while(1)
		{
			str = str + node.parent.pr + ',' + node.parent.pc + ';  ';
			path.push({row:node.parent.pr, col:node.parent.pc});
			
			var newNode = this.regionList[node.parent.pr][node.parent.pc];
			
			if( (node.parent.pr == this.startRow) && (node.parent.pc == this.startCol) )
				break;
				
			node = newNode;
		}
		
		return path;
	}
	
	/*
	六边形相邻域的规律（奇数列/行坐标减小的情况）
	横向六边形
	
	偶数列（0，2，4等）
		col-1	col 	col+1
		----------------------
		row		row-1	row
		row+1	row+1	row+1
		
	奇数列（1，3，5等）
		col-1	col 	col+1
		---------------------
		row-1	row-1	row-1
		row		row+1	row
		
	竖向六边形
	
	偶数行（0，2，4等）
		row-1	row 	row+1
		----------------------
		col		col-1	col
		col+1	col+1	col+1
		
	奇数行（1，3，5等）
		row-1	row 	row+1
		---------------------
		col-1	col-1	col-1
		col		col+1	col
	*/
	
	//0: to be continue; 1: find path
	this.findOpenHexRegion = function(currCol, currRow, flag)
	{
		var orgRegion = this.regionList[currRow][currCol];
			
		for(var row = currRow-1; row<= currRow+1; row++)
		{
			if((row < 0) || (row >= this.block_rows))
				continue;
				
			for(var col = currCol-1; col<=currCol+1; col++)
			{
				if((col < 0) || (col >= this.block_cols))
					continue;
				
				if(flag == 1)
				{
					//Remove not align grid in hexagon map
					if(currCol % 2 == 0)
					{
						if( (row == (currRow-1)) && (col!=currCol) )
							continue;
					}
					else
					{
						if( (row == (currRow+1)) && (col!=currCol) )
							continue;
					}
				}
				else if(flag == 2)
				{
					//Remove not align grid in hexagon map
					if(currRow % 2 == 0)
					{
						if( (col == (currCol-1)) && (row!=currRow) )
							continue;
					}
					else
					{
						if( (col == (currCol+1)) && (row!=currRow) )
							continue;
					}
				}

				var region = this.regionList[row][col];
				if(region != null)
				{
					var newValue = this.G_VALUE1;
					
					//F = G + H
					newValue = newValue + orgRegion.value + Math.abs(this.endCol - currCol) + Math.abs(this.endRow - currRow);
						
					if(region.flag == AS_UNUSE) //Add unuse node to open list
					{
						region.flag = AS_OPEN;
						region.parent = {pc:currCol, pr:currRow};
						if((region.row == region.parent.pr) && (region.col == region.parent.pc))
							return -1;
						region.value = newValue;
						this.openList.push(region);
					}
					else if(region.flag == AS_OPEN) //Open node, recount node value
					{
						if(newValue < region.value)
						{
							region.parent = {pc:currCol, pr:currRow};
							if((region.row == region.parent.pr) && (region.col == region.parent.pc))
								return -1;
							region.value = newValue;
						}
					}
					else if(region.flag == AS_END) //Reach end point!
					{
						region.parent = {pc:currCol, pr:currRow};
						if((region.row == region.parent.pr) && (region.col == region.parent.pc))
							return -1;
						return 1; //Find path
					}
				}
			}
		}
		return 0; //Need continue
	}
}
