$(document).one("pagecontainerbeforeshow", function () {
    masterAccountCodeEditFunctions.renderDetails();
});

var masterAccountCodeEditFunctions = {
    renderDetails: function () {
        var url = window.location.href;
        var accountCode = url.split("=")[1];

        var apiURL = SERVER_URL + "/api/accountcode/";

        $.ajax({
            url: apiURL + accountCode,
            type: "GET",
            crossDomain: true,
            async: false,
            success: function (data) {
                $("#accountCode").val(data[0].AccountCode);
                $("#description").val(data[0].Description);
                if (data[0].ActiveFlag == 1) {
                    $("#active").prop("checked", true).checkboxradio('refresh');
                }
            },
            error: function (jqXHR, exception) {
                setTimeout(function () { $("#popup_ErrMsg_MasterAccountCodeEdit").popup("open"); }, 1000);
                if (jqXHR.status === 0) {
                    $('#ErroMessage_MasterAccountCodeEdit').html('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    $('#ErroMessage_MasterAccountCodeEdit').html('Requested page not found. [404]');
                } else if (jqXHR.status == 401) {
                    $('#ErroMessage_MasterAccountCodeEdit').html('401 Unauthorized');
                } else if (jqXHR.status == 500) {
                    $('#ErroMessage_MasterAccountCodeEdit').html('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    $('#ErroMessage_MasterAccountCodeEdit').html('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    $('#ErroMessage_MasterAccountCodeEdit').html('Time out error.');
                } else if (exception === 'abort') {
                    $('#ErroMessage_MasterAccountCodeEdit').html('Ajax request aborted.');
                } else {
                    $('#ErroMessage_MasterAccountCodeEdit').html('Error Occur.');
                }
            }
        });
    },
    updateAccountCode: function () {
        var apiURL = SERVER_URL + "/api/accountcode/";

        var accountCode = $("#accountCode").val();
        var description = $("#description").val();
        var activeFlag = function () {
            if ($("#active").prop("checked") == true) {
                return 1;
            } else {
                return 0;
            }
        }();

        var createdBy = localStorage.getItem("UserID");
        if (accountCode == "") {
            setTimeout(function () { $("#popup_ErrMsg_MasterAccountCodeEdit").popup("open"); }, 1000);
            $('#ErroMessage_MasterAccountCodeEdit').html('Account Code cannot be empty.');
        } else if (description == "") {
            setTimeout(function () { $("#popup_ErrMsg_MasterAccountCodeEdit").popup("open"); }, 1000);
            $('#ErroMessage_MasterAccountCodeEdit').html('Description cannot be empty.');
        } else {
            $.ajax({
                url: apiURL + accountCode,
                type: "POST",
                crossDomain: true,
                async: false,
                contentType: "application/json",
                data: JSON.stringify({
                    "AccountCode": accountCode,
                    "Description": description,
                    "ActiveFlag": activeFlag,
                    "CreatedBy": createdBy
                }),
                success: function () {
                    // Confirmation popup
                    setTimeout(function () { $("#popup_sucessfullyEditAccountcode").popup("open"); }, 1000);
                },
                error: function (jqXHR, exception) {
                    setTimeout(function () { $("#popup_ErrMsg_MasterAccountCodeEdit").popup("open"); }, 1000);
                    if (jqXHR.status === 0) {
                        $('#ErroMessage_MasterAccountCodeEdit').html('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        $('#ErroMessage_MasterAccountCodeEdit').html('Requested page not found. [404]');
                    } else if (jqXHR.status == 401) {
                        $('#ErroMessage_MasterAccountCodeEdit').html('401 Unauthorized');
                    } else if (jqXHR.status == 500) {
                        $('#ErroMessage_MasterAccountCodeEdit').html('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        $('#ErroMessage_MasterAccountCodeEdit').html('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        $('#ErroMessage_MasterAccountCodeEdit').html('Time out error.');
                    } else if (exception === 'abort') {
                        $('#ErroMessage_MasterAccountCodeEdit').html('Ajax request aborted.');
                    } else {
                        $('#ErroMessage_MasterAccountCodeEdit').html('Error Occur.');
                    }
                }
            });
        }
    }
};


$(document).one('pagecreate', '#master-accountcode-edit', function () {
    $(document).off('click', '#btn_closeErrMsg_MasterAccountCodeEdit').on('click', '#btn_closeErrMsg_MasterAccountCodeEdit', function (e) {
        $("#popup_ErrMsg_MasterAccountCodeEdit").popup("close");
    });

    $(document).off('click', '#AccountcodeSuccessOK').on('click', '#AccountcodeSuccessOK', function (e) {

        $.mobile.changePage("master-accountcode.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });
});