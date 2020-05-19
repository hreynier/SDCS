// --------- TOOLKIT --------- //
// -- AUTHOR: Harvey Reynier --//
// ------- DESCRIPTION ------- //

//  Smaller functions that add interactivity, 
//  Animations, or ...



//  Scrolls to top of page on refresh.
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

// ---- LOADING ANIMATION ON SITE LOAD ---- //
//  Utilises the GSAP tweenmax library.

//  Animates the hero-img svg to move up. 
TweenMax.from(".hero-img", 1.6, {
    delay: 6.4,
    opacity: 0,
    y: 30,
    ease: Expo.easeInOut
});

//  Animates the brand text to move up.
TweenMax.from(".main-text h1", 1.6, {
    delay: 6.8,
    opacity: 0,
    y: 30,
    ease: Expo.easeInOut
});

//  Animates the tag-line to move up.
TweenMax.from(".main-text p", 1.6, {
    delay: 7,
    opacity: 0,
    y: 30,
    ease: Expo.easeInOut
});

//  Animates the down icon.
TweenMax.from("#down", 1.6, {
    delay: 7.4,
    opacity: 0,
    y: 30,
    ease: Expo.easeInOut
});

//  --- TOGGLES WHETHER DESCRIPTION BOXES ARE SHOWN/HIDDEN --- //
function toggleBox(bro) {
    var x = document.getElementById(bro);
    if(bro=='geoInfo' || bro=='data-control-widget') {
        document.getElementById('heatInfo').style.display = "none";
        document.getElementById('markerInfo').style.display = "none";
    } else {
        document.getElementById('heatInfo').style.display = "none";
        document.getElementById('markerInfo').style.display = "none";
        document.getElementById('geoInfo').style.display = "none";
        document.getElementById('data-control-widget').style.display = "none";
        console.log("plz give us a first")
    ;}

    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
};

// ---- jQuery Section ---- //
//  On DOM page load -> init.
$(document).ready(function(){
    
    //  ----- NAV-BAR FADE -----//
    //  Hide Navbar, and fade in and out depending
    //  on scroll position.
   
    // hide .navbar first
    $(".navbar").hide();
    console.log("hidden.")

    // fade in .navbar
    $(function () {
        $(window).scroll(function () {
            // set distance user needs to scroll before we fadeIn navbar
            if ($(this).scrollTop() > 200) {
                $(".navbar").fadeIn();
                console.log("not hidden.")
            } else {
                $(".navbar").fadeOut();
                console.log("hidden agagin.")
            }
        });


    });

    //  ---- ANIMATED SCROLL ON CLICK ----//
    //  When click on #down element on landing page
    //  autoscroll to next section.
    $("#down").on('click', function () {
        $("html").scrollTop(0);
        $("html, body").animate({
            scrollTop: $("#map").offset().top
        }, 1000);
    })


});	
    