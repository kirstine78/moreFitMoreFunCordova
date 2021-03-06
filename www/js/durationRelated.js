/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/



function convertDurationStringToSeconds(durationString)
{
	var totalSeconds = null;
	
	if (durationString == "")
	{
		totalSeconds = null;  // redundant
	}
	else  // user has entered duration
	{
		
		// else convert to seconds
		// var dayAmount = getDayAmount(durationString);
		var hourAmount = getHourAmount(durationString);
		var minutesAmount = getMinuteAmount(durationString);
		var secondsAmount = getSecondAmount(durationString);	

		// add amounts
		var totalSeconds = hoursToSeconds(hourAmount) + minutesToSeconds(minutesAmount) + secondsAmount;
		// alert ("totalSeconds: " + totalSeconds);
		
		if (totalSeconds == 0)
		{
			totalSeconds = null;
			// alert ("totalSeconds: " + totalSeconds);
		}
				
		return totalSeconds;
	}	
}



function hoursToSeconds(numberOfHours)
{
	var secondsInHour = 3600;
	return numberOfHours * secondsInHour;
}


function minutesToSeconds(numberOfMinutes)
{
	var secondsInMinute = 60;
	return numberOfMinutes * secondsInMinute;
}



function getHourAmount(durationString)
{	
    var resultArray = getSplitString(durationString, ":");
	var hours = resultArray[0];
	
	// convert to number
	hours = Number(hours);
	// alert ("hours: " + hours);
	// alert ("type of hours: " + typeof(hours));
	
	return hours;
}

function getMinuteAmount(durationString)
{	
    var resultArray = getSplitString(durationString, ":");
	var minutes = resultArray[1];
	
	// convert to number
	minutes = Number(minutes);
	
	// alert ("minutes: " + minutes);
	// alert ("type of minutes: " + typeof(minutes));
	
	return minutes;
}

function getSecondAmount(durationString)
{	
    var resultArray = getSplitString(durationString, ":");
	var seconds = resultArray[2];
	
	// convert to number
	seconds = Number(seconds);
	
	// alert ("seconds: " + seconds);
	// alert ("type of seconds: " + typeof(seconds));
	
	return seconds;
}


function getSplitString(someString, splitIndication)
{
	var resultArray = someString.split(splitIndication);
	return resultArray;
}


function convertSecondsToHMS(durationInSeconds)
{		
	durationInSeconds = Number(durationInSeconds);
	
	var h = Math.floor(durationInSeconds / 3600);
	var m = Math.floor(durationInSeconds % 3600 / 60);
	var s = Math.floor(durationInSeconds % 3600 % 60);
	
	if (m < 10)
	{
		m = "0" + m;
	}
	if (s < 10)
	{
		s = "0" + s;
	}
	
	return h + ":" + m + ":" + s;	
}


function getSpeedKmPerHour(km, seconds)
{
	var hour = 3600;
	var speed = km * 1.0 / seconds * hour;

	return speed.toFixed(2);
}
