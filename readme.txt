从TILED地图编辑器导出JSON格式地图，并在HTML5中直接使用其data对象
建立背景/前景图层，导出背景/前景地图，另外建一个碰撞层，导出障碍地图，用于路径查找
需要改进A*对象类，

1，避免父节点指向自身导致的无限循环，
2，查找这个问题的原因是否与FLAG有关，并规范所有FLAG. 

为了使用地图自动生成的障碍地图，最好0为 unuse 1 close/obstacle 2 open，start和end不使用flag
//Flag -1 unuse, 0: open, 1: close, 2: start, 3: end
修改为
//Flag 0 unuse; 1: close/obstacle; 2: open; 3: start; 4: end
并定义常量
var AS_UNUSE = 0;
var AS_CLOSE = 1;
var AS_OPEN = 2;
var AS_START = 3;
var AS_END = 4;

3，增加路径函数异常返回



Astar路径搜索
astarTest.html	block地图的搜索
hexAstarTest.html	hexagon地图的搜索

使用astarClass.js类，
hexagonClass可以支持横向和竖向六边形
（heaxgonMap.js和astar.js测试用算法，已过时）

测试应用程序
1，测试启动时使用canvas对话框（OK)
2，测试新的图像列表json数组，
var imageList = [{"id":0,"name":"CherryBomb.png","obj":null,"src":"res/Card/Plants/CherryBomb.png"},{"id":1,"name":"Chomper.png","obj":null,"src":"res/Card/Plants/Chomper.png"},{"id":2,"name":"Jalapeno.png","obj":null,"src":"res/Card/Plants/Jalapeno.png"},{"id":3,"name":"Peashooter.png","obj":null,"src":"res/Card/Plants/Peashooter.png"},];

该数组包括了image对象，在装载时初始化，而且该数字能够由程序自动生成，id号与数组中的位置匹配。
新增对象时，最好增加到图像列表的后面，以免影响现有代码，或者代码中通过名称查找。

3，测试使用多个图片组成的动画列表

4，测试使用多个图片组成的，而且分部分的动画列表

var tweenAnmatePara = {name:'Animate', frameCount:12, alpha:0.8, interval:8, offsetX:0, offsetY:0, 
						width:101, height:66,
						frames:[
								[{id:57, x:0, y:0}, {id:56, x:30, y:20},{id:59, x:30, y:0},],
								[{id:57, x:0, y:0}, {id:56, x:30, y:20},{id:59, x:30, y:0},],
								[{id:57, x:0, y:0}, {id:58, x:30, y:20},{id:60, x:21, y:-9},],
								[{id:57, x:0, y:0}, {id:58, x:30, y:20},{id:60, x:21, y:-9},],
								[{id:57, x:0, y:0}, {id:56, x:30, y:20},{id:59, x:30, y:0},],
								[{id:57, x:0, y:0}, {id:56, x:30, y:20},{id:59, x:30, y:0},],
								[{id:57, x:0, y:0}, {id:58, x:30, y:20},{id:60, x:21, y:-9},],
								[{id:57, x:0, y:0}, {id:58, x:30, y:20},{id:60, x:21, y:-9},],
								[{id:57, x:0, y:0}, {id:58, x:30, y:20},{id:60, x:21, y:-9},],
								[{id:57, x:0, y:0}, {id:58, x:30, y:20},{id:60, x:21, y:-9},],
								[{id:57, x:0, y:0}, {id:58, x:30, y:20},{id:60, x:21, y:-9},],
								[{id:57, x:0, y:0}, {id:58, x:30, y:20},{id:60, x:21, y:-9},],
								],
						};
可见动画有12帧，并分为三部分，其中第一部分固定为57（body），而第二部分eye为56（open）或58（close），第三部分cap为59（light）或60（nolight）


5，进一步支持每个动画部分的基于矩阵的转换

