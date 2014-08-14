$(document).one("pagebeforeshow", function () {
});

var masterActivityAddFunctions = {
    addActivity: function () {
        var apiURL = SERVER_URL + "/api/activity";

        var activityCode = $("#activityCode").val();
        var description = $("#description").val();
        var userID = localStorage.getItem("userID");

        if (activityCode == "") {
            setTimeout(function () { $("#popup_ErrMsg_MasterActivityAdd").popup("open"); }, 1000);
            $('#ErroMessage_MasterActivityAdd').html('Please insert activity code, activity code cannot be null.');
        } else if (description == "") {
            setTimeout(function () { $("#popup_ErrMsg_MasterActivityAdd").popup("open"); }, 1000);
            $('#ErroMessage_MasterActivityAdd').html('Please insert description, description cannot be null.');
        } else {
            $.ajax({
                url: apiURL,
                type: "POST",
                crossDomain: true,
                async: false,
                contentType: "application/json",
                data: JSON.stringify({
                    "ActivityCode": activityCode,
                    "Description": description,
                    "ActiveFlag": 1,
                    "CreatedBy": userID
                }),
                success: function () {
                    // Confirmational response from server
                    setTimeout(function () { $("#popup_sucessfullyAddActivity").popup("open"); }, 1000);
                },
                error: function (jqXHR, exception) {
                    setTimeout(function () { $("#popup_ErrMsg_MasterActivityAdd").popup("open"); }, 1000);
                    if (jqXHR.status === 0) {
                        $('#ErroMessage_MasterActivityAdd').html('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        $('#ErroMessage_MasterActivityAdd').html('Requested page not found. [404]');
                    } else if (jqXHR.status == 401) {
                        $('#ErroMessage_MasterActivityAdd').html('401 Unauthorized');
                    } else if (jqXHR.status == 500) {
                        $('#ErroMessage_MasterActivityAdd').html('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        $('#ErroMessage_MasterActivityAdd').html('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        $('#ErroMessage_MasterActivityAdd').html('Time out error.');
                    } else if (exception === 'abort') {
                        $('#ErroMessage_MasterActivityAdd').html('Ajax request aborted.');
                    } else {
                        $('#ErroMessage_MasterActivityAdd').html('Error Occur.');
                    }
                }
            });
        }
    }

}

$(document).one('pagecreate', '#master-activity-add', function () {
    $(document).off('click', '#btn_closeErrMsg_MasterActivityAdd').on('click', '#btn_closeErrMsg_MasterActivityAdd', function (e) {
        $("#popup_ErrMsg_MasterActivityAdd").popup("close");
    });
    $(document).off('click', '#ActivitySuccessOK').on('click', '#ActivitySuccessOK', function (e) {
        
        $.mobile.changePage("master-activity.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });
});