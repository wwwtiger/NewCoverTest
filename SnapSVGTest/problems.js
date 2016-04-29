//Specific solution with C, F, H
//		solutionStack.push({blockIndex: 2, blockName: 'C', resultIndex: 0, 
//							pos:[{col:0, row:4},{col:1, row:4},{col:2, row:4} ,{col:3, row:4},{col:3, row:3}  ]});
//		resultArray[2].useFlag = true; 
//		
//		solutionStack.push({blockIndex: 5, blockName: 'F', resultIndex: 0, 
//							pos:[{col:1, row:5},{col:2, row:5},{col:2, row:6}]});
//		resultArray[5].useFlag = true; 
//		
//		solutionStack.push({blockIndex: 7, blockName: 'H', resultIndex: 0, 
//							pos:[{col:1, row:3},{col:2, row:3},{col:2, row:2} ,{col:3, row:2},{col:3, row:1}  ]},
//		resultArray[7].useFlag = true; 


//Specific solution with C, F, H
var problem_218= [
		{blockIndex: 2, blockName: 'C', resultIndex: 0, 
							pos:[{col:0, row:4},{col:1, row:4},{col:2, row:4} ,{col:3, row:4},{col:3, row:3}  ]},
		
		
		{blockIndex: 5, blockName: 'F', resultIndex: 0, 
							pos:[{col:1, row:5},{col:2, row:5},{col:2, row:6}]},
		
		
		{blockIndex: 7, blockName: 'H', resultIndex: 0, 
							pos:[{col:1, row:3},{col:2, row:3},{col:2, row:2} ,{col:3, row:2},{col:3, row:1}  ]},
		];


//Specific solution with D, J, H
var problem_219= [
		{blockIndex: 3, blockName: 'D', resultIndex: 0, 
							pos:[{col:0, row:4},{col:1, row:4},{col:2, row:4} ,{col:3, row:4},{col:1, row:3}  ]},
		
		
		{blockIndex: 9, blockName: 'J', resultIndex: 0, 
							pos:[{col:1, row:5},{col:2, row:5},{col:3, row:5},{col:4, row:5}]},
		
		
		{blockIndex: 7, blockName: 'H', resultIndex: 0, 
							pos:[{col:2, row:6},{col:3, row:6},{col:3, row:7} ,{col:4, row:7},{col:4, row:8}  ]},
		 ];
		 
		 
function PuzzleProblem()
{
	this.ignoredIndex = 0; 				//忽略的块，可能是A,J或R
	this.initialBlocks = []; 			//初始化放置的块
	this.showProblem = showProblem; 	//显示
	this.addBlock = addBlock; 			//添加初始化块
	this.deleteBlock = deleteBlock;		//删除初始化块
	this.findSolution = findSolution;	//找到答案
	this.reset = resetProblem;
}

function resetProblem()
{
	this.initialBlocks = [];
	this.showProblem();
}

function findSolution()
{
	//Search one solution
	solutionStack = [];
	for(i in resultArray)
	{
		resultArray[i].useFlag = false;
	}
	resultArray[this.ignoredIndex].useFlag = true; //Not use 'A' or 'R' or 'G'
	
	loadProblem(this.initialBlocks);
	
	if(findOneSolution())
	{
		alert('Find puzzle solution');
	}
	else
	{
		alert('Can not find puzzle solution');
	}
	
	//Show solution
	drawSolution();
	
	console.log(solutionStack);
}

function showProblem()
{
	resetBkGrid();
	for(i in this.initialBlocks)
	{
		highlightBlock(this.initialBlocks[i].pos, brainPuzzleBlocks[this.initialBlocks[i].blockIndex].color, 2);
	}
}


function addBlock(blockIndex, pos)
{
	this.deleteBlock(blockIndex); //Delete first
	
	//Check points occupied or not
	var allPoints = [];
	for(i in this.initialBlocks)
		allPoints = allPoints.concat(this.initialBlocks[i].pos);
	if(pointsInUseFlag(allPoints, pos))
		return false;
	
	//Add initial block and update grids
	this.initialBlocks.push({blockIndex:blockIndex, pos:pos});
	this.showProblem();
	return true;
}

function deleteBlock(blockIndex)
{
	for(i in this.initialBlocks)
	{
		if(this.initialBlocks[i].blockIndex == blockIndex)
		{
			this.initialBlocks[i] = this.initialBlocks[this.initialBlocks.length-1];
			this.initialBlocks.pop();
		}
	}
	this.showProblem();
}