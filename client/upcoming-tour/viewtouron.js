Template.viewtouron.helpers({
    log: function (data) {
        console.log(data);
    },

    images: function () {
        // console.log(this);
        if (this['rawTour'][0] && this['rawTour'][0]['DayPlan']['planNumberDay'][0]['Daydescriptions']) {
            return this['rawTour'][0]['DayPlan']['planNumberDay'][0]['Daydescriptions'][0];
        }
    },
    datetime: function (data) {
        if (data && FlowRouter.subsReady()) {
            return (data.getDate()) + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
        }
    },
    tourOptions: function (bookDueDate, tourDateStart,tourDateEnd, max, people, fullPaymentDueDate, min, status) {
        // if (tourDateStart.isBefore('today')) {
        //     return '<div class="upcoming-tour-availability upc-ongoing">ON GOING</div>';
        // }
        //bookDueDate.isBefore('today') ||
        if ((((people ? people : []).count(function (item) {
                return item.payment !== 'none' && item.paymentStatus !== 'REFUND';
            }) >= min && fullPaymentDueDate.isBefore('today')) || status === "confirm") && tourDateStart.isAfter('today') && tourDateEnd.isAfter('today') ) {
            return '<div class="upcoming-tour-availability upc-ongoing">CONFIRM DEPARTURE</div>';
        }
        else if (((people ? people : []).count(function (item) {
                return item.payment !== 'none' && item.paymentStatus !== 'REFUND';
            }) <= min) && fullPaymentDueDate.isBefore('today')) {
            return '<div class="upcoming-tour-availability upc-fullybooked">TRIP CLOSED</div>';
        }
        else if ((bookDueDate).daysFromNow() < (-14)) {
            // console.log((bookDueDate).relative()!=="1 weeks from now");
            return '<div class="upcoming-tour-availability upc-available">TRIP CLOSING SOON</div>';
        }
        else if (bookDueDate.isAfter('today') && (bookDueDate).daysFromNow() > (-14)) {
            return '<div class="upcoming-tour-availability upc-available">TRIP AVAILABLE</div>';
        }
        //2 weeks from now
        // return '<div class="upcoming-tour-availability upc-available">TRIP CLOSING SOON</div>';

    },
})