$(document).ready(function(){
    $("#menu-toggle").click(function(e) {
        debugger;
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
})