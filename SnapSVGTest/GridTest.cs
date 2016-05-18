using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Collections;
using System.Windows.Forms;

using System.IO;
using System.Runtime.Serialization.Json;

namespace WindowsFormsApplication1
{
    public class PuzzleResultInfo
    {
        public int blockIndex { get; set; }
        public int posIndex { get; set; }
    }

    public class PuzzlePos
    {
        public int col { get; set; }
        public int row { get; set; }
    }

    public class BlockResult
    {
        public double angle { get; set; }
        public PuzzlePos[] pos { get; set; }
    }

    public class PuzzleResult
    {
        public string blockName { get; set; }
        public bool useFlag { get; set; }
        public BlockResult[] result { get; set; }
    }

    class GridTest
    {
        public static int BK_ROWS = 10;
        public static int BK_COLS = 10;
        public static int GRID_EMPTY = 0;
        public static int GRID_INVALID = 1;

        public static int[] piorityIndex = {6, 7, 8, 3, 4, 1, 2, 0, 9, 10, 11, 5};

        public static Stack<PuzzleResultInfo> allSolutionStack = new Stack<PuzzleResultInfo>(); //[{blockIndex:0, posIndex:0},{blockIndex:1, posIndex:1}]
        public static Dictionary<String, int> validMap = new Dictionary<string, int>();

        public static ArrayList allSolutionList = new ArrayList();

        public static ArrayList validPoints = new ArrayList();
        public static PuzzleResult[] results = null;
        public static int[,] allGrids = null;
        public static DataContractJsonSerializer ds;

        public static void startFind()
        {
            ds = new DataContractJsonSerializer(typeof(PuzzleResultInfo[]));

            initValidPoints(); //初始化有效点
            initValidMap();
            allGrids = initBrainPuzzleGrids();
            getResultArrayFromFile(); //从JS得到所有可能的结果列表
            String ignoredName = "R";
            setIgnoreName(ignoredName);
            findAllSolutions();

            String info = "Find all finished, ignored: " + ignoredName + ", count: " + allSolutionList.Count.ToString();
            MessageBox.Show(info);

            saveSolutionListToFile();
        }

        //var specialList = [0, 9, 11]; //['A', 'J', 'R'];
        public static void setIgnoreName(string name)
        {
            for (int i = 0; i < results.Length; i++)
            {
                results[i].useFlag = false;
                if(results[i].blockName.Equals(name))
                    results[i].useFlag = true;
            }
        }

        public static int[,] initBrainPuzzleGrids()
        {
	        int[,] grids = new int[BK_COLS, BK_ROWS];
	        for(var i=0; i<BK_COLS; i++)
	        {
		        for(var j=0; j<BK_ROWS; j++)
		        {
                    grids[i,j] = GRID_INVALID;
		        }
	        }
	
	        for(var i=0; i<validPoints.Count;i++)
	        {
		        //grids[VALID_POINTS[i].col][VALID_POINTS[i].row] = VALID;
                int[] key = (int[])validPoints[i];
                grids[key[0],key[1]] = GRID_EMPTY;
	        }
	
	        return grids;
        }

        public static void resetGrid(int[,] grids)
        {
            for (var i = 0; i < validPoints.Count; i++)
            {
                //grids[VALID_POINTS[i].col][VALID_POINTS[i].row] = VALID;
                int[] key = (int[])validPoints[i];
                grids[key[0], key[1]] = GRID_EMPTY;
            }
        }

        public static void initValidMap()
        {
	        for(int i=0; i<validPoints.Count; i++)	 
            {
		        int[] key = (int[])validPoints[i];
                String keyStr = key[0].ToString() + "_" + key[1].ToString();
                validMap[keyStr] = 0;
	        }
        }

        public static void addPosArrayToMap(PuzzlePos[] pps)
        {
	        foreach(PuzzlePos p in pps)
	        {
		        var key = p.col.ToString() +"_"+p.row.ToString();
		        validMap[key] = 1;
	        }
        }

        public static void removePosArrayFromMap(PuzzlePos[] pps)
        {
            foreach (PuzzlePos p in pps)
            {
                var key = p.col.ToString() + "_" + p.row.ToString();
                validMap[key] = 0;
            }
        }

        public static bool checkPosArrayOnMap(PuzzlePos[] pps) //true: occupied, false: empty
        {
	        var flag = false;
            foreach (PuzzlePos p in pps)
	        {
                var key = p.col.ToString() + "_" + p.row.ToString();
		        if(validMap[key] == 1)
		        {
			        flag = true;
			        break;
		        }
	        }
	        return flag;
        }

