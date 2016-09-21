/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

/////////////////////////////////////////Variable Declaration

var editRunPageInited = false;

var editRun_RunTableRowElementGlobal;


/////////////////////////////////////////jquery On pageinit

$("#editRunPage").on("pageinit", function(){

    if(editRunPageInited)
    {
//        alert("editRunPageInited true");
        return;
    }
    else
    {
//        alert("editRunPageInited false");
        editRunPageInited= true;
    }  // end added code


    // editRunPage Event Handlers
    $("#editRunPage").on("pagebeforeshow", function(event){
		
//        alert("before editRunPage show");
		fillFieldsEditRun(editRun_RunTableRowElementGlobal);

    });


    // editRunPage Event Handlers
    $("#editRunPage").on("pagebeforehide", function(event){

//        alert("before editRunPage hide");
		editRun_RunTableRowElementGlobal = null;

    });


    // btn click
    $("#btnEditRun").on("click", function(){
		
		alert ("edit btn clicked");
		
		// var userResponse = confirm("Warning!\n\nAny runs related to this Route will be affected\n\nAre you sure you want to edit Route?");
		// if (userResponse == true) 
		// {
			// // ok proceed with edit
			// submitRouteChanges();
		// } 
		// else 
		// {
			// // cancel
			
			// // redirect
			// $(location).attr('href', '#addRunPage');
		// }
		
    });
	
});  // end #editRunPage on pageinit


///////////////////////////////////////// END jquery On #editRunPage Ready



function fillFieldsEditRun(rowElement)
{
	alert("runId: " + rowElement.data("runId"));	
	alert("routeId: " + rowElement.children(".runRouteName").data("runrouteId"));	
	
	// fill fields
	
	// date
	$("#dateEditRun").val(rowElement.children(".runDate").text());
	
	// duration
	var duration = rowElement.children(".runDuration").text();
	
	// check format, 1:00:01 should be 01:00:01
	if (duration.length < 8)
	{
		// add zero
		duration = "0" + duration;
	}
	
	$("#timeEditRun").val(duration);
	
	// route
	populateDropDownMenuRoutes("#selMenuForRoutesEditRun", "#selRouteEditRun");
	
	var runRouteId = rowElement.children(".runRouteName").data("runrouteId");
	alert ("assigned to variable: "  + runRouteId);
	
	// check if run is blank or a known route
	if (runRouteId == null)
	{
		// no route, show km and meter
		alert ("==null");
	}
	else
	{
		alert ("not null");
		
		// known route, set the correct selected option		
		var aSelector = "#selMenuForRoutesEditRun" + " option[value=" + runRouteId + "]";
		alert ("aSelector: " + aSelector);
		$(aSelector).attr('selected','selected');

		//refresh and force rebuild
		$("#selRouteEditRun").selectmenu('refresh', true);
		
		// hide km and meter
	}
	
	
	
	// notes/feeling
	$("#txtFeelingEditRun").val(rowElement.children(".runFeeling").text());
	
	
	
	// var distance = rowElement.children(".distance").text();
	// var splitArray = distance.split(".");
	// var km = splitArray[0];
	// var meter = splitArray[1];
	
	// // always add a zero to meter because 650 meter is .65 in db and will come out as 65 when split
	// meter = meter + "0";
	
	// // convert to number
	// km = Number(km);
	// meter = Number(meter);	
	
	// // alert("km: " + km);
	// // alert("meter: " + meter);
	
	// // set sliders to the correct value
	// $("#sliEditRouteKm").val(km);
	// $("#sliEditRouteMeter").val(meter);	
  
	// // refresh sliders
	// $('#sliEditRouteKm').slider('refresh');
	// $('#sliEditRouteMeter').slider('refresh');
	
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
	// add route
	$.ajax({
		type: "PUT",
		url: rootURL + 'route/',
		data: stringifyEditRouteDetails(),
		dataType: 'json',
	})
	.done(function(data) {
//        alert("this is data: " + data);

		if (data)  // insert route succeeded
		{
			// route creation successful; display msg to user
			toast("Route was successfully edited", standardDurationToast, standardDelayToast);
		
			// redirect to add run page home
			$(location).attr('href', '#addRunPage');
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

    // create runDetails object
    var runDetails = new Object();

    // add properties to object
    runDetails.customerId 			= window.localStorage.getItem("Id");
	runDetails.name 				= window.localStorage.getItem("Name");
    runDetails.authenticationKey 	= window.localStorage.getItem("OAuth");
    runDetails.routeName 			= routeName;
    runDetails.routeDistance 		= distance;
    runDetails.routeId 				= editRun_RunTableRowElementGlobal.data("routeId");
	
    // serialize it
    var jsonStringRunDetails = JSON.stringify(runDetails);

//    alert(jsonStringRunDetails);

    return jsonStringRunDetails;

}  // end stringifyRunDetails()

