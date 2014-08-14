var oldactivityCode;
var oldaccountCode;
$(document).one("pagecontainerbeforeshow", function () {
    masterActivityEditFunctions.populateSelectMenu();
    masterActivityEditFunctions.renderDetails();
   
});

var masterActivityEditFunctions = {

    renderDetails: function () {
        var url = window.location.href;
        //var activityMainID = Number(url.split("=")[1].split("-")[0]);
        var activityMainID = url.split("=")[1].split("-")[0];
        var activityCode = url.split("=")[1].split("-")[1].replace(/_+/g," "); // in case there is spacing
        var accountCode = url.split("=")[1].split("-")[2];

        localStorage.activityCode = activityCode;
        localStorage.accountCode = accountCode;
        

        var date = url.split("=")[1].split("-")[3];
        var formattedDate = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6);
        var userID = localStorage.getItem("UserID");

        var apiURL = SERVER_URL + "/api/activity/myactivity";

        $.ajax({
            url: apiURL,
            type: "POST",
            crossDomain: true,
            async: false,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "UserDetailID": userID,
                "date": formattedDate
            }),
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ActivityMainID == activityMainID && data[i].ActivityCode == activityCode && data[i].AccountCode == accountCode) {
                        $("#activityCode").val(data[i].ActivityCode).selectmenu("refresh", true);
                        $("#accountCode").val(data[i].AccountCode).selectmenu("refresh",true);
                        //alert(data[i].ActivityCode);
                        //alert(data[i].AccountCode);
                        $("#hours").val(data[i].Hours);
                        $("#approvedHours").val(data[i].ApprovedHours);
                        $("#remark").val(data[i].Remark);
                       
                        
                        localStorage.oldactivityCode = data[i].ActivityCode;
                        localStorage.oldaccountCode = data[i].AccountCode;
                        break;
                    }
                }
            },
            error: function (jqXHR, exception) {
                setTimeout(function () { $("#popup_ErrMsg_EditMyActivity").popup("open"); }, 1000);
                if (jqXHR.status === 0) {
                    $('#ErrorMessage_EditMyActivity').html('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    $('#ErrorMessage_EditMyActivity').html('Requested page not found. [404]');
                } else if (jqXHR.status == 401) {
                    $('#ErrorMessage_EditMyActivity').html('401 Unauthorized');
                } else if (jqXHR.status == 500) {
                    $('#ErrorMessage_EditMyActivity').html('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    $('#ErrorMessage_EditMyActivity').html('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    $('#ErrorMessage_EditMyActivity').html('Time out error.');
                } else if (exception === 'abort') {
                    $('#ErrorMessage_EditMyActivity').html('Ajax request aborted.');
                } else {
                    $('#ErrorMessage_EditMyActivity').html('Error Occur.');
                }
            }
        });
    },
    populateSelectMenu: function () {
        //ajax GET activityCode

        $.ajax({
            url: SERVER_URL + "/api/activity",
            type: "GET",
            crossDomain: true,
            async: true,
            success: function (data) {
                // Confirmational response from server
                for (var i = 0; i < data.length; i++) {
                    
                    if (localStorage.activityCode == data[i].ActivityCode) {
                       
                        var appendActivityCodes =
                         "<option selected value='" + data[i].ActivityCode + "'>" + data[i].ActivityCode + " " + data[i].Description + "</option>";
                    }
                    else {
                        var appendActivityCodes =
                           "<option value='" + data[i].ActivityCode + "'>" + data[i].ActivityCode + " " + data[i].Description + "</option>";
                    }
                    $("select#activityCode").append(appendActivityCodes);
                }
                $("select#activityCode").selectmenu("refresh");
            },
            error: function (jqXHR, exception) {
                setTimeout(function () { $("#popup_ErrMsg_EditMyActivity").popup("open"); }, 1000);
                if (jqXHR.status === 0) {
                    $('#ErrorMessage_EditMyActivity').html('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    $('#ErrorMessage_EditMyActivity').html('Requested page not found. [404]');
                } else if (jqXHR.status == 401) {
                    $('#ErrorMessage_EditMyActivity').html('401 Unauthorized');
                } else if (jqXHR.status == 500) {
                    $('#ErrorMessage_EditMyActivity').html('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    $('#ErrorMessage_EditMyActivity').html('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    $('#ErrorMessage_EditMyActivity').html('Time out error.');
                } else if (exception === 'abort') {
                    $('#ErrorMessage_EditMyActivity').html('Ajax request aborted.');
                } else {
                    $('#ErrorMessage_EditMyActivity').html('Error Occur.');
                }
            }
        });

        //ajax GET accountCode
        //var getAccountCodesAPI = "http://175.139.183.94:76/TimeReportingAPI/api/accountcode/MyFavouriteCode";
        //var userID = localStorage.getItem("UserID");
        //$.ajax({
        //    url: getAccountCodesAPI,
        //    type: "POST",
        //    crossDomain: true,
        //    async: true,
        //    contentType: "application/json",
        //    data: JSON.stringify({
        //        "UserDetailID": userID
        //    }),
        //    success: function (data) {
        //        // Confirmational response from server
        //        for (var i = 0; i < data.length; i++) {

        //            if (localStorage.accountCode == data[i].AccountCode) {

        //                var appendAccountCodes =
        //                 "<option selected value='" + data[i].AccountCode + "'>" + data[i].AccountCode + " " + data[i].Description + "</option>";
        //            }
        //            var appendAccountCodes =
        //                "<option value='" + data[i].AccountCode + "'>" + data[i].AccountCode + " " + data[i].Description + "</option>";
        //            $("select#accountCode").append(appendAccountCodes);
        //        }
        //        $("select#accountCode").selectmenu("refresh");
        //    },
        //    error: function (jqXHR, exception) {
        //        if (jqXHR.status === 0) {
        //            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Not connect.\n Verify Network.');
        //        } else if (jqXHR.status == 404) {
        //            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Requested page not found. [404]');
        //        } else if (jqXHR.status == 401) {
        //            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('401 Unauthorized');
        //        } else if (jqXHR.status == 500) {
        //            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Internal Server Error [500].');
        //        } else if (exception === 'parsererror') {
        //            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Requested JSON parse failed.');
        //        } else if (exception === 'timeout') {
        //            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Time out error.');
        //        } else if (exception === 'abort') {
        //            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Ajax request aborted.');
        //        } else {
        //            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html(jqXHR.responseText);
        //        }
        //    }
        //});
    },
    updateActivity: function () {
        var apiURL = SERVER_URL + "/api/Activity/UpdateMyActivity";

        var url = window.location.href;
        var activityMainID = url.split("=")[1].split("-")[0];
        var activityCode = $("#activityCode").val();
        var accountCode = $("#hrefAccountCode").text();
        var hours = $("#hours").val();
        var approvedHours = $("#approvedHours").val();
        var remark = $("#remark").val();
        var oldactivityCode=localStorage.oldactivityCode;
        var oldaccountCode = localStorage.oldaccountCode;

     
        
        if (activityCode == "") {
            setTimeout(function () { $("#popup_ErrMsg_EditMyActivity").popup("open"); }, 1000);
            $('#ErrorMessage_EditMyActivity').html('Please select an activity code.');
        } else if (accountCode == "") {
            setTimeout(function () { $("#popup_ErrMsg_EditMyActivity").popup("open"); }, 1000);
            $('#ErrorMessage_EditMyActivity').html('Please select an account code.');
        } else if (hours == "") {
            setTimeout(function () { $("#popup_ErrMsg_EditMyActivity").popup("open"); }, 1000);
            $('#ErrorMessage_EditMyActivity').html('Please key in hours.');
        } else if (parseInt(hours) > 24) {
            setTimeout(function () { $("#popup_ErrMsg_EditMyActivity").popup("open"); }, 1000);
            $('#ErrorMessage_EditMyActivity').html('Hours cannot more than 24.');
        } else if (parseInt(hours) === 0) {
            setTimeout(function () { $("#popup_ErrMsg_AddMyActivity").popup("open"); }, 1000);
            $('#ErroMessage_AddMyActivity').html('Hours cannot be 0.');
        } else {
            $.ajax({
                url: apiURL,
                type: "POST",
                //crossDomain: true,
                //async: false, // false for now

                contentType: "application/json",

                data: JSON.stringify({
                    "ActivityMainID": activityMainID,
                    "ActivityCode": activityCode,
                    "AccountCode": accountCode,
                    "OldActivityCode": oldactivityCode,
                    "OldAccountCode": oldaccountCode,
                    "Hours": hours,
                    //"ApprovedHours": approvedHours,
                    "Remark": remark
                }),
                success: function () {
                    // Confirmation popup
                    setTimeout(function () { $("#popup_sucessfullyEditMyActivity").popup("open"); }, 1000);
                },
                error: function (jqXHR, exception) {
                    setTimeout(function () { $("#popup_ErrMsg_EditMyActivity").popup("open"); }, 1000);
                    if (jqXHR.status === 0) {
                        $('#ErrorMessage_EditMyActivity').html('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        $('#ErrorMessage_EditMyActivity').html('Requested page not found. [404]');
                    } else if (jqXHR.status == 401) {
                        $('#ErrorMessage_EditMyActivity').html('401 Unauthorized');
                    } else if (jqXHR.status == 500) {
                        $('#ErrorMessage_EditMyActivity').html('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        $('#ErrorMessage_EditMyActivity').html('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        $('#ErrorMessage_EditMyActivity').html('Time out error.');
                    } else if (exception === 'abort') {
                        $('#ErrorMessage_EditMyActivity').html('Ajax request aborted.');
                    } else {
                        $('#ErrorMessage_EditMyActivity').html('Error Occur.');
                    }
                }
            });
        }
    }
};

$(document).one('pagecreate', '#myActivity', function () {
    $(document).off('click', '#btn_closeErrMsg_EditMyActivity').on('click', '#btn_closeErrMsg_EditMyActivity', function (e) {
        $("#popup_ErrMsg_EditMyActivity").popup("close");
    });

    $(document).off('click', '#MyActivitySuccessOK').on('click', '#MyActivitySuccessOK', function (e) {
        $.mobile.changePage("myactivity.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });

    $('#hours').keypress(function (event) {
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }

        var text = $(this).val();

        if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 2)) {
            if (text.length > 4) {
                event.preventDefault();
            }
        } else if (text.indexOf('.') == -1) {
            if (text.length > 1) {
                if (event.which != 46 || $(this).val().indexOf('.') != -1) {
                    event.preventDefault();
                }
            }
        }

    });
});

