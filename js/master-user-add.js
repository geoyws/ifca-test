$(document).one("pagecontainerbeforeshow", function () {
    GenerateManagerDropDownList();
});

function GenerateManagerDropDownList() {
    $("#ReportTo").html("<option value=''>Manager</option>");

    $.ajax({
        type: "GET",
        url: SERVER_URL + "/api/UserDetail/GetAllManager",
        success: function (result) {
            $.each(result, function (index, element) {
                if(element.UserDetailID!=localStorage.getItem("UserID"))
                    $("#ReportTo").append("<option value=" + element.UserDetailID + ">" + display_name_format(element.FirstName, element.LastName) + "</option>");
            });
            $('#ReportTo').selectmenu('refresh', true);
        },
        fail: function (jqXHR, exception) {
            setTimeout(function () { $("#popup_ErrMsg_MasterUserAdd").popup("open"); }, 1000); $("#ErroMessage_MasterUserAdd").html(jqXHR.responseText);
        }

    });
}

var masterUserAddFunctions = {
    addUser: function () {
    var userName = $("#userName").val();
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var phone = $("#phone").val();
    var email = $("#email").val();
    var reportTo = $('#ReportTo').find(":selected").val();
    var createdBy = localStorage.getItem("UserID");
    var password = $("#pass").val();
    var role = $('#role').find(":selected").val();

    var error_val = 0;
    var password_strength = 0;
    var check_small_letter = password.match(/([a-z])/) ? 1 : 0;
    var check_capital_letter = password.match(/([A-Z])/) ? 1 : 0;
    var check_numeric = password.match(/([0-9])/) ? 1 : 0;
    var check_symbols = password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~])/) ? 1 : 0;
    var check_all_combination_symbols = password.match(/^[ A-Za-z0-9!,%,&,@,#,$,^,*,?,_,~]*$/) ? 1 : 0;

    if (password.length < 6) {
        error_val = 1;
    }

    password_strength = check_small_letter + check_capital_letter + check_numeric + check_symbols;
    
    if (userName == "") {
        $("#popup_ErrMsg_MasterUserAdd").popup("open");
        $("#ErroMessage_MasterUserAdd").html("Please insert user name, user name cannot be empty.");
    } else if (error_val == 1 || password_strength < 3 || check_all_combination_symbols == 0) {
        $("#popup_ErrMsg_MasterUserAdd").popup("open");
        $("#ErroMessage_MasterUserAdd").html("Password must be at least 6 characters, combination of at least 3 different type from number, small letter, capital letter, and symbols (!,%,&,@,#,$,^,*,?,_,~).");
    } else if (firstName == "") {
        $("#popup_ErrMsg_MasterUserAdd").popup("open");
        $("#ErroMessage_MasterUserAdd").html("Please insert first name, first name cannot be empty.");
    } else if (lastName == "") {
        $("#popup_ErrMsg_MasterUserAdd").popup("open");
        $("#ErroMessage_MasterUserAdd").html("Please insert last name, last name cannot be empty.");
    } else if (email == "") {
        $("#popup_ErrMsg_MasterUserAdd").popup("open");
        $("#ErroMessage_MasterUserAdd").html("Please insert email, email cannot be empty.");
    } else if (!validateEmail(email)) {
        $("#popup_ErrMsg_MasterUserAdd").popup("open");
        $("#ErroMessage_MasterUserAdd").html("Invalid email format.");
    //} else if (ReportTo == 0) {
    //    $("#popup_ErrMsg_MasterUserAdd").popup("open");
    //    $("#ErroMessage_MasterUserAdd").html("Please select a manager");
    //} else if (reportTo == 0) {
    //    $("#popup_ErrMsg_MasterUserAdd").popup("open");
    //    $("#ErroMessage_MasterUserAdd").html("Please select a manager");
    } else {
        alert(JSON.stringify(
               {
                   "UserName": userName,
                   "Password": password,
                   "ConfirmPassword": password,
                   "Role": role,
                   "CreateUserDetail": {
                       "FirstName": firstName,
                       "LastName": lastName,
                       "Phone": phone,
                       "Email": email,
                       "ReportTo": reportTo,
                       "CreatedBy": createdBy,
                       "UserName": userName
                   }
               }
            ));
        $.ajax({
            url: SERVER_URL + "/api/Account/Register",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(
               {
                   "UserName": userName,
                   "Password": password,
                   "ConfirmPassword": password,
                   "Role": role,
                   "CreateUserDetail": {
                       "FirstName": firstName,
                       "LastName": lastName,
                       "Phone": phone,
                       "Email": email,
                       "ReportTo": reportTo,
                       "CreatedBy": createdBy,
                       "UserName": userName
                   }
               }
            ),
            success: function (result) {   
                setTimeout(function () { $("#popup_sucessfullyAddUser").popup("open"); }, 1000);
            },
            error: function (jqXHR, exception, err) {
                setTimeout(function () { $("#popup_ErrMsg_MasterUserAdd").popup("open"); }, 1000);
                if (jqXHR.status === 0) {
                    $('#ErroMessage_MasterUserAdd').html('Not connected to the internet.\n Please verify your network connection.');
                } else if (jqXHR.status == 400) {
                    var str = $.parseJSON(jqXHR.responseText);
                    var s = str.ModelState.msg.toString();
                        $('#ErroMessage_MasterUserAdd').html(s);
                }
                else if (jqXHR.status == 404) {
                    $('#ErroMessage_MasterUserAdd').html('Requested page not found. [404]');
                } else if (jqXHR.status == 401) {
                    $('#ErroMessage_MasterUserAdd').html('401 Unauthorized');
                } else if (jqXHR.status == 500) {
                    $('#ErroMessage_MasterUserAdd').html('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    $('#ErroMessage_MasterUserAdd').html('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    $('#ErroMessage_MasterUserAdd').html('Time out error.');
                } else if (exception === 'abort') {
                    $('#ErroMessage_MasterUserAdd').html('Ajax request aborted.');
                } else {
                    $('#ErroMessage_MasterUserAdd').html(err);
                }
            }
        });
    }
//}
    }

}

function validateEmail(email) {
    var email_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email_format.test(email);
}

$(document).one('pagecreate', '#master-user-add', function () {
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

    $(document).off('click', '#btn_closeErrMsg_MasterUserAdd').on('click', '#btn_closeErrMsg_MasterUserAdd', function (e) {
        $("#popup_ErrMsg_MasterUserAdd").popup("close");
    });

    $(document).off('click', '#UserSuccessOK').on('click', '#UserSuccessOK', function (e) {
        
        $.mobile.changePage("master-user.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });
});

//$(document).one('pagecreate', function () {
//    $("#SaveUser").click( function (){
//        var userName = $("#userName").val();
//        var lastName = $("#name").val();
//        var phone = $("#phone").val();
//        var email = $("#email").val();
//        var reportTo = $('#ReportTo').find(":selected").val();
//        var createdBy = localStorage.getItem("userID");             
//        var password = $("#password").val();
//        var role = $('#role').find(":selected").val();
//        alert(userName);
//        alert(lastName);
//        alert(phone);
//        alert(email);
//        alert(reportTo);
//        alert(createdBy);
//        alert(password);
//        alert(role);
//        var register = new Registration(userName, lastName,phone,email,reportTo,createdBy,password,role, SERVER_END_POINT_API);
//        alert(register.getRoles());

//    }
//    )
//    function Registration(userName, lastName, phone, email, reportTo, createdBy, password, role, SERVER_END_POINT_API) {
//        this.userName = userName;
//        this.lastName = lastName;
//        this.phone = phone;
//        this.email = email;
//        this.reportTo = reportTo;
//        this.createdBy = createdBy;
//        this.password = password;
//        this.role = role;
//        this.urlEndPoint = SERVER_END_POINT_API;
//        this.ticket;
//        this.initialize();

//    }
//    Authentication.prototype.initialize = function initialize() {

//        $.ajaxSetup({
//            async: false
//        });
//        alert("ini");
//        var result;
//        //$.post(this.urlEndPoint + "/Token", "grant_type=password&username=" + this.username + "&password=" + this.password, function (data) {
//        //    result = data;
//        //}, "json");
//        $.ajax({
//            url: this.urlEndPoint + "/api/Account/Register",
//            type: "POST",
//            //crossDomain: true,
//            //async: false, // false for now
//            //statusCode: {
//            //    400: function () {
//            //        alert("Something went wrong.")
//            //    },
//            //    404: function () {
//            //        alert("Server not found.");
//            //    }
//            //},
//            contentType: "application/json",
//            dataType: "json",
//            data: JSON.stringify(
//               {
//                   "UserName": this.userName,
//                   "Password": this.password,
//                   "ConfirmPassword": this.password,
//                   "Role": this.role,
//                   "CreateUserDetail": {
//                       "FirstName": this.userName,
//                       "LastName": this.lastName,
//                       "Phone": this.phone,
//                       "Email": this.email,
//                       "ReportTo": this.reportTo,
//                       "CreatedBy": this.createdBy
//                   }
//               }
//            ),
//            success: function (data) {
//                // Confirmational response from server
//                result = data;
//                alert("Changes saved.")
//            },
//            error: function (jqXHR, exception) {
//                if (jqXHR.status === 0) {
//                    alert('Not connect.\n Verify Network.');
//                } else if (jqXHR.status == 404) {
//                    alert('Requested page not found. [404]');
//                } else if (jqXHR.status == 401) {
//                    alert('401 Unauthorized');
//                } else if (jqXHR.status == 500) {
//                    alert('Internal Server Error [500].');
//                } else if (exception === 'parsererror') {
//                    alert('Requested JSON parse failed.');
//                } else if (exception === 'timeout') {
//                    alert('Time out error.');
//                } else if (exception === 'abort') {
//                    alert('Ajax request aborted.');
//                } else {
//                    alert(jqXHR.responseText);

//                }
//            }
//        });
//        this.ticket = result;
//    }


//    Authentication.prototype.getRoles = function getRoles() {
//        return this.ticket.Role;
//    };
//});
