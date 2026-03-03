//Citrus
////Header dropdowns
//$(".menu").on("mouseenter mouseleave", function () {
//    if (window.innerWidth > 768) {
//        $this = $(this);
//        $this.toggleClass('open');
//        $(".menu-popup").toggleClass('open');
//    }
//});

// Mobile menu

$("#neDev").css('display','none');

$(".mobile-menu-btn").on("click", function () {
    $('.mobile-menu-btn').css('display', 'none');
    $('.mobile-close-btn').css('display', 'inline-block');
    $("body").addClass('locked');
    $(".mobile-menu").addClass('open');
    $("header").css("background-color", "#000000");
    $(".mobile-nav .logo").css("background-image", 'url("/assets/img/cities-and-beaches-logo-light.png")');
    $('.mobile-close-btn').addClass('inverted');
    $('.mobile-contacts').addClass('inverted');
	//$(".mobile-nav").show();
});
$(".mobile-close-btn").on("click", function () {
    $('.mobile-menu-btn').css('display','inline-block');
    $('.mobile-close-btn').css('display', 'none');
    $('.mobile-contacts').css('display', 'inline-block');
    $('.mobile-back-btn').css('display', 'none');
    $('.mobile-contacts').removeClass('inverted');
    $("header").css("background-color", "#000000");
    $(".mobile-nav .logo").text("");
    $(".mobile-nav .logo").css("background-image", 'url("/assets/img/cities-and-beaches-logo.png")');
    if ($("#view-all-dest").hasClass("open")) {
        $(".mobile-sub-destinations").removeClass('open');       
        $(".mobile-destinations-list").addClass('open');
        $("#view-all-dest").removeClass('open');
    }
    $("body").removeClass('locked');
    $(".mobile-menu").removeClass('open');
    $(".mobile-destinations").removeClass('open');
    $(".mobile-collections").removeClass('open');
	// $("#neDev").css('display','none');
	// $('.mobile-menu').css('height','calc(100vh - 50px)');
	// $("header").css('height','50px');
});
$(".mobile-back-btn").on("click", function () {
    if ($("#view-all-dest").hasClass("open")) {
        $(".mobile-sub-destinations").removeClass('open');    
        $(".mobile-destinations-list").addClass('open');
        $("#view-all-dest").removeClass('open');
        $(".mobile-nav .logo").text("Destinations");
        return;
    }
    $('.mobile-contacts').css('display', 'inline-block');
    $('.mobile-back-btn').css('display', 'none');
    $(".mobile-destinations").removeClass('open');
    $(".mobile-collections").removeClass('open');
    $("header").css("background-color", "#000000");
    $(".mobile-nav .logo").text("");
    $(".mobile-nav .logo").css("background-image", 'url("/assets/img/cities-and-beaches-logo-light.png")');
    $('.mobile-close-btn').addClass('inverted');
	$('.mobile-contacts').addClass('inverted');
	$('.mobile-destinations .hero-section:eq(0)').show();
	// $("#neDev").css('display','none');
	// $('.mobile-menu').css('height','calc(100vh - 50px)');
	// $("header").css('height','50px');
});

$("#mobile-destinations-btn").on("click", function () {
    if (window.innerWidth < 769) {
        event.preventDefault();
        $(".mobile-destinations").addClass('open');
        $(".mobile-destinations-list").addClass('open');
        //$('.mobile-contacts').css('display', 'none');
		$('.mobile-contacts').removeClass('inverted');
        $('.mobile-back-btn').css('display', 'inline-block');
        $("header").css("background-color", "#000000");
        $(".mobile-nav .logo").css("background-image", 'none');
        $(".mobile-nav .logo").text("Destinations");
        $('.mobile-close-btn').removeClass('inverted');
		$('.mobile-menu-btn').css('display', 'inline-block');
		// $('.mobile-menu').css('height','calc(100vh - 100px)');
		// $("header").css('height','100px');
		// $("#neDev").css('display','inline-block');
    }
});
$("#mobile-flights-btn").on("click", function () {
    if (window.innerWidth < 769) {
        event.preventDefault();
        $(".mobile-flights").addClass('open');
        $(".mobile-flights-list").addClass('open');
        $('.mobile-contacts').removeClass('inverted');
        $('.mobile-back-btn').css('display', 'inline-block');
        $("header").css("background-color", "#000000");
        $(".mobile-nav .logo").css("background-image", 'none');
        $(".mobile-nav .logo").text("Collections");
        $('.mobile-close-btn').removeClass('inverted');
        $('.mobile-menu-btn').css('display', 'inline-block');
    }
}); 

