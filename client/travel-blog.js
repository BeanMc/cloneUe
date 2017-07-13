Template.travelblog.onRendered(function () {
    $('html,body').animate({
            scrollTop: $("html,body").offset().top
        },
        'slow');

})

Template.travelblog.helpers({
    tour: function () {
        if(MySeo.findOne()){
            DocHead.setTitle(MySeo.findOne().travelBlog.title);
            MySeo.findOne().travelBlog.metaInfo.each(function (item) {
                var metaInfo = {name: item.name, content: item.content};
                console.log(metaInfo);
                DocHead.addMeta(metaInfo);
            })


        }


        var tour = {};
        var travel = {};
        tour['rawTravel'] = [];
        tour['rawTravel'] = Article.find().fetch() || [];
        tour['length'] = (tour['rawTravel'].count() / 3).ceil();
        tour['next'] = true;
        travel['next'] = true;
        if ((tour['rawTravel'].count()) < (parseInt(FlowRouter.getQueryParam("page")) * 9)) {
            travel['next'] = false;
        }

        travel['rawTravel'] = [];
        for (var i = 1; i <= tour['length']; i++) {
            var arr = tour['rawTravel'].slice((i * 3) - 3, (i * 3));
            travel['rawTravel'].push(arr)
        }
        return travel;
    },


})

Template.travelblog.events({
    "click #nextpage": function () {
        FlowRouter.setQueryParams({"page": ( parseInt(FlowRouter.getQueryParam("page")) + 1)});
    }

})
