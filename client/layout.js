/**
 * Created by HuycongNguyen on 12/17/2016.
 */
Template.layout.onRendered(function () {
    var linkInfo = {rel: "icon", type: "image/jpg", href: "images/fav_icon.jpg"};
    DocHead.addLink(linkInfo);
    var $nav = $('#nav');
    // $nav.fadeOut();
    $nav.slideUp('fast');
    var $window = $(window);
    $(window).scroll(function () {
        var top = $window.scrollTop();
        var $pageNav = $('#page-nav');
        var point = $pageNav.offset().top + $pageNav.height();
        if (top > point) {
            $nav.slideDown();
        } else
            $nav.slideUp('fast');
    });

});