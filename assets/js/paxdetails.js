$(document).ready(function () {
    //mobile summary toggle
    $(".summary-btn").on("click", toggleSummary);

    function toggleSummary() {
        if ($(".summary-btn").hasClass('close')) {
            $(".summary-btn").text("Summary");
            var tabsOffset = $(".sidebar").offset();
            $('html, body').animate({ scrollTop: tabsOffset.top - 75 }, 100);
        } else {
            $(".summary-btn").text("Close");
            var tabsOffset = $(".pax-section").offset();
            $('html, body').animate({ scrollTop: tabsOffset.top - 50 }, 100);
        }

        $(".summary-btn").toggleClass('close');
        $(".content").toggleClass('close');
        $(".sidebar").toggleClass('open-summary');
    }

    //make second passenger form optional 
    $(".optional-fill").on("click", function (e) {
        e.preventDefault();
        if ($(this).find("#filllater").is(":checked")) {
            $(this).find("#filllater").prop("checked", false);
            $(this).parent().parent().find("input").each(function () {
                if ($(this).id != "fillater")
                    $(this).attr("required", true);
            });
        } else {
            $(this).find("#filllater").prop("checked", true);
            $(this).parent().parent().find("input").each(function () {
                if ($(this).id != "fillater")
                    $(this).attr("required", false);
            });
        }
    });

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

    //$('#msgboxbtn').click();
});
$(document).on('click', '.submit, .check-price', function () {
	 $(this).prop('disabled', true);
	 $(this).css("opacity", "0.5");

    var pkgId = $('input[name=pkgId]').val();
    var selecteddate = $('input[name=selecteddate]').val();
    var title = $('input[name=title]').val();
    var destination = $('input[name=destination]').val();
    var price = $('input[name=price]').val();
    var airport = $('input[name=airport]').val();
    var adults = $('#adults').val();
    var duration = $('input[name=duration]').val();
	var name= $('#firstname').val() +' '+ $('#lastname').val();
	var email = $('#email').val();
	var phonenumber = $('#phonenumber').val();
    //var firstname = $('input[name=firstname]').map(function (i, v) { return $(this).val(); });
    //var lastname = $('input[name=lastname]').map(function (i, v) { return $(this).val(); });
    //var dob = $('input[name=dob]').map(function (i, v) { return $(this).val(); });
    //var phone = $('input[name=phone]').map(function (i, v) { return $(this).val(); });
    //var email = $('input[name=email]').map(function (i, v) { return $(this).val(); });
    //var streetname = $('input[name=streetname]').map(function (i, v) { return $(this).val(); });
    //var town = $('input[name=town]').map(function (i, v) { return $(this).val(); });
    //var city = $('input[name=city]').map(function (i, v) { return $(this).val(); });
    //var postcode = $('input[name=postcode]').map(function (i, v) { return $(this).val(); });
    //var housenumber = $('input[name=housenumber]').map(function (i, v) { return $(this).val(); });

    var length = $('input[name=firstname]').length;
    for (i = 0; i < length; i++) {
        if (i == 0) {
            if (!checkvalidation(i)) {
                return;
            }
        }
        else {
            var j = i - 1;
            if ($('input[name=filllater]:eq(' + j + ')').is(':checked') == false) {
                if (!checkvalidation(i)) {
                    return;
                }
            }
        }
    }
    var formdata = new FormData();
    var model = $('form').serializeArray();
    $.each(model, function (k, v) {
        formdata.append(v.name, v.value)
    })
    var addOnsIds = $('.icon-close').map(function () { return $(this).attr('data-id') }).get().join(',');
    formdata.append('addOnsIds', addOnsIds);
    $(".loader").show();
	
	const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://www.privyr.com/integrations/api/v1/incoming-webhook");
            xhr.setRequestHeader("X-TOKEN", "Fq3dHw3g");
            xhr.setRequestHeader("Content-Type", "application/json");

            const body = JSON.stringify({
                "name": name,
                "lead_source": "Flights and Packages Holidays",
                "email": email,
                "phone": phonenumber,
                "other_fields": {
                    "Holiday Name": title,
                    "Price": price,
                    "Travel Date": selecteddate,
                    "Departure Airport": airport,
                    "Duration": duration,
                    "Number Of Passenger": adults
                }
            });
            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log(JSON.parse(xhr.responseText));
                } else {
                    console.log(`Error: ${xhr.status}`);
                }
            };
            xhr.send(body);
	
    $.ajax({
        url: '/reservation/submit',
        method: 'post',
        processData: false,
        contentType: false,
        data: formdata,
        success: function (data) {
            $(".loader").hide();
            $('#msgboxbtn').click();
            setTimeout(function () {
                window.location.href = "/Holidays/" + destination.split(" ").join("-") + "/" + title.split(" ").join("-");
            }, 5000);
        },
        error: function (result) {
        }
    });
})

function checkvalidation(i) {
    if ($('input[name=firstname]:eq(' + i + ')').val() == "") {
        $('input[name=firstname]:eq(' + i + ')').focus();
        return false;
    }
    else if ($('input[name=lastname]:eq(' + i + ')').val() == "") {
        $('input[name=lastname]:eq(' + i + ')').focus();
        return false;
    }
    else if ($('input[name=dob]:eq(' + i + ')').val() == "") {
        $('input[name=dob]:eq(' + i + ')').focus();
        return false;
    }
    else if ($('input[name=phone]:eq(' + i + ')').val() == "") {
        $('input[name=phone]:eq(' + i + ')').focus();
        return false;
    }
    else if ($('input[name=email]:eq(' + i + ')').val() == "") {
        $('input[name=email]:eq(' + i + ')').focus();
        return false;
    }
    else if ($('input[name=housenumber]:eq(' + i + ')').val() == "") {
        $('input[name=housenumber]:eq(' + i + ')').focus();
        return false;
    }
    else if ($('input[name=streetname]:eq(' + i + ')').val() == "") {
        $('input[name=streetname]:eq(' + i + ')').focus();
        return false;
    }
    //else if ($('input[name=town]:eq(' + i + ')').val() == "") {
    //    $('input[name=town]:eq(' + i + ')').focus();
    //    return false;
    //}
    else if ($('input[name=city]:eq(' + i + ')').val() == "") {
        $('input[name=city]:eq(' + i + ')').focus();
        return false;
    }
    else if ($('input[name=postcode]:eq(' + i + ')').val() == "") {
        $('input[name=postcode]:eq(' + i + ')').focus();
        return false;
    }
    else {
        return true;
    }
}

$(document).on('click', '.icon-close', function () {
    var total = parseInt($('#totalprice').val());
    var price = parseInt($(this).attr('price'));
    var finalprice = total - price;
    $('#totalprice').val(finalprice);
    $('.total-price').html('\u00A3' + finalprice + '<div class="price-label"> <span>Total</span> <span>Price</span> </div>');
    $(this).parent().remove();
})

$(document).on('change', '#adults', function () {
    var total = parseInt($('input[name=price]').val()) * parseInt($(this).val().replace(' adults', ''));
    $('.total-price').html('\u00A3' + total + '<div class="price-label"> <span>Total</span> <span>Price</span> </div>');
})