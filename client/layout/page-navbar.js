Template.pageNavbar.onRendered(function () {
    $('a').css({"text-decoration": "none"})
});


Template.pageNavbar.events({
    'click #w-icon-nav-menu1': function (e, t) {
        $('#navbar-collapse-1').slideToggle(300, function () {

        });
        // $('#navbar-collapse-1 a').css({
        // "display": "inline-block !important;",
        // });
    }
});