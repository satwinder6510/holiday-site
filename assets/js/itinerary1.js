$(document).ready(function () {
    var scrollY = 0;
    //hero carousel
    $('.carousel').slick({
        arrows: true,
        rows: false,
        fade: true,
        zIndex: 0,
        prevArrow: $("#hero-prev"),
        nextArrow: $("#hero-next")
    });
    //itinerary section carousels
    $('.itinerary-carousel-l').slick({
        arrows: true,
        rows: false,
        prevArrow: $("#itinerary-1-prev"),
        nextArrow: $("#itinerary-1-next")
    });
    $('.itinerary-carousel-2').slick({
        arrows: true,
        rows: false,
        prevArrow: $("#itinerary-2-prev"),
        nextArrow: $("#itinerary-2-next")
    });
    $('.itinerary-carousel-3').slick({
        arrows: true,
        rows: false,
        prevArrow: $("#itinerary-3-prev"),
        nextArrow: $("#itinerary-3-next")
    });
    $('.itinerary-carousel-4').slick({
        arrows: true,
        rows: false,
        prevArrow: $("#itinerary-4-prev"),
        nextArrow: $("#itinerary-4-next")
    });
    $('.itinerary-carousel-5').slick({
        arrows: true,
        rows: false,
        prevArrow: $("#itinerary-5-prev"),
        nextArrow: $("#itinerary-5-next")
    });
    //accommodation section carousels
    $('.accommodation-carousel-l').slick({
        arrows: true,
        rows: false,
        prevArrow: $("#accommodation-1-prev"),
        nextArrow: $("#accommodation-1-next")
    });
    $('.accommodation-carousel-2').slick({
        arrows: true,
        rows: false,
        prevArrow: $("#accommodation-2-prev"),
        nextArrow: $("#accommodation-2-next")
    });
    $('.accommodation-carousel-3').slick({
        arrows: true,
        rows: false,
        prevArrow: $("#accommodation-3-prev"),
        nextArrow: $("#accommodation-3-next")
    });
    //gallery carousel
    $('.gallery-carousel').slick({
        arrows: true,
        rows: false,
        prevArrow: $("#gallery-prev"),
        nextArrow: $("#gallery-next")
    });

    //itinerary tabs
    if (window.innerWidth > 768) {
        if (!$(".tabs").data("ui-tabs")) {
            $(function () {
                $(".tabs").tabs();
            });
        }
    } else {
        if ($(".tabs").data("ui-tabs")) {
            $(function () {
                $(".tabs").tabs("destroy");
            });
        }
    }

    //itinerary header sticky toggle
    if (window.innerWidth > 768) {
        if ($(window).scrollTop() >=
            ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) - 200)) {
            $('#tab_navigation').addClass('stick');
        } else if ($(window).scrollTop() <=
            ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) + 100)) {
            $('#tab_navigation').removeClass('stick');
        }
    } else {
        if ($(window).scrollTop() >= ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) - 100)) {
            $('#tab_navigation').addClass('stick');
        } else if ($(window).scrollTop() <= ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) + 70)) {
            $('#tab_navigation').removeClass('stick');
        }
    }

    $(window).scroll(function () {
        //itinerary header sticky toggle
        if (window.innerWidth > 768) {
            if ($(window).scrollTop() >=
                ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) - 200)) {
                $('#tab_navigation').addClass('stick');
            } else if ($(window).scrollTop() <=
                ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) + 100)) {
                $('#tab_navigation').removeClass('stick');
            }
        } else {
            if ($(window).scrollTop() >= ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) - 100)) {
                $('#tab_navigation').addClass('stick');
            } else if ($(window).scrollTop() <= ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) + 70)) {
                if (!$(".sidebar").hasClass('open-summary'))
                {
                    $('#tab_navigation').removeClass('stick');
                }
            }
            // mobile dropdown section selector update on scroll when summary is not active
            if ($(".current").text() != "Summary") {
                $(".itinerary-content section .content").reverse().each(function () {
                    if ($(this).isInView()) {
                        var id = $(this).attr('id');
                        $(".current").text($(".tab-list>li").find("a[href$=" + id + "]").text());
                        return false;
                    }
                });
            }
        }
    });

    //itinerary mobile header 
    $(".drop-down").on("click", function () {
        $(".tab-list").addClass('open-drop-down');
    });

    $(".tab-list>li").on("click", function () {
            var tabsOffset = $(".tabs").offset();
        if (window.innerWidth > 768) {
            $('html, body').animate({ scrollTop: tabsOffset.top - 80 }, 100);
        } else {
            $(".tab-list").removeClass('open-drop-down');
            $(this).siblings().removeClass("ui-tabs-active");
            $(this).addClass("ui-tabs-active");
            $(".current").text($(this).find("a").text());
        }
        $(".slick-slider").slick("refresh");
    });

    $(".summary-btn").on("click", toggleSummary);
    function toggleSummary() {
        if (!$(".sidebar").hasClass('open-summary')) {
            scrollY = $(window).scrollTop();
            $(".summary-btn").text("Close");
            $("body").addClass('locked');
            $(".itinerary-header").addClass('stick');
            $(".current").text("Summary");
        } else {
            $(".summary-btn").text("Summary");
            $("body").removeClass('locked');
            $(".itinerary-header").removeClass('stick');
            $(window).scrollTop(scrollY);
            $(".current").text($(".tab-list>li").find("ui-tabs-active").text());
        }
        $(".sidebar").toggleClass('open-summary');
        $(".summary-btn").toggleClass('close');
    
    }
    //summary helper functions
    $.fn.isInView = function () {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };
    $.fn.reverse = [].reverse;


    $(window).resize(function (e) {
        //mobile only summary button toggle on resize
        if (window.innerWidth > 768) {
            if ($(".summary-btn").hasClass('close')) {
                toggleSummary();
                $(".current").text("Overview");
            }
            if (!$(".tabs").data("ui-tabs")) {
                $(function () {
                    $(".tabs").tabs();
                });
            }
        } else {
            if ($(".tabs").data("ui-tabs")) {
                $(function () {
                    $(".tabs").tabs("destroy");
                });
            }
        }
        //responsive calendar modal on resize
        if (window.innerWidth > 1100) {
            $(".calendar-modal .search-form").css("display", "block");
            $(".calendar-modal .calendar").css("display", "block");
            $(".calendar-modal .mobile-back-btn").css("display", "none");
        } else {
            $(".calendar-modal .search-form").css("display", "block");
            $(".calendar-modal .calendar").css("display", "none");
            $(".calendar-modal .mobile-back-btn").css("display", "none");
            $(".calendar-modal .calendar .book-btn").css("display", "none");
        }

    });

    //calendar modal
    $(function () {
        $('#datepicker').datepicker({
            firstDay: 1,
            inline: true,
            showOtherMonths: true,
            dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            
        });
    });
    $(".date-select-btn").on("click", function () {
        event.preventDefault();
        $(".calendar-modal .search-form").css("display", "none");
        $(".calendar-modal .calendar").css("display", "block");
        $(".calendar-modal .mobile-back-btn").css("display", "block");
        $(".calendar-modal .calendar .book-btn").css({ "display": "flex", "display": "-webkit-flex" });
    });
    $(".calendar-modal .close-btn").on("click", function () {
        if (window.innerWidth < 1101) {
            $(".calendar-modal .search-form").css("display", "block");
            $(".calendar-modal .calendar").css("display", "none");
            $(".calendar-modal .mobile-back-btn").css("display", "none");
            $(".calendar-modal .calendar .book-btn").css( "display", "none");
        }
    });
    $(".calendar-modal .mobile-back-btn").on("click", function () {
        $(".calendar-modal .search-form").css("display", "block");
        $(".calendar-modal .calendar").css("display", "none");
        $(".calendar-modal .mobile-back-btn").css("display", "none");
        $(".calendar-modal .calendar .book-btn").css("display", "none");
    });

    //itinerary accordion
    var acc = document.getElementsByClassName("panel-header");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            $(this).find("span").toggleClass("icon-less-minus icon-more-plus");
           var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
                $(".slick-slider").slick("refresh");
            }
        });
    }

})