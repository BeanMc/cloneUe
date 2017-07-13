/**
 * Created by HuycongNguyen on 12/17/2016.
 */
Template.othertour.helpers({
    imageAvailable:function (data) {
        return Tour.find({_id:data}).fetch()[0]['DayPlan']['planNumberDay'][0]['Daydescriptions'][0];
    },
    name:function (data) {
        return Tour.find({_id:data}).fetch()[0]['tourName'];
    }
});