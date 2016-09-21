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
		
		// show km and meter sliders		
		showKmAndMeterSliders("#editRunKmSlider", "#editRunMeterSlider");
		
		// set sliders values to default zero
		$("#sliEditRunKm").val(0);
		$("#sliEditRunMeter").val(0);	
		
		// refresh sliders
		$("#sliEditRunKm").slider('refresh');
		$("#sliEditRunMeter").slider('refresh');
		
		
		// pre fill fields with data from db
		fillFieldsEditRun(editRun_RunTableRowElementGlobal);

    });


    // editRunPage Event Handlers
    $("#editRunPage").on("pagebeforehide", function(event){

//        alert("before editRunPage hide");
		editRun_RunTableRowElementGlobal = null;

    });

	
	// selRoute Event Handlers
    $("#selRouteEditRun").on("change", function(){
		
		var selectedRouteValue = getSelectedRouteValue("selRouteEditRun");
		
		// check if default option is chosen
		if (selectedRouteValue < 0)
		{
			// show km and meter sliders		
			showKmAndMeterSliders("#editRunKmSlider", "#editRunMeterSlider");
		}
		else
		{
			// hide km and meter sliders
			hideKmAndMeterSliders("#editRunKmSlider", "#editRunMeterSlider");			
		}		
		
    });


    // btn click
    $("#btnEditRun").on("click", function(){
		
		alert ("edit btn clicked");
		
		handleBtnClickEditRun();
		
    });
	
});  // end #editRunPage on pageinit


///////////////////////////////////////// END jquery On #editRunPage Ready



function fillFieldsEditRun(rowElement)
{
	alert (JSON.stringify(editRun_RunTableRowElementGlobal));
	alert (JSON.stringify(rowElement));
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
	
	// route, get the routeId belonging to the run (either an id or null if no route belongs)
	var runRouteId = rowElement.children(".runRouteName").data("runrouteId");
	
	// check if run is blank or a known route
	if (runRouteId == null)
	{
		// no route connected to run, populate sel menu
		populateDropDownMenuRoutes("#selMenuForRoutesEditRun", "#selRouteEditRun", null);	
		
		// by default km and meter is shown, so set km and meter values	
		var distance = rowElement.children(".runDistance").text();
		setKmAndMeterSliderValues(distance, "#sliEditRunKm", "#sliEditRunMeter");		
	}
	else
	{
		// known route, set the correct selected option
		populateDropDownMenuRoutes("#selMenuForRoutesEditRun", "#selRouteEditRun", runRouteId);
		
		// hide km and meter sliders
		hideKmAndMeterSliders("#editRunKmSlider", "#editRunMeterSlider");
	}	
	
	// notes/feeling
	$("#txtFeelingEditRun").val(rowElement.children(".runFeeling").text());
	
}


function setKmAndMeterSliderValues(aDistance, aKmSlider, aMeterSlider)
{
	var distance = aDistance;
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
	$(aKmSlider).val(km);
	$(aMeterSlider).val(meter);	
  
	// refresh sliders
	$(aKmSlider).slider('refresh');
	$(aMeterSlider).slider('refresh');
}



function handleBtnClickEditRun()
{
	var date = $("#dateEditRun").val();
   // alert("date: " + date);

	var dateOk = isDateValid(date, "#dateEditRun");
   // alert(dateOk);
   
	var feeling = $("#txtFeelingEditRun").val().trim();
	
	var feelingOk = isFeelingValid(feeling, "#txtFeelingEditRun");

	// only if dateOk and feelingOk continue with edit run process
	if (dateOk && feelingOk)
	{			
		editRun();					
	}
}



function editRun()
{
	alert("inside editRun");
	// edit run
	$.ajax({
		type: "PUT",
		url: rootURL + 'run/',
		data: stringifyRunDetails(	"#dateEditRun", 
									"#txtFeelingEditRun", 
									"selRouteEditRun", 
									"#sliEditRunKm", 
									"#sliEditRunMeter", 
									"#timeEditRun", 
									true, 
									editRun_RunTableRowElementGlobal),
		dataType: 'json',
	})
	.done(function(data) {
//        alert("this is data: " + data);

		if (data)  // update run succeeded
		{
			// run creation successful; display msg to user
			toast("Run was successfully updated", standardDurationToast, standardDelayToast);
			
			doRedBackground(true, "#dateEditRun");			
		}
		else  // update run failed
		{
			// update run did not go through; display msg to user
			toast("Sorry run was not updated<br/>Please try again", standardDurationToast, standardDelayToast);
		}
	})
	.always(function() { /* always execute this code */ })
	.fail(function(data){
		toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
	});	
}




