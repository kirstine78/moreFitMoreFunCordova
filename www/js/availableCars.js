/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

/////////////////////////////////////////Variable Declaration

var availableCarsPageInited = false;

var availableCarsPickupDateGlobal = "";
var availableCarsReturnDateGlobal = "";
var availableCarsSuburbIdGlobal = "";

var availableCarsDataArrayGlobal;


/////////////////////////////////////////jquery On pageinit

// only apply to specific page(s)
$("#availableCarsPage").on("pageinit", function(){

    if(availableCarsPageInited)
    {
//        alert("availableCarsPageInited true");
        return;
    }
    else
    {
//        alert("availableCarsPageInited false");
        availableCarsPageInited= true;
    }  // end added code


    $("#availableCarsPage").on("pagebeforeshow", function(){
        // alert("pagebeforeshow event fired - page one is about to be shown");

        // build table
        loadAvailableCarsTable(availableCarsDataArrayGlobal);

        // make sure to remove highlight on the rows
        $(".clickable-row").removeClass('row_highlight');
    });


    // click row
    $("#carsAvailableTable").on("click", ".clickable-row", function(evt){

        // $(this) is the jQuery object
        var rowElementClicked = $(this);  // this refers to the 'tr' element

        // Check to see if background color is set or if it's set to white.
        rowElementClicked.toggleClass('row_highlight');

        activateConfirmCarBookingDetailsObjectGlobal(rowElementClicked);

        //redirect
        $(location).attr('href', '#confirmBookingPage');
    });
             
});  // end on pageinit

///////////////////////////////////////// END jquery On pageinit


// takes array of records as param
function loadAvailableCarsTable(data)
{
    // add suburb name to title (same for all possible rows)
     $("#titleAvailable").html("Available cars at: " + data[0].fldSuburb);

     var str = "";

     // build string to populate the available cars table
     for (var i = 0; i < data.length; i++)
     {
         // add to string
         str += "<tr class='clickable-row' id='" + data[i].fldCarId + "'><td>" +
                 data[i].fldBrand + "</td><td>" +
                 data[i].fldSeating + "</td><td>" +
                 data[i].fldHirePriceCurrent + "</td><td>" +
                 data[i].fldStreetName + "</td>" +
                 "<td class='hidden suburb'>" + data[i].fldSuburb + "</td>" +
                 "<td class='hidden streetName'>" + data[i].fldStreetName + "</td>" +
                 "<td class='hidden description'>" + data[i].fldDescription + "</td>" +
                 "<td class='hidden regoNo'>" + data[i].fldRegoNo + "</td>" +
                 "<td class='hidden brand'>" + data[i].fldBrand + "</td>" +
                 "<td class='hidden seating'>" + data[i].fldSeating + "</td>" +
                 "<td class='hidden price'>" + data[i].fldHirePriceCurrent + "</td></tr>";
     }

     // add str to html, find closest element, refresh table, trigger
     // make columns toggle work
     $("#carsAvailableTable tbody").html(str).closest("table").table("refresh").trigger("create");
}


// instantiate object and set properties, pass in a jQuery object
function activateConfirmCarBookingDetailsObjectGlobal(rowElement)
{
    confirmCarBookingDetailsObjectGlobal = new Object();

    // add properties to global object
    confirmCarBookingDetailsObjectGlobal.pickupDate = availableCarsPickupDateGlobal;
    confirmCarBookingDetailsObjectGlobal.returnDate = availableCarsReturnDateGlobal;
    confirmCarBookingDetailsObjectGlobal.carId = rowElement.attr("id");
    confirmCarBookingDetailsObjectGlobal.suburb = rowElement.children(".suburb").text();  // current element's children where class is suburb, get the text
    confirmCarBookingDetailsObjectGlobal.streetName = rowElement.children(".streetName").text();
    confirmCarBookingDetailsObjectGlobal.description = rowElement.children(".description").text();
    confirmCarBookingDetailsObjectGlobal.regoNo = rowElement.children(".regoNo").text();
    confirmCarBookingDetailsObjectGlobal.brand = rowElement.children(".brand").text();
    confirmCarBookingDetailsObjectGlobal.seating = rowElement.children(".seating").text();
    confirmCarBookingDetailsObjectGlobal.price = rowElement.children(".price").text();

//    alert(JSON.stringify(confirmCarBookingDetailsObjectGlobal));
}