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
	this.ignoredIndex = 0; 				//∫ˆ¬‘µƒøÈ£¨ø…ƒ‹ «A,JªÚR
	this.initialBlocks = []; 			//≥ı ºªØ∑≈÷√µƒøÈ
	this.showProblem = showProblem; 	//œ‘ æ
	this.addBlock = addBlock; 			//ÃÌº”≥ı ºªØøÈ
	this.deleteBlock = deleteBlock;		//…æ≥˝≥ı ºªØøÈ
	this.findSolution = findSolution;	//’“µΩ¥∞∏
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
		//alert('Find puzzle solution');
		alert('ÊâæÂà∞ÁªÑÂêàÁ≠îÊ°à');
	}
	else
	{
		//alert('Can not find puzzle solution');
		alert('ËØ•ÁªÑÂêàÊ≤°ÊúâÁ≠îÊ°à');
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