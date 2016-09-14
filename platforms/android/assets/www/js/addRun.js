/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/

/////////////////////////////////////////Variable Declaration

var addRunPageInited = false;

/////////////////////////////////////////jquery On pageinit


// only apply to specific page(s)
$("#addRunPage").on("pageinit", function(){
	
    if(addRunPageInited)
    {
//        alert("addRunPageInited true");
        return;
    }
    else
    {
//        alert("addRunPageInited false");
        addRunPageInited= true;
    }  // end added code


    // addRunPage Event Handlers
    $("#addRunPage").on("pagebeforeshow", function(){
		
        // populate select menu for Routes
        populateDropDownMenuRoutes();
		
		
    }); // end addRunPage live beforepageshow


    $("#addRunPage").on("pagebeforehide", function(){
//         alert("Before hide addRunPage");
    }); // end addRunPage live pagebeforehide
    // END addRunPage Event Handlers

	
	// selRoute Event Handlers
    $("#selRoute").on("change", function(){
		
		// get chosen value in select menu for routes
		var selectedRouteValue = $('select[name=selRoute]').val();
		
		// alert ("selectedRouteValue: " + selectedRouteValue);
		
		// check if default option is chosen
		if (selectedRouteValue < 0)
		{
			// show km and meter sliders
			$("#addRunKmSlider").show();
			$("#addRunMeterSlider").show();			
		}
		else
		{
			// hide km and meter sliders
			$("#addRunKmSlider").hide();
			$("#addRunMeterSlider").hide();			
		}		
		
    }); // end selRoute live pagebeforehide
    // END selRoute Event Handlers
	
	
    // btn click
    $("#btnAddRun").on("click", function(){
		// alert ("button clicked");
		
        var date = $("#dateRun").val();
       // alert("date: " + date);

        var dateOk = isDateValid(date);
       // alert(dateOk);

        // only if dateOk continue with add run process
        if (dateOk)
		{
			// decide whether to add run for unknown route or add run for known route
		
			// get chosen value in select menu for routes
			var selectedRouteValue = $('select[name=selRoute]').val();
			
			alert ("selectedRouteValue: " + selectedRouteValue);
			
			// check if default option is chosen
			if (selectedRouteValue < 0)
			{
				// add run for unknown route		
				addRunWithoutRoute();
			}
			else
			{
				// add run for known route		
				addRunKnownRoute();	
			}					
		}		
    });
});  // end on pageinit


///////////////////////////////////////// END jquery On pageinit



