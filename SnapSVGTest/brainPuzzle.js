//´Ó¸´ÔÓµ½¼òµ¥µÄ·ÅÖÃË³Ğò
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


var BK_COLS = 10;
var BK_ROWS = 10;

var VALID_POINTS = [];		//ËùÓĞÔÚ³õÊ¼»¯Ê±ÓĞĞ§µãµÄ×ø±êË÷Òı	
var BK_GRIDS = []; //±³¾°¾ØÕó

//±³¾°¾ØÕóÈ¡Öµ
var VALID = 0;
var INVALID = 1;
var OCCUPIED = 2;

var PI = 3.1415;
var angles = [0, PI / 2, PI, PI / 2 * 3];
var solutionStack = []; //½â¶ÑÕ»
var resultArray = []; //ËùÓĞÓĞĞ§·ÅÖÃÎ»ÖÃÁĞ±í
			
/*
Àı1 ÈÆÈÎÒâµãC=£ÛCx Cy£İµÄĞı×ª±ä»»¡£Í¼2.28×ÜµÄ±ä»»¿ÉÍ¨¹ıÈı¸ö»ù±¾±ä»»¸´ºÏ¶ø³É¡£ÏÈ½øĞĞÆ½ÒÆ½»»»£¬Æ½ÒÆÁ¿Îª-CxºÍ-Cy£¬È»ºóÈÆÔ­µãĞı×ª¦È½Ç£¬×îºóÔÙ½øĞĞÆ½ÒÆÁ¿ÎªCxºÍCyµÄÆ½ÒÆ±ä»»¡£Òò´Ë£¬ÈÎÒ»µãP¾­¹ıÖğ´Î±ä»»ºóµÄÆë´Î×ø±êÎª


1 0 cx		cos  -sin 0    1 0 -cx
0 1 cy		sin  cos  0    0 1 -cy	=
0 0 1		0    0    1    0 0 1


cos -sin -cos*cx+sin*cy+cx
sin cos  -sin*cx-cos*cy+cy
0    0    1

*/

