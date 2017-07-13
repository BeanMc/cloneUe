Template.upcomingtour.onCreated(function () {


});


Template.upcomingtour.onRendered(function () {
    $('html,body').animate({
            scrollTop: $("html,body").offset().top
        },
        'slow');
    // var linkInfo = {rel: "icon", type: "image/jpg", href: "images/fav_icon.jpg"};
    // DocHead.addLink(linkInfo);
    // if(FlowRouter.subsReady()){
    //
    //     SEO.set({
    //         title: "test4",
    //         description: "this is my test 4",
    //         meta: {
    //             'property="og:image"': post.image,
    //             'name="twitter:image"': post.image
    //         }
    //     });
    // }
    $(document).ready(function () {

        // DocHead.setTitle("Overseas Travel Photography Tours and Post Processing Workshops");
        // document.title = "Overseas Travel Photography Tours and Post Processing Workshops";
        // console.log($('meta[name=description]').text())
        // $('meta[name=description]').attr('content', 'We are professional photography instructors that provides basic photography course and conduct travel workshops with post processing knowledge in Singapore.');
        // $("head").append(" <meta property='article:publisher' content=' http://www.facebook.com/unusualexpedition' > ");
        // $("head > meta:nth-child(22)").context.title=" we are professional photography instructors that provides basic photography course and conduct travel workshops with post processing knowledge in Singapore"

    });
    //set title and meta tag for upcoming tour
    // DocHead.setTitle("help");
    // DocHead.addMeta({name: "description", content: "FlowRouter SSR is Awesome"});
});

Template.upcomingtour.helpers({
    data: function () {
        var data = this;
        if (FlowRouter.subsReady()) {
            DocHead.setTitle(MySeo.findOne().upcomingtour.title);
            MySeo.findOne().upcomingtour.metaInfo.each(function (item) {
                var metaInfo = {name: item.name, content: item.content};
                DocHead.addMeta(metaInfo);
            })
        }

        var trip = data.map(function (item) {
            if ((new Date()).isBefore(item['tourDateEnd'])) {
                return item['trip']
            }
        });

        if (trip[0]) {
            //check all is tour
            var allistour = Tour.find({_id: {$nin: trip}}, {sort: {"createdAt": -1}}).fetch();
            if (allistour[0]) {
                return allistour;
            }
            else {
                //return Tour.find({}, {sort: {"createdAt": -1}}).fetch();
            }
        }
        return Tour.find({}, {sort: {"createdAt": -1}}).fetch();
    },

    check: function () {

    },

    travel: function () {
        var travel = Travel.find({}, {sort: {"createdAt": -1}}).fetch().map(function (item) {
            if ((new Date()).isBefore(item['tourDateEnd']) && (item['cancelTour'] || '') !== true) {
                return item;
            }
            return ''
        }).remove('');
            travel.forEach(function (item) {
                item['rawTour'] = Tour.find({_id: item['trip']}).fetch();
            });
            return travel;
    },


    tripontravel: function (data) {
        return Tour.find({}, {sort: {"createdAt": -1}}).fetch();
    },


})
