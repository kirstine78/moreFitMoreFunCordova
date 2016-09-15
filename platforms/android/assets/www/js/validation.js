/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/



////////////////////////// addRun //////////////////////////

// check if date is ok
function isDateValid(aDate)
{
    // clear red background
    doRedBackground(true, "#dateRun");

    // flag
    var dateOk = false;

    // check if aDate field is filled out
    if (aDate.length == 0)
    {
        // empty field
       // alert("date empty");

        // color error
        doRedBackground(false, "#dateRun");
    }
    else
    {
		// update flag
		var dateOk = true;
    }

    return dateOk;
}




////////////////////////// addRoute //////////////////////////

// check if route name is ok
function isRouteNameValid(aRouteName, elementInHtml)
{
    // clear red background
    doRedBackground(true, elementInHtml);

    // flag
    var routeNameOk = false;

    // check if aRouteName field is filled out
    if (aRouteName.length > 0 && aRouteName.length < 30)
    {
		// update flag
		var routeNameOk = true;
    }
    else
    {
		// not valid route name
        // color error
        doRedBackground(false, elementInHtml);
    }

    return routeNameOk;
}


function isDistanceValid(distance)
{
	var distanceOk = false;
	
	// check if distance > 0
	if (distance > 0)
	{
		distanceOk = true;		
	}
	else
	{
		toast("Distance can't be 0 km", standardDurationToast, standardDelayToast);
	}
	return distanceOk;	
}