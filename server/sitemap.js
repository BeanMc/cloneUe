/**
 * Created by HuycongNguyen on 2/13/2017.
 */

// var metafetch = Npm.require('metafetch');
//
// metafetch.fetch('http://dev.chord:4500/singapore/viewtour?id=DHHPevfTg2uYWbBDk&tripid=wNNQ5CGkzLrTrmz7N', function(err, meta) {
//     console.log('title: ', meta.title);
//     console.log('description: ', meta.description);
//     // console.log('type: ', meta.type);
//     // console.log('url: ', meta.url);
//     // // console.log('siteName: ', meta.siteName);
//     // console.log('charset: ', meta.charset);
//     // console.log('image: ', meta.image);
//     // console.log('meta: ', meta.meta);
//     // console.log('images: ', meta.images);
//     // console.log('links: ', meta.links);
// });

sitemaps.add('/sitemap.xml', function () {
    // required: page
    // optional: lastmod, changefreq, priority, xhtmlLinks, images, videos
    var homeImage=(Imagehome.findOne().imageView.map(function (item) {
        return {loc: '/cfs/files/image/' + item};
    }));
    homeImage.push({loc: '/images/D3_3549-1024x576.jpg'}, {loc: '/images/uephoto01.jpg'}, {loc: 'images/TRIP15-20150212-1678.jpg'}, {loc: '/images/TRIP15-20150824-6804-1024x683.jpg'}, {loc: '/images/xet1Z1L.jpg'}, {loc: '/images/NIv4Dzn.jpg'});
   var upcomingtour=Tour.find().fetch().map(function (item) {
       if(item.DayPlan.planNumberDay[0].Daydescriptions){
           return {loc:'/cfs/files/image/'+item.DayPlan.planNumberDay[0].Daydescriptions[0]};
       }
       return '';
   }).remove('');

    var portfolio=Imagegallery.findOne().imageView.map(function (item) {
        return {loc:'/cfs/files/image/'+item};
    });

    return [
        {
            page: '/',
            lastmod: new Date(),
            changefreq: 'monthly',
            images:homeImage,
            videos: [
                {
                    loc: Linkvideo.findOne().linkVideo,    // Below properties are optional
                    // thumbnail_loc: "..", title: "..", description: ".."
                }
            ]
        },
        {
            page: '/singapore/upcomingtour',
            lastmod: new Date(),
            changefreq: 'monthly',
            images: upcomingtour,

        },
        {
            page: '/singapore/portfolio',
            lastmod: new Date(),
            changefreq: 'monthly',
            images: portfolio,
        },
        {
            page: '/singapore/travel-blog',
            lastmod: new Date(),
            changefreq: 'monthly',
            images: Article.find().fetch().map(function (item) {
                return {loc: '/cfs/files/image/' + item.Thumbnail[0],
                    caption:item.Synopsis, title:item.Title,
                };
            }),
        },

        {
            page: '/singapore/about-us',
            lastmod: new Date(),
            changefreq: 'monthly',
            images: Article.find().fetch().map(function (item) {
                return {loc: '/cfs/files/image/' + item.Thumbnail[0],
                    caption:item.Synopsis, title:item.Title,
                };
            }),
        },












    ];
});


