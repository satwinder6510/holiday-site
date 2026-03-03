$(document).ready(function() {
    $('.team-carousel').slick({
        arrows: true,
        variableWidth: true,
        rows: false,
        prevArrow: $("#team-prev"),
        nextArrow: $("#team-next")
    });
    $('.testimonials-carousel').slick({
        arrows: true,
        variableWidth: true,
        rows: false,
        prevArrow: $("#testimonials-prev"),
        nextArrow: $("#testimonials-next")
    });
    //mobile only USP carousel slider toggle
    if (window.innerWidth < 1101) {
        mobileOnlyUSPSlider();
    }
});



$(window).resize(function (e) {
    //responsive USP carousel slider toggle
    if (window.innerWidth < 1101) {
        if (!$('.usp-carousel').hasClass('slick-initialized')) {
            mobileOnlyUSPSlider();
        }
    } else {
        if ($('.usp-carousel').hasClass('slick-initialized')) {
            $('.usp-carousel').slick('unslick');
        }
    }
});

//mobile only USP carousel slider
function mobileOnlyUSPSlider() {
    $('.usp-carousel').not('.slick-initialized').slick({
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