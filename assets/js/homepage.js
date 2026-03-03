$(document).ready(function () {
    $('.carousel').slick({
        arrows: true,
        rows: false,
        fade: true,
        zIndex: 0,
        prevArrow: $("#hero-prev"),
        nextArrow: $("#hero-next")
    });

    $('.countries-carousel').slick({
        arrows: true,
        rows: false,
        variableWidth: true,
        touchThreshold: 100,
        infinite: true,
        prevArrow: $("#countries-prev"),
        nextArrow: $("#countries-next"),
        responsive: [{
            breakpoint: 1260,
            settings: {
                infinite: false
            }
        }]
    });


    $('.collections-carousel').slick({
        arrows: true,
        rows: false,
        variableWidth: true,
        infinite: false,
        prevArrow: $("#collections-prev"),
        nextArrow: $("#collections-next")
    });

    $('.offer-carousel').slick({
        arrows: true,
        rows: false,
        variableWidth: true,
        infinite: false,
        prevArrow: $("#offer-prev"),
        nextArrow: $("#offer-next")
    });

    $('.carousel-blogs').slick({
        arrows: true,
        rows: false,
        variableWidth: true,
        infinite: false,
        prevArrow: $("#blog-prev"),
        nextArrow: $("#blog-next")
    });

    $('.destinations-carousel').slick({
        arrows: true,
        rows: false,
        variableWidth: true,
        centerMode: true,
        prevArrow: $("#destinations-prev"),
        nextArrow: $("#destinations-next")
    });

    $('#hero-next').click(function () {
        var position = parseInt($('.hero-index').find('span').text().trim());
        position++;
        if (position == 6) {
            position = 1;
        }
        $('.hero-index').find('span').text(position);
        $('.slick-slide').show()
    });
    $('#hero-prev').click(function () {
        var position = parseInt($('.hero-index').find('span').text().trim());
        position--;
        if (position == 0) {
            position = 5;
        }
        $('.hero-index').find('span').text(position);
        $('.slick-slide').show()
    });
})

$(document).on('change', '#destination', function () {
    var destination = $(this).val();
    $(".loader").show();
    $.ajax({
        url: '/home/filterByDestination',
        data: { destination: destination },
        type: 'POST',
        success: function (data) {   
            if (data.airports.length > 0) {
                var airporthtml = ' <option></option>';
                for (i = 0; i < data.airports.length; i++) {
                    airporthtml += ' <option>' + data.airports[i]+'</option>'
                }
                $('#airport').html(airporthtml);
            }
            if (data.months.length > 0) {
                var monthhtml = ' <option></option>';
                for (i = 0; i < data.months.length; i++) {
                    monthhtml += ' <option>' + data.months[i] + '</option>'
                }
                $('#month').html(monthhtml);
            }
            $(".loader").hide();
        },
        error: function (result) {
            $(".loader").hide();
        }
    });
});

$(document).on('click', '.find-btn', function () {
    var destination = $('#destination').val().split(' ').join('-');
    var airport = $('#airport').val().split(' ').join('-');
    var month = $('#month').val().split(' ').join('-');
    var psngr = $('#passenger').val().split(' ')[0];

    destination = destination == "" ? "Any-Destination" : destination;
    airport = airport == "" ? "Any-Airport" : airport;
    month = month == "" ? "Any-Month" : month;
    psngr = psngr == "" ? "0" : psngr;

    window.location.href = '/result?destination=' + destination + '&departure=' + airport + '&month=' + month + '&passengers=' + psngr;
})