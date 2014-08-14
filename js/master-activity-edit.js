$(document).one("pagecontainerbeforeshow", function () {
    masterActivityEditFunctions.renderDetails();
});

var masterActivityEditFunctions = {
    renderDetails: function () {
        var url = window.location.href;
        var activityCode = url.split("=")[1];

        var apiURL = SERVER_URL + "/api/activity/";
        //alert(activityCode);
        $.ajax({
            url: apiURL + activityCode,
            type: "GET",
            //crossDomain: true,
            //async: false,
            //dataType: "json",
            success: function (data) {
                $("#activityCode").val(data[0].ActivityCode);
                if (data[0].ActiveFlag == 1) {
                    $("#active").prop("checked", true).checkboxradio('refresh');
                }
                $("#description").val(data[0].Description);
            },
            error: function (jqXHR, exception) {
                setTimeout(function () { $("#popup_ErrMsg_MasterActivityEdit").popup("open"); }, 1000);
                if (jqXHR.status === 0) {
                    $('#ErroMessage_MasterActivityEdit').html('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    $('#ErroMessage_MasterActivityEdit').html('Requested page not found. [404]');
                } else if (jqXHR.status == 401) {
                    $('#ErroMessage_MasterActivityEdit').html('401 Unauthorized');
                } else if (jqXHR.status == 500) {
                    $('#ErroMessage_MasterActivityEdit').html('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    $('#ErroMessage_MasterActivityEdit').html('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    $('#ErroMessage_MasterActivityEdit').html('Time out error.');
                } else if (exception === 'abort') {
                    $('#ErroMessage_MasterActivityEdit').html('Ajax request aborted.');
                } else {
                    $('#ErroMessage_MasterActivityEdit').html('Error Occur.');
                }
            }
        });
    },
    updateActivityCode: function () {
        var apiURL = SERVER_URL + "/api/activity/";

        var activityCode = $("#activityCode").val();
        var description = $("#description").val();
        var modifiedBy = localStorage.getItem("userID");
        var activeFlag = function () {
            if ($("#active").prop("checked") == true) {
                return 1;
            } else {
                return 0;
            }
        }();

        if (activityCode == "") {
            setTimeout(function () { $("#popup_ErrMsg_MasterActivityEdit").popup("open"); }, 1000);
            $('#ErroMessage_MasterActivityEdit').html('Please insert activity code, activity code cannot be null.');
        } else if (description == "") {
            setTimeout(function () { $("#popup_ErrMsg_MasterActivityEdit").popup("open"); }, 1000);
            $('#ErroMessage_MasterActivityEdit').html('Please insert description, description cannot be null.');
        } else {
            $.ajax({
                url: apiURL + activityCode,
                type: "POST",
                crossDomain: true,
                async: false,
                contentType: "application/json",
                data: JSON.stringify({
                    "Description": description,
                    "ModifiedBy": modifiedBy,
                    "ActiveFlag": activeFlag
                }),
                success: function () {
                    setTimeout(function () { $("#popup_sucessfullyEditActivity").popup("open"); }, 1000);
                },
                error: function (jqXHR, exception) {
                    setTimeout(function () { $("#popup_ErrMsg_MasterActivityEdit").popup("open"); }, 1000);
                    if (jqXHR.status === 0) {
                        $('#ErroMessage_MasterActivityEdit').html('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        $('#ErroMessage_MasterActivityEdit').html('Requested page not found. [404]');
                    } else if (jqXHR.status == 401) {
                        $('#ErroMessage_MasterActivityEdit').html('401 Unauthorized');
                    } else if (jqXHR.status == 500) {
                        $('#ErroMessage_MasterActivityEdit').html('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        $('#ErroMessage_MasterActivityEdit').html('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        $('#ErroMessage_MasterActivityEdit').html('Time out error.');
                    } else if (exception === 'abort') {
                        $('#ErroMessage_MasterActivityEdit').html('Ajax request aborted.');
                    } else {
                        $('#ErroMessage_MasterActivityEdit').html('Error occurred.');
                    }
                }
            });
        }
    }
};


$(document).one('pagecreate', '#master-activity-edit', function () {
    $(document).off('click', '#btn_closeErrMsg_MasterActivityEdit').on('click', '#btn_closeErrMsg_MasterActivityEdit', function (e) {
        $("#popup_ErrMsg_MasterActivityEdit").popup("close");
    });
    $(document).off('click', '#ActivitySuccessOK').on('click', '#ActivitySuccessOK', function (e) {

        $.mobile.changePage("master-activity.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });
});
