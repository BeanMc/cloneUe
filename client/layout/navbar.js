Template.navbar.events({
    'click #w-icon-nav-menu2': function (e, t) {
        $('#navbar-collapse-2').slideToggle(300, function () {
            // $('#navbar-collapse-2').css({
            // "display": "block !important;",
            // });
        })
    }
})