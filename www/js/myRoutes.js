/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/

/////////////////////////////////////////Variable Declaration

var myRoutesPageInited = false;

var myRoutes_RoutesArrayGlobal = null;


/////////////////////////////////////////jquery On pageinit

$("#myRoutesPage").on("pageinit", function(){

    if(myRoutesPageInited)
    {
//        alert("myRoutesPageInited true");
        return;
    }
    else
    {
//        alert("myRoutesPageInited false");
        myRoutesPageInited= true;
    }  // end added code


    // myRoutesPage Event Handlers
    $("#myRoutesPage").on("pagebeforeshow", function(event){
       // alert("before myRoutesPage show");	   
		
		// alert("myRoutes_RoutesArrayGlobal: " + myRoutes_RoutesArrayGlobal);
		
		// check if there are any routes to display
		if (myRoutes_RoutesArrayGlobal != null)
		{
			// wipe 'tbody' in the myRoutesTable, find closest element, refresh table, trigger
			// make columns toggle work
			$("#myRoutesTable tbody").html("").closest("table").table("refresh").trigger("create");

			// load all bookings for customer into the table to display
			loadMyRoutesTable(myRoutes_RoutesArrayGlobal);

			// make sure to remove highlight on the rows
			$(".clickable-row").removeClass('row_highlight');
		}
		
    });


    // click row
    $("#myRoutesTable").on("click", ".clickable-row", function(evt){
       // alert("row was clicked");

        // $(this) is the jQuery object
        var rowElementClicked = $(this);  // this refers to the 'tr' element
		
		editOrDeleteRoute_RouteTableRowElementGlobal = rowElementClicked;

        // Check to see if background color is set or if it's set to white.
        rowElementClicked.toggleClass('row_highlight');
		
		// redirect 
		$(location).attr('href', '#editOrDeleteRoutePage');
    });
             
});  // end #myRoutesPage on pageinit


///////////////////////////////////////// END jquery On #myRoutesPage Ready


// takes array of records as param
function loadMyRoutesTable(data)
{
   // alert("inside fct loadMyRoutesTable");
    var str = "";

    // build string to populate my runs table
    for (var i = 0; i < data.length; i++)
    {		
        // build html dynamically
        str += "<tr class='clickable-row' data-route-id='" + data[i].fldRouteId + "'><td class='routeName'>" +
                data[i].fldRouteName + "</td><td class='distance'>" +
                data[i].fldRouteDistance + "</td></tr>";
    }

    // add str to html, find closest element, refresh table, trigger
    // make columns toggle work
    $("#myRoutesTable tbody").html(str).closest("table").table("refresh").trigger("create");
}





