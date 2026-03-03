$(document).ready(function () {
    //add/remove extra toggle
    $('.extrabtn').click(function (event) {
        var total = parseInt($('#totalprice').val());
        var ppprice = parseInt($('#price').val());
        var adults = parseInt($('#adults').val());
        var price = parseInt($(this).attr('price'));
        var title = $(this).attr('title');
        $(this).toggleClass("added");
        if ($(this).hasClass("added")) {
            $(this).text("Remove Extra");
            var finalprice = total + (price * adults);
            var totalppprice = ppprice + price;
            $('#totalprice').val(finalprice);
            $('#price').val(totalppprice);
            $('.total-price').html('\u00A3' + finalprice + '<div class="price-label"> <span>Total</span> <span>Price</span> </div>');
            $('ul.picked-extras').append('<li>' + title + ' <span class="icon-close" price="' + (price * adults) + '" ppprice="' + price + '"></span></li>');
            $('.holiday-price:eq(0)').html('<div>\u00A3' + totalppprice + '<span>/pp</span></div>');
            $('.holiday-price:eq(1)').html('<div style="font-size: x-large;">\u00A3' + totalppprice + '<span>/pp</span></div>');
        } else {
            $(this).text('Add Extra');
            $(this).append('<span class="icon-more"></span>');
            var finalprice = total - (price * adults);
            var totalppprice = ppprice - price;
            $('#totalprice').val(finalprice);
            $('#price').val(totalppprice);
            $('.total-price').html('\u00A3' + finalprice + '<div class="price-label"> <span>Total</span> <span>Price</span> </div>');
            $('.holiday-price:eq(0)').html('<div>\u00A3' + totalppprice + '<span>/pp</span></div>');
            $('.holiday-price:eq(1)').html('<div style="font-size: x-large;">\u00A3' + totalppprice + '<span>/pp</span></div>');
            $('ul.picked-extras li:contains("' + title + '")').remove();
        }

        if ($('ul.picked-extras li').length > 0) {
            $('.sd-extra').show();
        }
        else {
            $('.sd-extra').hide();
        }
    });
    //mobile summary toggle
    $(".summary-btn").on("click", toggleSummary);

    function toggleSummary() {
        if ($(".summary-btn").hasClass('close')) {
            $(".summary-btn").text("Summary");
            var tabsOffset = $(".sidebar").offset();
            $('html, body').animate({ scrollTop: tabsOffset.top - 75 }, 100);
        } else {
            $(".summary-btn").text("Close");
            var tabsOffset = $(".extras-section").offset();
            $('html, body').animate({ scrollTop: tabsOffset.top - 50 }, 100);
        }

        $(".summary-btn").toggleClass('close');
        $(".content").toggleClass('close');
        $(".sidebar").toggleClass('open-summary');
    }


    $(window).resize(function (e) {
        //responsive mobile summary toggle
        if (window.innerWidth > 768) {
            if ($(".summary-btn").hasClass('close')) {
                toggleSummary();
            }
        }
    });

    $(window).scroll(function () {
        //mobile summary sticky toggle
        if ($(window).scrollTop() >= ($('.hero-section').offset().top + $('.hero-section').outerHeight(true) - 100)) {
            $('.mobile-summary-toggle').addClass('stick');
        } else if ($(window).scrollTop() <= ($('.hero-section').offset().top + $('.hero-section').outerHeight(true) + 70)) {
            $('.mobile-summary-toggle').removeClass('stick');
        }
    });

    $('.sd-extra').hide();
});

$('#btnconfirm, .confirm-btn').click(function () {
    var addons = $('.added').map(function () { return $(this).attr('data-val') }).get().join(',');
    window.location.href = "/reservation?offerId=" + $('#pkgId').val() + "&adults=" + $('#adults').val() + "&date=" + $('#selecteddate').val() + "&airport=" + $('#airport').val().split(' ').join('-') + "&price=" + $('#price').val() + "&addons=" + addons;
})

$(document).on('click', '.icon-close', function () {
    var total = parseInt($('#totalprice').val());
    var totalppprice = parseInt($('#price').val());
    var ppprice = parseInt($(this).attr('ppprice'));
    var price = parseInt($(this).attr('price'));
    var title = $(this).parent().text().trim();
    var finalprice = total - price;
    totalppprice = totalppprice - ppprice;
    $('#totalprice').val(finalprice);
    $('#price').val(totalppprice);
    $('.total-price').html('\u00A3' + finalprice + '<div class="price-label"> <span>Total</span> <span>Price</span> </div>');
    $('.holiday-price:eq(0)').html('<div>\u00A3' + totalppprice + '<span>/pp</span></div>');
    $('.holiday-price:eq(1)').html('<div style="font-size: x-large;">\u00A3' + totalppprice + '<span>/pp</span></div>');
    $(this).parent().remove();
    $('div.extra:contains("' + title + '")').find('.extrabtn').text('Add Extra').removeClass('added')
    if ($('ul.picked-extras li').length > 0) {
        $('.sd-extra').show();
    }
    else {
        $('.sd-extra').hide();
    }
})