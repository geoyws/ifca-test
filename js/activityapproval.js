function dispSetDate() {
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var myDate, myFormatDate;
    var t = localStorage.ApvrDate.split("/");
    if (t[1]) {
        myDate = new Date(t[2], t[1] - 1, t[0]);
        myFormatDate = myDate.getDate() + " " + MONTHS[myDate.getMonth()] + " " + myDate.getFullYear();
    } else {
        myDate = new Date(new Date().getFullYear(), t[0] - 1, t[1]);

        myFormatDate = MONTHS[myDate.getMonth()] + "," + mydate.getDate();
    }
    $("#subaction").text(myFormatDate);
    //date shown beside datepicker
    dispSubordinate();
    

}

function dispSubordinate() {
    var realurl = SERVER_URL + "/api/activity/SubordinateWithDetail";
    //var realurl = "http://localhost:8080/api/activity/SubordinateWithDetail";
    var manID = localStorage.getItem("UserID");
    var datePick = localStorage.ApvrDate.split("/").reverse().join("-");

    var cred = {
        "managerID": manID,
        "date": datePick
    };

    callAjax(realurl, cred, "POST");

}

function dispTodayDate() {
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var myDate, myFormatDate;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    //January is 0!
   
    var yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd } if (mm < 10) { mm = '0' + mm } var today = dd + '/' + mm + '/' + yyyy;
  
    var t = today.split("/");
    if (t[1]) {
        myDate = new Date(t[2], t[1] - 1, t[0]);
        myFormatDate = myDate.getDate() + " " + MONTHS[myDate.getMonth()] + " " + myDate.getFullYear();
    } else {
        myDate = new Date(new Date().getFullYear(), t[0] - 1, t[1]);
        myFormatDate = MONTHS[myDate.getMonth()] + "," + mydate.getDate();
    }
    $("#subaction").text(myFormatDate);

    dispTodaySubordinate();
}

function dispTodaySubordinate()      {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var realurl = SERVER_URL + "/api/activity/SubordinateWithDetail";
    var manID = localStorage.getItem("UserID");
    //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd } if (mm < 10) { mm = '0' + mm } var datePick = yyyy+ '-' + mm + '-' + dd;

   

    var cred = {
        "managerID": manID,
        "date": datePick
    };
    
    callAjax(realurl, cred, "POST");
  
}

$(document).on("pageinit", function () {
    // $(".subaction").text((new Date()).toString().split(' ').splice(1, 3).join(' '));

    //var newdate = localStorage.ApvrDate.split("/").reverse().join("-");
    //alert(newdate);

    dispTodayDate();
    /* set the date shown beside datepicker dropdown button*/

});



$(document).on('click', '.dwb0', function () { // when click on set button on datepicker

    dispSetDate();


});

function approveList() {
    var realurl = SERVER_URL + "/api/Activity/ApproveActivity";
     //var realurl = "http://localhost:8080/api/Activity/ApproveActivity";

    var manID = localStorage.getItem("UserID");
    var checked = $("input:checkbox:checked");

    var approveList = [];

    var appr = "";
    var fal = 1;
    var tcount = 0;
    var changed = 0;

    if (checked.length >= 1) {
        for (var i = 0; i < checked.length; i++) {
            appr = ".apphr" + i;
            var AppHr = 0;

           

            /*minimum approved hour is half an hour*/
            // alert(checked[i].id.split("-")[4]);
            // alert("appvhr:" + $(appr).val());
            // alert("leng:" + checked[i].id);

            var tc = checked[i].id.split("-")[4];
            //alert(tc);
            appr = ".apphr" + tc;

            $(appr).each(function () {
               // alert("ow" + $(this).val());
                if ($(this).val() != "") {
                    //alert("yesthis");
                    AppHr = $(this).val();
                }
                else {
                    //alert($(this).attr('placeholder'));
                    AppHr = $(this).attr('placeholder');
                }

                var cdata = $(this).attr('appvdata');

                var AMID = checked[i].id.split("-")[1];
                var ACTID = cdata.split("-")[0];
                var ACCID = cdata.split("-")[1];
              

                var cred = {
                    "ManagerID": manID,
                    "ActivityMainID": AMID,
                    "ApprovedHours": AppHr,
                    "ActivityCode": ACTID,
                    "AccountCode": ACCID
                };

                approveList.push(cred);
                
            });

           
           
            //if ($(appr).val() != "") {
            //    if ($(appr).val() < 0.5 || $(appr).val() > 24) {

            //        fal = 0;
            //        alert("Minimum approved hour is 0.5 & maximum is 24 hours. Please try again.");
            //        break;
            //    }
            //}


            //if (fal == 1) {
              
            //    AppHr = $(appr).val();

            //    var AMID = checked[i].id.split("-")[2];
            //    var ACTID = checked[i].id.split("-")[3];
            //    var ACCID = checked[i].id.split("-")[5];


            //    var cred = {
            //        "ManagerID": manID,
            //        "ActivityMainID": AMID,
            //        "ApprovedHours": AppHr,
            //        "ActivityCode": ACTID,
            //        "AccountCode": ACCID
            //    };

            //    approveList.push(cred);

            //}
            //else {
            //    alert("Cannot approve for more than one time.");
            //    break;
            //}
        }
        //alert(JSON.stringify(approveList));
     
        //var strApproveList=JSON.stringify(approveList);

        //if (fal == 1)
        //    // alert("testapproved");
            callAjaxApprove(realurl, approveList, "POST");
    }

    else
        alert("No Activity was selected.");



}