$("#mobile-collections-btn").on("click", function () {
    if (window.innerWidth < 769) {
        event.preventDefault();
        // $(".mobile-collections").addClass('open');
        // $(".mobile-collections-list").addClass('open');
        // $('.mobile-contacts').css('display', 'none');
        // $('.mobile-back-btn').css('display', 'inline-block');
        // $("header").css("background-color", "#ffffff");
        // $(".mobile-nav .logo").css("background-image", 'none');
        // $(".mobile-nav .logo").text("Collections");
        // $('.mobile-close-btn').removeClass('inverted');
		// $('.mobile-contacts').removeClass('inverted');
		// $(".mobile-nav .logo").css("background-image", 'url("/assets/img/citrus-holidays-logo.svg")');
		// $("#neDev").css('display','inline-block');
		$(".mobile-collections").addClass('open');
        $(".mobile-collections-list").addClass('open');
        //$('.mobile-contacts').css('display', 'none');
		$('.mobile-contacts').removeClass('inverted');
        $('.mobile-back-btn').css('display', 'inline-block');
        $("header").css("background-color", "#000000");
        $(".mobile-nav .logo").css("background-image", 'none');
        $(".mobile-nav .logo").text("Collections");
        $('.mobile-close-btn').removeClass('inverted');
		$('.mobile-menu-btn').css('display', 'inline-block');
		// $('.mobile-menu').css('height','calc(100vh - 100px)');
		// $("header").css('height','100px');
		// $("#neDev").css('display','inline-block');
    }
});

//mobile menu destinations
{
    $(document).on("click", ".mobile-dest",
        function() {
            if (window.innerWidth < 769) {
                event.preventDefault();
                var value = $(this).attr('data-val');
                $('.mobile-destinations-list').removeClass('open');
                $('.' + value).addClass('open');
                $('#view-all-dest').addClass('open');
                var str = value.replace('dest-', '').replace('-', ' ');
                var new_str = str.toLowerCase().replace(/\b[a-z]/g, function (txtVal) {
                    return txtVal.toUpperCase();
                });
                //var img = "https://admin2.citrusholidays.com/images/destinations/" + new_str + "_banner.jpg?" + (new Date().getTime());
                // img = "/cdn-cgi/image/f=auto,fit=contain,h=210/" + img;
                // $('#destinationBg').css('background-image', 'url("' + img + '")');
                // $('#destinationBg h2').text(new_str + " Holidays");
                $(".mobile-nav .logo").text(new_str);
                var url = "/Holidays/" + new_str.split(' ').join('-');
                $('#view-all-dest').attr('href', url);
				$('.mobile-destinations .hero-section:eq(0)').hide();
            }
        });    
}

//mobile menu flights
{
    $(document).on("click", ".mobile-flight",
        function () {
            if (window.innerWidth < 769) {
                event.preventDefault();
                var value = $(this).attr('data-val');
                $('.mobile-flights-list').removeClass('open');
                $('.' + value).addClass('open');
                $('#view-all-flight').addClass('open');
                var str = value.replace('flight-', '').replace('-', ' ');
                var new_str = str.toLowerCase().replace(/\b[a-z]/g, function (txtVal) {
                    return txtVal.toUpperCase();
                });
                //var img = "https://admin2.citrusholidays.com/images/destinations/" + new_str + "_banner.jpg?" + (new Date().getTime());
                // img = "/cdn-cgi/image/f=auto,fit=contain,h=210/" + img;
                // $('#destinationBg').css('background-image', 'url("' + img + '")');
                // $('#destinationBg h2').text(new_str + " Holidays");
                $(".mobile-nav .logo").text(new_str);
                var url = "/flights/" + new_str.split(' ').join('-');
                $('#view-all-flight').attr('href', url);
                $('.mobile-flights .hero-section:eq(0)').hide();
            }
        });
}