        public static void initValidPoints()
        {
	        validPoints.Clear();

	        for(var i=4; i>=0; i--)
	        {
		        var startIndex = 4 - i;
		        var count = i * 2 + 1;
		        for(var j=startIndex; j<(count + startIndex); j++)
		        {
			        validPoints.Add(new int[]{i,j}); //.push({col:i, row:j});
		        }
	        }
	
	        for(var i=5; i<10; i++)
	        {
		        var startIndex = i - 4;
		        var count = (9 - i) * 2 + 1;
		        for(var j=startIndex; j<(count + startIndex); j++)
		        {
                    validPoints.Add(new int[] { i, j });
		        }
	        }
        }

        public static void getResultArray()
        {
            String resultListStr = @"[{""blockName"":""A"",""useFlag"":true,
            ""result"":[{""angle"":0,""pos"":[{""col"":4,""row"":3},{""col"":5,""row"":3},{""col"":6,""row"":3},{""col"":6,""row"":2}]}] }]";

            //将Json字符串转化成对象
            DataContractJsonSerializer outDs = new DataContractJsonSerializer(typeof(PuzzleResult[]));
            using (MemoryStream outMs = new MemoryStream(Encoding.Default.GetBytes(resultListStr)))
            {
                PuzzleResult[] results = outDs.ReadObject(outMs) as PuzzleResult[];
                String str = "";

                foreach (PuzzleResult pr in results)
                {
                    str += "==============PATH OBJ=====================\r\n";
                    str += "block name:" + pr.blockName + "\r\n";
                }
            }
        }

        public static void saveSolutionListToFile()
        {
            SaveFileDialog sfd = new SaveFileDialog();
            sfd.DefaultExt = "js";
            sfd.AddExtension = true;
            sfd.Filter = "js文档(*.js)|*.js|所有文件(*.*)|*.*";
            if (sfd.ShowDialog() != DialogResult.OK)
                return;

            StreamWriter sw = new StreamWriter(sfd.FileName, true, Encoding.Default);
            sw.WriteLine("[");
            //将对象转化成Json字符串
            //DataContractJsonSerializer ds = new DataContractJsonSerializer(typeof(String));
            for(int i=0; i<allSolutionList.Count; i++)
            {
                sw.Write(allSolutionList[i]);
                sw.WriteLine(",");
            }
            sw.WriteLine("]");
            sw.Close();
        }

        public static void getResultArrayFromFile()
        {
            OpenFileDialog dialog = new OpenFileDialog();
            dialog.Multiselect = false;
            dialog.DefaultExt = "*.txt";
            dialog.AddExtension = true;
            dialog.Filter = "所有文件(*.*)|*.*";

            if (dialog.ShowDialog() != DialogResult.OK)
                return;

            //将Json字符串转化成对象
            DataContractJsonSerializer outDs = new DataContractJsonSerializer(typeof(PuzzleResult[]));

            //FileStream fs = new FileStream(dialog.FileName, FileMode.Open, FileAccess.Read);
            StreamReader sr = new StreamReader(dialog.FileName, Encoding.Default);
            results = outDs.ReadObject(sr.BaseStream) as PuzzleResult[];
            
            sr.Close();

        }
        
        public static int getPIndex(int index)
        {
	        for(var i=0; i<piorityIndex.Length; i++)
	        {
		        if(index == piorityIndex[i])
			        return i;
	        }
	
	        return -1;
        }


        public static int getNextBlockIndex()
        {
            var pIndex = -1;
            if (allSolutionStack.Count == 0)
                pIndex = 0;
            else
            {
                PuzzleResultInfo pri = (PuzzleResultInfo)allSolutionStack.Peek();
                pIndex = getPIndex(pri.blockIndex);
                if (pIndex == -1)
                    return -1;
                pIndex++;
            }

            if (pIndex >= piorityIndex.Length)
                return -1;

            PuzzleResult pr = (PuzzleResult)results[piorityIndex[pIndex]];

            if (pr.useFlag == true)
                pIndex++;

            if (pIndex >= piorityIndex.Length)
                return -1;

            return piorityIndex[pIndex];
        }

        public static void addPosArrayToGrid(PuzzlePos[] pps)
        {
            for (int i = 0; i < pps.Length; i++)
            {
                allGrids[pps[i].col, pps[i].row] = GRID_INVALID;
            }
        }

        public static void removePosArrayFromGrid(PuzzlePos[] pps)
        {
            for (int i = 0; i < pps.Length; i++)
            {
                allGrids[pps[i].col, pps[i].row] = GRID_EMPTY;
            }
        }


         public static bool checkPos(int blockIndex, int posIndex)
        {
            PuzzlePos[] pps = results[blockIndex].result[posIndex].pos;
	        var flag = checkPosArrayOnMap(pps);
	        if(flag)
		        return false;

            addPosArrayToGrid(pps);
            flag = hasSinglePoint(allGrids);
            removePosArrayFromGrid(pps);

            if (flag)
                return false;

            return true;
         }

        public static void findAllSolutions()
        {
	        var blockIndex = getNextBlockIndex();
	        //var findFlag = false;
	        if(blockIndex == -1)
		        return;
	
            PuzzleResult pr = (PuzzleResult)results[blockIndex];
	        for(var posIndex=0; posIndex<pr.result.Length; posIndex++)
	        {
		        if(checkPos(blockIndex, posIndex) == true)
		        {
			        //findFlag = true;
			        var posArray = results[blockIndex].result[posIndex].pos;
			
			        //Add to stack and mark on map
                    PuzzleResultInfo pri = new PuzzleResultInfo();
                    pri.blockIndex = blockIndex;
                    pri.posIndex = posIndex;
			        allSolutionStack.Push(pri);
			        addPosArrayToMap(posArray); //Add to check map(for overlap)
                    addPosArrayToGrid(posArray); //Add to check grid(for isolate grid)

			        if(allSolutionStack.Count == 11)
			        {
				        //Add to solution list
				        //allSolutionList.Add(allSolutionStack); //Error: not deep copy

                        //将对象转化成Json字符串
                        PuzzleResultInfo[] pris = (PuzzleResultInfo[])allSolutionStack.ToArray<PuzzleResultInfo>();
                        using (MemoryStream ms = new MemoryStream())
                        {
                            GridTest.ds.WriteObject(ms, pris);
                            string resultStr = Encoding.UTF8.GetString(ms.ToArray());
                            //Console.WriteLine(output);
                            allSolutionList.Add(resultStr);
                        }





				        //drawOneSolution(allSolutionStack);
				        //console.log("Find one");
				
				        //Rmove and clear map
				        allSolutionStack.Pop();
                        removePosArrayFromMap(posArray);//Remove from check map(for overlap)
                        removePosArrayFromGrid(posArray); //Remove from check grid(for isolate grid)
				        break;
			        }
			        else
			        {
				        findAllSolutions();
			        }
			
			        //Remove and clear map
			        allSolutionStack.Pop();
                    removePosArrayFromMap(posArray);//Remove from check map(for overlap)
                    removePosArrayFromGrid(posArray); //Remove from check grid(for isolate grid)
                }
	        }
	
	        return;
        }

    public static void getPointNeighbourCount(ArrayList neighbours, int[,] tempGrids, int col, int row)
    {
	    if((row<(BK_ROWS-1)) && (tempGrids[col,row+1] == GRID_EMPTY)) 
	    {
		    neighbours.Add(0);
	    }
	    if((col<(BK_COLS-1)) && (tempGrids[col+1,row] == GRID_EMPTY))
	    {
		    neighbours.Add(1);
	    }
	    if((row>0) &&  (tempGrids[col,row-1] == GRID_EMPTY)) 
	    {
		    neighbours.Add(2);
	    }
	    if((col>0) && (tempGrids[col-1,row] == GRID_EMPTY)) 
	    {
		    neighbours.Add(3);
	    }
	
    }

    //根据矩阵检查当前空闲的点中是否有小于等于2个块的孤立点
    public static bool hasSinglePoint(int[,] tempGrids)
    {

        for (var i = 0; i < validPoints.Count; i++)
	    {
            int[] temp = (int[])validPoints[i];
            var col = temp[0];
            var row = temp[1];
		
		    if(tempGrids[col,row] != GRID_EMPTY) 
			    continue;

            var neighbours = new ArrayList();
            getPointNeighbourCount(neighbours, tempGrids, col, row);
					
		    if(neighbours.Count == 0) //
			    return true;
            else if (neighbours.Count == 1) //
		    {
			    var nCol = col;
			    var nRow = row;
			    if((int)neighbours[0] == 0)
				    nRow++;
			    else if((int)neighbours[0] == 1)
				    nCol++;
			    else if((int)neighbours[0] == 2)
				    nRow--;
			    else if((int)neighbours[0] == 3)
				    nCol--;

                neighbours.Clear();
                getPointNeighbourCount(neighbours, tempGrids, nCol, nRow);
                if (neighbours.Count <= 1) 
				    return true;
		    }
	    }
	    return false;
    }
        //////////////////

    }
}
