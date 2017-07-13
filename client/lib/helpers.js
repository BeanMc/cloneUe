// Template.registerHelper("video",function () {
//
// })

// Meteor.startup(function () {
//    if(Meteor.isClient){
//        SEO = new FlowRouterSEO({database: true});
//        SEO.setDefaults({
//            title: 'Default title',
//            description: 'Default description',
//            meta: {
//                'property="og:type"': 'website',
//                'property="og:site_name"': 'Default site name',
//                'name="twitter:card"': 'summary',
//                'name="twitter:site"': '@TwitterUsername'
//            }
//        });
//    }
// });
Tracker.autorun(function() {
    // console.log("Is myPost ready?:", FlowRouter.subsReady("myPost"));
    // console.log("Are all subscriptions ready?:", FlowRouter.subsReady());
    // if(FlowRouter.subsReady()){
    //     console.log(Tour.findOne({_id:(FlowRouter.getQueryParam('tripid'))}));
    //
    //     if(Tour.findOne({_id:(FlowRouter.getQueryParam('tripid'))})){
    //         DocHead.setTitle(Tour.findOne({_id:(FlowRouter.getQueryParam('tripid'))}).homePage.title);
    //         Tour.findOne({_id:(FlowRouter.getQueryParam('tripid'))}).homePage.metaInfo.each(function (item) {
    //             var metaInfo = {name: item.name, content: item.content};
    //             console.log(metaInfo);
    //             DocHead.addMeta(metaInfo);
    //         })
    //     }
    // }
});


Template.registerHelper('imageSeo', function (data) {
    return Meteor.absoluteUrl('/cfs/files/image/2iKwij29PjMZXfLdT')
});
Template.registerHelper('price', function (data) {
    var rate = 0;
    if (data && data.Rate && !(data['Rate'].isEmpty())) {
        data['Rate'].forEach(function (item) {
            if (!rate || (item['tourRateIn'] < rate)) {
                rate = item['tourRateIn'];
            }
        });

        var optional = 0;

        if (data.optionalTour && !(data.optionalTour.isEmpty()))
            data['optionalTour'].forEach(function (item) {
                if (!optional || (item['optionalTourRateIn'] < optional)) {
                    optional = item['optionalTourRateIn'];
                }
            });
        return (rate + optional);
    }


})

Template.registerHelper('count', function (data,maximum) {
    if (data && data[0]) {

        return maximum -data.count(function (item) {
            return item.payment !== 'none' && item.paymentStatus!=="REFUND";
            });
    }
    return maximum;

});
