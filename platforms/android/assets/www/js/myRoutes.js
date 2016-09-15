/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

/////////////////////////////////////////Variable Declaration

var myRoutesPageInited = false;

var myRoutes_RoutesArrayGlobal;


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
//        alert("before myRoutesPage show");

        // wipe 'tbody' in the myRoutesTable, find closest element, refresh table, trigger
        // make columns toggle work
        $("#myRoutesTable tbody").html("").closest("table").table("refresh").trigger("create");

        // load all bookings for customer into the table to display
        loadMyRoutesTable(myRoutes_RoutesArrayGlobal);

        console.log('before myRoutesPage show'); // from Eclipse
    });


    // click row
    $("#myRoutesTable").on("click", ".clickable-row", function(evt){
//        alert("row was clicked");

        // $(this) is the jQuery object
        var rowElementClicked = $(this);  // this refers to the 'tr' element
    });
             
});  // end #myRoutesPage on pageinit


///////////////////////////////////////// END jquery On #myRoutesPage Ready


// takes array of records as param
function loadMyRoutesTable(data)
{
   alert("inside fct loadMyRoutesTable");
    var str = "";

    // build string to populate my runs table
    for (var i = 0; i < data.length; i++)
    {		
        // build html dynamically
        str += "<tr class='clickable-row' id='" + data[i].fldRouteId + "'><td>" +
                data[i].fldRouteName + "</td><td>" +
                data[i].fldRouteDistance + "</td></tr>";
    }

    // add str to html, find closest element, refresh table, trigger
    // make columns toggle work
    $("#myRoutesTable tbody").html(str).closest("table").table("refresh").trigger("create");
}





