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
		var dayAmount = getDayAmount(durationString);
		var hourAmount = getHourAmount(durationString);
		var minutesAmount = getMinuteAmount(durationString);
		var secondsAmount = getSecondAmount(durationString);	

		// add amounts
		var totalSeconds = daysToSeconds(dayAmount) + hoursToSeconds(hourAmount) + minutesToSeconds(minutesAmount) + secondsAmount;
		// alert ("totalSeconds: " + totalSeconds);
		
		if (totalSeconds == 0)
		{
			totalSeconds = null;
			// alert ("totalSeconds: " + totalSeconds);
		}
				
		return totalSeconds;
	}	
}


function daysToSeconds(numberOfDays)
{
	var secondsInDay = 86400;
	return numberOfDays * secondsInDay;
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



function getDayAmount(durationString)
{	
    var resultArray = getSplitString(durationString, " ")
	var days = resultArray[0];
	
	// convert to number
	days = Number(days);
	
	// alert ("days: " + days);
	// alert ("type of days: " + typeof(days));
	
	return days;
}

function getHourAmount(durationString)
{	
    var resultArray = getSplitString(durationString, " ")
	var hourMinuteSecond = resultArray[2];
	
	var resultArrayHourMinuteSecond = getSplitString(hourMinuteSecond, ":");
	var hours = resultArrayHourMinuteSecond[0];
	
	// convert to number
	hours = Number(hours);
	// alert ("hours: " + hours);
	// alert ("type of hours: " + typeof(hours));
	
	return hours;
}

function getMinuteAmount(durationString)
{	
    var resultArray = getSplitString(durationString, " ")
	var hourMinuteSecond = resultArray[2];
	
	var resultArrayHourMinuteSecond = getSplitString(hourMinuteSecond, ":");
	var minutes = resultArrayHourMinuteSecond[1];
	
	// convert to number
	minutes = Number(minutes);
	
	// alert ("minutes: " + minutes);
	// alert ("type of minutes: " + typeof(minutes));
	
	return minutes;
}

function getSecondAmount(durationString)
{	
    var resultArray = getSplitString(durationString, " ")
	var hourMinuteSecond = resultArray[2];
	
	var resultArrayHourMinuteSecond = getSplitString(hourMinuteSecond, ":");
	var seconds = resultArrayHourMinuteSecond[2];
	
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