$(document).ready(function() {

    $('.featured-carousel').slick({
        arrows: true,
        rows: false,
        variableWidth: true,
        zIndex: 0,
        prevArrow: $("#featured-prev"),
        nextArrow: $("#featured-next")
    });

    $('.scroll').click(function() {
        $('html, body').animate({
                scrollTop: 0
            },
            500);
        return false;
    });

    //footer accordion
    $("footer .navigation .lhs, .mid, .rhs").click(function () {
        $(this).toggleClass("open");
    });

    if (window.innerWidth < 1101) {
        mobileOnlySlider();        
    }
    if (window.innerWidth < 736) {
        $('.call-now-m').show();
    }
});

$(window).resize(function (e) {
    //mobile only carousel slider toggle on resize
    if (window.innerWidth < 1101) {
        if (!$('.carousel-blogs').hasClass('slick-initialized')) {
            mobileOnlySlider();
        }
    } else {
        if ($('.carousel-blogs').hasClass('slick-initialized')) {
            $('.carousel-blogs').slick('unslick');
        }
    }   
    if (window.innerWidth < 736) {
        $('.call-now-m').show();
    }
    else {
        $('.call-now-m').hide();
    }
});

function mobileOnlySlider() {
    $('.carousel-blogs').not('.slick-initialized').slick({
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

$("#btnNewsLeter1").click(function () {
    $("#loader").show();
    var email = $("#nl1_email").val();
    var contactType = "newsletter";
    $.ajax({
        url: '/home/ContactUs',
        data: { rcb_email: email, contactType: contactType },
        type: 'POST',
        success: function (data) {
            $("#nl_email").val('');
            $("#loader").hide();
            $('#nlboxbtn').click();
        },
        error: function (result) {
            $("#loader").hide();
            var notification = '<div style="padding: 15px; margin-bottom: 20px; border: 1px solid transparent; border-radius: 4px; color: #a94442; background-color: #f2dede; border-color: #ebccd1;position:fixed;top:20%;right:38%;z-index:9999" id="notification"> Oops!there is some problem try again. </div>';
            $("#notify").append(notification);
            setTimeout(function () {
                $("#notification").remove();
            }, 10000);
        }
    });
});
$(document).on('click', '.icon-close', function () {
    //alert();
    $('header ul li.menu').removeClass('open');
    $(this).parent().parent().removeClass('open');
});

$(function () {
    $('.lazy').Lazy();
});
//$('#msgboxbtn').click();
$("#btRequestCallBack").click(function () {
    var rcb_name = $("#rcb_name").val();
    var rcb_email = $("#rcb_email").val();
    var rcb_phn = $("#rcb_phn").val();
    var rcb_dep = "";
    var rcb_date = "";
    var rcb_traveller = "";
    var rcb_comment = $("#rcb_comment").val();
    var contactType = "RequestCallBack";
    if (rcb_name != "" && rcb_email != "" && rcb_phn != "" && rcb_comment != "") {
        $(this).prop('disabled', true);
        $(".loader").show();
        $.ajax({
            url: '/Home/ContactUs',
            data: { rcb_name: rcb_name, rcb_email: rcb_email, rcb_phn: rcb_phn, rcb_dep: rcb_dep, rcb_date: rcb_date, rcb_traveller: rcb_traveller, rcb_comment: rcb_comment, contactType: contactType },
            type: 'POST',
            success: function (data) {
                //$("#contactForm")[0].reset();
                $(".loader").hide();
                $('#msgboxbtn').click();
                setTimeout(function () {
                    window.location.reload();
                }, 5000);
            },
            error: function (result) {

            }
        });
    }

});