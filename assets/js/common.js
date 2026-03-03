//Citrus
//header dropdowns
$(".menu").on("mouseenter mouseleave", function () {
    if (window.innerWidth > 768) {
        $this = $(this);
        $this.toggleClass('open');
        $(".menu-popup").toggleClass('open');
    }
});

// mobile menu
$(".mobile-menu-btn").on("click", function () {
    $('.mobile-menu-btn').css('display', 'none');
    $('.mobile-close-btn').css('display', 'inline-block');
    $("body").addClass('locked');
    $(".mobile-menu").addClass('open');
    $("header").css("background-color", "#000000");
    $(".mobile-nav .logo").css("background-image", 'url("../../assets/img/citrus-holidays-logo-white.svg")');
    $('.mobile-close-btn').addClass('inverted');
    $('.mobile-contacts').addClass('inverted');
});
$(".mobile-close-btn").on("click", function () {
    $('.mobile-menu-btn').css('display','inline-block');
    $('.mobile-close-btn').css('display', 'none');
    $('.mobile-contacts').css('display', 'inline-block');
    $('.mobile-back-btn').css('display', 'none');
    $('.mobile-contacts').removeClass('inverted');
    $("header").css("background-color", "#ffffff");
    $(".mobile-nav .logo").text("");
    $(".mobile-nav .logo").css("background-image", 'url("../../assets/img/citrus-holidays-logo.svg")');
    if ($("#view-all-dest").hasClass("open")) {
        $(".europe-destinations").removeClass('open');
        $(".americas-destinations").removeClass('open');
        $(".africa-destinations").removeClass('open');
        $(".asia-destinationst").removeClass('open');
        $(".middle-east-destinations").removeClass('open');
        $(".indian-ocean-destinations").removeClass('open');
        $(".mobile-destinations-list").addClass('open');
        $("#view-all-dest").removeClass('open');
    }
    $("body").removeClass('locked');
    $(".mobile-menu").removeClass('open');
    $(".mobile-destinations").removeClass('open');
    $(".mobile-collections").removeClass('open');
});
$(".mobile-back-btn").on("click", function () {
    if ($("#view-all-dest").hasClass("open")) {
        $(".europe-destinations").removeClass('open');
        $(".americas-destinations").removeClass('open');
        $(".africa-destinations").removeClass('open');
        $(".asia-destinations").removeClass('open');
        $(".middle-east-destinations").removeClass('open');
        $(".indian-ocean-destinations").removeClass('open');
        $(".mobile-destinations-list").addClass('open');
        $("#view-all-dest").removeClass('open');
        $(".mobile-nav .logo").text("Destinations");
        return;
    }
    $('.mobile-contacts').css('display', 'inline-block');
    $('.mobile-back-btn').css('display', 'none');
    $(".mobile-destinations").removeClass('open');
    $(".mobile-collections").removeClass('open');
    $("header").css("background-color", "#000000");
    $(".mobile-nav .logo").text("");
    $(".mobile-nav .logo").css("background-image", 'url("../../assets/img/citrus-holidays-logo-white.svg")');
    $('.mobile-close-btn').addClass('inverted');
});
// mobile inner menu
$("#mobile-destinations-btn").on("click", function () {
    if (window.innerWidth < 769) {
        event.preventDefault();
        $(".mobile-destinations").addClass('open');
        $(".mobile-destinations-list").addClass('open');
        $('.mobile-contacts').css('display', 'none');
        $('.mobile-back-btn').css('display', 'inline-block');
        $("header").css("background-color", "#ffffff");
        $(".mobile-nav .logo").css("background-image", 'none');
        $(".mobile-nav .logo").text("Destinations");
        $('.mobile-close-btn').removeClass('inverted');
    }
});
$("#mobile-collections-btn").on("click", function () {
    if (window.innerWidth < 769) {
        event.preventDefault();
        $(".mobile-collections").addClass('open');
        $(".mobile-collections-list").addClass('open');
        $('.mobile-contacts').css('display', 'none');
        $('.mobile-back-btn').css('display', 'inline-block');
        $("header").css("background-color", "#ffffff");
        $(".mobile-nav .logo").css("background-image", 'none');
        $(".mobile-nav .logo").text("Collections");
        $('.mobile-close-btn').removeClass('inverted');
    }
});

