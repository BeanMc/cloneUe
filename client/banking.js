/**
 * Created by CongNguyen on 6/6/2017.
 */

Template.banking.helpers({
    deposit:function () {
        if(Travel.findOne(FlowRouter.getParam("id"))){
            if((Travel.findOne(FlowRouter.getParam("id")).fullPaymentDueDate).isBefore('today')){
                return FlowRouter.getParam('_amount')
            }
            return Travel.findOne(FlowRouter.getParam("id")).depositPayable;
        }
    }
});
