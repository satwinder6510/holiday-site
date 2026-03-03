$(document).ready(function () {
    $('.destinations-carousel').slick({
        arrows: true,
        rows: 2,
        slidesToScroll: 1,
        slidesToShow: 3,
        variableWidth: true,
        infinite: false,
        prevArrow: $("#destinations-prev"),
        nextArrow: $("#destinations-next"),
        responsive: [{
            breakpoint: 768,
            settings: {
                infinite: false,
                rows: 1
            }
        }]
    });

    $('.blog-section').addClass('white-bg');
    $('.rest-para1').hide();

    var para2 = $('.para2').html();
    if (para2 != undefined) {
        if (para2.indexOf('<p') >= 0) {
            $('.para2').html('<p>' + $('.para2 p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
        }
        else {
            $('.para2').html('<p>' + $('.para2 div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
        }

        $(document).on('click', '.show1', function () {
            $('.para2').html(para2 + '<a href="javaScript:void(0);" class="hide1 read-more">Read less</a>');
        });
        $(document).on('click', '.hide1', function () {
            if (para2.indexOf('<p') >= 0) {
                $('.para2').html('<p>' + $('.para2 p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
            }
            else {
                $('.para2').html('<p>' + $('.para2 div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
            }
        });
    }
})


$(document).on('click', '.show', function () {
    var restpara1 = $('.rest-para1').html();
    if (restpara1 != undefined) {
        $('.rest-para1').show();
        $(this).hide();
        $('html, body').animate({
            scrollTop: $(".rest-para1").offset().top - 150
        }, 500);
    }
});

$(document).on('click', '.hide', function () {
    $('.rest-para1').hide();
    $('.show').show();
});