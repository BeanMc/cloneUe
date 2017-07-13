Meteor.publish('tour', function () {
    return Tour.find();
});

Meteor.publish('coupon', function () {
    return Coupon.find();
});
Meteor.publish('mySeo', function () {
    return MySeo.find();
});


Meteor.publishComposite("touron", function () {
    var trip = Travel.find({});
    var tourtrip = trip.fetch().map(function (item) {
        return item['trip'];
    });


    return {
        find: function () {
            return Tour.find({});
        },
        children: [
            {
                find: function () {
                    return Travel.find();

                }
            },

        ]
    }
});

Meteor.publish('viewtrip', function () {
    return Travel.find({});
});
// Meteor.publish('viewtour',function (id) {
//     return Tour.find({_id:id});
// })


Meteor.publishComposite("viewtour", function () {
    return {
        find: function () {
            return Tour.find({}, {
                transform: function (tour) {
                    tour.myarticle = true;
                    return tour;
                }
            })
        },
        children: [
            {
                find: function () {
                    return Tour.find({}, {sort: {"createdAt": -1}, limit: 7});
                }
            }
        ]
    }
});

Meteor.publish('image', function () {
    return MyImage.find();
});


Meteor.publish('imagehome', function () {
    return Imagehome.find();
});


Meteor.publish('imagegallery', function () {
    return Imagegallery.find();
});

Meteor.publish('article', function (page) {
    if (!page) {
        page = 1
    }
    // var a=Article.find({},{sort:{"createdAt":-1},limit:3});
    return Article.find({}, {sort: {"createdAt": -1}, limit: page * 9});
});


Meteor.publish('videohome', function () {
    return Linkvideo.find();
});
// Meteor.publish('view')


Meteor.publishComposite('read-blog', function (id) {
    return {
        find: function () {
            return Article.find({_id: id}, {
                transform: function (article) {
                    article.myarticle = true;
                    return article;
                }
            })
        },
        children: [
            {
                find: function () {
                    return Article.find({}, {sort: {"createdAt": -1}, limit: 5});
                }
            }
        ]
    }
});


