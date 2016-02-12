function SoundSystem()
{
	this.list = [];
	this.volume = 1;
	this.setVolume = function(vol){
	};
	
	this.stop = function(){
		
	};
	
	this.play = function(){
	};
	
	this.replace = function(){
	};
	
	this.append = function(){
	};
	
function setSoundVolumn(sound, volume)
{
	try{
		sound.volume = volume;
	}
	catch(err){}
}

function playSound(sound, loop, volume)
{
	//if(PVZ_OPTION.mute)
	//	return;
		
	try{
		sound.loop = loop;
		sound.volume = volume;
		
		if(PVZ_OPTION.mute)
			sound.volume = 0;
			
		try{
			sound.currentTime = 0;
		}catch(err){}
		
		sound.play();
	}
	catch(err){}
}
}