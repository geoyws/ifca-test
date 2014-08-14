$(document).one('pagecontainerbeforeshow', function () {

    var error;

    //localStorage.clear();

    function navigateToMenu() {
        $.mobile.pageContainer.pagecontainer('change', 'menu.html');
        //$.mobile.navigate("menu.html");
        //$.mobile.changePage("menu.html");
    }

    $("#login form").on("submit", function () {
        event.preventDefault();
        var login = new Authentication($("#username").val(), encodeURIComponent($("#password").val()), SERVER_URL);
        //$.mobile.navigate("menu.html");
    });

    function Authentication(username, password, urlEndPoint) {
        this.username = username;
        this.password = password;
        this.urlEndPoint = urlEndPoint;
        this.ticket;
        this.initialize();
    }

    Authentication.prototype.initialize = function initialize() {
        //$.ajaxSetup({
        //    async: false
        //});

        var result;
        $.ajax({
            type: "POST",
            url: this.urlEndPoint + "/token",
            async: false,
            contentType: "application/x-www-form-urlencoded",
            data: "grant_type=password&username=" + this.username + "&password=" + this.password
        })
       .done(function (data) {
           result = data;
           localStorage.setItem("Token", data.access_token);
           localStorage.setItem("UserName", data.userName);
           localStorage.setItem("role", data.roles);
           localStorage.setItem("UserID", data.UserID);
           // alert(data.access_token);
           // alert(data.userName);
           // alert(data.roles);
           // alert(data.UserID);
           //alert(localStorage.getItem("role"));
           navigateToMenu();
       }).fail(function () {
           error = "Invalid login";
           $("#reusableDialog p.ui-title").text(error);
           $("#reusableDialog").popup("reposition", "positionTo: window").popup("open");
       });
        this.ticket = result;
    }

    if (localStorage.getItem("UserName") != undefined && localStorage.getItem("Token") != undefined) {
        $.ajaxSetup({
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("Token")
            }
        });
        navigateToMenu();
    }

    //Authentication.prototype.getToken = function getToken() {
    //    return this.ticket.access_token;
    //};

    //Authentication.prototype.getRoles = function getRoles() {
    //    return this.ticket.roles;
    //};

});

//$(document).one('pagecontainerbeforeshow', function () {
//    indexFunctions.ajaxErrorReportSetup();
//});

//var indexFunctions = {
//    ajaxErrorReportSetup: function () {
//        $.ajaxSetup({
//            error: function (jqXHR, exception) { 
//                if (jqXHR.status === 0) {
//                    alert('Unable to connect to server. Are you connected to the internet?');
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
//                    //alert(jqXHR.responseText);
//                }
//            }
//        });
//    },
//    navigateToMenu: function () {

//    }
//}