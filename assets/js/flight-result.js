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
    //$(".sort-order").on("click", function () {
    //    if ($(".sort-order-list").css('display') == "block") {
    //        $(".sort-order-list").css("display", "none");
    //    } else {
    //        $(".sort-order-list").css("display", "block");
    //    }
    //});
    //$(".sort-option").on("click", function () {
    //    $(".sort-order-list").css("display", "none");
    //    $(".sort-order").find(".current-option").text($(this).text());
    //    sortOffer();
    //});
    $(".price-order").on("click", function () {
        if (!$(this).hasClass("active")) {
            $(".price-order").toggleClass("active");
        }
        sortOffer();
    });

    //mobile filter button responsive positioning
    if (window.innerWidth < 769) {
        if ($(window).scrollTop() >= ($('.featured-tour-section').offset().top + $('.featured-tour-section').outerHeight(true) - 50)) {
            $('.mobile-filter-wrap').addClass('stick');
        } else if ($(window).scrollTop() <= ($('.featured-tour-section').offset().top + $('.featured-tour-section').outerHeight(true) + 70)) {
            $('.mobile-filter-wrap').removeClass('stick');
        }
    }


    pricerangeslider();

    var resultType = $("#resultType").val();
    if (resultType == "calendar") {
        $('#destination1').val($('.open-calendar:eq(0)').attr('aname'));
        $('#airport1').val($('.open-calendar:eq(0)').attr('dname'));
        $('#contentbtn').click();
        var depapt = $('.open-calendar:eq(0)').attr('dcode');
        var arrapt = $('.open-calendar:eq(0)').attr('code');
        var nights = $('.open-calendar:eq(0)').attr('nights');
        $('#selectednights').val(nights);
        $('#destination1').attr('code', arrapt);
        $('#airport1').attr('code', depapt);
        getDatePicker(depapt, arrapt, nights);
    }
});

$(".date-select-btn").on("click",
        function () {
            event.preventDefault();
            $(".calendar-modal .search-form").css("display", "none");
            $(".calendar-modal .calendar").css("display", "block");
            $(".calendar-modal .mobile-back-btn").css("display", "block");
            $(".calendar-modal .calendar .book-btn").css({ "display": "flex", "display": "-webkit-flex" });
        });
$(".calendar-modal .close-btn").on("click",
    function () {
        if (window.innerWidth < 1101) {
            $(".calendar-modal .search-form").css("display", "block");
            $(".calendar-modal .calendar").css("display", "none");
            $(".calendar-modal .mobile-back-btn").css("display", "none");
            $(".calendar-modal .calendar .book-btn").css("display", "none");
        }
    });
