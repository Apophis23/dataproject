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

    // Shrink the navbar when the page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

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
        var first_modal_div = $("#first_modal_div");

        // 민원 분류 시작 메시지 표시 후 2초 지연
        first_modal_div.text("민원의 목적을 분류하고 있습니다! 잠시만 기달려 주세요!");
        setTimeout(function () {
            $.ajax({
                url: "/get_filter1_result",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({message: user_complaint}),
                success: function (filter1_result) {
                    if (filter1_result.status === "no") {
                        $('.modal_image').attr('src', 'https://item.kakaocdn.net/do/c5c470298d527ef65eb52883f0f186c48b566dca82634c93f811198148a26065');
                        first_modal_div.text("본 민원의 목적을 판단하기 힘들거나/부적절한 목적으로 보입니다. 3초뒤 화면이 종료됩니다.");
                        setTimeout(function () {
                            $("#first_modal").fadeOut();
                            location.reload();
                        }, 3000);
                    } else {
                        // 관련된 민원으로 분류된 경우
                        first_modal_div.html("본 민원은 <b>" + filter1_result.category + "</b>과 관련된 민원으로 보입니다. 관련과로 전달해드리기 전에 잠시 살펴보겠습니다.");
                        setTimeout(function () {
                            first_modal_div.text("욕설 / 부적절한 표현 확인 중.....");
                        }, 2500);
                        // Filter 2 실행
                        setTimeout(function () {
                            $.ajax({
                                url: "/get_filter2_result",
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify({message: user_complaint}),
                                success: function (filter2_result) {
                                    if (filter2_result.status === "no") {
                                        first_modal_div.text("발견된 욕설이 없습니다. 수정할 내용이 있는지 살펴보겠습니다.");
                                    } else if (filter2_result.status === "yes") {
                                        first_modal_div.text("욕설이 발견되었습니다. 민원을 수정해 드리겠습니다!");
                                    }

                                    setTimeout(function () {
                                        first_modal_div.text("욕설 / 민원 수정중....");
                                    }, 2000);

                                    // 2초 지연 후 Filter 3 실행
                                    setTimeout(function () {
                                        $.ajax({
                                            url: "/get_filter3_result",
                                            type: "POST",
                                            contentType: "application/json",
                                            data: JSON.stringify({message: user_complaint}),
                                            success: function (filter3_result) {
                                                if (filter3_result.status === "no") {
                                                    first_modal_div.text("수정할 내용이 없습니다!");
                                                    $("#filteredMessage").val(user_complaint);
                                                } else if (filter3_result.status === "yes") {
                                                    first_modal_div.text("민원 수정이 완료되었습니다!");
                                                    $(".filteredMessage").val(filter3_result.filteredMessage);
                                                }

                                                setTimeout(function () {
                                                    $('.modal_image').attr('src', 'https://item.kakaocdn.net/do/c5c470298d527ef65eb52883f0f186c48f324a0b9c48f77dbce3a43bd11ce785');
                                                    first_modal_div.text("결과를 확인하여 주세요. 3초뒤 결과 화면으로 이동합니다.");
                                                }, 2000)

                                                setTimeout(function () {
                                                    $("#first_modal").fadeOut();
                                                    $(document.body).css({
                                                        overflow: 'visible'
                                                    });
                                                    location.replace('/#result');
                                                }, 5000);
                                            }
                                        });
                                    }, 6000); // 2초 지연
                                }
                            });
                        }, 4000);
                    }
                }
            });
        }, 2000); // 2초 지연
    });
});