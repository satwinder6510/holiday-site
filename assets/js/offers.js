$(document).ready(function () {
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

    var phoneno = $('.phone:eq(0)').text();
    $('.call-us span').text(phoneno);
   //    $('.rest-para1').hide();


    //var para2 = $('.para2').html();
    //if (para2 != undefined && para2.trim() != "") {
    //    if (para2.indexOf('<p') >= 0) {
    //        $('.para2').html('<p>' + $('.para2 p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
    //    }
    //    else {
    //        $('.para2').html('<p>' + $('.para2 div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
    //    }

    //    $(document).on('click', '.show1', function () {
    //        $('.para2').html(para2 + '<a href="javaScript:void(0);" class="hide1 read-more">Read less</a>');
    //    });
    //    $(document).on('click', '.hide1', function () {
    //        if (para2.indexOf('<p') >= 0) {
    //            $('.para2').html('<p>' + $('.para2 p:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
    //        }
    //        else {
    //            $('.para2').html('<p>' + $('.para2 div:eq(0)').html() + '</p><a href="javaScript:void(0);" class="show1 read-more">Read more<span class="icon-dropdown"></span></a>');
    //        }
    //    });
    //}

});

$(document).on('click', '.more-offers', function () {
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

function sortOffer(orderBy, sortBy) {
    $(".loader").show();
    $.ajax({
        url: '/holiday/offerListWithSortOnly',
        data: { orderBy: orderBy, sortBy: sortBy },
        type: 'POST',
        success: function (data) {
            $(".offers").html(data._OfferListPartial);
            $(".results").text(data.TotalCount + " results found");            
            $(".loader").hide();
        },
        error: function (result) {
            $(".loader").hide();
        }
    });
}

$(document).on('click', '.show', function () {
    var restpara1 = $('.rest-para1').html();
    if (restpara1 != undefined) {
        $('.rest-para1').show();
        $(this).hide();
    }
});

$(document).on('click', '.hide', function () {
    $('.rest-para1').hide();
    $('.show').show();
});