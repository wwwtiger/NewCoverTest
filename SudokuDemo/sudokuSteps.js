//row[1-9], col[1-9], 0: total row/col 
//t: target; b: base; pos: position; pv: possible value; iv: impossible value; d: description
var sudokuSteps = [ 
{ t:[{pos:[1,8], pv:[3], iv:[]}], b:[[0,7],[0,9]], d:'通过行列法确认(1,8)=3' },
{ t:[{pos:[3,2], pv:[4,6], iv:[]}, {pos:[3,3], pv:[4,6], iv:[]}], b:[[2,6],[3,8]] , d:'通过行列法确认(1,8)=3'}
];


/*
var sudokuSteps = [ 
{TARGET: [[1,8]], BASE: [[0,7],[0,9]], OUT:[[8,9]], RESULT: [[3]]},
{TARGET: [[3,1], [3,2]], BASE: [[1,1],[2,2],[1,3]], OUT:[[8,9],[1,2]], RESULT: [[5,6],[5,6]]},
{TARGET: [[1,1]], BASE: [[1,1],[1,6],[1,3]], OUT:[[8,9]], RESULT: [[1,2,3]]},
{TARGET: [[5,1]], BASE: [[3,1],[1,2],[1,3]], OUT:[[8,9]], RESULT: [[1,2,3]]},
{TARGET: [[1,1]], BASE: [[1,1],[1,8],[1,3]], OUT:[[8,9]], RESULT: [[1,2,3]]},
{TARGET: [[8,1]], BASE: [[7,1],[1,2],[1,3]], OUT:[[8,9]], RESULT: [[1,2,3]]},
{TARGET: [[7,1]], BASE: [[1,1],[1,2],[2,3]], OUT:[[8,9]], RESULT: [[1,2,3]]},
{TARGET: [[2,5]], BASE: [[6,1],[1,2],[1,3]], OUT:[[8,9]], RESULT: [[1,2,3]]},
{TARGET: [[6,3]], BASE: [[1,1],[5,2],[1,3]], OUT:[[8,9]], RESULT: [[1,2,3]]},
];
*/