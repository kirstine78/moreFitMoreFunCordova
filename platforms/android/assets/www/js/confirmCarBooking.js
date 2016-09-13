/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

/////////////////////////////////////////Variable Declaration

var confirmCarBookingPageInited = false;

// create confirmCarBookingDetailsObjectGlobal object
var confirmCarBookingDetailsObjectGlobal;

/////////////////////////////////////////jquery On pageinit


// only apply to specific page(s)
$("#confirmBookingPage").on("pageinit", function(){

    if(confirmCarBookingPageInited)
    {
//        alert("confirmCarBookingPageInited true");
        return;
    }
    else
    {
//        alert("confirmCarBookingPageInited false");
        confirmCarBookingPageInited= true;
    }  // end added code


    $("#confirmBookingPage").on("pagebeforeshow", function(){
        // alert("pagebeforeshow event fired - page one is about to be shown");

        // fill out page with car booking details
        filloutConfirmCarBookingPage();
    });


    // btn click
    $("#btnConfirmCarHire").on("click", function(){
        // make booking
        bookCar();
    });
             
});  // end on pageinit


///////////////////////////////////////// END jquery On pageinit



// fill the page with booking details for the car picked
function filloutConfirmCarBookingPage()
{
    // build str
    var str = "";

    str += "<tr><td>Pick up</td><td>" + confirmCarBookingDetailsObjectGlobal.pickupDate + "</td></tr>";
    str += "<tr><td>Return</td><td>" + confirmCarBookingDetailsObjectGlobal.returnDate + "</td></tr>";
    str += "<tr><td>Suburb</td><td>" + confirmCarBookingDetailsObjectGlobal.suburb + "</td></tr>";
    str += "<tr><td>Street</td><td>" + confirmCarBookingDetailsObjectGlobal.streetName + "</td></tr>";
    str += "<tr><td>Description</td><td>" + confirmCarBookingDetailsObjectGlobal.description + "</td></tr>";
    str += "<tr><td>Rego no</td><td>" + confirmCarBookingDetailsObjectGlobal.regoNo + "</td></tr>";
    str += "<tr><td>Brand</td><td>" + confirmCarBookingDetailsObjectGlobal.brand + "</td></tr>";
    str += "<tr><td>Seating</td><td>" + confirmCarBookingDetailsObjectGlobal.seating + " seats</td></tr>";
    str += "<tr><td>Price</td><td>$" + confirmCarBookingDetailsObjectGlobal.price + "</td></tr>";
    str += "<tr class='hidden'><td>cardId</td><td>" + confirmCarBookingDetailsObjectGlobal.carId + "</td></tr>";

    var imgStr = "<img src='img/" + confirmCarBookingDetailsObjectGlobal.brand + ".png' alt='car' height='auto' width='100%'>";

    // add the html for image
    $("#carImg").html(imgStr);

    // add str to html, find closest element, refresh table, trigger
    // make columns toggle work
    $("#confirmBookingTable tbody").html(str).closest("table").table("refresh").trigger("create");
}


// book the car on confirmation click
function bookCar()
{
//    alert("in booking");

    $.ajax({
        type: "POST",
        url: rootURL + '/bookings',
        data: stringifyBookingDetails(),
        dataType: 'json',
    })
    .done(function(data) {
//        alert("this is data: " + data);

        if (data)  // booking succeeded
        {
            // booking successful; display msg to user
            toast("Booking was successful", standardDurationToast, standardDelayToast);
        }
        else  // booking failed
        {
            // booking did not go through; display msg to user
            toast("Sorry booking failed<br/>Please try again", standardDurationToast, standardDelayToast);
        }

        // redirect to searchCarPage
        $(location).attr('href', '#searchCarPage');
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });

}  // end bookCar()


// make json string
function stringifyBookingDetails()
{
//    alert("stringify booking details");

    // create bookingDetails object
    var bookingDetails = new Object();

    // add properties to object
    bookingDetails.customerId = window.localStorage.getItem("Id");
    bookingDetails.email = window.localStorage.getItem("Email");
    bookingDetails.authenticationKey = window.localStorage.getItem("OAuth");
    bookingDetails.carId = confirmCarBookingDetailsObjectGlobal.carId;
    bookingDetails.startDate = confirmCarBookingDetailsObjectGlobal.pickupDate;
    bookingDetails.returnDate = confirmCarBookingDetailsObjectGlobal.returnDate;
    bookingDetails.hirePricePay = confirmCarBookingDetailsObjectGlobal.price;

    // serialize it
    var jsonStringBookingDetails = JSON.stringify(bookingDetails);

//    alert(jsonStringBookingDetails);

    return jsonStringBookingDetails;

}  // end stringifyBookingDetails()