function callAjaxApprove(someurl, approveList, sometype) {
    var $Xhr = $.ajax({
        type: sometype,
        url: someurl,
        data: { '': approveList },
        async: false,
        dataType: "json",
        success: function () { },
        error: function (xhr, ajaxOptions, thrownError) {

        },
        statusCode: {
            404: function () {
                alert("Server not found.");
            }
        },
        beforeSend: function () {
            $("#master-ActivityCode div.ui-content").append("<img id='loader' src='css/images/ajax-loader.gif' />")
        },
        complete: function () {
            $("#loader").remove()
        }
    });
    $Xhr.done(function renderData(data) {

        if (!data)
            alert("Minimum approval hour is 0.5 hours and maximum is 24 hours. ");
        else {
            alert("Approved Successfully !");
            dispSubordinate();
        }

    });
}

//$(document).one("pagecontainerbeforeshow", function () {


//    //var realurl = "http://175.139.183.94:76/TimeReportingapi/api/activity/SubordinateWithDetail";

//    //var manID = localStorage.getItem("UserID");

//    //var today = new Date();
//    //var dd = today.getDate();
//    //var mm = today.getMonth() + 1;

//    //var yyyy = today.getFullYear();
//    //if (dd < 10) { dd = '0' + dd } if (mm < 10) { mm = '0' + mm } var today = dd + '/' + mm + '/' + yyyy;

//    //var t = today.split("/").reverse().join("-");
//    //var datePick = t;
   
//    //var cred = {
//    //    "managerID": manID,
//    //    "date": datePick
//    //};

//    //// callAjax(realurl, cred, "POST");

//    $("#contentDetail").empty();
//    $("#contentDetail").html("<div style='text-align:center;'>Please select a date.</div>").trigger("create");



//});


function callAjax(someurl, somedata, sometype) {
    var $Xhr = $.ajax({
        type: sometype,
        url: someurl,
        data: somedata,
        async: false,
        dataType: "json",
        success: function () { },
        error: function (xhr, ajaxOptions, thrownError) {

        },
        statusCode: {
            404: function () {
                alert("Server not found.");
            }
        },
        beforeSend: function () {
            $("#master-ActivityCode div.ui-content").append("<img id='loader' src='css/images/ajax-loader.gif' />")
        },
        complete: function () {
            $("#loader").remove();
        }
    });
    $Xhr.done(function renderData(data) {
        //renderList(data);

        renderListtemp(data);
    });
}


