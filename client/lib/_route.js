/**
 * Created by lvhln on 10/1/2016.
 */

FlowRouter.route('/', {
    action: function (params, queryParams) {

        window.location.assign('/singapore');
    },
});

FlowRouter.route('/singapore', {
    action: function (params, queryParams) {
        BlazeLayout.render('layout', {main: 'home', footer: 'footer'});
    },
    subscriptions: function (params, queryParams) {
        // console.log("this route");
        this.register('imagehome', Meteor.subscribe('imagehome'));
        this.register('videohome', Meteor.subscribe('videohome'));
        this.register('image', Meteor.subscribe('image'));
        this.register('seo', Meteor.subscribe('seo'));
    }

});

FlowRouter.route('/index', {
    action: function (params, queryParams) {
        BlazeLayout.render('layout', {main: 'home', footer: 'footer'});

    },
    subscriptions: function (params, queryParams) {
        // console.log("this route");
        this.register('imagehome', Meteor.subscribe('imagehome'));
        this.register('videohome', Meteor.subscribe('videohome'));
        this.register('image', Meteor.subscribe('image'));
        this.register('seo', Meteor.subscribe('seo'));

    }
});


FlowRouter.route('/singapore/travel-blog', {
    action: function (params, queryParams) {
        // FlowRouter.setParams("/")
        // BlazeLayout.render('home');
        if (!queryParams['page']) {
            FlowRouter.setQueryParams({page: 1})
        }
        BlazeLayout.render('layout', {main: 'travelblog'});

    },
    subscriptions: function (params, queryParams) {
        // console.log("this route");
        this.register('image', Meteor.subscribe('image'));
        this.register('article', Meteor.subscribe('article', queryParams['page']));
        this.register('seo', Meteor.subscribe('seo'));

    }
});


FlowRouter.route('/singapore/read-blog', {
    action: function (params, queryParams) {
        // FlowRouter.setParams("/")
        // BlazeLayout.render('home');
        BlazeLayout.render('layout', {main: 'readblog'});

    },
    subscriptions: function (params, queryParams) {
        // console.log("this route");
        this.register('image', Meteor.subscribe('image'));
        this.register('read-blog', Meteor.subscribe('read-blog', queryParams['id']));
    },
    // triggersExit: [trackRouteClose]
});

// InCredible

FlowRouter.route('/singapore/portfolio', {
    action: function (params, queryParams) {
        // FlowRouter.setParams("/")
        // BlazeLayout.render('home');
        BlazeLayout.render('layout', {main: 'gallery'});


    },
    subscriptions: function (params, queryParams) {
        // console.log("this route");
        this.register('imagegallery', Meteor.subscribe('imagegallery'));
        this.register('image', Meteor.subscribe('image'));
        this.register('seo', Meteor.subscribe('seo'));

    }
});


FlowRouter.route('/singapore/upcomingtour', {
    action: function (params, queryParams) {
        BlazeLayout.render('layout', {main: 'upcomingtour', footer: 'footer'});

    },
    subscriptions: function (params, queryParams) {
        this.register('touron', Meteor.subscribe('touron'));
        this.register('image', Meteor.subscribe('image'));
        this.register('mySeo', Meteor.subscribe('mySeo'));

    }
});


FlowRouter.route('/singapore/viewtour', {
    action: function (params, queryParams) {
        $('body').addClass('background-home')
        BlazeLayout.render('layout', {main: 'viewtour', footer: 'footer'});

    },

    subscriptions: function (params, queryParams) {

        this.register('viewtour', Meteor.subscribe('viewtour'));
        this.register('viewtrip', Meteor.subscribe('viewtrip'));
        this.register('image', Meteor.subscribe('image'));
        this.register('coupon', Meteor.subscribe('coupon'));
    },
    // triggersExit: [trackRouteClose]
    // triggersEnter:[trackRouteEntry]
});
// function trackRouteEntry() {
//     // context is the output of `FlowRouter.current()`
//     if(FlowRouter.subsReady()){
//         console.log(Tour.findOne({_id:(FlowRouter.getQueryParam('tripid'))}));
//
//         if(Tour.findOne({_id:(FlowRouter.getQueryParam('tripid'))})){
//             DocHead.setTitle(Tour.findOne({_id:(FlowRouter.getQueryParam('tripid'))}).homePage.title);
//             Tour.findOne({_id:(FlowRouter.getQueryParam('tripid'))}).homePage.metaInfo.each(function (item) {
//                 var metaInfo = {name: item.name, content: item.content};
//                 console.log(metaInfo);
//                 DocHead.addMeta(metaInfo);
//             })
//         }
//     }
// }


FlowRouter.route('/singapore/about-us', {
    action: function (params, queryParams) {
        // BlazeLayout.render('layout', {main: 'about-us'});
        BlazeLayout.render('layout', {main: 'aboutus', footer: 'footer'});
    },
    subscriptions: function (params, queryParams) {
        this.register('seo', Meteor.subscribe('seo'));

    }
});

FlowRouter.route('/singapore/termsandconditions', {
    action: function (params, queryParams) {
        BlazeLayout.render('layout', {main: 'bookTerm', footer: 'footer'})
    },
    subscriptions: function (params, queryParams) {
        this.register('seo', Meteor.subscribe('seo'));

    }
});
FlowRouter.route('/singapore/banking/:id/:_amount', {
    action: function (params, queryParams) {
        BlazeLayout.render('layout', {main: 'banking', footer: 'footer'})
    },
    subscriptions: function (params, queryParams) {
        this.register('viewtrip', Meteor.subscribe('viewtrip'));
        this.register('seo', Meteor.subscribe('seo'));
    }
});
