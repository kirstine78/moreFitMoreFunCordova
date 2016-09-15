/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/

/////////////////////////////////////////Variable Declaration

var addRoutePageInited = false;

/////////////////////////////////////////jquery On pageinit


// only apply to specific page(s)
$("#addRoutePage").on("pageinit", function(){
	
    if(addRoutePageInited)
    {
//        alert("addRoutePageInited true");
        return;
    }
    else
    {
//        alert("addRoutePageInited false");
        addRoutePageInited= true;
    }  // end added code


    // addRoutePage Event Handlers
    $("#addRoutePage").on("pagebeforeshow", function(){
//         alert("Before show addRoutePage");
    }); // end addRoutePage live beforepageshow


    $("#addRoutePage").on("pagebeforehide", function(){
//         alert("Before hide addRoutePage");
    }); // end addRoutePage live pagebeforehide
    // END addRoutePage Event Handlers


    // btn click
    $("#btnAddRoute").on("click", function(){
		// alert ("button clicked");
		
        var routeName = $("#txtAddRouteName").val().trim();
       alert("routeName: " + routeName);
		
		// slider input always there
        var routeKm = $("#sliAddRouteKm").val();
       alert("routeKm: " + routeKm);
		
        var routeMeter = $("#sliAddRouteMeter").val();
       alert("routeMeter: " + routeMeter);
	   
	   
		var routeNameOk = isRouteNameValid(routeName, "#txtAddRouteName");
       alert("routeNameOk: " + routeNameOk);

	   var strAdd = routeKm + "." + routeMeter;
	   alert("strAdd: " + strAdd);
	   
        var routeDistanceOk = isDistanceValid(strAdd);
       alert("routeDistanceOk: " + routeDistanceOk);
	   

        // only if routeNameOk && routeDistanceOk continue with add route process
        if (routeNameOk && routeDistanceOk)
		{			
			addRoute();
		}
		
    });
             
});  // end on pageinit


///////////////////////////////////////// END jquery On pageinit




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



// // check if route km is ok
// function isRouteKmValid(km)
// {
    // // flag
    // var routeKmOk = false;
	
	// // route name must be more than length zero
	// // route name must be less than length 30

    // // check if km field is filled out
    // if (km.length > 0)
    // {
		
		// if (km > 0)  // positive number
		// {
			// // update flag
			// var routeKmOk = true;
		// }
    // }

    // return routeKmOk;
// }



function addRoute()
{
	// add route
	$.ajax({
		type: "POST",
		url: rootURL + 'route/',
		data: stringifyRouteDetails(),
		dataType: 'json',
	})
	.done(function(data) {
//        alert("this is data: " + data);

		if (data)  // insert route succeeded
		{
			// route creation successful; display msg to user
			toast("Route was successfully saved", standardDurationToast, standardDelayToast);
		}
		else  // insert route failed
		{
			// insert route did not go through; display msg to user
			toast("Sorry route was not saved<br/>Please try again", standardDurationToast, standardDelayToast);
		}
	})
	.always(function() { /* always execute this code */ })
	.fail(function(data){
		toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
	});
}



// make json string
function stringifyRouteDetails()
{
   // alert("stringify route details");
		
	var routeName 	= $("#txtAddRouteName").val().trim();
	
	// slider input always there
	var routeKm = $("#sliAddRouteKm").val();
	var routeMeter = $("#sliAddRouteMeter").val();

	var distance = routeKm + "." + routeMeter;
	// alert("distance: " + distance);	  

    // create runDetails object
    var runDetails = new Object();

    // add properties to object
    runDetails.customerId 			= window.localStorage.getItem("Id");
	runDetails.name 				= window.localStorage.getItem("Name");
    runDetails.authenticationKey 	= window.localStorage.getItem("OAuth");
    runDetails.routeName 			= routeName;
    runDetails.routeDistance 		= distance;

    // serialize it
    var jsonStringRunDetails = JSON.stringify(runDetails);

//    alert(jsonStringRunDetails);

    return jsonStringRunDetails;

}  // end stringifyRunDetails()