var tweenAnmatePara = {name:'Animate', frameCount:12, alpha:0.8, interval:8, offsetX:0, offsetY:0, 
						width:100, height:100,
						frames:[
								[{id:57, x:0, y:20}, {id:56, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:59, x:0, y:0, matrix:[1, 0, 0, 1, 40, 10]}],
								[{id:57, x:0, y:20}, {id:56, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:59, x:0, y:0, matrix:[1, 0, 0, 1, 40, 0]},],
								[{id:57, x:0, y:20}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:1},],
								[{id:57, x:0, y:20}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:11},],
								[{id:57, x:0, y:20}, {id:56, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:59, x:0, y:0, matrix:[1, 0, 0, 1, 40, 10]}],
								[{id:57, x:0, y:20}, {id:56, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:59, x:0, y:0, matrix:[1, 0, 0, 1, 40, 0]}],
								[{id:57, x:0, y:20}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:1},],
								[{id:57, x:0, y:20}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:11},],
								[{id:57, x:0, y:20}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:1},],
								[{id:57, x:0, y:20}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:11},],
								[{id:57, x:0, y:20}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:1},],
								[{id:57, x:0, y:20}, {id:58, x:0, y:0, matrix:[1, 0, 0, 1, 30, 40]},{id:60, x:31, y:11},],
								],
						};
	
6，复合变换


例1 绕任意点C=［Cx Cy］的旋转变换。图2.28总的变换可通过三个基本变换复合而成。先进行平移交换，平移量为-Cx和-Cy，然后绕原点旋转θ角，最后再进行平移量为Cx和Cy的平移变换。因此，任一点P经过逐次变换后的齐次坐标为


1 0 dx		cos  -sin 0    1 0 -dx
0 1 dy		sin  cos  0    0 1 -dy	=
0 0 1		0    0    1    0 0 1


cos -sin -cos*dx+sin*dy+dx
sin cos  -sin*dx-cos*dy+dy
0    0    1


当theta = PI*3/4 = 135, dx=dy=50时, cos = 0.707, sin = -0.707
matrix = [0.707, -0.707, 0.707, 0.707, -20.7, 50]

当theta = PI*4 = 45, dx=150, dy=50时, cos = -0.707, sin = 0.707
matrix = [0.707, 0.707, -0.707, 0.707, 79.3, -91.4]


7，每个部分分别作变换有些困难，不好组合，如果存在旋转，需要分割为小canvas, 最后将小的canvas组合

8，增加每个部分的alpha操作

9，是否能从界面上自动生成，将每个部分在界面上摆放，并设置alpha等属性后，自动生成json动画参数



PngAnimate: 帧动画，动画来自一个图片，通过帧数截取其中的一部分循环显示
PngAnimate2: 帧动画，动画来自多个图片，循环显示
PngAnimate3: 组合帧动画，动画来自多个图片，根据参数将其显示在特定部分
PngAnimate4: 组合帧动画的改进，动画来自多个图片，根据参数将其显示在特定部分，与PngAnimate3不同的是，动画参数是根据每个帧的坐标设置即可，简化的参数的确定，特别是存在旋转的情况，

PngAnimate4也可以用于代替PngAnimate帧动画，可以自由使用横向和纵向帧动画资源。

10，结合矢量和位图，在大尺度，简单图像使用矢量描述，而小尺度，精细图像使用位图描述
矢量图的自动化程度还是比较低，除非能大量减小位图体积，一般尽量少采用

bug
动画参数坐标为浮点数时，动画无法显示，可能由于浮点数坐标计算问题造成，可以将所有目标大小统一为整型
如果源坐标超出资源坐标范围，chrome不会报错，而firefox不能显示，应当注意


11, 由SKETCH生成动画资源，首先解决了生成透明背景的PNG图片问题，然后利用摄像机移动的ruby脚本自动生成动画图片
最后在浏览器中显示。

12，测试CHROME音频问题，好像用OGG没有问题，MP3很快会崩溃

13，自动生成音频列表，类似图像，将资源对象改为path，name，ext三部分以便根据浏览器加载不同的音频格式文件