$(".calendar-modal .mobile-back-btn").on("click",
    function () {
        $(".calendar-modal .search-form").css("display", "block");
        $(".calendar-modal .calendar").css("display", "none");
        $(".calendar-modal .mobile-back-btn").css("display", "none");
        $(".calendar-modal .calendar .book-btn").css("display", "none");
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

$(document).on('click', 'input[name=nights],input[name=airport],input[name=region]', function () {
    var aiportCheck = ""; var nightCheck = "";
    if ($(this).attr('name') == 'region') {
        $('input[name=airport]').removeAttr('checked');
        $('input[name=nights]').removeAttr('checked');
    }
    else if ($(this).attr('name') == 'airport') {
        $('input[name=nights]').removeAttr('checked');
        aiportCheck = $('input[name=airport]:checked').map(function () { return this.value; }).get();
    }
    else {
        if ($('#resultType').val() == "calendar") {
            var url = window.location.href.split('/');
            var lastStr = url[url.length - 1].split('-');
            lastStr[lastStr.length - 2] = $(this).val();
            url[url.length - 1] = lastStr.join('-');
            window.location.href = url.join('/');
        }
        else {
            aiportCheck = $('input[name=airport]:checked').map(function () { return this.value; }).get();
            nightCheck = $('input[name=nights]:checked').map(function () { return this.value; }).get();
        }
    }
    sortOffer(aiportCheck, nightCheck);
});
function sortOffer(aiportCheck, nightCheck) {
    var nights = $('input[name=nights]:checked').map(function () { return this.value; }).get();
    var airports = $('input[name=airport]:checked').map(function () { return this.value; }).get();
    var regions = $('input[name=region]:checked').map(function () { return this.value; }).get();
    var minprice = $('.price-boxes div:eq(0) span').text();
    var maxprice = $('.price-boxes div:eq(1) span').text();
    var priceRange = minprice + ";" + maxprice;
    var month = $("#month").val();
    orderBy = $('.price .active').text();
    $(".loader").show();
    $.ajax({
        url: '/flights/flightListWithFilter',
        data: { regions: regions, priceRange: priceRange, nights: nights, orderBy: orderBy, airports: airports, month: month },
        type: 'POST',
        success: function (data) {
            $(".holidays").html(data._flightListPartial);
            $(".results").text(data.TotalCount + " results found");
            $('.more-holidays').attr('count', 0);
            $('.more-holidays').attr('max', parseInt(data.TotalCount) % 10);
            if (data.TotalCount > 10) {
                $('.more-holidays').show();
            }
            else {
                $('.more-holidays').hide();
            }
            if (data.airports.length > 1) {
                var airporthtml = '';
                for (i = 0; i < data.airports.length; i++) {
                    var check = (aiportCheck == undefined || aiportCheck == "") ? "" : (aiportCheck.includes(data.airports[i].Value) ? "checked" : "");
                    airporthtml += '<div class="checkbox-option"> <input type="checkbox" name="airport" value="' + data.airports[i].Value + '" id="' + data.airports[i].Text.toLowerCase().split(' ').join('-') + '" ' + check + ' /> <label for="' + data.airports[i].Text.toLowerCase().split(' ').join('-') + '">' + data.airports[i].Text + '</label> </div>'
                }
                $('.side-airports .sidebar-content').html(airporthtml);
                $('.side-airports').show();
            }
            if (data.nights.length > 1) {
                var cathtml = '';
                for (i = 0; i < data.nights.length; i++) {
                    var check = (nightCheck == undefined || nightCheck == "") ? "" : (nightCheck.includes(data.nights[i]) ? "checked" : "");
                    cathtml += '<div class="checkbox-option"> <input type="checkbox" name="nights" value="' + data.nights[i] + '" id="' + data.nights[i].toLowerCase().split(' ').join('-') + '" ' + check + ' /> <label for="' + data.nights[i].toLowerCase().split(' ').join('-') + '">' + data.nights[i] + ' nights</label> </div>'
                }
                $('.side-night .sidebar-content').html(cathtml);
            }


            $('.price-boxes div:eq(0) span').text(data.minPrice);
            $('.price-boxes div:eq(1) span').text(data.maxPrice);
            pricerangeslider();
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

$('#search').click(function () {
    var orderBy = $('.price .active').text();
    var sortBy = $('.current-option').text();
    var resultType = $("#resultType").val();
    var region = $("#subdestination").val();
    var airports = $("#airport").val();
    var nights = $('#passenger').val();
    //var minprice = $('.price-boxes div:eq(0) span').text();
    //var maxprice = $('.price-boxes div:eq(1) span').text();
    var priceRange = "";
    var month = $("#month").val();
    if (region != "" && airports == "Any destination") {
        var url = window.location.href.split('/').slice(0, 6);// + '/' + region.replace('- ', '').split(' ').join('-');
        window.location.href = url.join('/') + '/' + region.replace('- ', '').split(' ').join('-');
    }
    else if (region != "" && airports != "Any destination" && nights == "Any nights") {
        airports = $("#airport option:selected").text().replace('- ', '').split(' ').join('-');
        region = region.replace('- ', '').split(' ').join('-');
        //if (resultType == "country") {
        //    var url = window.location.href + '/' + airports + '-to-' + region;
        //    window.location.href = url;
        //}
        //if (resultType == "airport" || resultType == "city") {
        //    var url = window.location.href.split('/');
        //    url[url.length - 1] = airports + '-to-' + region;
        //    window.location.href = url.join('/');
        //}
        var url = window.location.href.split('/').slice(0, 6).join('/') + '/' + airports + '-to-' + region;
        window.location.href = url;
    }
    else if (region != "" && airports != "Any destination" && nights != "Any nights") {
        airports = $("#airport option:selected").text().replace('- ', '').split(' ').join('-');
        region = region.replace('- ', '').split(' ').join('-');
        //if (resultType == "country") {
        //    var url = window.location.href + '/' + airports + '-to-' + region + '-' + nights.split(' ').join('-');
        //    window.location.href = url;
        //}
        //if (resultType == "airport" || resultType == "city") {
        //    var url = window.location.href.split('/');
        //    url[url.length - 1] = airports + '-to-' + region + '-' + nights.split(' ').join('-');
        //    window.location.href = url.join('/');
        //}
        var url = window.location.href.split('/').slice(0, 6).join('/') + '/' + airports + '-to-' + region + '-' + nights.split(' ').join('-');
        window.location.href = url;
    }
    else {
        $(".loader").show();
        $.ajax({
            url: '/flights/flightListWithFilter',
            data: { regions: region, priceRange: priceRange, orderBy: orderBy, sortBy: sortBy, airports: airports, month: month },
            type: 'POST',
            success: function (data) {
                $(".holidays").html(data._flightListPartial);
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
                        airporthtml += '<div class="checkbox-option"> <input type="checkbox" name="airport" value="' + data.airports[i].Value + '" id="' + data.airports[i].Text.toLowerCase().split(' ').join('-') + '" ' + checked + ' /> <label for="' + data.airports[i].Text.toLowerCase().split(' ').join('-') + '">' + data.airports[i].Text + '</label> </div>'
                    }
                    $('.side-airports .sidebar-content').html(airporthtml);
                    $('.side-airports').show();
                }
                else {
                    $('.side-airports').hide();
                }
                if (data.nights.length > 0) {
                    var cathtml = '';
                    for (i = 0; i < data.nights.length; i++) {
                        cathtml += '<div class="checkbox-option"> <input type="checkbox" name="mealplan" value="' + data.nights[i] + '" id="' + data.nights[i].toLowerCase().split(' ').join('-') + '" /> <label for="' + data.nights[i].toLowerCase().split(' ').join('-') + '">' + data.nights[i] + '</label> </div>'
                    }
                    $('.side-night .sidebar-content').html(cathtml);
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

var regionArray = $('#regionCW').val().split(',')//$('input[name=region]').map(function () { return $(this).next().text(); }).get();


$('#subdestination').autocomplete({
    source: regionArray,
    minLength: 0,
    messages: {
        noResults: 'no results',
        results: function (amount) {
            return amount + 'results.'
        }
    },
    select: function (e, ui) {
        getAirports(ui.item.label);
    }
}).mousedown(function () {
    $(this).autocomplete('search', "")
});

function getAirports(arrivalApt) {
    $.ajax({
        url: '/flights/getAirportListCityWise',
        data: { arrivalApt: arrivalApt },
        type: 'POST',
        asycn: false,
        success: function (result) {
            if (result.length > 0) {
                var airporthtml = '<option>Any destination</option>';
                for (i = 0; i < result.length; i++) {
                    airporthtml += '<option value="' + result[i].departureCode + '">' + result[i].departure + '</option>'
                }
                $('#airport').html(airporthtml);
            }
        },
        error: function (result) {
            $(".loader").hide();
        }
    });
}

$(document).on('click', '.open-calendar', function () {
    $('#destination1').val($(this).attr('aname'));
    $('#airport1').val($(this).attr('dname'));
    $('#contentbtn').click();
    var depapt = $(this).attr('dcode');
    var arrapt = $(this).attr('code');
    var nights = $(this).attr('nights');
    $('#selectednights').val(nights);
    $('#destination1').attr('code', arrapt);
    $('#airport1').attr('code', depapt);
    getDatePicker(depapt, arrapt, nights);
});

var dynamicCSSRules = [];
function getDatePicker(depapt, arrapt, nights) {
    $("#datepicker").datepicker("destroy");
    $('.loader').show();
    $.ajax({
        url: '/flights/getCalendar',
        data: { depapt: depapt, arrapt: arrapt, nights: nights },
        type: 'POST',
        success: function (result) {
            if (result != "") {
                debugger
                if (result.length > 0) {
                    var colorArray = ["green", "teal", "blue", "yellow", "black", "red", "BurlyWood", "GrayDark", "purple", "orange"];

                    var today = new Date(2020, 7, 1);
                    var alldates = $.map(result, function (n, i) { return n.date });

                    var dates = [];
                    for (i = 0; i < alldates.length; i++) {
                        var d = alldates[i].split('/');
                        dates.push(new Date(d[2], d[1] - 1, d[0]));
                    }

                    dates = dates.filter(function (v) {
                        return v >= today;
                    });

                    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    var allmonths = $.map(dates, function (n, i) { return (monthNames[n.getMonth()] + ' ' + n.getFullYear()) });

                    var uniqueMonths = allmonths.filter(function (itm, i, a) {
                        return i == a.indexOf(itm);
                    }).sort(function (a, b) { return (new Date(a) - new Date(b)) });

                    var monthArray = $.map(uniqueMonths, function (n, i) { return '<option>' + n + '</option>' });;
                    $('#month1').html('<option>Any Month</option>' + monthArray.join(''));
                    debugger
                    if (dates.length > 0) {
                        var minDate = new Date(Math.min.apply(null, dates));
                        var maxDate = new Date(Math.max.apply(null, dates));

                        if (dates.length == 0) {
                            minDate = today;
                            maxDate = today;
                        }

                        var arrprices = $.map(result, function (n, i) { return n.price; });
                        arrprices = arrprices.sort(function (a, b) { return parseInt(a) - parseInt(b) });

                        minprice = arrprices[0];
                        var minpricedate = result.filter(function (v) {
                            return v.price == minprice;
                        })[0].date;

                        var dateParts = minpricedate.split("/");

                        // month is 0-based, that's why we need dataParts[1] - 1
                        var defaultDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

                        //var defaultDate = new Date(minpricedate[2], minpricedate[1] - 1, minpricedate[0]);

                        $("#datepicker").datepicker({
                            firstDay: 1,
                            inline: true,
                            showOtherMonths: true,
                            dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                            dateFormat: "yy-mm-dd",
                            defaultDate: defaultDate,
                            minDate: minDate,
                            maxDate: maxDate,
                            beforeShowDay: function (date) {
                                var event = "";
                                if (dates.length > 0) {
                                    var newdate = [
                                        (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()),
                                        ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)),
                                        date.getFullYear()
                                    ].join('/');

                                    var pricingdata = result.filter(function (v) {
                                        return v.date.indexOf(newdate) >= 0;
                                    })
                                    pricingdata = pricingdata.sort(function (a, b) { return parseInt(a.price) - parseInt(b.price) });
                                    if (pricingdata != undefined && pricingdata.length > 0) {
                                        var price_cal = $.map(pricingdata, function (n, i) { return (n.price); })[0];

                                        if (price_cal != undefined) {
                                            //var color = colorArray[arrprices.indexOf(price_cal)];
                                            event = "ui-state-highlight";
                                            return [true, "ui-state-highlight css-" + price_cal, "\u00A3" + price_cal];
                                        }
                                    }
                                }
                                if (event == "") {
                                    return [false, ""];
                                }
                            },
                            onSelect: function (dateText, inst) {
                                $('.book-btn').removeAttr('disabled');
                                var date = new Date(dateText);
                                var newdate = [
                                    (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()),
                                    ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)),
                                    date.getFullYear()
                                ].join('/');
                                var pricingdata = result.filter(function (v) {
                                    return v.date.indexOf(newdate) >= 0;
                                }).sort(function (a, b) { return parseInt(a.price) - parseInt(b.price) });;
                                if (pricingdata != undefined && pricingdata.length > 0) {
                                    var price_cal = $.map(pricingdata, function (n, i) { return (n.price); })[0];
                                    if (price_cal != undefined) {
                                        var psngr = parseInt($('#passenger1').val().replace(' adults', ''));
                                        var total = psngr * parseInt(price_cal);
                                        $('.book-btn .price').text("\u00A3" + total);
                                        $('#priceperperson').val(price_cal);
                                    }
                                }
                                $(this).data('datepicker').inline = false;
                                $('#selecteddate').val(newdate);
                            }
                        });


                        function afterdpload() {

                            //for (i = 0; i < arrprices.length; i++) {
                            //    price = "\u00A3" + arrprices[i];
                            //    var className = 'datepicker-content-20';
                            //    $('.ui-state-highlight a.ui-state-default').addClass(className);
                            //    className = '.ui-datepicker-calendar td.' + colorArray[i] + ' a.' + className + ':after {content: "' + price + '";}';
                            //    //if ($.inArray(className, dynamicCSSRules) == -1) {
                            //    //    $('head').append('<style id="' + colorArray[i] +'">' + className + '</style>');
                            //    //    dynamicCSSRules.push(className);
                            //    //}
                            //    $('#' + colorArray[i]).remove()
                            //    $('head').append('<style id="' + colorArray[i] + '">' + className + '</style>');
                            //}
                            var className = 'datepicker-content-20';
                            $('.ui-state-highlight a.ui-state-default').addClass(className);
                            $("#datepicker td").find("a.datepicker-content-20").each(function (i, html) {
                                var tdClass = $(this).parent().attr('title').replace('£', '');
                                var tdPrice = "\u00A3" + tdClass;
                                var className1 = '.ui-datepicker-calendar td.css-' + tdClass + ' a.' + className + ':after {content: "' + tdPrice + '";}';
                                $('#css-' + tdClass).remove()
                                $('head').append('<style id="css-' + tdClass + '">' + className1 + '</style>');
                            });

                            $('head').append('<style>.ui-state-highlight a.ui-state-default:before {content: "per person";}</style>');
                            $('.ui-state-highlight a.ui-state-default').attr("onclick", "return false;");
                        }

                        $(document).on('click', '.ui-datepicker-prev', function () {
                            afterdpload();
                            //var mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            //var month = $(this).parent().find('.ui-datepicker-month').text();
                            //var monthno = mlist.indexOf(month) - 1;
                            //if (jQuery.inArray(monthno, allmonths) == -1) {
                            //    $('.ui-datepicker-prev').click();
                            //}
                        });
                        $(document).on('click', '.ui-datepicker-next', function () {
                            afterdpload();
                            //var mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            //var month = $(this).parent().find('.ui-datepicker-month').text();
                            //var monthno = mlist.indexOf(month) + 1;
                            //if (jQuery.inArray(monthno, allmonths) == -1) {
                            //    $('.ui-datepicker-next').click();
                            //}
                        });
                        afterdpload();
                    }
                    else {

                    }

                }
            }
            $('.loader').hide();
        },
        error: function (result) {
            $('.loader').hide();
            alert('error');
        }
    });
}

$(document).on('change', '#month1', function () {
    $("#datepicker").datepicker("setDate", new Date("01 " + $(this).val()));
    var className = 'datepicker-content-20';
    $('.ui-state-highlight a.ui-state-default').addClass(className);
});
$(document).on('change', '#passenger1', function () {
    var total = parseInt($('#priceperperson').val()) * parseInt($(this).val().replace(' adults', ''));
    $('.book-btn .price').text("\u00A3" + total);
});
$('#airport').change(function () {
    var country = $('#hfCountry').val();
    var region = $('#subdestination').val();
    var airport = $(this).val();

    $.ajax({
        url: '/flights/getNights',
        data: { country: country, region: region, airport: airport },
        type: 'POST',
        asycn: false,
        success: function (result) {
            if (result.length > 0) {
                var nhtml = '<option>Any nights</option>';
                for (i = 0; i < result.length; i++) {
                    nhtml += '<option>' + result[i] + ' nights</option>'
                }
                $('#passenger').html(nhtml);
            }
        },
        error: function (result) {
            $(".loader").hide();
        }
    });
});


$(document).on('click', '.book-btn', function () {
    var depcode = $('#airport1').attr('code');
    var arrcode = $('#destination1').attr('code');
    var nights = $('#selectednights').val();
    var sd = $('#selecteddate').val().split("/");
    var date = new Date(sd[2], sd[1] - 1, sd[0]);
    var obdate = date.getFullYear().toString() + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)).toString() + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()).toString();

    var days = parseInt(nights);
    date.setDate(date.getDate() + days);

    var ibdate = date.getFullYear().toString() + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)).toString() + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()).toString();

    window.location.href = "https://citrusholidays.travelflow.co.uk/directsearch.asp?bn=0004&SearchType=FLIGHT&OBDepart=" + depcode + "&OBArrive=" + arrcode + "&OBDate=" + obdate + "&IBDepart=" + arrcode + "&IBArrive=" + depcode + "&IBDate=" + ibdate + "&Airline=&Class=Economy&Adults=" + $('#passenger1').val();
});
