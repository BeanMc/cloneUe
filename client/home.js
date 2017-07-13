var setText = new ReactiveVar('');
var setLink = new ReactiveVar('');
Template.home.helpers({

    // setButton:function (text) {
    //     setText.set(text);
    // },
    getTextButton:function () {


      return setText.get();
    },
    getLinkButton:function () {
        return setLink.get();
    },

    image: function () {
        if(MySeo.findOne()){
            DocHead.setTitle(MySeo.findOne().homePage.title);
            MySeo.findOne().homePage.metaInfo.each(function (item) {
                var metaInfo = {name: item.name, content: item.content};
                console.log(metaInfo);
                DocHead.addMeta(metaInfo);
            })

        }




        var a = Imagehome.find({}, {sort: {"createdAt": -1}}).fetch();

        var b = [];
        a.forEach(function (item) {
            if (item['imageView']) {
                item['imageView'].forEach(function (item2) {
                        b.push({view:item2,link:item.redirectTo,text:item.imageText});
                });
            }
        });
        if(b[0]){
            // console.log(b[0]);
            setText.set(b[0].text);
            setLink.set(b[0].link);
        }

        return b;
    },


    video: function () {
        if (Linkvideo.findOne()) {
            return (Linkvideo.findOne()['linkVideo']);
        }
    },
})

Template.home.events({
    'click .w-slider-arrow-left': function (e, t) {
        var now = $('#slideimagehome').children('div :visible');
        var last = $('#slideimagehome').children('div :last');
        var prev = now.prev();
        prev = prev.index() === -1 ? last : prev;
        //set button
        setText.set(prev.attr('text'));
        setLink.set(prev.attr('link'));
        now.fadeOut(1000, function () {
            prev.fadeIn(1000)
        })
    },
    'click .w-slider-arrow-right': function (e, t) {
        var now = $('#slideimagehome').children('div :visible');
        var first = $('#slideimagehome').children('div :first');
        var next = now.next();
        next = next.index() == -1 ? first : next;
        //set text button
        setText.set(next.attr('text'));
        setLink.set(next.attr('link'));
        now.fadeOut(1000, function () {
            // next.css({"display":"block"})
            next.fadeIn(1000)
        })
    },


});


Template.home.onRendered(function () {
    Meta.config({
        options: {
            title: "UNUSUAL EXPEDITION",
            suffix: "",
            namespace: "project"
        }
    });
    Meta.setTitle("UNUSUAL EXPEDITION");


    $(function () {
        $('a[href*="#"]:not([href="#"])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 2000);
                    return false;
                }
            }
        });
    });


    $('html,body').animate({
            scrollTop: $("html,body").offset().top
        },
        'slow');

})
