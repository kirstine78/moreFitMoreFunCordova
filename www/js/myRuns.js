/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/

/////////////////////////////////////////Variable Declaration

var myRunsPageInited = false;

var myRuns_RunsArrayGlobal = null;


/////////////////////////////////////////jquery On pageinit

$("#myRunsPage").on("pageinit", function(){

    if(myRunsPageInited)
    {
//        alert("myRunsPageInited true");
        return;
    }
    else
    {
//        alert("myRunsPageInited false");
        myRunsPageInited= true;
    }  // end added code


    // myRunsPage Event Handlers
    $("#myRunsPage").on("pagebeforeshow", function(event){
       // alert("before myRunsPage show");
		
		// alert("myRuns_RunsArrayGlobal: " + myRuns_RunsArrayGlobal);
		
		// check if there are any runs to display
		if (myRuns_RunsArrayGlobal != null)
		{
			// wipe 'tbody' in the myRunsTable, find closest element, refresh table, trigger
			// make columns toggle work
			$("#myRunsTable tbody").html("").closest("table").table("refresh").trigger("create");

			// load all runs for customer into the table to display
			loadMyRunsTable(myRuns_RunsArrayGlobal);			

			// make sure to remove highlight on the rows
			$(".clickable-row").removeClass('row_highlight');
		}
        
        // console.log('before myRunsPage show'); // from Eclipse
    });


    // click row
    $("#myRunsTable").on("click", ".clickable-row", function(evt){
//        alert("row was clicked");

        // $(this) is the jQuery object
        var rowElementClicked = $(this);  // this refers to the 'tr' element
		
		editRun_RunTableRowElementGlobal = rowElementClicked;

        // Check to see if background color is set or if it's set to white.
        rowElementClicked.toggleClass('row_highlight');
		
		// redirect 
		$(location).attr('href', '#editRunPage');
		
    });
             
});  // end #myRunsPage on pageinit


///////////////////////////////////////// END jquery On #myRunsPage Ready


// takes array of records as param
function loadMyRunsTable(data)
{
   // alert("inside fct loadMyRunsTable");
    var str = "";

    // build string to populate my runs table
    for (var i = 0; i < data.length; i++)
    {
		// alert("in for loop");
		var distanceHtml 	= convertPossibleNullToDisplayEmptyString(data[i].fldDistance);
		var durationHtml 	= convertPossibleNullToDisplayEmptyString(data[i].fldSeconds);
		var kmPerHourHtml 	= "";
		var routeNameHtml 	= convertPossibleNullToDisplayEmptyString(data[i].fldRouteName);
		var feelingHtml 	= convertPossibleNullToDisplayEmptyString(data[i].fldFeeling);
			
		// if data[i].fldSeconds was NOT null then not empty string
		if (durationHtml != "")
		{
			// convert string to proper message 
			durationHtml = convertSecondsToHMS(data[i].fldSeconds);
		}
		
		// check if both distance and seconds have values in db
		if (data[i].fldDistance != null && data[i].fldSeconds != null)
		{
			// calculate speed km/h
			kmPerHourHtml = getSpeedKmPerHour(data[i].fldDistance, data[i].fldSeconds);
		}
		else
		{
			// no distance and no seconds so speed can't be calculated
			kmPerHourHtml = "";			
		}
		
		// alert ("data[i].fldRouteId: " + data[i].fldRouteId);
		
        // build html dynamically
        str += "<tr class='clickable-row' data-run-id='" + data[i].fldRunId + "'><td class='runDate'>" +
                data[i].fldDate + "</td><td class='runDistance'>" +
                distanceHtml + "</td><td class='runDuration'>" +
                durationHtml + "</td><td class='runKmPerHour'>" +
                kmPerHourHtml + "</td><td class='runRouteName' data-runroute-id='" + data[i].fldRouteId + "'>" +
                routeNameHtml + "</td><td class='runFeeling'>" +
                feelingHtml + "</td></tr>";			
    }
	
	// alert("end");
	
    // add str to html, find closest element, refresh table, trigger
    // make columns toggle work
    $("#myRunsTable tbody").html(str).closest("table").table("refresh").trigger("create");
}



/**
* if value is null in db then display empty string in tables
*/
function convertPossibleNullToDisplayEmptyString(value)
{
	var str = "";
	
	// check if value is NOT null
	if (value != null)
	{
		str = value;
	}
	
	return str;	
}

