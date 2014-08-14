

$(document).on('click', '.dwb0', function () { // when click on set button on datepicker

    myActivityAddFunctions.dispSetDate();


});


$(document).one("pagebeforeshow", function () {
    //$("div[data-role='page']").trigger('create');
    myActivityAddFunctions.populateSelectMenu();
    //myActivityAddFunctions.defaultDatepickerToToday();
    myActivityAddFunctions.dispTodayDate();

});

var myActivityAddFunctions = {
    defaultDatepickerToToday: function () {
        $("#activityDate")[0].valueAsDate = new Date();
    },
    populateSelectMenu: function () {
        //ajax GET activityCode
        var cacheSelect = $("select#activityCode");

        $.ajax({
            url: SERVER_URL + "/api/activity",
            type: "GET",
            crossDomain: true,
            async: true,
            success: function (data) {
                // Confirmational response from server
                if (data != "") {
                    for (var i = 0; i < data.length; i++) {
                        var appendActivityCodes =
                            "<option value='" + data[i].ActivityCode + "'>" + data[i].ActivityCode + " " + data[i].Description + "</option>";
                        cacheSelect.html(appendActivityCodes);
                    }
                    cacheSelect.selectmenu("refresh");
                }
                else {
                    cacheSelect.html("<option value=''>No Activity Code</option>'");
                    cacheSelect.selectmenu("refresh");
                }
            },
            error: function (jqXHR, exception) {
                setTimeout(function () { $("#popup_ErrorMsg_AddMyActivity").popup("open"); }, 1000);
                if (jqXHR.status === 0) {
                    $('#ErrorMessage_AddMyActivity').html('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    $('#ErrorMessage_AddMyActivity').html('Requested page not found. [404]');
                } else if (jqXHR.status == 401) {
                    $('#ErrorMessage_AddMyActivity').html('401 Unauthorized');
                } else if (jqXHR.status == 500) {
                    $('#ErrorMessage_AddMyActivity').html('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    $('#ErrorMessage_AddMyActivity').html('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    $('#ErrorMessage_AddMyActivity').html('Time out error.');
                } else if (exception === 'abort') {
                    $('#ErrorMessage_AddMyActivity').html('Ajax request aborted.');
                } else {
                    $('#ErrorMessage_AddMyActivity').html('Error Occur.');
                }
            }
        });

        //ajax GET accountCodeMyFavouriteCode";
        var userID = localStorage.getItem("UserID");
        $.ajax({
            url: SERVER_URL + "/api/accountcode/myfavouritecode",
            type: "POST",
            crossDomain: true,
            async: true,
            contentType: "application/json",
            data:JSON.stringify({
                "UserDetailID":userID
            }),
            success: function (data) {
                // Confirmational response from server
                for (var i = 0; i < data.length; i++) {
                    var appendAccountCodes =
                        "<option value='" + data[i].AccountCode + "'>" + data[i].AccountCode + " " + data[i].Description + "</option>";
                    $("select#accountCode").html(appendAccountCodes);
                }
                $("select#accountCode").selectmenu("refresh");
            },
            error: function (jqXHR, exception) {
                setTimeout(function () { $("#popup_ErrorMsg_AddMyActivity").popup("open"); }, 1000);
                if (jqXHR.status === 0) {
                    $('#ErrorMessage_AddMyActivity').html('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    $('#ErrorMessage_AddMyActivity').html('Requested page not found. [404]');
                } else if (jqXHR.status == 401) {
                    $('#ErrorMessage_AddMyActivity').html('401 Unauthorized');
                } else if (jqXHR.status == 500) {
                    $('#ErrorMessage_AddMyActivity').html('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    $('#ErrorMessage_AddMyActivity').html('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    $('#ErrorMessage_AddMyActivity').html('Time out error.');
                } else if (exception === 'abort') {
                    $('#ErrorMessage_AddMyActivity').html('Ajax request aborted.');
                } else {
                    $('#ErrorMessage_AddMyActivity').html('Error Occur.');
                }
            }
        });
    },
    addActivity: function () {
       
        var apiURL = SERVER_URL + "/api/activity/savemyactivity";

        var activityCode = $("#activityCode").val();
        var accountCode = $("#hrefAccountCode").text();
        var hours = $("#hours").val();
        var remark = $("#remark").val();
        var userDetailID = localStorage.getItem("UserID");
        var activityDate = "";

        if (localStorage.ApvrDate == null) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) { dd = '0' + dd } if (mm < 10) { mm = '0' + mm }  activityDate = yyyy + '-' + mm + '-' + dd;
         
        }
        else
            activityDate = localStorage.ApvrDate.split("/").reverse().join("-");


       // var activityDate = $("#activityDate").val();
        var statusID = 1;
        if (activityCode == "") {
            setTimeout(function () { $("#popup_ErrMsg_AddMyActivity").popup("open"); }, 1000);
            $('#ErroMessage_AddMyActivity').html('Please select an activity code.');
        } else if (accountCode == "Select account code") {
            setTimeout(function () { $("#popup_ErrMsg_AddMyActivity").popup("open"); }, 1000);
            $('#ErroMessage_AddMyActivity').html('Please select an account code.');
        } else if (hours == "") {
            setTimeout(function () { $("#popup_ErrMsg_AddMyActivity").popup("open"); }, 1000);
            $('#ErroMessage_AddMyActivity').html('Please key in hours.');
        } else if (parseInt(hours) > 24) {
            setTimeout(function () { $("#popup_ErrMsg_AddMyActivity").popup("open"); }, 1000);
            $('#ErroMessage_AddMyActivity').html('Hours cannot more than 24.');
        } else if (parseInt(hours) === 0) {
            setTimeout(function () { $("#popup_ErrMsg_AddMyActivity").popup("open"); }, 1000);
            $('#ErroMessage_AddMyActivity').html('Hours cannot be 0.');
        } else {
            $.ajax({
                url: apiURL,
                type: "POST",
                crossDomain: true,
                async: true, // false for now

                contentType: "application/json",
                data: JSON.stringify({
                    "ActivityCode": activityCode,
                    "AccountCode": accountCode,
                    "Hours": hours,
                    "Remark": remark,
                    "UserDetailID": userDetailID,
                    "ActivityDate": activityDate,
                    "StatusID": statusID
                }),
                success: function () {
                    // Confirmational response from server
                    setTimeout(function () { $("#popup_sucessfully_AddMyActivity").popup("open"); }, 1000);
                },
                error: function (jqXHR, exception) {
                    setTimeout(function () { $("#popup_ErrorMsg_AddMyActivity").popup("open"); }, 1000);
                    if (jqXHR.status === 0) {
                        $('#ErrorMessage_AddMyActivity').html('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        $('#ErrorMessage_AddMyActivity').html('Requested page not found. [404]');
                    } else if (jqXHR.status == 401) {
                        $('#ErrorMessage_AddMyActivity').html('401 Unauthorized');
                    } else if (jqXHR.status == 500) {
                        $('#ErrorMessage_AddMyActivity').html('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        $('#ErrorMessage_AddMyActivity').html('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        $('#ErrorMessage_AddMyActivity').html('Time out error.');
                    } else if (exception === 'abort') {
                        $('#ErrorMessage_AddMyActivity').html('Ajax request aborted.');
                    } else {
                        $('#ErrorMessage_AddMyActivity').html('Error Occur.');
                    }
                }
            });
        }
    },


dispSetDate:function() {
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
    $("#subaction1").text(myFormatDate);

    


},

dispTodayDate:function() {
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

    if (localStorage.ApvrDate == null) {
        $("#subaction").text(myFormatDate);
        $("#subaction1").text(myFormatDate);
        localStorage.ApvrDate = today;
    }

    else
        myActivityAddFunctions.dispSetDate();
    
}
}

$(document).one('pagecreate', '#myActivity-add', function () {
    $(document).off('click', '#btn_closeErrMsg_AddMyActivity').on('click', '#btn_closeErrMsg_AddMyActivity', function (e) {
        $("#popup_ErrMsg_AddMyActivity").popup("close");
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