function getBlockIndexById(id)
{
	for(var i=0; i<brainPuzzleBlocks.length; i++)
	{
		if(brainPuzzleBlocks[i].name == id)
			return i;
	}
	
	return null;
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

//³õÊ¼»¯±³¾°¾ØÕó£¨10*10£©£¬²¢¼ÇÂ¼³õÊ¼ÓĞĞ§µãÁĞ±í£¨50¸ö£©
function initValidPoints()
{
	VALID_POINTS = [];
	for(var i=4; i>=0; i--)
	{
		var startIndex = 4 - i;
		var count = i * 2 + 1;
		for(var j=startIndex; j<(count + startIndex); j++)
		{
			VALID_POINTS.push({col:i, row:j});
		}
	}
	
	for(var i=5; i<BK_COLS; i++)
	{
		var startIndex = i - 4;
		var count = (9 - i) * 2 + 1;
		for(var j=startIndex; j<(count + startIndex); j++)
		{
			VALID_POINTS.push({col:i, row:j});
		}
	}
}

function initBrainPuzzleGrids()
{
	var grids = [];
	for(var i=0; i<BK_COLS; i++)
	{
		var gridRow = [];
		for(var j=0; j<BK_ROWS; j++)
		{
			gridRow.push(INVALID);
		}
		grids.push(gridRow);
	}
	
	for(var i=0; i<VALID_POINTS.length;i++)
	{
		grids[VALID_POINTS[i].col][VALID_POINTS[i].row] = VALID;
	}
	
	return grids;
}	

//µÃµ½ÓĞĞ§ÏàÁÚµãµÄ¸öÊıºÍ·½Ïò
function getPointNeighbourCount(tempGrids, col, row)
{
	var neighbours = [];
	
	if((row<(BK_ROWS-1)) && (tempGrids[col][row+1] == VALID)) 
	{
		neighbours.push({orient:0});
	}
	if((col<(BK_COLS-1)) && (tempGrids[col+1][row] == VALID))
	{
		neighbours.push({orient:1});
	}
	if((row>0) &&  (tempGrids[col][row-1] == VALID)) 
	{
		neighbours.push({orient:2});
	}
	if((col>0) && (tempGrids[col-1][row] == VALID)) 
	{
		neighbours.push({orient:3});
	}
	
	return neighbours;
}

//æ ¹æ®çŸ©é˜µæ£€æŸ¥æ˜¯å¦æœ‰å°äºç­‰äº2ä¸ªå—çš„å­¤ç«‹ç‚¹
function hasSinglePoint(tempGrids, deletePos)
{
	for(var i=0; i<deletePos.length; i++)
	{
		tempGrids[deletePos[i].col][deletePos[i].row] = INVALID;
	}
	
	for(var i=0; i<VALID_POINTS.length; i++)
	{
		var col = VALID_POINTS[i].col;
		var row = VALID_POINTS[i].row;
		
		if(tempGrids[col][row] == INVALID) //Ö»¼ì²éÓĞĞ§µã
			continue;
			
		var neighbours = getPointNeighbourCount(tempGrids, col, row);
					
		if(neighbours.length == 0) //¿éÊıÎª1
			return true;
		else if(neighbours.length == 1) //Ö»ÓĞÒ»¸öÏàÁÚ¿é£¬ĞèÒª½øÒ»²½ÅĞ¶Ï
		{
			var nCol = col;
			var nRow = row;
			if(neighbours[0].orient == 0)
				nRow++;
			else if(neighbours[0].orient == 1)
				nCol++;
			else if(neighbours[0].orient == 2)
				nRow--;
			else if(neighbours[0].orient == 3)
				nCol--;
				
			var nCount = getPointNeighbourCount(tempGrids, nCol, nRow);
			if(nCount.length <= 1) // ¿éÊıÎª2
				return true;
		}
	}
	return false;
}

//²âÊÔ·ÅÖÃÊÇ·ñºÏ·¨£¬Èç¹ûºÏ·¨£¬·µ»Ø·ÅÖÃÎ»ÖÃµãµÄÁĞ±í£¬¸ÃÊı¾İ¿ÉÒÔ×÷Îª¾²Ì¬Êı¾İ
function testBlock(block, angle, mirrorX, grids, col, row) //²âÊÔ½«·½¿éĞı×ªangleºó£¬·ÅÖÃÔÚgridµÄCOL,ROW´¦ÊÇ·ñºÏ·¨
{
	var ret = {r:false, o:[]};
	
	//console.log('Test place ' + block.name + ' with angle ' + angle + ' at col:' + col + ', row:' + row);
	var count = block.points.length;
	var org = block.points[0]; //ÒÔµÚÒ»¿éÎªÔ­µã½øĞĞĞı×ª
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
		var pt = {x: block.points[i].x, y:block.points[i].y};

		if(mirrorX) //ÒÔXÖá½øĞĞ¾µÏñ
			pt.y = -pt.y;
			
		var offset = rotateByPoint(pt.x, pt.y, org.x, org.y, angle);
		
		var newCol = col+offset.x;
		var newRow = row+offset.y;
		
		if((newCol > (BK_COLS-1)) || (newRow > (BK_ROWS-1)) || (newCol < 0) || (newRow < 0))
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
	
	ret.r = true;
	return ret;
}

//²âÊÔÃ¿¸ö¿éµÄÓĞĞ§·ÅÖÃÎ»ÖÃ£¬·Ö¾µÏñÁ½¸ö£¬Ğı×ªËÄ¸ö·½Ïò
function testGroupOnGrid(index)
{	
	var validCount = 0;
	var validResult = {blockName:brainPuzzleBlocks[index].name, useFlag: false, result:[]}; //Ãû³Æ£¬ÊÇ·ñÔÚ½â¾ö·½·¨ÖĞÊ¹ÓÃ£¬[{½Ç¶È£¬Î»ÖÃ}]
	
	for(var i=0; i<2; i++) //¾µÏñ
	{
		if(((brainPuzzleBlocks[index].name == "F") || 
			(brainPuzzleBlocks[index].name == "G") || 
			(brainPuzzleBlocks[index].name == "H") || 
			(brainPuzzleBlocks[index].name == "I") || 
			(brainPuzzleBlocks[index].name == "J") || 
			(brainPuzzleBlocks[index].name == "S") ) 
			&& (i == 1)) //F G H I J S²»ĞèÒª¾µÏñ
			continue;
			
		for(var j=0; j<angles.length; j++) //Ğı×ª
		{
			if((brainPuzzleBlocks[index].name == "J") && ((j == 2) || (j == 3))) //JÎª¶Ô³Æ¼¸ºÎÌå
				continue;
				
			var angle = angles[j];
			//var svgGroup1 = drawSingleGroup(brainPuzzleBlocks[index], angle, i);			
			for(var k=0; k<VALID_POINTS.length;k++)
			{
				//svgGroup1.attr({
				//				transform: 'T' + [testCol*GRID_SIZE, testRow*GRID_SIZE]
				//			});
				//¶ÔÃ¿¸ö³õÊ¼ÓĞĞ§µã½øĞĞ±éÀú
				var ret = testBlock(brainPuzzleBlocks[index], angle, i, BK_GRIDS, VALID_POINTS[k].col, VALID_POINTS[k].row);
				if(ret.r == true)
				{
					var tempGrids = initBrainPuzzleGrids();
					//console.log(tempGrids);
					if(hasSinglePoint(tempGrids, ret.o)) //¼ì²é¹ÂÁ¢µã
					{
						//if(brainPuzzleBlocks[index].name == "I")
						//	alert("Valid but impossible");
					}
					else //¼ÇÂ¼ÓĞĞ§Î»ÖÃ
					{
						validCount++;
						validResult.result.push( {angle:angle, pos:ret.o} );
						//if(brainPuzzleBlocks[index].name == "E")
						//	alert("Valid and possible");
					}
				}
				//else
					//alert("Invalid");
			}
			//setTimeout(null, 1000);
			//svgGroup1.remove();
		}
	}
	//Record possible result array
	resultArray.push(validResult);
	console.log(validResult);
	//console.log(index + ' at ' + angle + ' has ' + validCount + ' results');
}
	

function findFirstSolutionWithoutA()
{
	//Search one solution
	solutionStack = [];
	for(var i=0; i<resultArray.length; i++)
	{
		resultArray[i].useFlag = false;
	}
	resultArray[0].useFlag = true; //Not use 'A'
	
	if(findOneSolution())
	{
		alert('Find first solution without A');
	}
	else
	{
		alert('Can not find first solution without A');
	}
	
	//Show solution
	drawSolution();
	
	console.log(solutionStack);
}

function loadProblem(problem)
{
	var list = [];
	for(var i=0; i<problem.length; i++)
	{
		solutionStack.push(problem[i]);
		resultArray[problem[i].blockIndex].useFlag = true;
		
		drawBlock(problem[i].pos, brainPuzzleBlocks[problem[i].blockIndex].color);
		//alert("Problem push " + problem[i].blockIndex);
		list.push(brainPuzzleBlocks[problem[i].blockIndex].name);
	}
	
	alert("æ”¾ç½®äº†" + list.length + "å—, " + "åˆ†åˆ«ä¸º" + list.join(', '));
}

function findSpecificSolution(problem)
{
	//Search one solution
	solutionStack = [];
	for(var i=0; i<resultArray.length; i++)
	{
		resultArray[i].useFlag = false;
	}
	resultArray[0].useFlag = true; //Not use 'A'
	
	loadProblem(problem);
	
	if(findOneSolution())
	{
		alert('Find specific solution without A');
	}
	else
	{
		alert('Can not find specific solution without A');
	}
	
	//Show solution
	drawSolution();
	
	console.log(solutionStack);
}

function isValidPoint(validPoints, point) //¸ÃµãÊÇ·ñÊÇÓĞĞ§µã
{
	for(var i=0; i<validPoints.length; i++)
	{
		if((validPoints[i].col == point.col) && (validPoints[i].row == point.row))
				return true;
	}
	return false;
}
	
function pointsInUseFlag(usedPoints, newPoints) //ĞÂÔöµÄµãÊÇ·ñÒÑ¾­±»Õ¼ÓÃ
{
	for(var i=0; i<usedPoints.length; i++)
	{
		for(var j=0; j<newPoints.length; j++)
		{
			if((usedPoints[i].col == newPoints[j].col) && (usedPoints[i].row == newPoints[j].row))
				return true;
		}
	}
	
	return false;
}

function findOneSolution()
{
	var findFlag = false;	
	if(solutionStack.length >= (brainPuzzleBlocks.length-1)) //Find one!
	{
		//console.log(solutionStack);
		//alert('findOneSolution');
		return true;
	}
	
	//Set current block index
	var blockIndex = -1;
	for(var i=0; i<piorityIndex.length; i++)
	{		
		if(resultArray[piorityIndex[i]].useFlag == false)
		{
			blockIndex = piorityIndex[i];
			break;
		}
	}
	
	if(blockIndex < 0)
		return false;
		
	var name = 	resultArray[blockIndex].blockName;
	var result = resultArray[blockIndex].result;
	
	//Get all occupied points
	var allPoints = [];
	for(var k=0; k<solutionStack.length; k++)
	{
		allPoints = allPoints.concat(solutionStack[k].pos);
	}
	
	for(var j=0; j<result.length; j++)
	{
		//if(brainPuzzleBlocks[blockIndex].name == "E")
		//{
		//	highlightBlock(result[j].pos, brainPuzzleBlocks[blockIndex].color, 5);
		//	alert("Test push " + blockIndex);
		//	highlightBlock(result[j].pos, HOVER_OUT_BK_STROKE, 1);
		//}
		
		//Point already used
		if(pointsInUseFlag(allPoints, result[j].pos))
			continue;
		
		//Single point exist
		var tempGrids = initBrainPuzzleGrids();
		var tempPoints = [];
		tempPoints = tempPoints.concat(allPoints, result[j].pos);
		if(hasSinglePoint(tempGrids, tempPoints))
			continue;
		
		//Possible position, push and recurse
		findFlag = true;
		solutionStack.push({blockIndex: blockIndex, blockName: name, resultIndex: j, pos:result[j].pos});
		
		drawBlock(result[j].pos, brainPuzzleBlocks[blockIndex].color);
		//alert("Push " + blockIndex);
		
		resultArray[blockIndex].useFlag = true;
		if(findOneSolution() == false) //µİ¹éÊ§°Ü£¬»ØÍË
		{
			findFlag = false;
			solutionStack.pop();
			
			drawBlock(result[j].pos, VALID_BK_COLOR);
			//alert("Pop " + blockIndex);
			
			resultArray[blockIndex].useFlag = false;
		}
		else
			break; //Find solution
	}
	
	return findFlag; //Success or failed
}

function Block()
{
	this.type = 'A';
	this.rotateFlag = 0;
	this.svgObj = null;
}