function renderListtemp(data) {

    var headlii = "";
    /*first person header*/
    var lii = "";
    /* person header*/
    var lit = "";
    /*more detail*/
    var changed = 0;
    /*flag to change person header*/
    var thr = 0;
    /*totalhours*/
    var totalhr = [];
    /*totalhours array*/
    var tcount = 0;

    /*set disabled to already been approved input : text & checkbox*/
    var dPlaceHolder = 0;

    var firstdPlaceHolder = 0;

    var tcountindex = 0;

    //alert(JSON.stringify(data));
    //sort by Activity Hour to be approved
    //var sorted = data.sort(function (a, b) {
    //    return a.Hours > b.Hours ? 1 : -1;
    //    //if (a.Hours > b.Hours) {
    //    //return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    //    //if (a.Hours > b.Hours) {
    //    //    return 1;
    //    //}
    //    //if (a.Hours < b.Hours) {
    //    //    return -1;
    //    //
    //    //return 0;
    //});

    if (data != "") {
        
        //store total hours
        for (var i = 0; i < data.length; i++) {
            if (changed == 1) {
                totalhr[tcount] = thr;
                ++tcount;
                changed = 0;
                thr = 0;
            }
            var k = i + 1;
            if (k < data.length) {
                if (data[i].UserdetailID == data[k].UserdetailID) {
                    if (data[i].ApprovedHours != null)
                        thr += data[i].ApprovedHours;
                    else
                        thr += data[i].Hours;
                }
                else {
                    if (data[i].ApprovedHours != null)
                        thr += data[i].ApprovedHours;
                    else
                        thr += data[i].Hours;
                    //thr += data[i].Hours;
                    changed = 1;
                }
            }
            else {
                if (data[i].ApprovedHours != null)
                    thr += data[i].ApprovedHours;
                else
                    thr += data[i].Hours;
                //thr += data[i].Hours;
                totalhr[tcount] = thr;
            }
        }

        tcount = 0;

        changed = 0;



        //generating collapsible table
        for (var i = 0; i < data.length; i++) {
            //alert(data[i].ApprovedHours);
            if (data[i].ApprovedHours == null) {
                dPlaceHolder = data[i].Hours + "'";
            }
            else {
                dPlaceHolder = data[i].ApprovedHours + "' disabled";
            }
            // approved hour textbox is disabled once approved.

            if (changed == 1) {
                tcountindex = tcount + 1;
                lii += lit + "</tbody></table>" + "</div>" +
          "<div data-role='collapsible' data-inset='false' data-collapsed='true' id='MainID'>" +
                       "<h3><div class='collaptitle' style='padding-top:2%' id='MainID" + i + "'>" + display_name_format(data[i].FirstName, data[i].LastName) + "</div><div class='collapfigure'><label style='padding-right:0%;width:10%;float:right'  ><input class='TimeReportingHideCheckbox' type='checkbox' id='checkbox-" + data[i].ActivityMainID + "-" + data[i].ActivityCode + "-" + data[i].AccountCode + "-" + tcountindex + "-" + dPlaceHolder + "></label></div><div class='collapfigure' style='padding-top:2%'>" + totalhr[tcount + 1] + " h" +
                       "</div></h3>" +
                           "<table  data-role='table' data-mode='columntoggle' class='ui-responsive ui-shadow collapstb'>" +
                                "<thead></thead><tbody>";
                changed = 0;
                lit = "";
                tcount++;

            }

            var k = i + 1;
            if (k < data.length) {
                if (data[i].UserdetailID == data[k].UserdetailID) {
                    lit += "<tr>" +
                                "<td colspan='2' style='width:40%'><p style='font-weight:bold;font-size:15px'>" + data[i].ActivityDescription + " (" + data[i].ActivityCode + ")<p></br><p style='font-size:15px'>" + data[i].AccountDescription + " (" + data[i].AccountCode + ")</p></br><p style='font-size:15px'>Remark : " + data[i].Remark + "</p></td>" +
                                //"<td>" + data[i].ActivityDescription + "</br>" + data[i].AccountDescription + "</td>" +
                                   //"<td >" + data[i].Hours + "</td>" +
                                "<td class='toright' style='width:20%;padding:0 0% 0 0;margin:0%!important'>" +
                                    "<input style='text-align: right;' class='apphr" + tcount + "' data-role='mini' type='text' placeholder='" + dPlaceHolder + " appvdata='" + data[i].ActivityCode +"-"+ data[i].AccountCode + "'/>" +
                                "</td>" +
                           "</tr>";


                }
                else {
                    lit += "<tr>" +
                                "<td colspan='2' style='width:40%'><p style='font-weight:bold;font-size:15px'>" + data[i].ActivityDescription + " (" + data[i].ActivityCode + ")<p></br><p style='font-size:15px'>" + data[i].AccountDescription + " (" + data[i].AccountCode + ")</p></br><p style='font-size:15px'>Remark : " + data[i].Remark + "</p></td>" +
                                //"<td>" + data[i].ActivityDescription + "</br>" + data[i].AccountDescription + "</td>" +
                                   //"<td >" + data[i].Hours + "</td>" +
                                "<td class='toright' style='width:20%;padding:0 0% 0 0;margin:0%!important'>" +
                                    "<input style='text-align: right;' class='apphr" + tcount + "' data-role='mini' type='text' placeholder='" + dPlaceHolder + " appvdata='" + data[i].ActivityCode + "-" + data[i].AccountCode + "'/>" +
                                "</td>" +
                           "</tr>";
                    changed = 1;

                }
            }
            else {
                lit += "<tr>" +
                                "<td colspan='2' style='width:40%'><p style='font-weight:bold;font-size:15px'>" + data[i].ActivityDescription + " (" + data[i].ActivityCode + ")<p></br><p style='font-size:15px'>" + data[i].AccountDescription + " (" + data[i].AccountCode + ")</p></br><p style='font-size:15px'>Remark : " + data[i].Remark + "</p></td>" +
                                //"<td>" + data[i].ActivityDescription + "</br>" + data[i].AccountDescription + "</td>" +
                                   //"<td >" + data[i].Hours + "</td>" +
                                "<td class='toright' style='width:20%;padding:0 0% 0 0;margin:0%!important'>" +
                                    "<input style='text-align: right;' class='apphr" + tcount + "' data-role='mini' type='text' placeholder='" + dPlaceHolder + " appvdata='" + data[i].ActivityCode + "-" + data[i].AccountCode + "'/>" +
                                "</td>" +
                           "</tr>";
            }
        }
        lii += lit + "</tbody></table>" + "</div>";

        /*set disabled to first header*/
        if (data[0].ApprovedHours != null) {
            
            firstdPlaceHolder = data[0].ApprovedHours + "' disabled";
        }
        else {
           
            //firstdPlaceHolder = data[0].Hours;apphr" + i
            var appval = "#apphr" + 0;
            firstdPlaceHolder = $(appval).val()+"'";
        }

        headlii +=
           "<div data-role='collapsible' data-inset='false' data-collapsed='true' id='MainID'>" +
                       "<h3><div class='collaptitle' style='padding-top:2%' id='MainID" + i + "'>" + display_name_format(data[0].FirstName, data[0].LastName) + "</div><div class='collapfigure'><label style='padding-right:0%;width:10%;float:right'  ><input class='TimeReportingHideCheckbox' type='checkbox' id='checkbox-" + data[0].ActivityMainID + "-" + data[0].ActivityCode + "-" + data[0].AccountCode + "-" + 0 + "-" + firstdPlaceHolder + "></label></div><div class='collapfigure' style='padding-top:2%'>" + totalhr[0] + " h" +
                       "</div></h3>" +
                           "<table data-role='table' data-mode='columntoggle' class='ui-responsive ui-shadow collapstb'>" +
                                "<thead></thead><tbody>";
        headlii += lii;
        //set the approval hour to disabled if the approval hour is not null
        $("input[disabled]").prop('disabled', true);
        $("input[disabled]:checkbox").prop('disabled', true);
       
        $('.ui-collapsible-heading-toggle .ui-btn .ui-btn-icon-left .ui-btn-c .ui-icon-minus').removeClass($.mobile.activeBtnClass);
        //$('.ui-collapsible .ui-collapsible-inset .ui-corner-all .ui-collapsible-themed-content .ui-last-child .ui-collapsible-collapsed').removeClass(ui-collapsible-inset ui-corner-all);
       
       

        $("#contentDetail").empty();
        $("#contentDetail").html(headlii).trigger("create");//.collapsibleset('refresh');
    }
    else {
        $("#contentDetail").empty();
        $("#contentDetail").html("<br/><div style='text-align:center;color:white;text-shadow:none'>No Submission Today.</div>").trigger("create");
    }

}





