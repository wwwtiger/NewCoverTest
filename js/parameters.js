	
	//Map data from tile map tools
	var mapPara = { mapRows:10, mapCols:10, mapGridW:48, mapGridH:48,
		 imgRows:16, imgCols:16, gridW:32, gridH:32, offsetX:0, offsetY:0, imgIndex:90,
         data:[66, 67, 68, 69, 70, 97, 97, 97, 97, 97, 82, 83, 84, 85, 86, 97, 129, 130, 131, 132, 98, 99, 100, 101, 102, 97, 145, 146, 147, 148, 114, 115, 116, 117, 118, 97, 161, 162, 163, 164, 17, 109, 19, 20, 21, 22, 25, 26, 27, 97, 33, 107, 108, 109, 110, 107, 108, 109, 110, 97, 49, 50, 51, 52, 53, 54, 57, 58, 59, 97, 209, 210, 211, 209, 210, 211, 2, 209, 210, 211, 213, 214, 215, 213, 214, 215, 213, 214, 213, 214, 213, 214, 215, 213, 214, 215, 213, 214, 213, 214],
         astarData:[1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         };
	
	
	//Use single image file
	var animatePara = [
					{name:'sunAnimate', imgIndex:50, frameCount:22, alpha:0.8, interval:8, offsetX:0, offsetY:0},
				];
	
	//Use multiple image files
	var newAnimatePara = {name:'Animate', frameCount:8, alpha:0.8, interval:8, offsetX:0, offsetY:0, 
						width:113, height:87,imageIndexes:[15,16,17,18,19,20,21,22],
						};
	/*
		matrix
		x	a	c	e		x'
		y=	b	d	f	*	y'
		z	0	0	1		z'
		
		e f = translate(x, y)
		a d = scale(x, y)
		rotate    a = cos;  b = sin;  c = -sin; d = cos
	*/
	
	
	var tweenAnimatePara = {name:'Animate', frameCount:12, alpha:0.8, interval:8, offsetX:0, offsetY:0, 
						width:100, height:100,
						frames:[
								//[{id:57, x:0, y:0, matrix:[0.707, -0.707, 0.707, 0.707, -20.7, 50]}, {id:58, x:0, y:0, matrix:[0.707, -0.707, 0.707, 0.707, 29.3, 50]},{id:59, x:0, y:0, matrix:[1, 0, 0, 1, 40, 10]}],
								//[{id:57, x:0, y:0, matrix:[0.707, 0.707, -0.707, 0.707, 79.3, -91.4]}, {id:58, x:0, y:0, matrix:[0.707, 0.707, -0.707, 0.707, 28.79,12.07]},{id:59, x:0, y:0, matrix:[1, 0, 0, 1, 40, 0]},],
								//[{id:57, x:0, y:0, matrix:[0.707, -0.707, 0.707, 0.707, 0, 0]}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:1},],
								//[{id:57, x:0, y:0, matrix:[0.707, -0.707, 0.707, 0.707, 0, 0]}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:11},],
								[{id:75, x:0, y:20, }, {id:74, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:77, x:0, y:0, matrix:[1, 0, 0, 1, 40, 10]}],
								[{id:75, x:0, y:20, }, {id:74, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:77, x:0, y:0, matrix:[1, 0, 0, 1, 40, 0]},],
								[{id:75, x:0, y:20, alpha:0.9}, {id:76, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:78, x:31, y:1},],
								[{id:75, x:0, y:20, alpha:0.8}, {id:76, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:78, x:31, y:11},],
								[{id:75, x:0, y:20, alpha:0.7}, {id:74, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:77, x:0, y:0, matrix:[1, 0, 0, 1, 40, 10]}],
								[{id:75, x:0, y:20, alpha:0.6}, {id:74, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:77, x:0, y:0, matrix:[1, 0, 0, 1, 40, 0]}],
								[{id:75, x:0, y:20, alpha:0.5}, {id:76, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:78, x:31, y:1},],
								[{id:75, x:0, y:20, alpha:0.4}, {id:76, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:78, x:31, y:11},],
								[{id:75, x:0, y:20, alpha:0.3}, {id:74, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:78, x:31, y:1},],
								[{id:75, x:0, y:20, alpha:0.2}, {id:74, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:78, x:31, y:11},],
								[{id:75, x:0, y:20, alpha:0.1}, {id:76, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:78, x:31, y:1},],
								[{id:75, x:0, y:20, alpha:1}, {id:76, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:78, x:31, y:11},],
								],
						};
	
	var tweenAnimatePara2 = {name:'SunFlowerAnimate', frameCount:7, interval:16, offsetX:0, offsetY:0, 
						width:80, height:60,
						frames:[
								[{id:82, x:0, y:0, }, {id:83, x:10, y:10, alpha:1}],
								[{id:82, x:0, y:0, }, {id:84, x:10, y:10, alpha:1},],
								[{id:82, x:0, y:0, }, {id:85, x:10, y:10, alpha:0.9},],
								[{id:82, x:0, y:0, }, {id:86, x:10, y:10, alpha:0.9},],
								[{id:82, x:0, y:0, }, {id:87, x:10, y:10, alpha:0.9}],
								[{id:82, x:0, y:0, }, {id:88, x:10, y:10, alpha:1}],
								[{id:82, x:0, y:0, }, {id:89, x:10, y:10, alpha:1},],
								],
						};
						
		
		var sketchupAnimatePara = {name: 'sketchupAnimate', frameCount:16, interval:8, offsetX:0, offsetY:0, 
					width:100, height:100,
					frames:[
							[{id:58, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:59, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:60, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:61, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:62, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:63, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:64, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:65, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],

							[{id:66, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:67, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:68, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:69, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:70, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:71, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:72, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],
							[{id:73, sx:0, sy:0, sw:100, sh:100, dx:0, dy:0, dw:100, dh:100, }],							
						],
					};
/*
var dayTime = 1;
var imgNum = 88;

//{id:0, name:'wwwtiger0', currentFlag:1, bonus:1000},
var userList = [];


var orgZombieQueue = [
			[ {type:5, row:0}, {type:2, row:1}, {type:0, row:3}],  //row 0, 1, 2, 3, 4, if row < 0, random row, row > 0 , row = row % BLOCK_ROW
			[],
			[{type:5, row:1},],
			[ {type:0, row:4}, {type:3, row:1}, {type:4, row:2}],  //type 0, 1, 2, 3, 4, 5 else type = 0
			[ {type:1, row:2}, {type:4, row:4}, {type:3, row:3}],
		      ]; 

//稳扎稳打，两翼齐飞，剑走偏锋，声东击西，随机应变, 孤注一掷
var levelList = [
			{id:0, name:'wzwd', currentFlag:1, difficult:1, zombieAccount:1000, AttackCount:20, queue:orgZombieQueue},
			{id:1, name:'lyqf', currentFlag:0, difficult:2, zombieAccount:2000, AttackCount:20, queue:orgZombieQueue},
			{id:2, name:'jzpf', currentFlag:0, difficult:3, zombieAccount:3000, AttackCount:20, queue:orgZombieQueue},
			{id:3, name:'sdjx', currentFlag:0, difficult:4, zombieAccount:4000, AttackCount:20, queue:orgZombieQueue},
		];

		
var packageObj = {
					pid:0, name:'default', startBonue:'0', gameCount:4, 
					[
						{gid:0, name:'a', lastResult:0, nightIndex:0, queueId:1},
						{gid:1, name:'b', lastResult:0, nightIndex:0, queueId:2},
					],
				};
				
//{uid:0, pid:0, gid, flag:0, tm:'20120909120000'},	 //flag  win:1, lost:0, abort:2		
var userRecords = [];


var zombiePara = [
			{name:'normalZombie', 	 type:0, imgIndex:1, animateIndex:1,	price:100}, 
			{name:'coneZombie', 	 type:1, imgIndex:1, animateIndex:1,	price:150}, 
			{name:'bucketZombie', 	 type:2, imgIndex:1, animateIndex:1,	price:200}, 
			{name:'newspaperZombie', type:3, imgIndex:1, animateIndex:1, 	price:125}, 
			{name:'jumpZombie', 	 type:4, imgIndex:1, animateIndex:1,	price:150}, 
			{name:'screenDoorZombie', 	 type:5, imgIndex:1, animateIndex:1,	price:175}, 
		];	
				

//Restore count = replant count
var plantCardPara = [	
			{name:'sunFlower', 	type:0, imageIndex:1, 	price:50, 	orgWorkCount:1200, 	orgLive:2000, 	orgRestoreCount:600, 	currentRestoreCount:600},
			{name:'peaShooter', 	type:1, imageIndex:2, 	price:100, 	orgWorkCount:120, 	orgLive:5000, 	orgRestoreCount:600, 	currentRestoreCount:600},
			{name:'wallNut', 	type:2, imageIndex:9, 	price:50, 	orgWorkCount:200, 	orgLive:20000, 	orgRestoreCount:1000, 	currentRestoreCount:1000},
			{name:'potatoMine', 	type:7, imageIndex:31, 	price:25, 	orgWorkCount:2000, 	orgLive:2000, 	orgRestoreCount:1500, 	currentRestoreCount:1500},
			{name:'chomper', 	type:9, imageIndex:52, 	price:75, 	orgWorkCount:2000, 	orgLive:2000, 	orgRestoreCount:1000, 	currentRestoreCount:1000},
			{name:'pumpkin', 	type:6, imageIndex:19, 	price:125, 	orgWorkCount:300, 	orgLive:15000, 	orgRestoreCount:1000, 	currentRestoreCount:1000},
			{name:'cherryBomb', 	type:8, imageIndex:51, 	price:125, 	orgWorkCount:60, 	orgLive:2000, 	orgRestoreCount:2000, 	currentRestoreCount:2000},
			{name:'snowPeaShooter', type:4, imageIndex:14, 	price:150, 	orgWorkCount:100, 	orgLive:5000, 	orgRestoreCount:1000, 	currentRestoreCount:1000},
			{name:'jalapeno', 	type:3, imageIndex:5, 	price:175, 	orgWorkCount:60, 	orgLive:2000, 	orgRestoreCount:2000, 	currentRestoreCount:2000},
		];	
		


var armorPara = [
			{type:0, resistCount:0, hitPower: 1, walkAnimateIndex:0, attackAnimateIndex:1}, //Normal/cone/bucket/Screen door
			{type:1, resistCount:50, hitPower: 2, walkAnimateIndex:6, attackAnimateIndex:7}, //Cone
			{type:2, resistCount:100, hitPower: 3, walkAnimateIndex:8, attackAnimateIndex:9}, //Bucket
			{type:3, resistCount:0, hitPower: 0.5, walkAnimateIndex:4, attackAnimateIndex:5}, //Normal/cone/bucket/Screen door lost head
			
			{type:41, resistCount:10, hitPower: 1, walkAnimateIndex:27, attackAnimateIndex:28}, //Newspaper
			{type:42, resistCount:0, hitPower: 3, walkAnimateIndex:29, attackAnimateIndex:30},  //Newspaper lost
			{type:43, resistCount:0, hitPower: 0.5, walkAnimateIndex:31, attackAnimateIndex:32}, //Newspaper lost head
			
			{type:51, resistCount:50, hitPower: 0, walkAnimateIndex:35, attackAnimateIndex:35}, //Jump
			{type:52, resistCount:0, hitPower: 1, walkAnimateIndex:36, attackAnimateIndex:37},  //After jump
			{type:53, resistCount:0, hitPower: 0.5, walkAnimateIndex:38, attackAnimateIndex:39}, //Jump lost head
			
			{type:61, resistCount:100, hitPower: 2, walkAnimateIndex:49, attackAnimateIndex:50}, //Screen door
		];
				
*/	
/*
背景图片1400×600，只显示1000×600，而且SourceX偏移-100

草地坐标 256 60  / 978 82 /  238 568 / 987 573 近似矩形 255 80 / 975 570 长720 宽490
分9列5行，每列80，行98

*/
var CAPTION_COLOR = 'black';

var INIT_ACCOUNT = 300;
var INIT_ZOMBIE_ACCOUNT	= 3000;
			
var BK_W = 1000, BK_H = 600; 
var BK_OFFSET_X = -100, BK_OFFSET_Y = 0;

//var LAWN_OFFSET_X = 255, LAWN_OFFSET_Y = 80;
var LAWN_W = 720, LAWN_H = 490;

var BLOCK_COL = 9, BLOCK_ROW = 5;
var ZOMBIE_HIT_COL_OFFSET = 0.875; //More little, more early attack

var BLOCK_OFFSETX = 155; //150;
var BLOCK_OFFSETY = 80; //75;
var BLOCK_W = LAWN_W / BLOCK_COL; //80
var BLOCK_H = LAWN_H / BLOCK_ROW; //98

//Distantce zombie can be hitted by bullet
var HIT_DISTANCE_X = 10;
var HIT_DISTANCE_Y = 0;

var SUN_COLLECTOR_X = 100;
var SUN_COLLECTOR_Y = 10;	

var PLANT_CARD_OX = 10;
var PLANT_CARD_OY = 50;
var PLANT_CARD_W = 90;
var PLANT_CARD_H = 50;

var SHOVEL_X = SUN_COLLECTOR_X + 150;
var SHOVEL_Y = SUN_COLLECTOR_Y;
var SHOVEL_W = 80;
var SHOVEL_H = 40;

var START_BTN_X = SUN_COLLECTOR_X + 415;
var START_BTN_Y = SUN_COLLECTOR_Y;

var PRICE_OFFSET_X = -25;
var PRICE_OFFSET_Y = -5;

var PLANT_OFFSET_X = 5;
var PLANT_OFFSET_Y = 5;

var ZOMBIE_START_X = 900;
var ZOMBIE_END_X = 20;

var ACCOUNT_X = SUN_COLLECTOR_X + 45, ACCOUNT_Y = SUN_COLLECTOR_Y + 28;
var ACCOUNT_FONT_SIZE = 25;
var PRICE_FONT_SIZE = 12;

//进度条大小
var PLANT_CARD_PROGRESS_W = 80;
var PLANT_CARD_PROGRESS_H = 5;
var PLANT_PROGRESS_W = 60;
var PLANT_PROGRESS_H = 5;

var GRAVITY = 0.02;

/*
速度表示为 距离/帧数，即在1帧内走过的距离
*/
var BULLET_FALL_SPEED 	= BLOCK_H / 100; 	//1; 
var SUNPIECE_FALL_SPEED = BLOCK_H / 200 	//0.5; 
var CORN_BULLET_FALL_SPEED = -BLOCK_H / 100; 	//-1;
var ZOMBIE_MOVE_SPEED = -BLOCK_W / 320; //400; 	//-0.15;
var BULLET_MOVE_SPEED = BLOCK_W / 16; 		//5;

var HIGHLIGHT_MARGIN = 3;
var HIGHLIGHT_LINEWIDTH = 5;
var PLANTCARD_INTERVAL = 10;

var PROGRESSBAR_X  = SUN_COLLECTOR_X + 250;
var PROGRESSBAR_Y  = SUN_COLLECTOR_Y + 20;
var PROGRESS_BORDER = 1;

//以可用宽度作为缩放比
var SCREEN_SCALE = 1;

function scaleParaByScreen()
{
	//var scaleX = window.screen.availWidth / BK_W ;
	//var scaleY = window.screen.availHeight / (BK_H + 150);
	
	var scaleX = window.innerWidth / BK_W;
	var scaleY = window.innerHeight / BK_H;

	SCREEN_SCALE = scaleX < scaleY ? scaleX : scaleY; 
	
	//Scale the parameters
	BK_W = BK_W*SCREEN_SCALE;
	BK_H = BK_H*SCREEN_SCALE; 
	BK_OFFSET_X = BK_OFFSET_X*SCREEN_SCALE;
	BK_OFFSET_Y = BK_OFFSET_Y*SCREEN_SCALE;

	LAWN_W = LAWN_W*SCREEN_SCALE;
	LAWN_H = LAWN_W*SCREEN_SCALE;

	BLOCK_OFFSETX = BLOCK_OFFSETX*SCREEN_SCALE;
	BLOCK_OFFSETY = BLOCK_OFFSETY*SCREEN_SCALE;
	BLOCK_W = BLOCK_W*SCREEN_SCALE;
	BLOCK_H = BLOCK_H*SCREEN_SCALE;

	HIT_DISTANCE_X = HIT_DISTANCE_X*SCREEN_SCALE;
	HIT_DISTANCE_Y = HIT_DISTANCE_Y*SCREEN_SCALE;

	SUN_COLLECTOR_X = SUN_COLLECTOR_X*SCREEN_SCALE;
	SUN_COLLECTOR_Y = SUN_COLLECTOR_Y*SCREEN_SCALE;	

	PLANT_CARD_OX = PLANT_CARD_OX*SCREEN_SCALE;
	PLANT_CARD_OY = PLANT_CARD_OY*SCREEN_SCALE;
	PLANT_CARD_W = PLANT_CARD_W*SCREEN_SCALE;
	PLANT_CARD_H = PLANT_CARD_H*SCREEN_SCALE;
	
	SHOVEL_X = SHOVEL_X*SCREEN_SCALE;
	SHOVEL_Y = SHOVEL_Y*SCREEN_SCALE;
	SHOVEL_W = SHOVEL_W*SCREEN_SCALE;
	SHOVEL_H = SHOVEL_H*SCREEN_SCALE;
	
	START_BTN_X = START_BTN_X*SCREEN_SCALE;
	START_BTN_Y = START_BTN_Y*SCREEN_SCALE;
	
	PRICE_OFFSET_X = PRICE_OFFSET_X*SCREEN_SCALE;
	PRICE_OFFSET_Y = PRICE_OFFSET_Y*SCREEN_SCALE;
	
	PLANT_OFFSET_X = PLANT_OFFSET_X*SCREEN_SCALE;
	PLANT_OFFSET_Y = PLANT_OFFSET_Y*SCREEN_SCALE;
	
	ZOMBIE_START_X = ZOMBIE_START_X*SCREEN_SCALE;
	ZOMBIE_END_X = ZOMBIE_END_X*SCREEN_SCALE;
	
	ACCOUNT_X = ACCOUNT_X*SCREEN_SCALE;
	ACCOUNT_Y = ACCOUNT_Y*SCREEN_SCALE;
	ACCOUNT_FONT_SIZE = ACCOUNT_FONT_SIZE*SCREEN_SCALE;
	PRICE_FONT_SIZE = PRICE_FONT_SIZE*SCREEN_SCALE;
	
	PLANT_CARD_PROGRESS_W = PLANT_CARD_PROGRESS_W*SCREEN_SCALE;
	PLANT_CARD_PROGRESS_H = PLANT_CARD_PROGRESS_H*SCREEN_SCALE;
	PLANT_PROGRESS_W = PLANT_PROGRESS_W*SCREEN_SCALE;
	PLANT_PROGRESS_H = PLANT_PROGRESS_H*SCREEN_SCALE;
	
	GRAVITY = GRAVITY*SCREEN_SCALE;
	BULLET_FALL_SPEED = BULLET_FALL_SPEED*SCREEN_SCALE;
	SUNPIECE_FALL_SPEED = SUNPIECE_FALL_SPEED*SCREEN_SCALE; 
	CORN_BULLET_FALL_SPEED = CORN_BULLET_FALL_SPEED*SCREEN_SCALE;
	ZOMBIE_MOVE_SPEED = ZOMBIE_MOVE_SPEED*SCREEN_SCALE;
	BULLET_MOVE_SPEED = BULLET_MOVE_SPEED*SCREEN_SCALE;
	
	HIGHLIGHT_MARGIN = HIGHLIGHT_MARGIN*SCREEN_SCALE;
	HIGHLIGHT_LINEWIDTH = HIGHLIGHT_LINEWIDTH*SCREEN_SCALE;
	
	PLANTCARD_INTERVAL = PLANTCARD_INTERVAL*SCREEN_SCALE;
	
	PROGRESSBAR_X  = PROGRESSBAR_X*SCREEN_SCALE;
	PROGRESSBAR_Y  = PROGRESSBAR_Y*SCREEN_SCALE;
	PROGRESS_BORDER = PROGRESS_BORDER*SCREEN_SCALE; 
}


