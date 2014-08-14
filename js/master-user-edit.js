$(document).one("pagecontainerbeforeshow", function () {
    GenerateManagerDropDownList();
    masterUserEditFunctions.renderDetails();
});

function GenerateManagerDropDownList() {
    $("#ReportTo").html("<option value='0' >Manager</option>");

    $.ajax({
        type: "GET",
        url: SERVER_URL + "/api/UserDetail/GetAllManager",
        success: function (result) {
            $.each(result, function (index, element) {
                if (element.UserDetailID != localStorage.getItem("UserID"))
                    $("#ReportTo").append("<option value=" + element.UserDetailID + ">" + display_name_format(element.FirstName, element.LastName) + "</option>");
            });
            $('#ReportTo').selectmenu('refresh', true);
        },
        fail: function (jqXHR, exception) {
            setTimeout(function () { $("#popup_ErrMsg_MasterUserEdit").popup("open"); }, 1000);
            $("#ErroMessage_MasterUserEdit").html(jqXHR.responseText);
        }

    });
}

var masterUserEditFunctions = {
    renderDetails: function () {
        var url = window.location.href;
        var userDetailID = url.split("=")[1];

        $.ajax({          
            url: SERVER_URL + "/api/UserDetail/DetailbyID/" + userDetailID,
            type: "GET",     
            success: function (data) {
                //alert(data.FirstName);
                $("#UserID").val(data.UserDetailID);
                $("#userName").val(data.UserName);
                $("#firstName").val(data.FirstName);               
                $("#lastName").val(data.LastName);
                $("#email").val(data.Email);
                $("#phone").val(data.Phone);
                $("#role").val(data.Role);
                $("#role").selectmenu("refresh");
                $("#ReportTo").val(data.ReportTo);
                //alert(data.ReportTo);
               // $("#reportTo").val(data.ReportTo);
                $("#ReportTo").selectmenu("refresh");
                if (data.ActiveFlag == true) {
                    $("#active").prop("checked", true).checkboxradio('refresh');
                }
            },
            error: function (jqXHR, exception) {
                setTimeout(function () { $("#popup_ErrMsg_MasterUserEdit").popup("open"); }, 1000);
                if (jqXHR.status === 0) {
                    $('#ErroMessage_MasterUserEdit').html('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    $('#ErroMessage_MasterUserEdit').html('Requested page not found. [404]');
                } else if (jqXHR.status == 401) {
                    $('#ErroMessage_MasterUserEdit').html('401 Unauthorized');
                } else if (jqXHR.status == 500) {
                    $('#ErroMessage_MasterUserEdit').html('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    $('#ErroMessage_MasterUserEdit').html('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    $('#ErroMessage_MasterUserEdit').html('Time out error.');
                } else if (exception === 'abort') {
                    $('#ErroMessage_MasterUserEdit').html('Ajax request aborted.');
                } else {
                    $('#ErroMessage_MasterUserEdit').html('Error Occur.');
                }
            }
        });
    },
    updateUser: function () {
       
        var userDetailID = $("#UserID").val();       
        var firstName = $("#firstName").val();      
        var lastName = $("#lastName").val();     
        var email = $("#email").val();    
        var phone = $("#phone").val();   
        var ReportTo = $("#ReportTo").val(); 
        var role = $('#role').find(":selected").val();     
        var activeFlag = function () {
            if ($("#active").prop("checked") == true) {
                return 1;
            } else {
                return 0;
            }
        }();
    
        var userID = localStorage.getItem("UserID");
       
        if (firstName == "") {
            $("#popup_ErrMsg_MasterUserEdit").popup("open");
            $("#ErroMessage_MasterUserEdit").html("Please insert first name, first name cannot be empty.");
        } else if (lastName == "") {
            $("#popup_ErrMsg_MasterUserEdit").popup("open");
            $("#ErroMessage_MasterUserEdit").html("Please insert last name, last name cannot be empty.");
        } else if (email == "") {
            $("#popup_ErrMsg_MasterUserEdit").popup("open");
            $("#ErroMessage_MasterUserEdit").html("Please insert email, email cannot be empty.");
        } else if (!validateEmail(email)) {
            $("#popup_ErrMsg_MasterUserEdit").popup("open");
            $("#ErroMessage_MasterUserEdit").html("Invalid email format.");
        } else if (ReportTo == 0) {
            $("#popup_ErrMsg_MasterUserEdit").popup("open");
            $("#ErroMessage_MasterUserEdit").html("Please Select A manager");
        } else {
            $.ajax({

                url: SERVER_URL + "/api/UserDetail/" + userID,
                //url: SERVER_END_POINT_API + "/api/Account/SetPassword/",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    //"NewPassword": password,
                    //"ConfirmPassword": password,
                    "Role": role,
                    "UserDetailID": userDetailID,
                    "FirstName": firstName,
                    "LastName": lastName,
                    "Phone": phone,
                    "Email": email,
                    "ReportTo": ReportTo,
                    "ActiveFlag": activeFlag,
                    // "ModifiedBy": userID

                }),
                success: function () {
                    setTimeout(function () { $("#popup_sucessfullyEditUser").popup("open"); }, 1000);
                },
                error: function (jqXHR, exception) {
                    setTimeout(function () { $("#popup_ErrMsg_MasterUserEdit").popup("open"); }, 1000);
                    if (jqXHR.status === 0) {
                        $('#ErroMessage_MasterUserEdit').html('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        $('#ErroMessage_MasterUserEdit').html('Requested page not found. [404]');
                    } else if (jqXHR.status == 401) {
                        $('#ErroMessage_MasterUserEdit').html('401 Unauthorized');
                    } else if (jqXHR.status == 500) {
                        $('#ErroMessage_MasterUserEdit').html('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        $('#ErroMessage_MasterUserEdit').html('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        $('#ErroMessage_MasterUserEdit').html('Time out error.');
                    } else if (exception === 'abort') {
                        $('#ErroMessage_MasterUserEdit').html('Ajax request aborted.');
                    } else {
                        $('#ErroMessage_MasterUserEdit').html('Error Occur.');
                    }
                }
            });
        }
    }
};

function validateEmail(email) {
    var email_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email_format.test(email);
}

$(document).one('pagecreate', '#master-user-edit', function () {
    $("#phone").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $(document).off('click', '#btn_closeErrMsg_MasterUserEdit').on('click', '#btn_closeErrMsg_MasterUserEdit', function (e) {
        $("#popup_ErrMsg_MasterUserEdit").popup("close");
    });

    $(document).off('click', '#UserSuccessOK').on('click', '#UserSuccessOK', function (e) {
       
        $.mobile.changePage("master-user.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });
});
