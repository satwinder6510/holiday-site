$(document).ready(function () {

    //sidebar accordion
    var acc = document.getElementsByClassName("sidebar-header");
    var i;
    for (i = 1; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            $(this).find("span").toggleClass("icon-dropdown icon-pullup");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

    //mobile filter toggle
    $(".filter-btn").on("click", function () {
        $(".holidays").toggleClass('hide');
        $(".text-wrap").toggleClass('hide');
        $(".more-holidays").toggleClass('hide');
        $(".call-expert").toggleClass('hide');
        $(".search-sort .results").toggleClass('hide');
        $(".search-sort .price").toggleClass('hide');
        $(".sidebar").toggleClass('show');
        $(".filter:first-child").toggleClass('hide');
        $(".sidebar-header").find("span").addClass('icon-dropdown');
        $(".sidebar-header").find("span").removeClass('icon-pullup');
        $(".sidebar-content").css('display', 'none');
        $(window).scrollTop($('.hero-section').offset().top + $('.hero-section').outerHeight(true) - 70);
    });
    $(".filter-apply-btn").on("click", function () {
        $(".holidays").toggleClass('hide');
        $(".text-wrap").toggleClass('hide');
        $(".more-holidays").toggleClass('hide');
        $(".call-expert").toggleClass('hide');
        $(".search-sort .results").toggleClass('hide');
        $(".search-sort .price").toggleClass('hide');
        $(".sidebar").toggleClass('show');
        $(".filter:first-child").toggleClass('hide');
        $(".sidebar-header").find("span").addClass('icon-pullup');
        $(".sidebar-header").find("span").removeClass('icon-dropdown');
        $(".sidebar-content").css('display', 'block');
    });

    //sorting
    $(".sort-order").on("click", function () {
        if ($(".sort-order-list").css('display') == "block") {
            $(".sort-order-list").css("display", "none");
        } else {
            $(".sort-order-list").css("display", "block");
        }
    });
    $(".sort-option").on("click", function () {
        $(".sort-order-list").css("display", "none");
        $(".sort-order").find(".current-option").text($(this).text());
        sortOffer();
    });
    $(".price-order").on("click", function () {
        if (!$(this).hasClass("active")) {
            $(".price-order").toggleClass("active");
            sortOffer();
        }
    });
    pricerangeslider();
    //mobile filter button responsive positioning
    if (window.innerWidth < 769) {
        if ($(window).scrollTop() >= ($('.hero-section').offset().top + $('.hero-section').outerHeight(true) - 135)) {
            $('.mobile-filter-wrap').addClass('stick');
        } else if ($(window).scrollTop() <= ($('.hero-section').offset().top + $('.hero-section').outerHeight(true) + 70)) {
            $('.mobile-filter-wrap').removeClass('stick');
        }
    }
});

$(window).resize(function (e) {
    //responsive sidebar on resize
    if (window.innerWidth > 769) {
        $(".holidays").removeClass('hide');
        $(".text-wrap").removeClass('hide');
        $(".more-holidays").removeClass('hide');
        $(".call-expert").removeClass('hide');
        $(".search-sort .results").removeClass('hide');
        $(".search-sort .price").removeClass('hide');
        $(".sidebar").removeClass('show');
        $(".filter:first-child").removeClass('hide');
    }
});

$(window).scroll(function () {
    //sticky filter header on mobile 
    if (window.innerWidth < 769) {
        if ($(window).scrollTop() >= ($('.hero-section').offset().top + $('.hero-section').outerHeight(true) - 135)) {
            if (!$('.call-expert').hasClass('hide') && $(window).scrollTop() >= $('.call-expert').offset().top) {
                $('.mobile-filter-wrap').removeClass('stick');
            } else {
                $('.mobile-filter-wrap').addClass('stick');
            }
        } else if ($(window).scrollTop() <= ($('.hero-section').offset().top + $('.hero-section').outerHeight(true) + 70)) {
            $('.mobile-filter-wrap').removeClass('stick');
        }
    }
});



$(document).on('click', '.gallery-link', function () {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    // build items array
    var items = [];
    var images = $(this).attr('images').split('|');
    for (i = 0; i < images.length; i++) {
        item = {}
        item["src"] = images[i];
        item["w"] = 923;
        item["h"] = 470;
        items.push(item);
    }

    // define options (if needed)
    var options = {
        // optionName: 'option value'
        // for example:
        index: 0 // start at first slide
    };

    // Initializes and opens PhotoSwipe
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
});

$(document).on('click', '.more-holidays', function () {
    var max = parseInt($(this).attr('max'));
    var count = parseInt($(this).attr('count'));
    count++;
    if (count >= max) {
        $(this).hide();
    }
    else {
        $('.count' + count).show();
        $(this).attr('count', count);
    }
})

//$('.sort-option, .price-order').click(function () {
//    sortOffer();
//});
$(document).on('click', 'input[name=mealplan],input[name=airport]', function () {
    sortOffer();
});
function sortOffer() {
    var orderBy = $('.price .active').text();
    var sortBy = $('.current-option').text();
    var offerType = $("#hOfferType").val();
    var mealPlan = $('input[name=mealplan]:checked').map(function () { return this.value; }).get();
    var airports = $('input[name=airport]:checked').map(function () { return this.value; }).get();
    var minprice = $('.price-boxes div:eq(0) span').text();
    var maxprice = $('.price-boxes div:eq(1) span').text();
    var priceRange = minprice + ";" + maxprice;
    var destId = $("#destID").val();
    var subDestId = $("#subDestId").val();
    var month = $(".month").text().trim();
    $(".loader").show();
    $.ajax({
        url: '/holiday/offerListWithFilter',
        data: { offerType: offerType, priceRange: priceRange, mealPlan: mealPlan, orderBy: orderBy, sortBy: sortBy, destId: destId, airports: airports, month: month, subDestId: subDestId },
        type: 'POST',
        success: function (data) {
            $(".holidays").html(data._OfferListPartial);
            $(".results").text(data.TotalCount + " results found");
            $('.more-holidays').attr('count', 0);
            $('.more-holidays').attr('max', parseInt(data.TotalCount) % 10);
            if (data.TotalCount > 10) {
                $('.more-holidays').show();
            }
            else {
                $('.more-holidays').hide();
            }
            $(".loader").hide();
        },
        error: function (result) {
            $(".loader").hide();
        }
    });
}


function pricerangeslider() {
    var minprice = parseInt($('.price-boxes div:eq(0) span').text());
    var maxprice = parseInt($('.price-boxes div:eq(1) span').text());

    $(".slider-range").slider({
        range: true,
        min: minprice,
        max: maxprice,
        values: [minprice, maxprice],
        stop: function (event, ui) {
            $('.price-boxes div:eq(0) span').text(ui.values[0]);
            $('.price-boxes div:eq(1) span').text(ui.values[1]);
            sortOffer();
        }
    });
}


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
                    airporthtml += ' <option>' + data.airports[i] + '</option>'
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
