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
		
		// reset fields
		resetFieldsToDefaultAddRunPage();		
		
    }); // end addRunPage beforepageshow


    // $("#addRunPage").on("pagebeforehide", function(){
    // }); // end addRunPage pagebeforehide

	
	// selRoute Event Handlers
    $("#selRoute").on("change", function(){
		
		showOrHideSlidersAddRunPage();
		
    }); // end selRoute pagebeforehide
	
	
    // btn click
    $("#btnAddRun").on("click", function(){
		
		handleBtnClickAddRun();
		
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
		   
		   // show select menu
			$("#selMenuForRoutes").show();

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
			// hide select menu
			$("#selMenuForRoutes").hide();		
			
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



function resetFieldsToDefaultAddRunPage()
{
	// date
	$("#dateRun").val("");
	doRedBackground(true, "#dateRun");
	
	// duration
	$("#timeRun").val("");

	// set sliders to the default values
	$("#sliAddRunKm").val(0);
	$("#sliAddRunMeter").val(0);	
  
	// refresh sliders
	$('#sliAddRunKm').slider('refresh');
	$('#sliAddRunMeter').slider('refresh');	
	
	// slider notes		
	$("#txtFeeling").val("");
	
	// show km and meter sliders
	$("#addRunKmSlider").show();
	$("#addRunMeterSlider").show();	
}


function showOrHideSlidersAddRunPage()
{
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
}


function handleBtnClickAddRun()
{
	var date = $("#dateRun").val();
   // alert("date: " + date);

	var dateOk = isDateValid(date);
   // alert(dateOk);

	// only if dateOk continue with add run process
	if (dateOk)
	{			
		addRun();					
	}
}



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



function addRun()
{
	// add run
	$.ajax({
		type: "POST",
		url: rootURL + 'run/',
		data: stringifyRunDetails(),
		dataType: 'json',
	})
	.done(function(data) {
//        alert("this is data: " + data);

		if (data)  // insert run succeeded
		{
			// run creation successful; display msg to user
			toast("Run was successfully saved", standardDurationToast, standardDelayToast);
			
			// reset fields
			resetFieldsToDefaultAddRunPage();			
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
function stringifyRunDetails()
{
   // alert("inside stringifyRunDetails");
	
	var date 		= $("#dateRun").val();
	var distance 	= null;	
	var seconds 	= null;
	var feeling 	= $("#txtFeeling").val().trim();	
		
	// get chosen value in select menu for routes
	var runRouteId = $('select[name=selRoute]').val();
	
	// alert ("runRouteId: " + runRouteId);
	
	// check if default option is chosen or null
	if (runRouteId < 0 || runRouteId == null)
	{
		// alert ("inside if runRouteId < 0 || runRouteId == null");
		
		// route NOT chosen, set it to null
		runRouteId = null;
		
		// fill in distance
		distance = $("#sliAddRunKm").val() + "." + $("#sliAddRunMeter").val();
		
		// alert ("distance: " + distance);
		
		// check distance
		if (distance == "0.0")
		{
			// set distance to null or else it will look like 0.0 in db
			distance = null;	
			// alert ("distance: " + distance);			
		}
	}
			
		
	var duration = $("#timeRun").val();  // return string
	// alert("duration: " + duration); 

	if (duration != "")
	{		
		// set seconds
		seconds	= convertDurationStringToSeconds(duration);
	}
	   
	// check if feeling was filled out
	if (feeling.length == 0)
	{
		// empty
		feeling = null;		
	}
	
	// alert("date: " + date + "\ndistance: " + distance + "\nseconds: " + seconds + "\nfeeling: " + feeling);

    // create runDetails object
    var runDetails = new Object();

    // add properties to object
    runDetails.runCustomerId		= window.localStorage.getItem("Id");
	runDetails.name 				= window.localStorage.getItem("Name");
    runDetails.authenticationKey 	= window.localStorage.getItem("OAuth");
    runDetails.date					= date;
    runDetails.distance 			= distance;
    runDetails.seconds 				= seconds;
    runDetails.feeling 				= feeling;
    runDetails.runRouteId			= runRouteId;

    // serialize it
    var jsonStringRunDetails = JSON.stringify(runDetails);

//    alert(jsonStringRunDetails);

    return jsonStringRunDetails;
}  // end stringifyRunDetails()





