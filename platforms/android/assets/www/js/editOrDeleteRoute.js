/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/

/////////////////////////////////////////Variable Declaration

var editOrDeleteRoutePageInited = false;

var editOrDeleteRoute_RouteTableRowElementGlobal;


/////////////////////////////////////////jquery On pageinit

$("#editOrDeleteRoutePage").on("pageinit", function(){

    if(editOrDeleteRoutePageInited)
    {
//        alert("editOrDeleteRoutePageInited true");
        return;
    }
    else
    {
//        alert("editOrDeleteRoutePageInited false");
        editOrDeleteRoutePageInited= true;
    }  // end added code


    // editOrDeleteRoutePage Event Handlers
    $("#editOrDeleteRoutePage").on("pagebeforeshow", function(event){
//        alert("before editOrDeleteRoutePage show");
		fillFields(editOrDeleteRoute_RouteTableRowElementGlobal);

        console.log('before editOrDeleteRoutePage show'); // from Eclipse
    });


    // editOrDeleteRoutePage Event Handlers
    $("#editOrDeleteRoutePage").on("pagebeforehide", function(event){
//        alert("before editOrDeleteRoutePage hide");
		editOrDeleteRoute_RouteTableRowElementGlobal = null;

        console.log('before editOrDeleteRoutePage hide'); // from Eclipse
    });


    // btn click
    $("#btnEditRoute").on("click", function(){
		
		// alert ("edit btn clicked");
		
		var userResponse = confirm("Warning!\n\nAny runs related to this Route will be affected\n\nAre you sure you want to edit Route?");
		if (userResponse == true) 
		{
			// ok proceed with edit
			submitRouteChanges();
		}		
    });


    // btn click
    $("#btnDeleteRoute").on("click", function(){
		
		// alert ("delete btn clicked");
		
		var userResponse = confirm("Are you sure you want to delete Route?");
		if (userResponse == true) 
		{
			// ok proceed with delete
			deleteRoute();
		} 	
    });
	
});  // end #editOrDeleteRoutePage on pageinit


///////////////////////////////////////// END jquery On #editOrDeleteRoutePage Ready



function fillFields(rowElement)
{
	// fill field
	$("#txtEditRouteName").val(rowElement.children(".routeName").text());
	
	var distance = rowElement.children(".distance").text();
	var splitArray = distance.split(".");
	var km = splitArray[0];
	var meter = splitArray[1];
	
	// always add a zero to meter because 650 meter is .65 in db and will come out as 65 when split
	meter = meter + "0";
	
	// convert to number
	km = Number(km);
	meter = Number(meter);	
	
	// alert("km: " + km);
	// alert("meter: " + meter);
	
	// set sliders to the correct value
	$("#sliEditRouteKm").val(km);
	$("#sliEditRouteMeter").val(meter);	
  
	// refresh sliders
	$('#sliEditRouteKm').slider('refresh');
	$('#sliEditRouteMeter').slider('refresh');
	
	// alert(rowElement.data("routeId"));	
}


// when editing a Route the system must check if routeName and distance are entered
function submitRouteChanges()
{
    // validate user input
		
	var routeName = $("#txtEditRouteName").val().trim();
	// alert("routeName: " + routeName);

	// slider input always there
	var routeKm = $("#sliEditRouteKm").val();
	// alert("routeKm: " + routeKm);

	var routeMeter = $("#sliEditRouteMeter").val();
	// alert("routeMeter: " + routeMeter);


	var routeNameOk = isRouteNameValid(routeName, "#txtEditRouteName");
	// alert("routeNameOk: " + routeNameOk);

	var strAdd = routeKm + "." + routeMeter;
	// alert("strAdd: " + strAdd);

	var routeDistanceOk = isDistanceValid(strAdd);
	// alert("routeDistanceOk: " + routeDistanceOk);	   

	// only if routeNameOk && routeDistanceOk continue with edit route process
	if (routeNameOk && routeDistanceOk)
	{			
		editRoute();
	}
}


function editRoute()
{
	// update route
	$.ajax({
		type: "PUT",
		url: rootURL + 'route/',
		data: stringifyEditRouteDetails(),
		dataType: 'json',		
	})
	.done(function(data) {
       alert("this is data: " + data);
		
		// data is null if credentials can't be authenticated
		if (data == null)
		{
			alert("data is null - credentials fake");
			
			// TODO what to do when authentication is false? Redirect to login/register page
		}
		else  // credentials ok
		{
			if (data)  // edit route succeeded
			{
				// route creation successful; display msg to user
				toast("Route was successfully edited", standardDurationToast, standardDelayToast);
				
				doRedBackground(true, "#txtEditRouteName");	
			}
			else  // edit route failed
			{
				// edit route did not go through; display msg to user
				toast("Sorry route was not edited<br/>Please try again", standardDurationToast, standardDelayToast);
			}

			// update global array myRoutes_RoutesArrayGlobal and redirect to my runs page implicit
			getRoutesForCustomer();
		}		
	})
	.always(function() { /* always execute this code */ })
	.fail(function(data){
		toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
	});
}


// make json string
function stringifyEditRouteDetails()
{
   // alert("stringify route details");
		
	var routeName = $("#txtEditRouteName").val().trim();
	// alert("routeName: " + routeName);	  
	
	// slider input always there
	var routeKm = $("#sliEditRouteKm").val();
	var routeMeter = $("#sliEditRouteMeter").val();

	var distance = routeKm + "." + routeMeter;
	// alert("distance: " + distance);	  

    // create routeDetails object
    var routeDetails = new Object();

    // add properties to object
    routeDetails.customerId 		= window.localStorage.getItem("Id");
	routeDetails.name 				= window.localStorage.getItem("Name");
    routeDetails.authenticationKey 	= window.localStorage.getItem("OAuth");
    routeDetails.routeName 			= routeName;
    routeDetails.routeDistance 		= distance;
    routeDetails.routeId 			= editOrDeleteRoute_RouteTableRowElementGlobal.data("routeId");
	
    // serialize it
    var jsonStringRunDetails = JSON.stringify(routeDetails);

    return jsonStringRunDetails;

}  // end stringifyEditRouteDetails()



function deleteRoute()
{
	// delete route
	$.ajax({
		type: "DELETE",
		url: rootURL + 'route/',
		data: stringifyDeleteRouteDetails(),
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
			if (data)  // delete route succeeded
			{
				// route creation successful; display msg to user
				toast("Route was successfully deleted", standardDurationToast, standardDelayToast);			
			}
			else  // delete route failed
			{
				// delete route did not go through; display msg to user
				toast("Sorry route was not deleted<br/>Please try again", standardDurationToast, standardDelayToast);
			}

			// update global array myRoutes_RoutesArrayGlobal and redirect to my runs page implicit
			getRoutesForCustomer();
		}

		
	})
	.always(function() { /* always execute this code */ })
	.fail(function(data){
		toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
	});
}



// make json string
function stringifyDeleteRouteDetails()
{
    // create routeDetails object
    var routeDetails = new Object();

    // add properties to object
    routeDetails.customerId 		= window.localStorage.getItem("Id");
	routeDetails.name 				= window.localStorage.getItem("Name");
    routeDetails.authenticationKey 	= window.localStorage.getItem("OAuth");
    routeDetails.routeId 			= editOrDeleteRoute_RouteTableRowElementGlobal.data("routeId");
	
    // serialize it
    var jsonStringRunDetails = JSON.stringify(routeDetails);

    return jsonStringRunDetails;

}  // end stringifyDeleteRouteDetails()








