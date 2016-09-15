/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

/////////////////////////////////////////Variable Declaration

var myRunsPageInited = false;

var myRuns_RunsArrayGlobal;


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
//        alert("before myRunsPage show");

        // wipe 'tbody' in the myRunsTable, find closest element, refresh table, trigger
        // make columns toggle work
        $("#myRunsTable tbody").html("").closest("table").table("refresh").trigger("create");

        // load all bookings for customer into the table to display
        loadMyRunsTable(myRuns_RunsArrayGlobal);

        console.log('before myRunsPage show'); // from Eclipse
    });


    // click row
    $("#myRunsTable").on("click", ".clickable-row", function(evt){
//        alert("row was clicked");

        // $(this) is the jQuery object
        var rowElementClicked = $(this);  // this refers to the 'tr' element

        showExtraBookingDetails(rowElementClicked);
    });
             
});  // end #myRunsPage on pageinit


///////////////////////////////////////// END jquery On #myRunsPage Ready


// takes array of records as param
function loadMyRunsTable(data)
{
   alert("inside fct loadMyRunsTable");
    var str = "";

    // build string to populate my runs table
    for (var i = 0; i < data.length; i++)
    {
		var distanceHtml 	= getTextToDisplay(data[i].fldDistance);
		var secondsHtml 	= getTextToDisplay(data[i].fldSeconds);
		var kmPerHourHtml 	= getTextToDisplay("hoho");
		var routeNameHtml 	= getTextToDisplay(data[i].fldRouteName);
		var feelingHtml 	= getTextToDisplay(data[i].fldFeeling);
		
		// check if any values are null
		if (data[i].fldDistance == null)
		{
			distanceHtml = "";
		}
		
		
        // build html dynamically
        str += "<tr class='clickable-row' id='" + data[i].fldRunId + "'><td>" +
                data[i].fldDate + "</td><td>" +
                distanceHtml + "</td><td>" +
                secondsHtml + "</td><td>" +
                kmPerHourHtml + "</td><td>" +
                routeNameHtml + "</td><td>" +
                feelingHtml + "</td></tr>";
		
        // build html dynamically
        // str += "<tr class='clickable-row' id='" + data[i].fldRunId + "'><td>" +
                // data[i].fldDate + "</td><td>" +
                // data[i].fldDistance + "</td><td>" +
                // data[i].fldSeconds + "</td><td>" +
                // "hoho" + "</td><td>" +
                // data[i].fldRouteName + "</td><td>" +
                // data[i].fldFeeling + "</td></tr>";
    }

    // add str to html, find closest element, refresh table, trigger
    // make columns toggle work
    $("#myRunsTable tbody").html(str).closest("table").table("refresh").trigger("create");
}


function getTextToDisplay(value)
{
	var str = "";
	
	// check if value is NOT null
	if (value != null)
	{
		str = value;
	}
	
	return str;	
}


// to show more details about a booking
function showExtraBookingDetails(rowElement)
{
//    alert("inside fct showExtraBookingDetails");
//    alert("element: " + rowElement.children(".suburb").text());
//    alert("element: " + rowElement.children(".streetName").text());
//    alert("element: " + rowElement.children(".description").text());

    // build str with booking details
    var str = "";

    str += rowElement.children(".suburb").text();
    str += "<br/><br/>" + rowElement.children(".streetName").text();
    str += "<br/><br/>" + rowElement.children(".description").text();

    // show more details in toast
    toast(str, 1700, 1700);
}