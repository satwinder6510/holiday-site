$(document).ready(function () {

    $('.collections-carousel').slick({
        arrows: true,
        rows: false,
        variableWidth: true,
        centerMode: true,
        prevArrow: $("#collections-prev"),
        nextArrow: $("#collections-next"),
        responsive: [{
            breakpoint: 940,
            settings: {
                infinite: false,
                centerMode: false
}
        }]
    });

    $('.blog-section').addClass('white-bg');
})