// populate drop down menu for Routes
function populateDropDownMenuRoutes()
{
    var idFromLocalStorage = window.localStorage.getItem("Id");
    var akeyFromLocalStorage = window.localStorage.getItem("OAuth");
    var nameFromLocalStorage = window.localStorage.getItem("Name");	
	
    // get routes for specific customer
    $.ajax({
        type: 'GET',
        url: rootURL + 'route/' + idFromLocalStorage + "/" + nameFromLocalStorage + "/" + akeyFromLocalStorage + "/",
        dataType: "json",
    })
    .done(function(data) {
       // alert("in done populateDropDownMenuRoutes");

        // Execute when ajax successfully completes

        // check that data holding array is longer than zero
        if (data.length > 0)  // at least one row
        {
           // alert("at least one row returned");
           // alert("data.length: " + data.length);

            var str = "";
			
			// add the default value -1
            str += "<option value='-1'>Choose Route (optional)</option>";

            // build string to populate the drop down
            for (var i = 0; i < data.length; i++)
            {
                // add to string
                str += "<option value='" + data[i].fldRouteId + "'>" + data[i].fldRouteName + "</option>";
            }

            // add str to element
            $("#selRoute").html(str);

            // set first option to be selected
            $("#selRoute option:first").attr('selected', 'selected');

            //refresh and force rebuild
            $("#selRoute").selectmenu('refresh', true);
        }
        else  // zero rows were returned
        {
            // no Routes returned
           alert("zero rows returned");
           alert("data.length: " + data.length);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice - populateDropDownMenuRoutes.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}

// check if date is ok
function isDateValid(aDate)
{
    // clear red background
    doRedBackground(true, "#dateRun");

    // flag
    var dateOk = false;

    var isPickupDateOk = false;
    var isReturnDateOk = false;

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



// run where there is no route
function addRunWithoutRoute()
{
	// add run
	$.ajax({
		type: "POST",
		url: rootURL + 'run/',
		data: stringifyRunWithoutRouteDetails(),
		dataType: 'json',
	})
	.done(function(data) {
//        alert("this is data: " + data);

		if (data)  // insert run succeeded
		{
			// run creation successful; display msg to user
			toast("Run was successfully saved", standardDurationToast, standardDelayToast);
		}
		else  // insert run failed
		{
			// insert run did not go through; display msg to user
			toast("Sorry run was not saved<br/>Please try again", standardDurationToast, standardDelayToast);
		}
	})
	.always(function() { /* always execute this code */ })
	.fail(function(data){
		toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
	});
	
}




// run known route
function addRunKnownRoute()
{
	// add run
	$.ajax({
		type: "POST",
		url: rootURL + 'runKnownRoute/',
		data: stringifyRunKnownRouteDetails(),
		dataType: 'json',
	})
	.done(function(data) {
//        alert("this is data: " + data);

		if (data)  // insert run succeeded
		{
			// run creation successful; display msg to user
			toast("Run was successfully saved", standardDurationToast, standardDelayToast);
		}
		else  // insert run failed
		{
			// insert run did not go through; display msg to user
			toast("Sorry run was not saved<br/>Please try again", standardDurationToast, standardDelayToast);
		}
	})
	.always(function() { /* always execute this code */ })
	.fail(function(data){
		toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
	});
	
}


// make json string
function stringifyRunWithoutRouteDetails()
{
   // alert("inside stringifyRunWithoutRouteDetails");
		
	var date 		= $("#dateRun").val();
	var km 			= $("#sliAddRunKm").val();
	var meter 		= $("#sliAddRunMeter").val();
	var seconds 	= $("#txtSeconds").val();
	var feeling 	= $("#txtFeeling").val().trim();
	
	var distance = km + "." + meter
	
	// check distance
	if (distance == "0.0")
	{
		// set distance to null
		distance = null;		
	}
	
	// alert("date: " + date + "\ndistance: " + distance + "\nseconds: " + seconds + "\nfeeling: " + feeling);

    // create runDetails object
    var runDetails = new Object();

    // add properties to object
    runDetails.customerId 			= window.localStorage.getItem("Id");
	runDetails.name 				= window.localStorage.getItem("Name");
    runDetails.authenticationKey 	= window.localStorage.getItem("OAuth");
    runDetails.date					= date;
    runDetails.distance 			= distance;
    runDetails.seconds 				= seconds;
    runDetails.feeling 				= feeling;

    // serialize it
    var jsonStringRunDetails = JSON.stringify(runDetails);

//    alert(jsonStringRunDetails);

    return jsonStringRunDetails;

}  // end stringifyRunDetails()




// make json string
function stringifyRunKnownRouteDetails()
{
   alert("inside stringifyRunKnownRouteDetails");
		
	var date 					= $("#dateRun").val();
	var routeValueSelectMenu 	= $('select[name=selRoute]').val();
	var seconds 				= $("#txtSeconds").val();
	var feeling 				= $("#txtFeeling").val().trim();
	
	// alert("date: " + date + "\nrouteValueSelectMenu: " + routeValueSelectMenu + "\nseconds: " + seconds + "\nfeeling: " + feeling);

    // create runDetails object
    var runDetails = new Object();

    // add properties to object
    runDetails.customerId 			= window.localStorage.getItem("Id");
	runDetails.name 				= window.localStorage.getItem("Name");
    runDetails.authenticationKey	= window.localStorage.getItem("OAuth");
    runDetails.date 				= date;
    runDetails.routeId 				= routeValueSelectMenu;
    runDetails.seconds 				= seconds;
    runDetails.feeling 				= feeling;

    // serialize it
    var jsonStringRunDetails = JSON.stringify(runDetails);

//    alert(jsonStringRunDetails);

    return jsonStringRunDetails;

}  // end stringifyRunDetails()


