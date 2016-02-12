	//检查本地存储功能
	function getLocalStorage() 
	{  
		try 
		{  
			if( !! window.localStorage ) 
				return window.localStorage;  
		} 
		catch(e) 
		{  
			return undefined;  
		}  
	}  
	
 	function readLocalData(itemName)
	{
		var db = getLocalStorage();  
		if(db) {
			var objJson = db.getItem(itemName); 
			
			if(objJson!=null)
				return JSON.parse(objJson);
			else
				return null;
		}
		else
		{
			//alert('No local storage support');
			return null;
		}
	}
	
	function writeLocalData(itemName, obj)
	{
		var db = getLocalStorage();  
		if(db) {  
		    db.setItem(itemName, JSON.stringify(obj)); 
		    //alert('Data saved');
		} 
		else{
			//alert('No local storage support');
			return;
		}
	} 
	
	function deleteLocalData(itemName)
	{
		var db = getLocalStorage();  
		if(db) {
			if(arguments.length == 0)
				db.clear();
			else
				db.removeItem(itemName); 
			//alert('Data deleted');
		}
		else{
			//alert('No local storage support');
			return;
		}
	}
	
	////////////////////////////////////////////////////////
	
	
	var userListItemName = "PZ_USER_LIST";
	var levelListItemName = "PZ_LEVEL_LIST";
	var userRecordsItemName = "PZ_USER_RECORDS";
	
	function initLocalStorage()
	{
		//Read users and records info from local storage, level is fixed now
		userList = readLocalData(userListItemName);
		if(userList == null)
		{
			userList = [];
			changeCurrentUser("wwwtiger"); //Default user
		}
		
		var levels = readLocalData(levelListItemName);
		if(levels == null)
			writeLocalData(levelListItemName, levelList);
		else
			levelList = levels;
		
		
		userRecords = readLocalData(userRecordsItemName);
		if(userRecords == null)
			userRecords = [];
		
		//Set zombie queue by level
		var currentLevel = getCurrentLevel();
		if(currentLevel != null)	
			orgZombieQueue = currentLevel.queue;
			
		/*
		//deleteUser("wwwtiger");
		
		//change user
		changeCurrentUser("wwwtiger");
		updateUserRecords(1);
		
		//change level
		changeCurrentLevel(2);
		updateUserRecords(0);
		
		//Read angin
		userList = readLocalData(userListItemName);
		userRecords = readLocalData(userRecordsItemName);
		*/
	}
	
	function deleteUser(userName)
	{
		var uid = null;
		for(index in userList)
		{
			var name = userList[index].name;
			if(name == userName)
			{
				uid = userList[index].id;
				userList.splice(index, 1);
				break;
			}
		}
		
		//Delete user records
		var deleteList = [];
		for(var i=userRecords.length-1; i>=0; i--) //Order by desc
		{
			if(userRecords[i].uid == uid)
				deleteList.push(i);
		}
		for(index in deleteList)
		{
			var deleteObj = userRecords.splice(deleteList[index],1);
			deleteObj = null;
		}
		
		//Write to disk
		writeLocalData(userListItemName, userList);
		writeLocalData(userRecordsItemName, userRecords);
	}
	
	function getMaxId(objList)
	{
		var maxId = -1;
		for(index in objList)
		{
			if(objList[index].id > maxId)
			{
				maxId = objList[index].id;
			}
		}
		return maxId;
	}
	
	function getCurrentUser()
	{
		var user = null;
		for(index in userList)
		{
			if(userList[index].currentFlag == 1)
			{
				user = userList[index];
				break;
			}
		}
		
		return user;
	}
	
	function getCurrentLevel()
	{
		var level = null;
		for(index in levelList)
		{
			if(levelList[index].currentFlag == 1)
			{
				level = levelList[index];
				break;
			}
		}
		
		return level;
	}
	
	function getCurrentUserRecord()
	{
		var record = null;
		
		var currentUser = getCurrentUser();
		var currentLevel = getCurrentLevel();
		
		if(currentUser == null || currentLevel == null)
			return null;
			
		for(index in userRecords)
		{
			if((userRecords[index].uid == currentUser.id) && (userRecords[index].lid == currentLevel.id))
			{
				record = userRecords[index];
				break;
			}
		}
		
		return record;
	}
	
	function changeCurrentUser(userName)
	{
		var uid = 0;
		var updateFlag = 0;
		
		for(index in userList)
		{
			userList[index].currentFlag = 0;
			if(userList[index].name == userName)
			{
				userList[index].currentFlag = 1;
				updateFlag = 1;
			}
		}
		
		if(updateFlag == 0)
		{
			var newUser = {id: getMaxId(userList) + 1, name:userName, currentFlag:1};
			userList.push(newUser);
		}
		
		writeLocalData(userListItemName, userList);
	}
	
	function changeCurrentLevel(lid)
	{
		var updateFlag = 0;
		
		for(index in levelList)
		{
			levelList[index].currentFlag = 0;
			if(levelList[index].id == lid)
			{
				levelList[index].currentFlag = 1;
				updateFlag = 1;
			}
		}
		
		//No level found, just set first one
		if((updateFlag == 0) && (levelList.length>0) )
		{
			levelList[0].currentFlag = 1;
		}
		
		writeLocalData(levelListItemName, levelList);
		
		//Set zombie queue by level
		var currentLevel = getCurrentLevel();
		if(currentLevel != null)	
			orgZombieQueue = currentLevel.queue;
	}
	
	function updateUserRecords(winFlag)
	{
		var currentUserRecord = getCurrentUserRecord();
		if(currentUserRecord != null)
		{
			
				if(winFlag)
					currentUserRecord.win += 1;
				else
					currentUserRecord.lost += 1;

		}
		else //First play
		{
			var currentUser = getCurrentUser();
			var currentLevel = getCurrentLevel();
			
			if(currentUser == null || currentLevel == null)
				return;
			
			var record = {uid: currentUser.id, lid:currentLevel.id, win:0, lost:0};
			if(winFlag)
				record.win = 1;
			else
				record.lost = 1;
			userRecords.push(record);
		}
		
		writeLocalData(userRecordsItemName, userRecords);
	}
	