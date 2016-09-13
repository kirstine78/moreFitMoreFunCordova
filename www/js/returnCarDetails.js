/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

/////////////////////////////////////////Variable Declaration

var returnCarDetailsPageInited = false;

var returnCarBookingGlobal;


/////////////////////////////////////////jquery On pageinit

$("#returnCarDetailsPage").on("pageinit", function(){

    if(returnCarDetailsPageInited)
    {
//        alert("returnCarDetailsPageInited true");
        return;
    }
    else
    {
//        alert("returnCarDetailsPageInited false");
        returnCarDetailsPageInited= true;
    }  // end added code


    // returnCarDetailsPage Event Handlers
    $("#returnCarDetailsPage").on("pagebeforeshow", function(){
//        alert("before returnCarDetailsPage show");   // from dreamweaver

        // wipe odom field
        $("#txtOdomFinish").val("");

        // reset checkbox
        $("#chkFullTank").prop("checked", false).checkboxradio('refresh');

        // show car to return
        loadCarForReturnHtml(returnCarBookingGlobal);

        console.log('before returnCarDetailsPage show'); // from Eclipse
    });


    // btn click
    $("#btnReturnCar").on("click", function(){
//        alert("return btn clicked");

        // return car
        returnCarProcess();
    });
             
});  // end on pageinit


///////////////////////////////////////// END jquery On pageinit



function loadCarForReturnHtml(aBooking)
{
    var str = "";

    str += "Return Car: " + aBooking.fldRegoNo;
    str += "<p class='hidden' id='hiddenBookingNo'>" + aBooking.fldBookingNo + "</p>";
    str += "<p class='hidden' id='hiddenIsTooLate'>" + aBooking.isReturnedTooLate + "</p>";

    // show the car rego no and hide bookingNo
    $("#returnCarTitle").html(str);
}



function returnCarProcess()
{
//    alert("in fct returnCarProcess");

    var fullTank = false;
    var isReturnedLate = false;

    // check if full tank chk box is checked
    if ($("#chkFullTank").is(':checked'))
    {
        fullTank = true;
//        alert ("checked");
    }
    else
    {
//        alert ("unchecked");
        console.log('unchecked tank full');
    }

    // check if return is past due date
    if ($("#hiddenIsTooLate").html() == 'true')
    {
        isReturnedLate = true;
    }
    else
    {
        isReturnedLate = false;
    }

//    alert("isReturnedLate: " + isReturnedLate);

    $.ajax({
        type: "PUT",
        url: rootURL + '/bookings',
        data: stringifyReturnDetails(),
        dataType: 'json',
    })
    .done(function(data) {
//        alert("in done returnCarProcess");

        // check if data is true
        if (data)
        {
//            alert("return car done in db");

            // build str
            var str = "Return successful";

            if (isReturnedLate)
            {
                str += "<br/><br/>Extra charge for Late Return";
            }
            if (fullTank == false)
            {
                str += "<br/><br/>Extra charge for Petrol";
            }

            // toast message
            toast(str, standardDurationToast, standardDelayToast);

            //redirect
            $(location).attr('href', '#searchCarPage');
        }
        else  // data == false
        {
//            alert("return failed - data: " + data);

            // toast message
            toast("Return car failed", standardDurationToast, standardDelayToast);

            //redirect
            $(location).attr('href', '#searchCarPage');
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
//         alert("Error: " + data);
         toast("Error: " + data, standardDurationToast, standardDelayToast);
    });

}



// make json string
function stringifyReturnDetails()
{
//    alert("stringifyReturnDetails");

    var odomInput = $("#txtOdomFinish").val();  // not validating for this assignment
//    alert ("odomInput: " + odomInput);

    // get the hidden bookinNo
    var bookingNo = $("#hiddenBookingNo").html();
//    alert("bookingNo: " + bookingNo);

    // create returnDetails object
    var returnDetails = new Object();

    // add properties to object
    returnDetails.bookingNo = bookingNo;
    returnDetails.email = window.localStorage.getItem("Email");
    returnDetails.authenticationKey = window.localStorage.getItem("OAuth");
    returnDetails.actualReturnDate = getTodaysDate();  // fct in searchCar
    returnDetails.odometerFinish = odomInput;

    // serialize it
    var jsonStringReturnDetails = JSON.stringify(returnDetails);

//    alert(jsonStringReturnDetails);

    return jsonStringReturnDetails;

}  // end stringifyReturnDetails()