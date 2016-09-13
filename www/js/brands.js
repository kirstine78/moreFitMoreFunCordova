/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

/////////////////////////////////////////Variable Declaration

var brandsPageInited = false;


/////////////////////////////////////////jquery On pageinit


// only apply to specific page(s)
$("#brandsPage").on("pageinit", function(){

    if(brandsPageInited)
    {
//        alert("brandsPageInited true");
        return;
    }
    else
    {
//        alert("brandsPageInited false");
        brandsPageInited= true;
    }  // end added code


    $("#brandsPage").on("pagebeforeshow", function(){
        // alert("pagebeforeshow event fired - page one is about to be shown");

        // get all brands and display on page
        showAllBrands();
    });
             
});  // end on pageinit


///////////////////////////////////////// END jquery On pageinit



function showAllBrands()
{
    // build html str
    var str = "";

    // loop through all brands in global array
    for (var i = 0; i < mainBrandsArrayGlobal.length; i++)
    {
        // add to string the image relevant
        str += "<tr><td><img src='img/" + mainBrandsArrayGlobal[i] + "Small.png' alt='car' height='auto' width='100%'></td>";

        // add to string Brand name
        str += "<td><h3>" + mainBrandsArrayGlobal[i] + "</h3></td></tr>";
    }

    // show string on page in table
    $("#brandsTable").html(str);
}