// mobile menu destinations
{
    $("#europe-dest").on("click",
        function() {
            if (window.innerWidth < 769) {
                event.preventDefault();
                $('.mobile-destinations-list').removeClass('open');
                $('.europe-destinations').addClass('open');
                $('#view-all-dest').addClass('open');
                $(".mobile-nav .logo").text("Europe");
            }
        });
    $("#americas-dest").on("click",
        function() {
            if (window.innerWidth < 769) {
                event.preventDefault();
                $('.mobile-destinations-list').removeClass('open');
                $('.americas-destinations').addClass('open');
                $('#view-all-dest').addClass('open');
                $(".mobile-nav .logo").text("Americas");
            }
        });
    $("#africa-dest").on("click",
        function() {
            if (window.innerWidth < 769) {
                event.preventDefault();
                $('.mobile-destinations-list').removeClass('open');
                $('.africa-destinations').addClass('open');
                $('#view-all-dest').addClass('open');
                $(".mobile-nav .logo").text("Africa");
            }
        });
    $("#asia-dest").on("click",
        function() {
            if (window.innerWidth < 769) {
                event.preventDefault();
                $('.mobile-destinations-list').removeClass('open');
                $('.asia-destinations').addClass('open');
                $('#view-all-dest').addClass('open');
                $(".mobile-nav .logo").text("Asia");
            }
        });
    $("#mideast-dest").on("click",
        function() {
            if (window.innerWidth < 769) {
                event.preventDefault();
                $('.mobile-destinations-list').removeClass('open');
                $('.middle-east-destinations').addClass('open');
                $('#view-all-dest').addClass('open');
                $(".mobile-nav .logo").text("Middle East");
            }
        });
    $("#indian-dest").on("click",
        function() {
            if (window.innerWidth < 769) {
                event.preventDefault();
                $('.mobile-destinations-list').removeClass('open');
                $('.indian-ocean-destinations').addClass('open');
                $('#view-all-dest').addClass('open');
                $(".mobile-nav .logo").text("Indian Ocean");
            }
        });
}


$(document).ready(function() {
    //featured tours section carousel
    $('.featured-carousel').slick({
        arrows: true,
        rows: false,
        variableWidth: true,
        zIndex: 0,
        prevArrow: $("#featured-prev"),
        nextArrow: $("#featured-next")
    });
    //back to top
    $('.scroll').click(function() {
        $('html, body').animate({
                scrollTop: 0
            },
            500);
        return false;
    });

    //mobile only carousel slider toggle
    if (window.innerWidth < 1101) {
        mobileOnlySlider();
    }
    //mobile only accordion toggle
    if (window.innerWidth < 761) {
        mobileOnlyAccordion(true);
    }


});

$(window).resize(function (e) {
    //mobile only carousel slider toggle on resize
    if (window.innerWidth < 1101) {
        if (!$('.carousel-blogs').hasClass('slick-initialized')) {
            mobileOnlySlider();
        }
    } else {
        if ($('.carousel-blogs').hasClass('slick-initialized')) {
            $('.carousel-blogs').slick('unslick');
        }
    }


    //footer mobile only accordion toggle
    if (window.innerWidth < 761) {
        mobileOnlyAccordion(true);
    } else {
        mobileOnlyAccordion(false);
        var flexWrap = document.getElementsByClassName("list-flex-wrap");
        $(flexWrap).css({ "display": "flex", "display": "-webkit-flex" });
    }
    
});

//mobile only carousel slider
function mobileOnlySlider() {
    $('.carousel-blogs').not('.slick-initialized').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        touchThreshold: 100,
        swipeToSlide: true,
        infinite: false,
        variableWidth: true,
        rows: 0,
        arrows: false
    });
};

//Footer mobile only accordion
function accordionHandler(event) {
    $(event.target).find("span").toggleClass("icon-pullup");
    var panel = event.target.nextElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
        $(event.target).find("a").css('pointer-events', 'none');

    } else {
        panel.style.display = "block";
        $(event.target).find("a").css('pointer-events', 'auto');
    }
}
function mobileOnlyAccordion(isActiveAccordion) {

    var acc = document.getElementsByClassName("footer-mobile-accordion");
    var i;
    if (isActiveAccordion) {
        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", accordionHandler,true);
            var panel = acc[i].nextElementSibling;
            panel.style.display = "none";
            $(acc[i]).find("a").css('pointer-events', 'none');
        }
    } else {
        for (i = 0; i < acc.length; i++) {
            acc[i].removeEventListener("click", accordionHandler, true);
            $(acc[i]).find("span").removeClass("icon-pullup");
            var panel = acc[i].nextElementSibling;
            panel.style.display = "block";
            $(acc[i]).find("a").css('pointer-events', 'auto');
        }
    }
};