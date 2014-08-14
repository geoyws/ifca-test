$(document).one("pagecontainerbeforeshow", function () {
    //alert(localStorage.Token);
    if (localStorage.Token) {
        setTimeout(function () { $.mobile.pageContainer.pagecontainer('change', 'menu.html'); }, 1500);
        //$.mobile.navigate("#homepage");
        //$.mobile.changePage("menu.html");
    } else {
        setTimeout(function () { $.mobile.pageContainer.pagecontainer('change', 'login.html'); }, 1500);
        //$.mobile.navigate("#login");
        //$.mobile.changePage("login.html");
    }
});