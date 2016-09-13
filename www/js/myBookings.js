/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

/////////////////////////////////////////Variable Declaration

var myBookingsPageInited = false;

var myBookings_BookingsArrayGlobal;


/////////////////////////////////////////jquery On pageinit

$("#myBookingsPage").on("pageinit", function(){

    if(myBookingsPageInited)
    {
//        alert("myBookingsPageInited true");
        return;
    }
    else
    {
//        alert("myBookingsPageInited false");
        myBookingsPageInited= true;
    }  // end added code


    // myBookingsPage Event Handlers
    $("#myBookingsPage").on("pagebeforeshow", function(event){
//        alert("before myBookingsPage show");   // from dreamweaver

        // wipe 'tbody' in the myBookingsTable, find closest element, refresh table, trigger
        // make columns toggle work
        $("#myBookingsTable tbody").html("").closest("table").table("refresh").trigger("create");

        // load all bookings for customer into the table to display
        loadMyBookingsTable(myBookings_BookingsArrayGlobal);

        console.log('before myBookingsPage show'); // from Eclipse
    });


    // click row
    $("#myBookingsTable").on("click", ".clickable-row", function(evt){
//        alert("row was clicked");

        // $(this) is the jQuery object
        var rowElementClicked = $(this);  // this refers to the 'tr' element

        showExtraBookingDetails(rowElementClicked);
    });
             
});  // end #myBookingsPage on pageinit


///////////////////////////////////////// END jquery On #myBookingsPage Ready


// takes array of records as param
function loadMyBookingsTable(data)
{
//    alert("inside fct loadMyBookingsTable");
    var str = "";

    // build string to populate my bookings table
    for (var i = 0; i < data.length; i++)
    {
        // build html dynamically
        str += "<tr class='clickable-row' id='" + data[i].fldBookingNo + "'><td>" +
                data[i].fldStartDate + "</td><td>" +
                data[i].fldReturnDate + "</td><td>" +
                data[i].fldRegoNo + "</td><td>" +
                data[i].fldSeating + "</td><td>" +
                data[i].fldHirePricePerDay + "</td>" +
                "<td class='hidden suburb'>" + data[i].fldSuburb + "</td>" +
                "<td class='hidden streetName'>" + data[i].fldStreetName + "</td>" +
                "<td class='hidden description'>" + data[i].fldDescription + "</td></tr>";
    }

    // add str to html, find closest element, refresh table, trigger
    // make columns toggle work
    $("#myBookingsTable tbody").html(str).closest("table").table("refresh").trigger("create");
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