Template.gallery.helpers({
    image: function () {
        if(MySeo.findOne()) {
            DocHead.setTitle(MySeo.findOne().portfolio.title);
            MySeo.findOne().portfolio.metaInfo.each(function (item) {
                var metaInfo = {name: item.name, content: item.content};
                console.log(metaInfo);
                DocHead.addMeta(metaInfo);
            })
        }


        var a = Imagegallery.find({}, {sort: {"createdAt": -1}}).fetch();
        var b = [];
        a.forEach(function (item) {
            //item.imageView
            var getObject = {}
            var getArr = [];
            item['imageView'].forEach(function (item2) {
                if (item2) {
                    getObject = {image: item2, title: item['imageText']};
                    getArr.push(getObject);
                }
            })
            b.push.apply(b, getArr);
        })
        return b;
    },

});

