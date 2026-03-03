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
        $(window).scrollTop($('.featured-tour-section').offset().top + $('.featured-tour-section').outerHeight(true));
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
        sortOffer("", $(this).text().trim());
    });
    $(".price-order").on("click", function () {
        if (!$(this).hasClass("active")) {
            $(".price-order").toggleClass("active");
        }
        sortOffer($(this).text().trim(), "");
    });

    //mobile filter button responsive positioning
    if (window.innerWidth < 769) {
        if ($(window).scrollTop() >= ($('.featured-tour-section').offset().top + $('.featured-tour-section').outerHeight(true) - 50)) {
            $('.mobile-filter-wrap').addClass('stick');
        } else if ($(window).scrollTop() <= ($('.featured-tour-section').offset().top + $('.featured-tour-section').outerHeight(true) + 70)) {
            $('.mobile-filter-wrap').removeClass('stick');
        }
    }
    // var para1 = $('.para1').html();
    // if (para1 != undefined) {
    // if (para1.indexOf('<p') >= 0) {
    // $('.para1').html('<p>' + $('.para1 p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show">Read more<span class="icon-dropdown"></span></a>');
    // }
    // else {
    // $('.para1').html('<p>' + $('.para1 div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show">Read more<span class="icon-dropdown"></span></a>');
    // }

    // $(document).on('click', '.show', function () {
    // $('.para1').html(para1 + '<a href="javaScript:void(0);" class="hide">Read less</a>');
    // });
    // $(document).on('click', '.hide', function () {
    // if (para1.indexOf('<p') >= 0) {
    // $('.para1').html('<p>' + $('.para1 p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show">Read more<span class="icon-dropdown"></span></a>');
    // }
    // else {
    // $('.para1').html('<p>' + $('.para1 div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show">Read more<span class="icon-dropdown"></span></a>');
    // }
    // });
    // }

    // var para2 = $('.para2').html();
    // if (para2 != undefined) {
    // if (para2.indexOf('<p') >= 0) {
    // $('.para2').html('<p>' + $('.para2 p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
    // }
    // else {
    // $('.para2').html('<p>' + $('.para2 div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
    // }

    // $(document).on('click', '.show1', function () {
    // $('.para2').html(para2 + '<a href="javaScript:void(0);" class="hide1 read-more">Read less</a>');
    // });
    // $(document).on('click', '.hide1', function () {
    // if (para2.indexOf('<p') >= 0) {
    // $('.para2').html('<p>' + $('.para2 p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
    // }
    // else {
    // $('.para2').html('<p>' + $('.para2 div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
    // }
    // });
    // }

    pricerangeslider();
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
        if ($(window).scrollTop() >= ($('.featured-tour-section').offset().top + $('.featured-tour-section').outerHeight(true) - 50)) {
            if (!$('.call-expert').hasClass('hide') && $(window).scrollTop() >= $('.call-expert').offset().top) {
                $('.mobile-filter-wrap').removeClass('stick');
            }
            else {
                $('.mobile-filter-wrap').addClass('stick');
            }
        } else if ($(window).scrollTop() <= ($('.featured-tour-section').offset().top + $('.featured-tour-section').outerHeight(true) + 70)) {
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
        item["src"] = images[i];// getBase64(images[i]);
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

function getBase64(imgurl) {
    var images = "";
    $.ajax({
        url: "/home/getBase64",
        data: { imgurl: imgurl },
        async: false,
        success: function (result) {
            images = 'data:image/jpg;base64,' + result;
        }
    });
    return images;
}

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

$(document).on('click', 'input[name=mealplan],input[name=airport],input[name=region]', function () {
    if ($(this).attr('name') == 'region') {
        var cityname = $(this).next().text().trim();
        var url = window.location.href.split('/');
        url[url.length - 1] = cityname.split(' ').join('-');
        window.location.href = url.join('/');
    }
    else {
        sortOffer();
    }
});
function sortOffer(orderBy, sortBy) {
    var offerType = $("#hOfferType").val();
    var mealPlan = $('input[name=mealplan]:checked').map(function () { return this.value; }).get();
    var airports = $('input[name=airport]:checked').map(function () { return this.value; }).get();
    var regions = $('input[name=region]:checked').map(function () { return this.value; }).get();
    var minprice = $('.price-boxes div:eq(0) span').text();
    var maxprice = $('.price-boxes div:eq(1) span').text();
    var priceRange = minprice + ";" + maxprice;
    var destId = $("#destID").val();
    var subDestId = $("#subDestId").val();
    var month = $("#month").val();
    var hCType = $("#hCType").val();
    if (orderBy == undefined && sortBy == undefined) {
        orderBy = $('.price .active').text();
    }
    $(".loader").show();
    $.ajax({
        url: '/holiday/offerListWithFilter',
        data: { offerType: offerType, priceRange: priceRange, mealPlan: mealPlan, orderBy: orderBy, sortBy: sortBy, destId: destId, airports: airports, month: month, subDestId: subDestId, holidaytype: hCType, regions: regions },
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
            $('html, body').animate({
                scrollTop: $(".search-sort").offset().top - 150
            }, 1500);
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

$('#search').click(function () {
    var orderBy = $('.price .active').text();
    var sortBy = $('.current-option').text();
    var offerType = $("#hOfferType").val();
    var mealPlan = $('input[name=mealplan]:checked').map(function () { return this.value; }).get();
    var airports = $("#airport").val();
    //var minprice = $('.price-boxes div:eq(0) span').text();
    //var maxprice = $('.price-boxes div:eq(1) span').text();
    var priceRange = "";
    var destId = $("#destID").val();
    var subDestId = $("#subDestId").val();
    var month = $("#month").val();
    var hCType = $("#hCType").val();
    if (parseInt($('#offerCounts').val()) > 0 && offerType == "SubDestination" && $('#subdestination').val() != "") {
        var url = window.location.href.split('/');
        url[url.length - 1] = $('#subdestination').val().split(' ').join('-');
        window.location.href = url.join('/');
    }
    else {
        $(".loader").show();
        $.ajax({
            url: '/holiday/offerListWithFilter',
            data: { offerType: offerType, priceRange: priceRange, mealPlan: mealPlan, orderBy: orderBy, sortBy: sortBy, destId: destId, airports: airports, month: month, subDestId: subDestId, holidaytype: hCType },
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
                if (data.airports.length > 0) {
                    var airporthtml = '';
                    var checked = $("#airport").val() == "Any Airport" ? "" : "checked";
                    for (i = 0; i < data.airports.length; i++) {
                        airporthtml += '<div class="checkbox-option"> <input type="checkbox" name="airport" value="' + data.airports[i] + '" id="' + data.airports[i].toLowerCase().split(' ').join('-') + '" ' + checked + ' /> <label for="' + data.airports[i].toLowerCase().split(' ').join('-') + '">' + data.airports[i] + '</label> </div>'
                    }
                    $('.side-airports .sidebar-content').html(airporthtml);
                    $('.side-airports').show();
                }
                else {
                    $('.side-airports').hide();
                }
                if (subDestId != "0") {
                    if (data.catType.length > 0) {
                        var cathtml = '';
                        for (i = 0; i < data.catType.length; i++) {
                            cathtml += '<div class="checkbox-option"> <input type="checkbox" name="mealplan" value="' + data.catType[i] + '" id="' + data.catType[i].toLowerCase().split(' ').join('-') + '" /> <label for="' + data.catType[i].toLowerCase().split(' ').join('-') + '">' + data.catType[i] + '</label> </div>'
                        }
                        $('.side-bb .sidebar-content').html(cathtml);
                    }
                }
                $('.price-boxes div:eq(0) span').text(data.minPrice);
                $('.price-boxes div:eq(1) span').text(data.maxPrice);
                pricerangeslider();
                $(".loader").hide();
                $('html, body').animate({
                    scrollTop: $(".search-sort").offset().top - 150
                }, 1500);
            },
            error: function (result) {
                $(".loader").hide();
            }
        });
    }
})


$('#subdestination').autocomplete({
    source: function (request, response) {
        if ($("#hOfferType").val() == "footerpage") {
            $.ajax({
                type: 'POST',
                url: '/holiday/GetDestinationByHolidayType',
                dataType: 'json',
                data: {
                    name: request.term, holidayType: $('#hCType').val()
                },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.label, value: item.value };
                    }))
                }
            })
        }
        else {
            var destID = $('#destID').val();
            if (destID == "0") {
                $.ajax({
                    type: 'POST',
                    url: '/holiday/GetDestinationByOfferType',
                    dataType: 'json',
                    data: {
                        name: request.term, offerType: $('#hOfferType').val()
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return { label: item.label, value: item.value };
                        }))
                    }
                });
            }
            else {
                $.ajax({
                    type: 'POST',
                    url: '/holiday/GetDestination',
                    dataType: 'json',
                    data: {
                        name: request.term, destID: destID
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return { label: item.label, value: item.value };
                        }))
                    }
                })
            }
        }
    },
    minLength: 0,
    select: function (event, ui) {
        event.preventDefault();
        $("#subdestination").val(ui.item.label);
        $("#subDestId").val(ui.item.value);
    },
    messages: {
        noResults: '',
        results: function (resultsCount) { }
    }
}).mousedown(function () {
    $(this).autocomplete('search', "")
});