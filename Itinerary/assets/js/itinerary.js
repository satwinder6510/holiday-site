$(document).ready(function() {
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
    $('.itinerary-carousel-1').slick({
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
    $('.accommodation-carousel-1').slick({
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
            $(function() {
                $(".tabs").tabs();
            });
        }
    } else {
        if ($(".tabs").data("ui-tabs")) {
            $(function() {
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
        if ($(window).scrollTop() >=
            ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) - 100)) {
            $('#tab_navigation').addClass('stick');
        } else if ($(window).scrollTop() <=
            ($('.itinerary-hero').offset().top + $('.itinerary-hero').outerHeight(true) + 70)) {
            $('#tab_navigation').removeClass('stick');
        }
    }

    $(window).scroll(function() {
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
                $(".itinerary-content section .content").reverse().each(function() {
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
        function() {
            $(".tab-list").addClass('open-drop-down');
        });

    $(".tab-list>li").on("click",
        function() {
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
    $.fn.isInView = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };
    $.fn.reverse = [].reverse;


    $(window).resize(function(e) {
        //mobile only summary button toggle on resize
        if (window.innerWidth > 768) {
            if ($(".summary-btn").hasClass('close')) {
                toggleSummary();
                $(".current").text("Overview");
            }
            if (!$(".tabs").data("ui-tabs")) {
                $(function() {
                    $(".tabs").tabs();
                });
            }
        } else {
            if ($(".tabs").data("ui-tabs")) {
                $(function() {
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
    $(function() {
        $('#datepicker').datepicker({
            firstDay: 1,
            inline: true,
            showOtherMonths: true,
            dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

        });
    });
    $(".date-select-btn").on("click",
        function() {
            event.preventDefault();
            $(".calendar-modal .search-form").css("display", "none");
            $(".calendar-modal .calendar").css("display", "block");
            $(".calendar-modal .mobile-back-btn").css("display", "block");
            $(".calendar-modal .calendar .book-btn").css({ "display": "flex", "display": "-webkit-flex" });
        });
    $(".calendar-modal .close-btn").on("click",
        function() {
            if (window.innerWidth < 1101) {
                $(".calendar-modal .search-form").css("display", "block");
                $(".calendar-modal .calendar").css("display", "none");
                $(".calendar-modal .mobile-back-btn").css("display", "none");
                $(".calendar-modal .calendar .book-btn").css("display", "none");
            }
        });
    $(".calendar-modal .mobile-back-btn").on("click",
        function() {
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
            function() {
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
    initPhotoSwipeFromDOM('.itinerary-carousel-2');
    initPhotoSwipeFromDOM('.itinerary-carousel-3');
    initPhotoSwipeFromDOM('.itinerary-carousel-4');
    initPhotoSwipeFromDOM('.itinerary-carousel-5');
    initPhotoSwipeFromDOM('.accommodation-carousel-1');
    initPhotoSwipeFromDOM('.accommodation-carousel-2');
    initPhotoSwipeFromDOM('.accommodation-carousel-3');
    initPhotoSwipeFromDOM('.gallery-carousel');
});
