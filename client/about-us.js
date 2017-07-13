/**
 * Created by HuycongNguyen on 2/10/2017.
 */

// Template.aboutus.helpers({
//     fixImage:function () {
//         return window.location.origin+'/';
//     },
// });

Template.registerHelper('fixImage', function (data) {
    return window.location.origin+'/';
});
