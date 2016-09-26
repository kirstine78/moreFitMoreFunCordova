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
		
		// reset fields
		resetFieldsToDefaultAddRoutePage();
		
    }); // end addRoutePage live beforepageshow


    $("#addRoutePage").on("pagebeforehide", function(){
//         alert("Before hide addRoutePage");
    }); // end addRoutePage live pagebeforehide
    // END addRoutePage Event Handlers


    // btn click
    $("#btnAddRoute").on("click", function(){
		
		handleBtnClickAddRoute();
		
    });
             
});  // end on pageinit


///////////////////////////////////////// END jquery On pageinit




function resetFieldsToDefaultAddRoutePage()
{
	// route name
	$("#txtAddRouteName").val("");
	doRedBackground(true, "#txtAddRouteName");

	// set sliders to the default values
	$("#sliAddRouteKm").val(10);
	$("#sliAddRouteMeter").val(0);	
  
	// refresh sliders
	$('#sliAddRouteKm').slider('refresh');
	$('#sliAddRouteMeter').slider('refresh');
}




function handleBtnClickAddRoute()
{
	var routeName = $("#txtAddRouteName").val().trim();
   // alert("routeName: " + routeName);
	
	// slider input always there
	var routeKm = $("#sliAddRouteKm").val();
   // alert("routeKm: " + routeKm);
	
	var routeMeter = $("#sliAddRouteMeter").val();
   // alert("routeMeter: " + routeMeter);   
   
	var routeNameOk = isRouteNameValid(routeName, "#txtAddRouteName");
   // alert("routeNameOk: " + routeNameOk);

	var strAddKmAndMeter = routeKm + "." + routeMeter;
   // alert("strAddKmAndMeter: " + strAddKmAndMeter);
   
	var routeDistanceOk = isDistanceValid(strAddKmAndMeter);
   // alert("routeDistanceOk: " + routeDistanceOk);   

	// only if routeNameOk && routeDistanceOk continue with add route process
	if (routeNameOk && routeDistanceOk)
	{			
		addRoute();
	}
}



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
		
		// data is null if credentials can't be authenticated
		if (data == null)
		{
			alert("data is null - credentials fake");
			
			// TODO what to do when authentication is false? Redirect to login/register page
		}
		else  // credentials ok
		{
			if (data)  // insert route succeeded
			{
				// route creation successful; display msg to user
				toast("Route was successfully saved", standardDurationToast, standardDelayToast);
				
				// reset fields
				resetFieldsToDefaultAddRoutePage();
				$(location).attr('href', '#addRunPage');
			}
			else  // insert route failed
			{
				// insert route did not go through; display msg to user
				toast("Sorry route was not saved<br/>Please try again", standardDurationToast, standardDelayToast);
			}
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

}  // end stringifyRouteDetails()


