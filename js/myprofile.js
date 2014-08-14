
$(document).one('pagecontainerbeforeshow', function (event, data) {
    myProfile_ShowDetailsFunctions.myProfile_ShowDetails();
    $("#btn_myProfile_save").click(function () {
        myProfile_ShowDetailsFunctions.myProfile_Change_password();
    });

    $(document).off('click', '#btn_FailChangePassword').on('click', '#btn_FailChangePassword', function (e) {
        $("#popup_FailChangePassword").popup("close");
    });

    $(document).off('click', '#btn_sucessfullyChangePassword').on('click', '#btn_sucessfullyChangePassword', function (e) {
        $("#popup_sucessfullyChangePassword").popup("close");
    });

    $('#oldPassword').keyup(function (event) {
        myProfile_ShowDetailsFunctions.myProfile_passwordErrorChecking($('#oldPassword'), "oldPassword");
    });

    $('#newPassword').keyup(function (event) {
        myProfile_ShowDetailsFunctions.myProfile_passwordErrorChecking($('#newPassword'), "newPassword");
    });


    $('#confirmPassword').keyup(function (event) {
        myProfile_ShowDetailsFunctions.myProfile_passwordErrorChecking($('#confirmPassword'), "confirmPassword");
    });

});


var myProfile_ShowDetailsFunctions = {
    myProfile_passwordErrorChecking: function (element, fields){
        var password_txt = element.val();
        var error_val = 0;
        var password_strength = 0;
        var error_msg = "";
        var check_small_letter = password_txt.match(/([a-z])/) ? 1 : 0;
        var check_capital_letter = password_txt.match(/([A-Z])/) ? 1 : 0;
        var check_numeric = password_txt.match(/([0-9])/) ? 1 : 0;
        var check_symbols = password_txt.match(/(.*[!,%,&,@,#,$,^,*,?,_,~])/) ? 1 : 0;

        if (password_txt.length < 6) {
            error_val = 1;
        }

        password_strength = check_small_letter + check_capital_letter + check_numeric + check_symbols;
        
        if (error_val == 1 || password_strength < 3) {
            error_msg = "Password must be at least 6 characters, combination of at least 3 different type from number, small letter, capital letter, and symbols";
        } else {
            if (fields == "newPassword" || fields == "confirmPassword") {
                var confirmPassword_txt = $('#confirmPassword').val();
                var newPassword_txt = $('#newPassword').val();
                if (newPassword_txt != confirmPassword_txt) {
                    error_msg = "New password and confirm password must be same.";
                } else {
                    $('#span_myprofile_newPassword').html("");
                    $('#span_myprofile_confirmPassword').html("");
                }
            }
        }

        $('#span_myprofile_' + fields).html(error_msg);
    },
    myProfile_ShowDetails: function () {
        $.ajax({
            url: SERVER_URL + '/api/UserDetail/MyProfile',
            type: 'POST',
            dataType: 'json',
            data: {
                UserDetailID: localStorage.getItem("UserID")
            },
            success: function (result) {
                $('#userID').val(result.UserName);
                $('#name').val(result.LastName+ " " + result.FirstName);
                $('#email').val(result.Email);
                $('#phone').val(result.Phone); 
                $('#role').val(result.Role);
                myProfile_ShowDetailsFunctions.myProfile_Show_ReporToDetails(result.ReportTo)
            }
        });
    },

    myProfile_Show_ReporToDetails: function (ReporTo_UserID) {
        $.ajax({
            url: SERVER_URL + '/api/UserDetail/MyProfile',
            type: 'POST',
            dataType: 'json',
            data: {
                UserDetailID: ReporTo_UserID
            },
            success: function (result) {
                $('#reportTo').val(result.LastName + " " + result.FirstName);
            } 
        });
    },

    myProfile_Change_password: function () {
        var oldPassword_txt = $('#oldPassword').val();
        var newPassword_txt = $('#newPassword').val();
        var confirmPassword_txt = $('#confirmPassword').val();
        var error_val_oldPassword_Strength = 0;
        var error_val_newPassword_Strength = 0;
        var error_val_confirmPassword_Strength = 0;
        var error_msg = "";
        var error_val = 0;
        var check_small_letter_oldPassword_txt = oldPassword_txt.match(/([a-z])/) ? 1 : 0;
        var check_capital_letter_oldPassword_txt = oldPassword_txt.match(/([A-Z])/) ? 1 : 0;
        var check_numeric_oldPassword_txt = oldPassword_txt.match(/([0-9])/) ? 1 : 0;
        var check_symbols_oldPassword_txt = oldPassword_txt.match(/(.*[!,%,&,@,#,$,^,*,?,_,~])/) ? 1 : 0;
        var check_small_letter_newPassword_txt = newPassword_txt.match(/([a-z])/) ? 1 : 0;
        var check_capital_letter_newPassword_txt = newPassword_txt.match(/([A-Z])/) ? 1 : 0;
        var check_numeric_newPassword_txt = newPassword_txt.match(/([0-9])/) ? 1 : 0;
        var check_symbols_newPassword_txt = newPassword_txt.match(/(.*[!,%,&,@,#,$,^,*,?,_,~])/) ? 1 : 0;
        var check_small_letter_confirmPassword_txt = confirmPassword_txt.match(/([a-z])/) ? 1 : 0;
        var check_capital_letter_confirmPassword_txt = confirmPassword_txt.match(/([A-Z])/) ? 1 : 0;
        var check_numeric_confirmPassword_txt = confirmPassword_txt.match(/([0-9])/) ? 1 : 0;
        var check_symbols_confirmPassword_txt = confirmPassword_txt.match(/(.*[!,%,&,@,#,$,^,*,?,_,~])/) ? 1 : 0;
        
        if (oldPassword_txt.length < 6 || newPassword_txt.length < 6 || confirmPassword_txt.length < 6) {
            error_val = 1;
            error_msg = "Password must be at least 6 characters, combination of at least 3 different type from number, small letter, capital letter, and symbols";
        } else if (encodeURIComponent(newPassword_txt) != encodeURIComponent(confirmPassword_txt)) {
            error_val = 1;
            error_msg = "New password and confirm password must be same.";
        }

        error_val_oldPassword_Strength = check_small_letter_oldPassword_txt + check_capital_letter_oldPassword_txt + check_numeric_oldPassword_txt + check_symbols_oldPassword_txt;
        error_val_newPassword_Strength = check_small_letter_newPassword_txt + check_capital_letter_newPassword_txt + check_numeric_newPassword_txt + check_symbols_newPassword_txt;
        error_val_confirmPassword_Strength = check_small_letter_confirmPassword_txt + check_capital_letter_confirmPassword_txt + check_numeric_confirmPassword_txt + check_symbols_confirmPassword_txt;

        if (error_val_oldPassword_Strength < 3 || error_val_newPassword_Strength < 3 || error_val_confirmPassword_Strength < 3) {
            error_msg = "Password must be at least 6 characters, combination of at least 3 different type from number, small letter, capital letter, and symbols";
        }

        if (error_val == 0 || error_val_oldPassword_Strength > 2 || error_val_newPassword_Strength > 2 || error_val_confirmPassword_Strength > 2) {
            $.ajax({
                url: SERVER_URL + '/api/Account/ChangePassword',
                type: 'POST',
                data: {
                    OldPassword: oldPassword_txt,
                    NewPassword: newPassword_txt,
                    ConfirmPassword: confirmPassword_txt
                },
                success: function () {
                    setTimeout(function () { $("#popup_sucessfullyChangePassword").popup("open"); }, 1000);
                }
            });
        } else {
            setTimeout(function () { $("#popup_FailChangePassword").popup("open"); }, 1000);
            $('#ErroMessage_FailChangePassword').html(error_msg);
        }
    }
}