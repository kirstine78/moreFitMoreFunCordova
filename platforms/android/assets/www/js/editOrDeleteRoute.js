/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
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
		
		alert ("edit btn clicked");
		
		var userResponse = confirm("Warning: Any runs related to the run will be affected\nAre you sure you want to edit Route?");
		if (userResponse == true) 
		{
			// ok proceed with edit
			submitRouteChanges();
		} 
		else 
		{
			// cancel
			
			// redirect
			$(location).attr('href', '#addRunPage');
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
    runDetails.routeId 				= editOrDeleteRoute_RouteTableRowElementGlobal.data("routeId");
	
    // serialize it
    var jsonStringRunDetails = JSON.stringify(runDetails);

//    alert(jsonStringRunDetails);

    return jsonStringRunDetails;

}  // end stringifyRunDetails()

