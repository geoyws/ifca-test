$(document).one("pagecontainerbeforeshow", function () {
    $("div[data-role='page']").trigger('create');
    $("#active").prop("checked", true).checkboxradio('refresh');
});

var masterAccountCodeAddFunctions = {
    addAccountCode: function () {
        var apiURL = SERVER_URL + "/api/accountcode";

        var accountCode = $("#accountCode").val();
        var description = $("#description").val();

        var userID = localStorage.getItem("userID");
        if (accountCode == "") {
            setTimeout(function () { $("#popup_ErrMsg_MasterAccountCodeAdd").popup("open"); }, 1000);
            $('#ErroMessage_MasterAccountCodeAdd').html('Account code is require.');
        } else if (description == "") {
            setTimeout(function () { $("#popup_ErrMsg_MasterAccountCodeAdd").popup("open"); }, 1000);
            $('#ErroMessage_MasterAccountCodeAdd').html('Description cannot be empty.');
        } else {
            $.ajax({
                url: apiURL,
                type: "POST",
                crossDomain: true,
                async: false,
                contentType: "application/json",
                data: JSON.stringify({
                    "AccountCode": accountCode,
                    "Description": description,
                    "ActiveFlag": 1,
                    "CreatedBy": userID
                }),
                success: function () {
                  
                    // Confirmational response from server
                    setTimeout(function () { $("#popup_sucessfullyAddAccountCode").popup("open"); }, 1000);
                },
                error: function (jqXHR, exception,err) {
                    setTimeout(function () { $("#popup_ErrMsg_MasterAccountCodeAdd").popup("open"); }, 1000);
                    if (jqXHR.status === 0) {
                        $('#ErroMessage_MasterAccountCodeAdd').html('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        $('#ErroMessage_MasterAccountCodeAdd').html('Requested page not found. [404]');
                    } else if (jqXHR.status == 400) {
                        $('#ErroMessage_MasterAccountCodeAdd').html(err);
                    }
                    else if (jqXHR.status == 401) {
                        $('#ErroMessage_MasterAccountCodeAdd').html('401 Unauthorized');
                    } else if (jqXHR.status == 500) {
                        $('#ErroMessage_MasterAccountCodeAdd').html('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        $('#ErroMessage_MasterAccountCodeAdd').html('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        $('#ErroMessage_MasterAccountCodeAdd').html('Time out error.');
                    } else if (exception === 'abort') {
                        $('#ErroMessage_MasterAccountCodeAdd').html('Ajax request aborted.');
                    } else {
                        $('#ErroMessage_MasterAccountCodeAdd').html("Error");
                    }
                }
            });
        }
    }

}
$(document).one('pagecreate', '#master-accountcode-add', function () {
    $(document).off('click', '#btn_closeErrMsg_MasterAccountCodeAdd').on('click', '#btn_closeErrMsg_MasterAccountCodeAdd', function (e) {
        $("#popup_ErrMsg_MasterAccountCodeAdd").popup("close");
    });

    $(document).off('click', '#AccountcodeSuccessOK').on('click', '#AccountcodeSuccessOK', function (e) {
       
        $.mobile.changePage("master-accountcode.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });
});