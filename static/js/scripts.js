window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }
    ;

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

$('.btn_close').click(function () {
    location.reload();
});

$("#RewriteButton").click(function () {
    window.location.href = '#input_complaint';
});

// 동기 지연 함수
function sleep(ms) {
    var start = Date.now() + ms;
    while (Date.now() < start) {
    }
}

$(document).ready(function () {
    $("#inputForm").submit(function (e) {
        e.preventDefault();

        $('#first_modal').css({
            display: 'flex'
        });

        $(document.body).css({
            overflow: 'hidden'
        });

        var user_complaint = $("#message").val();

        $("#first_modal_div").text("민원의 목적을 분류하고 있습니다! 잠시만 기달려 주세요!");

        $.ajax({
            url: "/get_filter1_result",
            type: "POST",
            contentType: "application/json",  // Content-Type을 JSON으로 설정
            data: JSON.stringify({message: user_complaint}),  // 데이터를 JSON 문자열로 변환하여 전송
            success: function (filter1_result) {
                if (filter1_result.status === "no") {
                    sleep(3000);
                    $("#first_modal_div").text("본 민원의 목적을 판단하기 힘들거나/부적절한 목적으로 보입니다.");
                    $("#first_modal").fadeOut();
                } else {
                    sleep(3000);
                    $("#first_modal_div").text("본 민원은 " + filter1_result.category + "과 관련된 민원으로 보입니다. 관련과로 전달해드리기 전에 잠시 살펴보겠습니다.");

                    // Filter 2 실행
                    $.ajax({
                        url: "/get_filter2_result",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({message: user_complaint}),
                        success: function (filter2_result) {
                            $("#first_modal_div").text("욕설확인중");
                            sleep(3000);
                            if (filter2_result.status === "no") {
                                $("#first_modal_div").text("발견된 욕설이 없습니다.");
                            } else if (filter2_result.status === "yes") {
                                $("#first_modal_div").text("욕설이 발견되었습니다. 수정 작업 하도록 하겠습니다.");
                            }
                            sleep(3000);
                            // Filter 3 실행
                            $.ajax({
                                url: "/get_filter3_result",
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify({message: user_complaint}),
                                success: function (filter3_result) {
                                    console.log(filter3_result);
                                    if (filter3_result.status === "no") {
                                        $("#first_modal_div").text("부적절한 표현이 없습니다. 결과를 표시해 드리겠습니다");
                                        $("#filteredMessage").val(user_complaint);
                                    } else if (filter3_result.status === "yes") {
                                        $("#first_modal_div").text("부적절한 표현이 확인 되었습니다. 민원을 수정하겠습니다.");
                                        $(".filteredMessage").val(filter3_result.filteredMessage);
                                    }
                                    $('.modal_image').attr('src', 'https://item.kakaocdn.net/do/c5c470298d527ef65eb52883f0f186c48f324a0b9c48f77dbce3a43bd11ce785');
                                    $("#first_modal_div").text("수정이 완료되었습니다. 수정 결과를 확인하여 주세요. 3초뒤 결과 화면으로 이동합니다.");
                                    setTimeout(function () {
                                        $("#first_modal").fadeOut();
                                        $(document.body).css({
                                            overflow: 'visible'
                                        });
                                        location.replace('/#result');
                                    }, 3000);
                                }
                            });
                        }
                    });
                }
            }
        });
    });
});