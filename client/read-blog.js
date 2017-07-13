
Meteor.startup(function () {
   if(Meteor.isClient){
       window.fbAsyncInit = function() {
           FB.init({
               appId      : '1866910563560022',
               status     : true,
               xfbml      : true,
               version    : 'v2.9'
           });
       };
   }
});

Template.readblog.onRendered(function () {
    $('html,body').animate({
            scrollTop: $("html,body").offset().top
        },
        'slow');
    // console.log("he",Meta);


});

Template.readblog.helpers({
    datahref:function () {
        FB.ui(
            {
                method: 'feed'
            }
        );

      if(window.location.href){
          return window.location.href;
      }
    },
    timeFomat: function (time) {
        return new Date(time).format('{Dow}  {dd}/{MM}/{yy}');
    },

    view: function () {
        if (Article.find({myarticle: true}).fetch()[0]) {
            console.log(((Article.find({myarticle: true}).fetch())[0]).Title);
            Meta.config({
                options: {
                    title: ((Article.find({myarticle: true}).fetch())[0]).Title,
                    suffix: "UNUSUAL EXPEDITION",
                    namespace: "project"
                }
            });
            Meta.setTitle(((Article.find({myarticle: true}).fetch())[0]).Title);
            Meta.set({
                name: 'property',
                property: 'og:url',
                content: window.location.href
            });
            Meta.set({
                name: 'property',
                property: 'og:title',
                content: ((Article.find({myarticle: true}).fetch())[0]).Title
            });
            Meta.set({
                name: 'property',
                property: 'og:description',
                content: ((Article.find({myarticle: true}).fetch())[0]).Synopsis
            });
            // console.log("hello",window.location.origin +"/cfs/files/image/" +((Article.find({myarticle: true}).fetch())[0]).Thumbnail[0]);
            Meta.set({
                name: 'property',
                property: 'og:image',
                content: window.location.origin +"/cfs/files/image/" +((Article.find({myarticle: true}).fetch())[0]).Thumbnail[0],
            });
        }
        // if(Article.findOne({_id:(FlowRouter.getQueryParam('id'))})){
        //     DocHead.setTitle(Article.findOne({_id:(FlowRouter.getQueryParam('id'))}).homePage.title);
        //     Article.findOne({_id:(FlowRouter.getQueryParam('id'))}).homePage.metaInfo.each(function (item) {
        //         var metaInfo = {name: item.name, content: item.content};
        //         console.log(metaInfo);
        //         DocHead.addMeta(metaInfo);
        //     })
        //
        // }
        // if(Seo.findOne()){
        //     DocHead.setTitle(Seo.findOne().homePage.title);
        //     Seo.findOne().homePage.metaInfo.each(function (item) {
        //         var metaInfo = {name: item.name, content: item.content};
        //         console.log(metaInfo);
        //         DocHead.addMeta(metaInfo);
        //     })
        //
        //
        // }

        return Article.find({myarticle: true}).fetch();
    },
    lastest: function () {
        return Article.find({}, {sort: {"createdAt": -1}, limit: 4}).fetch();
    }

})


