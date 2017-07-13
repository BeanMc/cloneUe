// /**
//  * Created by lvhln on 10/1/2016.
//  */
//
// FlowRouter.route('/', {
//     action: function (params, queryParams) {
//
//         window.location.assign('/singapore');
//     },
// })
// FlowRouter.route('/singapore', {
//     action: function (params, queryParams) {
//         BlazeLayout.render('layout', {main: 'home', footer: 'footer'});
//
//     },
//     subscriptions: function (params, queryParams) {
//         // console.log("this route");
//         this.register('imagehome', Meteor.subscribe('imagehome'));
//         this.register('videohome', Meteor.subscribe('videohome'));
//         this.register('image', Meteor.subscribe('image'));
//     }
//
// })
//
// FlowRouter.route('/index', {
//     action: function (params, queryParams) {
//         BlazeLayout.render('layout', {main: 'home', footer: 'footer'});
//
//     },
//     subscriptions: function (params, queryParams) {
//         // console.log("this route");
//         this.register('imagehome', Meteor.subscribe('imagehome'));
//         this.register('videohome', Meteor.subscribe('videohome'));
//         this.register('image', Meteor.subscribe('image'));
//     }
// })
//
//
// FlowRouter.route('/singapore/travel-blog', {
//     action: function (params, queryParams) {
//         // FlowRouter.setParams("/")
//         // BlazeLayout.render('home');
//         if (!queryParams['page']) {
//             FlowRouter.setQueryParams({page: 1})
//         }
//         BlazeLayout.render('layout', {main: 'travelblog'});
//
//     },
//     subscriptions: function (params, queryParams) {
//         // console.log("this route");
//         this.register('image', Meteor.subscribe('image'));
//         this.register('article', Meteor.subscribe('article', queryParams['page']));
//     }
// })
//
//
// FlowRouter.route('/singapore/read-blog', {
//     action: function (params, queryParams) {
//         // FlowRouter.setParams("/")
//         // BlazeLayout.render('home');
//         BlazeLayout.render('layout', {main: 'readblog'});
//
//     },
//     subscriptions: function (params, queryParams) {
//         // console.log("this route");
//         this.register('image', Meteor.subscribe('image'));
//         this.register('read-blog', Meteor.subscribe('read-blog', queryParams['id']));
//     },
//     // triggersExit: [trackRouteClose]
// })
//
// // InCredible
//
// FlowRouter.route('/singapore/portfolio', {
//     action: function (params, queryParams) {
//         // FlowRouter.setParams("/")
//         // BlazeLayout.render('home');
//         BlazeLayout.render('layout', {main: 'gallery'});
//
//     },
//     subscriptions: function (params, queryParams) {
//         // console.log("this route");
//         this.register('imagegallery', Meteor.subscribe('imagegallery'));
//         this.register('image', Meteor.subscribe('image'));
//     }
// })
//
//
// FlowRouter.route('/singapore/upcomingtour', {
//     action: function (params, queryParams) {
//         // BlazeLayout.render('upcoming-tour');
//         BlazeLayout.render('layout', {main: 'upcomingtour', footer: 'footer'});
//
//     },
//     subscriptions: function (params, queryParams) {
//         // console.log("this route");
//         this.register('touron', Meteor.subscribe('touron'));
//         this.register('image', Meteor.subscribe('image'));
//         // this.register('tour',Meteor.subscribe('tour'))
//     }
// });
//
//
// FlowRouter.route('/viewtour', {
//     action: function (params, queryParams) {
//         $('body').addClass('background-home')
//         // BlazeLayout.render('viewtour');
//         BlazeLayout.render('layout', {main: 'viewtour', footer: 'footer'});
//
//
//     },
//     subscriptions: function (params, queryParams) {
//         // console.log("this route");
//         // console.log(queryParams.id);
//         // if(queryParams['tripid']){
//         //     this.register('viewtrip',Meteor.subscribe('viewtrip',queryParams['id']))
//         //     // console.log("true")
//         // }
//         // this.register('viewtour', Meteor.subscribe('viewtour', queryParams['tripid']));
//
//         this.register('viewtour', Meteor.subscribe('viewtour'))
//         this.register('viewtrip', Meteor.subscribe('viewtrip'));
//         this.register('image', Meteor.subscribe('image'));
//     },
//     // triggersExit: [trackRouteClose]
// })
//
// // function trackRouteClose(content) {
// //     $('html,body').animate({
// //
// //             scrollTop: $("html,body").offset().top
// //         },
// //         'slow');
// // }
//
//
// FlowRouter.route('/singapore/about-us', {
//     action: function (params, queryParams) {
//         // BlazeLayout.render('layout', {main: 'about-us'});
//         BlazeLayout.render('layout', {main: 'about-us', footer: 'footer'});
//     },
//     subscriptions: function (params, queryParams) {
//         // console.log("this route");
//         // console.log(queryParams.id);
//         // this.register('tour',Meteor.subscribe('tour',queryParams.id));
//         // this.register('image',Meteor.subscribe('image'));
//     }
// })
//
// FlowRouter.route('/singapore/termsandconditions', {
//     action: function (params, queryParams) {
//         BlazeLayout.render('layout', {main: 'bookTerm', footer: 'footer'})
//     }
// })
