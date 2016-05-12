/*
找到所有解
步骤：
建立当前栈列表，保存当前盘面上的放置情况；
建立结果列表，保存所有解
递归过程（先深）
	将当前块的可能位置放入栈，并判断位置，如果可行，转向下一个块，
	如果盘中放满，则将结果保存到结果列表；上一个块位置+1（在本问题中，不需要循环最后一个块的位置）
	如果放置位置冲突，则寻找下一个可能位置+1，
	如果位置到达最后一个，则无解，上一个块位置+1，重复上述过程
	第一个块的位置循环结束，退出递归
	
	resultArray = [{blockName, usedFlag, result:[{angle, pos[]]}, ...]
*/
var allSolutionStack = []; //[{blockIndex:0, posIndex:0},{blockIndex:1, posIndex:1}]
var allSolutionList = [];  //[ [{blockIndex:0, posIndex:0},{blockIndex:1, posIndex:1}], [{blockIndex:0, posIndex:1},{blockIndex:1, posIndex:3}]]
var validMap = {};

function initValidMap()
{
	validMap = {};
	for(i in VALID_POINTS)
	{
		var key = VALID_POINTS[i].col+"_"+VALID_POINTS[i].row;
		validMap[key] = 0; //0: empty; 1:occupied
	}
}

function addPosArrayToMap(posArray)
{
	for(i in posArray)
	{
		var key = posArray[i].col+"_"+posArray[i].row;
		validMap[key] = 1;
	}
}

function removePosArrayFromMap(posArray)
{
	for(i in posArray)
	{
		var key = posArray[i].col+"_"+posArray[i].row;
		validMap[key] = 0;
	}
}

function checkPosArrayOnMap(posArray) //true: occupied, false: empty
{
	var flag = false; 
	for(i in posArray)
	{
		var key = posArray[i].col+"_"+posArray[i].row;
		if(validMap[key] == 1)
		{
			flag = true;
			break;
		}
	}
	return flag;
}

function getPIndex(index)
{
	for(var i=0; i<piorityIndex.length; i++)
	{
		if(index == piorityIndex[i])
			return i;
	}
	
	return -1;
}

function getNextBlockIndex()
{
	var  pIndex = -1;
	if(allSolutionStack.length == 0)
		pIndex = 0;
	else
	{
		pIndex = getPIndex(allSolutionStack[allSolutionStack.length-1].blockIndex);
		if(pIndex == -1)
			return -1;
		pIndex++;	
	}
	
	if(pIndex >= piorityIndex.length)
		return -1;

	if(resultArray[piorityIndex[pIndex]].useFlag == true)
		pIndex++;
		
	if(pIndex >= piorityIndex.length)
		return -1;
		
	return piorityIndex[pIndex];
	
}

//function getNextPosIndex()
//{
//	var index = 0;
//	if(allSolutionStack.length == 0)
//		index = 0;
//	else
//	{
//		var blockIndex = allSolutionStack[allSolutionStack.length-1].blockIndex;
//		index = allSolutionStack[allSolutionStack.length-1].posIndex + 1;
//		if(index >= resultArray[blockIndex].length)
//			index = -1; //Reach last one
//	}
//	return index;
//}

function checkPos(blockIndex, posIndex)
{
	var flag = checkPosArrayOnMap(resultArray[blockIndex].result[posIndex].pos);
	if(flag)
		return false;
		
	////Get all occupied points
	//var allPoints = [];
	//for(var k=0; k<allSolutionStack.length; k++)
	//{
	//	var bi = allSolutionStack[k].blockIndex;
	//	var pi = allSolutionStack[k].posIndex;
	//	var usedPoints = resultArray[bi].result[pi].pos;
	//	allPoints = allPoints.concat(usedPoints);
	//}
	//
	////Point already used
	//if(pointsInUseFlag(allPoints, resultArray[blockIndex].result[posIndex].pos))
	//	return false;
	
	//Single point exist
	var tempGrids = initBrainPuzzleGrids(); 
	for(var k=0; k<allSolutionStack.length; k++)
	{
		var bi = allSolutionStack[k].blockIndex;
		var pi = allSolutionStack[k].posIndex;
		var usedPoints = resultArray[bi].result[pi].pos;
		for(var i=0; i<usedPoints.length; i++)
		{
			tempGrids[usedPoints[i].col][usedPoints[i].row] = INVALID;
		}
	}

	//var tempPoints = [];
	//tempPoints = tempPoints.concat(allPoints, resultArray[blockIndex].result[posIndex].pos);
	if(hasSinglePoint(tempGrids, resultArray[blockIndex].result[posIndex].pos))
		return false;
	
	//Possible position
	return true;

}

function drawOneSolution(stack)
{
	for(var i=0; i<stack.length; i++)
	{
		var color = brainPuzzleBlocks[stack[i].blockIndex].color;
		var pos = resultArray[stack[i].blockIndex].result[stack[i].posIndex].pos;
		drawBlock(pos, color);
	}
}

function findAllSolutions()
{
	var blockIndex = getNextBlockIndex();
	var findFlag = false;
	if(blockIndex == -1)
		return findFlag;
	
	for(var posIndex=0; posIndex<resultArray[blockIndex].result.length; posIndex++)
	{
		if(checkPos(blockIndex, posIndex) == true)
		{
			findFlag = true;
			var posArray = resultArray[blockIndex].result[posIndex].pos;
			
			//Add to stack and mark on map
			allSolutionStack.push({blockIndex:blockIndex, posIndex:posIndex});
			addPosArrayToMap(posArray);
			
			if(allSolutionStack.length == 11)
			{
				//Add to solution list
				allSolutionList.push(allSolutionStack);
				//drawOneSolution(allSolutionStack);
				console.log("Find one");
				
				//Rmove and clear map
				allSolutionStack.pop();
				removePosArrayFromMap(posArray);
				
				break;
			}
			else
			{
				findAllSolutions();
			}
			
			//Remove and clear map
			allSolutionStack.pop();
			removePosArrayFromMap(posArray);
		}
	}
	
	return findFlag;
}


//AllTypes
//AllPos
function SolutionTree(usedInfo) //usedInfo: [{type, resultIndex}, {type, resultIndex}]
{
	resetAllType();
	resultAllPos();
	
	var root = new SolutionTreeNode();
	root.type = -1; //real root;
	
	AddRoot(root.SubNode, usedInfo, 0);
	
}

function AddRoot(parent, usedInfo, index)
{
	if(index < usedInfo.length)
	{
		var node = new SolutionTreeNode();
		node.type = usedInfo[index].type;
		node.resultIndex = usedInfo[index].resultIndex;

		parent.append(node);
		AddRoot(node.subNode, usedInfo, index++);
	}
}

function SolutionTreeNode()
{
	this.type = 0;
	this.resultIndex = 0;
	this.subNode = [];
	
	this.addNode = addNode;
	this.deleteNode = deleteNode;
}		 

function addNode(type, resultIndex)
{
	var st = new SolutionTree();
	st.type = type;
	st.resultIndex = resultIndex;
	this.subNode.add(st);
}
