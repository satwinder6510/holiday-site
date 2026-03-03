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
    //$('.itinerary-carousel-1').slick({
    //    arrows: true,
    //    rows: false,
    //    prevArrow: $("#itinerary-1-prev"),
    //    nextArrow: $("#itinerary-1-next")
    //});

    //accommodation section carousels
    $('.accommodation-carousel').each(function (key, item) {
        var sliderId = '.accommodation-carousel-' + key;
        var prevArrow = '#accommodation-' + key + '-prev';
        var nextArrow = '#accommodation-' + key + '-next';
        $(sliderId).slick({
            arrows: true,
            rows: false,
            prevArrow: prevArrow,
            nextArrow: nextArrow
        });
        initPhotoSwipeFromDOM(sliderId);
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
        $('.content').show();
        if ($(".tabs").data("ui-tabs")) {
            $(function () {
                $(".tabs").tabs("destroy");
            });
        }
        $('.itinerary-section .panel-content').css("display", "");
        $('.itinerary-section .panel-header span').removeClass("icon-less-minus").addClass("icon-more-plus");
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
        if ($(window).scrollTop() >=
            ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) - 100)) {
            $('#tab_navigation').addClass('stick');
        } else if ($(window).scrollTop() <=
            ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) + 70)) {
            $('#tab_navigation').removeClass('stick');
        }
        $('.call-now-m').html('<a href="#content" data-lity=""><span>Check Price &amp; Availability</span></a>');
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
            if ($(window).scrollTop() >=
                ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) - 100)) {
                $('#tab_navigation').addClass('stick');
            } else if ($(window).scrollTop() <=
                ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) + 70)) {
                if (!$(".sidebar").hasClass('open-summary')) {
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
    $(".drop-down").on("click",
        function () {
            $(".tab-list").addClass('open-drop-down');
        });

    $(".tab-list>li").on("click",
        function () {
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
    getDatePicker($('#airport').val(), $('#pkgId').val())
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

    //itinerary accordion
    var acc = document.getElementsByClassName("panel-header");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click",
            function () {
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

    //var overview = $('.overview-section .overview').html();
    //if (overview != undefined) {
    //    if (overview.indexOf('<p') >= 0) {
    //        $('.overview-section .overview').html('<p>' + $('.overview p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="read-more show">Read more<span class="icon-dropdown"></span></a>');
    //    }
    //    else {
    //        $('.overview-section .overview').html('<p>' + $('.overview div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="read-more show">Read more<span class="icon-dropdown"></span></a>');
    //    }

    //    $(document).on('click', '.show', function () {
    //        $('.overview-section .overview').html(overview + '<a href="javaScript:void(0);" class="read-less hide">Read less</a>');
    //    });
    //    $(document).on('click', '.hide', function () {
    //        if (overview.indexOf('<p') >= 0) {
    //            $('.overview-section .overview').html('<p>' + $('.overview p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="read-more show">Read more<span class="icon-dropdown"></span></a>');
    //        }
    //        else {
    //            $('.overview-section .overview').html('<p>' + $('.overview div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="read-more show">Read more<span class="icon-dropdown"></span></a>');
    //        }
    //    });
    //}
    //var whatsincluded = $('.overview-section .whats-included').html();
    //if (whatsincluded != undefined) {
    //    if (whatsincluded.indexOf('<ul') >= 0 && $('.whats-included ul:eq(0) li').length > 6) {
    //        var lis = $('.whats-included ul:eq(0) li:lt(6)');
    //        var lihtml = "";
    //        for (i = 0; i < lis.length; i++) {
    //            lihtml += "<li>" + lis[i].innerHTML + "</li>"
    //        }
    //        $('.overview-section .whats-included').html('<ul>' + lihtml + '</ul><a href="javaScript:void(0);" class="read-more show1">Read more<span class="icon-dropdown"></span></a>');
    //    }
    //    $(document).on('click', '.show1', function () {
    //        $('.overview-section .whats-included').html(whatsincluded + '<a href="javaScript:void(0);" class="read-less hide1">Read less</a>');
    //        $('ul').addClass('custom-bullets');
    //    });
    //    $(document).on('click', '.hide1', function () {
    //        if (whatsincluded.indexOf('<ul') >= 0) {
    //            var lis = $('.whats-included ul:eq(0) li:lt(6)');
    //            var lihtml = "";
    //            for (i = 0; i < lis.length; i++) {
    //                lihtml += "<li>" + lis[i].innerHTML + "</li>"
    //            }
    //            $('.overview-section .whats-included').html('<ul>' + lihtml + '</ul><a href="javaScript:void(0);" class="read-more show1">Read more<span class="icon-dropdown"></span></a>');
    //        }
    //        $('ul').addClass('custom-bullets');
    //    });
    //}

    $('ul').addClass('custom-bullets');
    $('.call-expert:not(:last)').addClass('mobile-hide');
	var phoneno = $('.phone:eq(0)').text();
    $('.check-price span').text(" "+phoneno);
});

var initPhotoSwipeFromDOM = function (gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if (figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            }

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};
// execute above function
$(document).ready(function () {
    initPhotoSwipeFromDOM('.itinerary-carousel-1');
    initPhotoSwipeFromDOM('.gallery-carousel');

    //$('.img-url').each(function () {
    //    var This = $(this);
    //    var attr = $(this).attr('href');
    //    $.ajax({
    //        url: "/home/getBase64",
    //        data: { imgurl: attr },
    //        success: function (result) {
    //            This.attr('href', 'data:image/jpg;base64,' + result);
    //        }
    //    });
    //});
});


var dynamicCSSRules = [];
function getDatePicker(depapt, packID) {
    $("#datepicker").datepicker("destroy");
    $('.loader').show();
    $.ajax({
        url: '/holiday/getCalendar',
        data: { fromFlight: depapt, packID: packID },
        type: 'POST',
        success: function (data) {
            if (data != "") {
                debugger
                if (data.length > 0) {

                    var colorArray = ["green", "teal", "blue", "yellow", "black", "red", "BurlyWood", "GrayDark", "purple", "orange"];
                    //var bgcolorArray = ["bg-green", "bg-teal", "bg-blue", "bg-yellow", "bg-black", "bg-red", "bg-BurlyWood", "bg-GrayDark", "bg-purple", "bg-orange"];

                    var today = new Date();

                    var alterdata = [];
                    $(data).each(function (k, v) {
                        var vdates = v.dates.split(',').filter(function (v) {
                            return new Date(v.trim()) >= today;
                        }).map(function (el) {
                            return el.trim();
                        });
                        if (vdates.length > 0) {
                            var adata = {};
                            adata["fromAirport"] = v.fromAirport;
                            adata["toAirport"] = v.toAirport;
                            adata["price"] = v.price;
                            adata["flightPrice"] = v.flightPrice == null ? "0" : v.flightPrice;
                            adata["excursionPrice"] = v.excursionPrice == null ? "0" : v.excursionPrice;
                            adata["excursionCode"] = v.excursionCode == null ? "" : v.excursionCode;
                            adata["dates"] = vdates;
                            adata["AreaCode"] = v.AreaCode;
                            adata["hotelName"] = v.hotelName;
                            alterdata.push(adata);
                        }
                    });

                    var alldates = $.map(alterdata, function (n, i) { return n.dates });

                    var dates = [];
                    for (i = 0; i < alldates.length; i++) {
                        if (alldates[i].indexOf(',') >= 0) {
                            var rowdates = alldates[i].split(',');
                            for (j = 0; j < rowdates.length; j++) {
                                var d = rowdates[j].trim();
                                dates.push(new Date(d));
                            }
                        }
                        else {
                            var d = alldates[i].trim();
                            dates.push(new Date(d));
                        }
                    }

                    dates = dates.filter(function (v) {
                        return v >= today;
                    });
                    var allmonths = $.unique($.map(dates, function (n, i) { return n.getMonth() }));
                    if (dates.length > 0) {
                        var minDate = new Date(Math.min.apply(null, dates));
                        var maxDate = new Date(Math.max.apply(null, dates));

                        if (dates.length == 0) {
                            minDate = today;
                            maxDate = today;
                        }

                        var arrprices = $.map(alterdata, function (n, i) { return n.price; });
                        arrprices = arrprices.sort(function (a, b) { return parseInt(a) - parseInt(b) });

                        minprice = arrprices[0];
                        var minpricedate = alterdata.filter(function (v) {
                            return v.price == minprice;
                        })[0].dates[0];

                        var defaultDate = new Date(minpricedate.trim());

                        if (packID == "6948") {
                            defaultDate = new Date(2021, 9, 15);
                        }

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
                                        ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)),
                                        (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()),
                                        date.getFullYear()
                                    ].join('/');

                                    var pricingdata = alterdata.filter(function (v) {
                                        return v.dates.indexOf(newdate) >= 0;
                                    }).sort(function (a, b) { return parseInt(a.price) - parseInt(b.price) });
                                    if (pricingdata != undefined && pricingdata.length > 0) {
                                        var price_cal = $.map(pricingdata, function (n, i) { return (n.price); })[0];

                                        if (price_cal != undefined) {
                                            var color = colorArray[arrprices.indexOf(price_cal)];
                                            event = "ui-state-highlight";
                                            return [true, "ui-state-highlight " + color, "\u00A3" + price_cal];
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
                                    ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)),
                                    (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()),
                                    date.getFullYear()
                                ].join('/');
                                var pricingdata = alterdata.filter(function (v) {
                                    return v.dates.indexOf(newdate) >= 0;
                                }).sort(function (a, b) { return parseInt(a.price) - parseInt(b.price) });
                                if (pricingdata != undefined && pricingdata.length > 0) {
                                    var price_cal = $.map(pricingdata, function (n, i) { return (n.price); })[0];
                                    var fprice = $.map(pricingdata, function (n, i) { return (n.flightPrice); })[0];
                                    var eprice = $.map(pricingdata, function (n, i) { return (n.excursionPrice); })[0];
                                    var ecode = $.map(pricingdata, function (n, i) { return (n.excursionCode); })[0];
                                    var fromAirport = $.map(pricingdata, function (n, i) { return (n.fromAirport); })[0];
                                    var toAirport = $.map(pricingdata, function (n, i) { return (n.toAirport); })[0];
                                    var AreaCode = $.map(pricingdata, function (n, i) { return (n.AreaCode); })[0];
                                    var hotelName = $.map(pricingdata, function (n, i) { return (n.hotelName); })[0];
                                    $('#areacode').val(AreaCode);
                                    $('#depart').val(fromAirport);
                                    if (hotelName != undefined) {
                                        if (hotelName.toLowerCase().indexOf('and') > 0) {
                                            hotelName = hotelName.toLowerCase().split('and')[0];
                                        }
                                        else if (hotelName.toLowerCase().indexOf('&') > 0) {
                                            hotelName = hotelName.toLowerCase().split('&')[0];
                                        }
                                        $('#hotel_name').val(hotelName);
                                    }

                                    var obday = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
                                    var obmonth = ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1));
                                    var obyear = date.getFullYear();
                                    var obdate = obyear.toString() + obmonth.toString() + obday.toString();
                                    $('#obdate').val(obdate);

                                    var durationStr = "";
                                    var duration = $('#duration').val();
                                    function checkNights(n) {
                                        return n.indexOf('nights') > 0;
                                    }
                                    if (duration.indexOf('/') > 0) {
                                        durationStr = duration.toLowerCase().split('/').filter(checkNights);
                                    }
                                    else {
                                        durationStr = duration;
                                    }
                                    var days = parseInt(durationStr);
                                    date.setDate(date.getDate() + days);

                                    var ibdate = date.getFullYear().toString() + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)).toString() + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()).toString();
                                    $('#ibdate').val(ibdate);
                                    debugger
                                    if (price_cal != undefined) {
                                        var psngr = parseInt($('#passenger').val().replace(' adults', ''));
                                        var total = psngr * parseInt(price_cal);
                                        $('.book-btn .price').text("\u00A3" + total);
                                        $('#priceperperson').val(price_cal);
                                        if (ecode != "") {
                                            var str = "<Parameters> <Journeys> <Journey> <Number>1</Number> <Departure City = 'False' Area = 'False'>" + fromAirport + "</Departure> <Destination City = 'False' Area = 'False'>" + toAirport + "</Destination> <DepartureDate>" + obdate + "</DepartureDate> <ClassType> <Economy>True</Economy> </ClassType> <DeparturePoint>True</DeparturePoint> <DestinationPoint>True</DestinationPoint> <StopoverPoint>False</StopoverPoint> </Journey> <Journey> <Number>2</Number> <Departure City = 'False' Area = 'False'>" + toAirport + "</Departure> <Destination City = 'False' Area = 'False'>" + fromAirport + "</Destination> <DepartureDate>" + ibdate + "</DepartureDate> <ClassType> <Economy>True</Economy> </ClassType> <DeparturePoint>True</DeparturePoint> <DestinationPoint>True</DestinationPoint> <StopoverPoint>False</StopoverPoint> </Journey> </Journeys> <Airlines> <Airline></Airline> <Airline></Airline> <Airline></Airline> </Airlines> <HotelExtra Excursion = 'True' Transfer = 'False'/> <Destination>" + toAirport + "</Destination> <CheckInDate>" + obdate + "</CheckInDate> <CheckOutDate>" + ibdate + "</CheckOutDate> <PassengerTypes> <PassengerType Age = ''>ADT</PassengerType> <PassengerType Age = ''>ADT</PassengerType> </PassengerTypes> <Contract Excursion = '" + ecode + "'/> <CacheText>True</CacheText> <AddFilters>True</AddFilters> <Pricing> <Package Adult = '" + price_cal + "' Child = '0.00' Infant = '0.00'/> <Excursion Adult = '" + eprice + "' Child = '0.00' Infant = '0.00'/> <Flight Adult = '" + fprice + "' Child = '0.00' Infant = '0.00'/> </Pricing> </Parameters>";
                                            $('#QUERY').val(str);
                                        }
                                        else {
                                            $('#QUERY').val("");
                                        }
                                    }
                                }
                                $(this).data('datepicker').inline = false;
                                $('#selecteddate').val(newdate);
                            }
                        });


                        function afterdpload() {

                            for (i = 0; i < arrprices.length; i++) {
                                price = "\u00A3" + arrprices[i];
                                var className = 'datepicker-content-20';
                                $('.ui-state-highlight a.ui-state-default').addClass(className);
                                className = '.ui-datepicker-calendar td.' + colorArray[i] + ' a.' + className + ':after {content: "' + price + '";}';
                                //if ($.inArray(className, dynamicCSSRules) == -1) {
                                //    $('head').append('<style id="' + colorArray[i] +'">' + className + '</style>');
                                //    dynamicCSSRules.push(className);
                                //}
                                $('#' + colorArray[i]).remove()
                                $('head').append('<style id="' + colorArray[i] + '">' + className + '</style>');
                            }
                            $('head').append('<style>.ui-state-highlight a.ui-state-default:before {content: "per person";}</style>');
                            $('.ui-state-highlight a.ui-state-default').attr("onclick", "return false;");
                        }

                        $(document).on('click', '.ui-datepicker-prev', function () {
                            afterdpload();
                            // var mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            // var month = $(this).parent().find('.ui-datepicker-month').text();
                            // var monthno = mlist.indexOf(month) - 1;
                            // if (jQuery.inArray(monthno, allmonths) == -1) {
                                // $('.ui-datepicker-prev').click();
                            // }
                        });
                        $(document).on('click', '.ui-datepicker-next', function () {
                            afterdpload();
                            // var mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            // var month = $(this).parent().find('.ui-datepicker-month').text();
                            // var monthno = mlist.indexOf(month) + 1;
                            // if (jQuery.inArray(monthno, allmonths) == -1) {
                                // $('.ui-datepicker-next').click();
                            // }
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


$(document).on('click', '.book-btn', function () {
    //$('.details p:eq(0)').text($('#airport').val());
    //$('.details p:eq(1)').text($('#passenger').val());
    //$('#finalprice').html($(this).find('.price').text() + '<span>/pp</span>');
    //$('.close-btn').click();
    //$('html, body').animate({
    //    scrollTop: $("#finalprice").offset().top - 250
    //}, 1500);
    if ($('#QUERY').val() == "") {
        if ($('#addon').val() == "0") {
            window.location.href = "/reservation?offerId=" + $('#pkgId').val() + "&adults=" + $('#passenger').val().replace(' adults', '') + "&date=" + $('#selecteddate').val() + "&airport=" + $('#airport').val().split(' ').join('-') + "&price=" + $('#priceperperson').val();
        }
        else {
            window.location.href = "/add-ons?offerId=" + $('#pkgId').val() + "&adults=" + $('#passenger').val().replace(' adults', '') + "&date=" + $('#selecteddate').val() + "&airport=" + $('#airport').val().split(' ').join('-') + "&price=" + $('#priceperperson').val();
        }
    }
    else {
        $('input[name=Submit1]').click();
        //window.location.href = "https://citiesandbeaches.travelflow.co.uk/directsearch.asp?bn=0004&SearchType=PACKAGE" + "&Depart=" + $('#depart').val() + "&Destination=" + $('#areacode').val() + "&OBDate=" + $('#obdate').val() + "&IBDate=" + $('#ibdate').val() + "&Adults=" + $('#passenger').val().replace(' adults', '') + "&Children=0" + "&hotel=" + $('#hotel_name').val();
    }
})


$(document).on('change', '#airport', function () {
    getDatePicker($(this).val(), $('#pkgId').val())
})

$(document).on('change', '#month', function () {
    $("#datepicker").datepicker("setDate", new Date("01 " + $(this).val()));
    var className = 'datepicker-content-20';
    $('.ui-state-highlight a.ui-state-default').addClass(className);
})
$(document).on('change', '#passenger', function () {
    var total = parseInt($('#priceperperson').val()) * parseInt($(this).val().replace(' adults', ''));
    $('.book-btn .price').text("\u00A3" + total);
})

$(document).on('focus', '.ui-state-highlight', function () {
    $('.ui-datepicker-calendar').find('td').removeClass('ui-datepicker-current-day');
    $(this).addClass('ui-datepicker-current-day');
});

