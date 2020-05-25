// --------- TOOLKIT --------- //
// -- AUTHOR: Harvey Reynier --//
// ------- DESCRIPTION ------- //

//  Smaller functions that add interactivity,
//  Animations, or ...



//  Scrolls to top of page on refresh.
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

// ---- LOADING ANIMATION ON SITE LOAD + TOOL LOAD ---- //
//  Utilises the GSAP tweenmax library.

//  Animates the hero-img svg to move up.
TweenMax.from(".hero-img", 1.6, {
    delay: 6.4,
    opacity: 0,
    y: 30,
    ease: Expo.easeInOut
});

TweenMax.from(".reg-hero", 1.6, {
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

TweenMax.from(".reg-text h1", 1.6, {
    delay: 6.8,
    opacity: 0,
    y: 30,
    ease: Expo.easeInOut
});


TweenMax.from(".reg-text h2", 1.6, {
    delay: 7,
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

TweenMax.from(".reg-text p", 1.6, {
    delay: 7.2,
    opacity: 0,
    y: 30,
    ease: Expo.easeInOut
});
//  Animates the down icon.
TweenMax.from("#home-dwn", 1.6, {
    delay: 7.4,
    opacity: 0,
    y: 30,
    ease: Expo.easeInOut
});

TweenMax.from("#tool-dwn", 1.6, {
    delay: 7.6,
    opacity: 0,
    y: 30,
    ease: Expo.easeInOut
});


//  --- TOGGLES WHETHER DESCRIPTION BOXES ARE SHOWN/HIDDEN --- //
function toggleBox(bro) {
    console.log("toggleBox function init");
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


//  --- TOGGLES WHETHER methodology BOXES ARE SHOWN/HIDDEN --- //
function toggleCard(allen) {
    console.log("toggleCard function init");
    var x = document.getElementById(allen);

        document.getElementById('specification').style.display = "none";
        document.getElementById('selection').style.display = "none";
        document.getElementById('Prediction').style.display = "none";
        console.log("Why is 6 afraid of 7")
    ;

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
    //console.log("hidden.")

    // fade in .navbar
    $(function () {
        $(window).scroll(function () {
            // set distance user needs to scroll before we fadeIn navbar
            if ($(this).scrollTop() > 200) {
                $(".navbar").fadeIn();
                //console.log("not hidden.")
            } else {
                $(".navbar").fadeOut();
                //console.log("hidden agagin.")
            }
        });


    });

    //  ---- ANIMATED SCROLL ON CLICK ----//
    //  When click on #down element on landing page
    //  autoscroll to next section.
    $("#home-dwn").on('click', function () {
        $("html").scrollTop(0);
        $("html, body").animate({
            scrollTop: $("#about").offset().top
        }, 1000);
    })
    $("#about-dwn").on('click', function () {
        $("#about").scrollTop(0);
        $("html,#about").animate({
            scrollTop: $(".map-section").offset().top-35
        }, 1000);
    })
    $("#toTop").on('click', function () {
        $("#home").scrollTop(0);
        $("html,#home").animate({
            scrollTop: $("#home").offset().top
        }, 1000);
    })
    $("#tool-dwn").on('click', function () {
        $("html").scrollTop(0);
        $("html, body").animate({
            scrollTop: $("#predTool").offset().top-49
        }, 1000);
    })

});


var sheet = document.createElement('style'),
  $rangeInput = $('.slideContainer input'),
  prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track']; //chrome, firefox, ie -> they really need to standardise..

document.body.appendChild(sheet);

var getTrackStyle = function (el) {
  var curVal = el.value,
      val = (curVal - 1) * 20,//% Between each point. 20 as there are 5 gaps -> 100/5 = 20%.
      style = '';

  // Set active label
  $('.range-labels li').removeClass('active selected');

  var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');

  curLabel.addClass('active selected');
  curLabel.prevAll().addClass('selected');

  // Change background gradient
  for (var i = 0; i < prefs.length; i++) {
    style += '.slideContainer {background: linear-gradient(to right, #70BDB3 0%, #70BDB3 ' + val + '%, transparent ' + val + '%, transparent 100%)}';
    style += '.slideContainer input::-' + prefs[i] + '{background: linear-gradient(to right, #70BDB3 0%, #70BDB3 ' + val + '%, #3E3E3E ' + val + '%, #3E3E3E 100%)}';
  }

  return style;
}

//  Changes bar color on input ;)
$rangeInput.on('input', function () {
  sheet.textContent = getTrackStyle(this);

});

// Change input value on label click
$('.range-labels li').on('click', function () {
  var index = $(this).index();

  $rangeInput.val(index + 1).trigger('input');


});
