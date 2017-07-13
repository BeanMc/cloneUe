var coupon = new ReactiveVar('');
var totalPrice = new ReactiveVar($('#tourMainPrice0').val());
var getCoupon = new ReactiveVar(0);
var firstname = new ReactiveVar('');
var lastname2 = new ReactiveVar('');


Template.viewtour.events({
    'keyup #valueDiscount': function () {
        coupon.set($('#valueDiscount').val());
    },


    'click .w-dropdown': function () {
        // $('.day-plan-details').dropdown();

    },

    'click #scrollBook': function () {
        $('html,body').animate({
                scrollTop: $("#formBooking").offset().top
            },
            'fast');
    },

    'click #day-plan': function (e, t) {
        $('html,body').animate({
                scrollTop: $("#dayplanning").offset().top
            },
            'fast');
    },
    'click #trip-inclusion': function () {
        $('html,body').animate({
                scrollTop: $("#trip-inclusion2").offset().top
            },
            'fast');
    },
    'click #trip-exclusion': function () {
        $('html,body').animate({
                scrollTop: $("#trip-exclusion2").offset().top
            },
            'fast');
    },
    'click #hotel': function () {
        $('html,body').animate({
                scrollTop: $("#accommodation").offset().top
            },
            'fast');
    },

    'click #dinning': function () {
        $('html,body').animate({
                scrollTop: $("#accommodation").offset().top
            },
            'fast');
    },
    'click #flight-suggestion': function () {
        $('html,body').animate({
                scrollTop: $("#signature-dining").offset().top
            },
            'fast');
    },
    'click #price': function () {
        $('html,body').animate({
                scrollTop: $(".flight-time-inf").offset().top
            },
            'fast');
    },

    'click #bookingNavi': function () {
        $('html,body').animate({
                scrollTop: $("#bookingdiv").offset().top
            },
            'fast');
    },
    //termandcon
    'click #terms': function () {
        $('html,body').animate({
                scrollTop: $("#termandcondiv").offset().top
            },
            'fast');
    },
    'click .w-dropdown-toggle': function () {
        $('.dropdown-dayplan-list').slideToggle(500);
    },
    'click .w-slider-arrow-left': function (e, t) {
        var now = $('#slideimage').children('div :visible');
        var last = $('#slideimage').children('div :last');
        var prev = now.prev();
        prev = prev.index() === -1 ? last : prev;
        now.fadeOut(1000, function () {

            prev.fadeIn(1000)
        })
    },

    'click .w-slider-arrow-right': function (e, t) {
        var now = $('#slideimage').children('div :visible');
        var first = $('#slideimage').children('div :first');
        var next = now.next();
        next = next.index() == -1 ? first : next;
        now.fadeOut(1000, function () {
            // next.css({"display":"block"})
            next.fadeIn(1000)
        })
    },


    'click #divMainPrice': function () {
        var all = this;
        if (all.tourPrice.Rate) {
            var rateMainCount = all.tourPrice.Rate.count()
            var mainPrice1 = 0;
            for (var i = 0; i < rateMainCount; i++) {
                if ($("#tourMainPrice" + i).is(":checked")) {
                    // mainRate +=all.tourPrice.Rate[i].tourRateNote + '  ';
                    // mainPrice += all.tourPrice.Rate[i].tourRateIn ;
                    mainPrice1 = i;
                }
            }
        }

        var optionalPrice = 0;
        if (all.tourPrice.optionalTour) {
            var rateCount = all.tourPrice.optionalTour.count()
            for (var i = 0; i < rateCount; i++) {
                if ($("#Optional" + i).is(":checked")) {
                    // optionalRate +=all.tourPrice.optionalTour[i].optionalTourRateInNote + '  ';
                    optionalPrice += all.tourPrice.optionalTour[i].optionalTourRateIn;
                }
            }
        }
        totalPrice.set(all.tourPrice.Rate[mainPrice1].tourRateIn + optionalPrice);
    },

    'click #optional_rate': function (e, t) {
        var all = Travel.find({_id: FlowRouter.getQueryParam('id')}).fetch()[0];
        if (all.tourPrice.Rate) {
            var rateMainCount = all.tourPrice.Rate.count();
            var mainPrice1 = 0;
            for (var i = 0; i < rateMainCount; i++) {
                if ($("#tourMainPrice" + i).is(":checked")) {
                    mainPrice1 = i;
                }
            }
        }

        var optionalPrice = 0;
        if (all.tourPrice.optionalTour) {
            var rateCount = all.tourPrice.optionalTour.count();
            for (var i = 0; i < rateCount; i++) {
                if ($("#Optional" + i).is(":checked")) {
                    optionalPrice += all.tourPrice.optionalTour[i].optionalTourRateIn;
                }
            }
        }

        totalPrice.set(all.tourPrice.Rate[mainPrice1].tourRateIn + optionalPrice);
    },
    'click #bookingbutton': function (e, t) {
        var all = this;

        var merchant_id = "";
        var key = "";
        if ($(e.target).attr("method") === "bookviavisa") {
            merchant_id = "0000021474";
            key = "716fd56c3699eaa34aaa9f15bbf10cde7a6a1604";
        }
        else if ($(e.target).attr("method") === "bookviaunion") {
            merchant_id = "0000021476";
            key = "7c96bc5cd1a28e5e9871211009b068888a4b479f";
        }
        else {

        }


        //check exist email
        if ($("#PassportNo").val() && $("#email").val() && $("#firstname").val() && $('#lastname').val() && $('#nationality').val()
            && $("#Dateofbird").val() && $("#Address1").val() && $("#Address2").val() && $("#City").val() && $("#Zip").val() && $("#Country").val() && $("#KinPhone").val()
            && $("#PhoneCountryCode").val() && $("#Phone").val() && $("#PassportCountry").val() && $("#PassportExpiryDate").val() && $("#KinName").val() && $("#KinRelationship").val()
        ) {
            var passport = $("#PassportNo").val();
            Meteor.call('checkPassport', passport, all._id, function (err, res) {
                if (err || (!res)) {
                    alert("This passport was used, pls use another passport to register.thanks!");
                    $("#PassportNo").css({"border": "1px solid red"});
                }
                else {
                    var travel = all._id;
                    var amount = all.depositPayable;
                    //get value of optinal
                    if (all.tourPrice.optionalTour) {
                        var rateCount = all.tourPrice.optionalTour.count();
                        var optionalRate = '';
                        var optionalPrice = [];
                        for (var i = 0; i < rateCount; i++) {
                            if ($("#Optional" + i).is(":checked")) {
                                optionalPrice.push(i);
                            }
                        }
                    }
                    //get main rate price and note
                    if (all.tourPrice.Rate) {
                        var rateMainCount = all.tourPrice.Rate.count();
                        var mainRate = '';
                        var mainPrice = 0;
                        for (var i = 0; i < rateMainCount; i++) {
                            if ($("#tourMainPrice" + i).is(":checked")) {
                                mainPrice = i;
                            }
                        }
                    }
                    //code discount and check
                    var allPriceDiscount = {};
                    // -----------------------------------
                    allPriceDiscount.discountCode = '';


                    //
                    Coupon.find().fetch().forEach(function (item) {
                        if (item.code == coupon.get() && (item.tourOn.findIndex(FlowRouter.getQueryParam('id')) > -1)) {
                            console.log(item._id);
                            allPriceDiscount.discountCode = item._id;
                        }
                    });
                    allPriceDiscount.optionalPrice = optionalPrice;
                    allPriceDiscount.mainPrice = mainPrice;
                    allPriceDiscount.idOfTour = all._id;


                    var indexMeal = all.meal.count();
                    var mealOrder = '';
                    for (var j = 0; j < indexMeal; j++) {
                        if ($('#mealradio' + j).is(':checked')) {
                            mealOrder += "/" + all.meal[j];
                        }
                    }
                    Meteor.call('checkPriceAndDiscount', allPriceDiscount, function (err, res) {
                        if (err) {
                            console.log(err)
                        }
                        //test deposit $0
                        var couponPrice = 0;
                        if (res.discountCode) {
                            var rawcoupon = Coupon.findOne({_id: res.discountCode});
                            if (rawcoupon.status == true && rawcoupon.status == true && rawcoupon.discountStartDate.isBefore(new Date()) && rawcoupon.discountEndDate.isAfter(new Date())) {
                                if (rawcoupon.discountType == 'flat') {
                                    couponPrice = rawcoupon.discountValue;
                                }
                                else {
                                    couponPrice = ((res.mainPrice + res.optionalPrice) * (rawcoupon.discountValue / 100));
                                }
                            }
                        }
                        var amout = res.mainPrice + res.optionalPrice - couponPrice;
                        //---------------------------------------
                        // about tour customers booking
                        var bookingHistory = {};
                        // bookingHistory.idTour = all._id;
                        // bookingHistory.mainRateNote = mainRate;
                        // bookingHistory.mainPrice = mainPrice;
                        // bookingHistory.optionalNote = optionalRate;
                        // bookingHistory.optionalPrice = optionalPrice;
                        Meteor.call('addcustomers', $("#email").val(), $("#firstname").val(), $("#lastname").val(),
                            new Date($('#Dateofbird').val()),
                            $("#Male").val() === "Male" ? "Male" : "Female",
                            $('#nationality').find(":selected").text(),
                            $("#Address1").val(),
                            $("#Address2").val(),
                            $('#Country').find(":selected").text(),
                            $("#Zip").val(),
                            $("#Phone").val(),
                            $("#PassportNo").val(),
                            $('#PassportCountry').find(":selected").text(),
                            $("#PassportExpiryDate").val(),//PassportExpiryDate
                            mealOrder,
                            $('#Extrafield').val(),
                            $('#commentRequest').val(),
                            res,
                            $('#KinName').val(),
                            $('#KinRelationship').val(),
                            $('#KinPhone').val(),
                            $('#PhoneCountryCode').val(),
                            $('#agentcode').val(),
                            $(e.target).attr("method"),//method payment
                            function (err, res) {
                                var arr = {
                                    first_name:$("#firstname").val(),
                                    last_name:$("#lastname").val(),
                                    email:$("#email").val(),
                                    order_number: Random.id(5),
                                    // merchant_id: '0000021476',
                                    merchant_id: merchant_id,
                                    currency_code: 'SGD',
                                    transaction_type: 'Sale',
                                    key: key,
                                    // key: '7c96bc5cd1a28e5e9871211009b068888a4b479f',
                                    //---------------------------------------link return-------------------------------------------
                                    return_url: window.location.origin + "/rdp",
                                    //---------------------------------------link return-------------------------------------------
                                    amount: amount,
                                    merchant_data1: res,
                                    merchant_data2: $('#valueDiscount').val(),
                                    merchant_data3: bookingHistory.optionalNote,//optional of tour
                                    merchant_data4: travel,
                                    merchant_data5: bookingHistory.mainPrice + bookingHistory.optionalPrice,//this is total price of optional tour rate and main tour rate
                                };
                                if (res) {
                                    if ($(e.target).attr("method") === "bookviabank") {
                                        Meteor.call('payByBank', arr, $("#email").val(), function (err, res) {
                                            window.location.assign(window.location.origin + '/singapore/banking/'+FlowRouter.getQueryParam("id")+'/'+res);
                                        });
                                    }
                                    else {
                                        // Meteor.call("recordCustomer", res, travel, function (res, err) {
                                        // });paybyvisa


                                        Meteor.call('paybyvisa', arr, $("#email").val(), function (err, res) {
                                            // window.location.assign(window.location.origin + '/singapore/banking');
                                            if (all.depositPayable === 0 || (all.fullPaymentDueDate).isBefore('today')) {
                                                arr.amount = amout;
                                                window.location.assign('https://connect.reddotpayment.com/merchant/cgi-bin-live?' + Object.toQueryString(arr))
                                            }
                                            // window.location.assign('https://connect.reddotpayment.com/merchant/cgi-bin-live?' + Object.toQueryString(arr))
                                            Meteor.call('signature',arr,function (err, res) {
                                                console.log('https://connect.reddotpayment.com/merchant/cgi-bin-live?' + res);
                                                 window.location.assign('https://connect.reddotpayment.com/merchant/cgi-bin-live?' + res);
                                            })
                                        });
                                    }
                                }
                            });
                    });
                }
            });
        }
        else {
            alert("some data fields is require!!");
            (!$("#PassportNo").val()) ? $("#PassportNo").css({"border": "1px solid red"}) : '';
            (!$("#email").val()) ? $("#email").css({"border": "1px solid red"}) : '';
            (!$("#firstname").val()) ? $("#firstname").css({"border": "1px solid red"}) : '';
            (!$("#lastname").val()) ? $("#lastname").css({"border": "1px solid red"}) : '';
            (!$("#nationality").val()) ? $("#nationality").css({"border": "1px solid red"}) : '';
            (!$("#Dateofbird").val()) ? $("#Dateofbird").css({"border": "1px solid red"}) : '';
            (!$("#Address1").val()) ? $("#Address1").css({"border": "1px solid red"}) : '';
            (!$("#Address2").val()) ? $("#Address2").css({"border": "1px solid red"}) : '';
            (!$("#City").val()) ? $("#City").css({"border": "1px solid red"}) : '';
            (!$("#Zip").val()) ? $("#Zip").css({"border": "1px solid red"}) : '';
            (!$("#Country").val()) ? $("#Country").css({"border": "1px solid red"}) : '';
            (!$("#PhoneCountryCode").val()) ? $("#PhoneCountryCode").css({"border": "1px solid red"}) : '';
            (!$("#Phone").val()) ? $("#Phone").css({"border": "1px solid red"}) : '';
            (!$("#PassportCountry").val()) ? $("#PassportCountry").css({"border": "1px solid red"}) : '';
            (!$("#PassportExpiryDate").val()) ? $("#PassportExpiryDate").css({"border": "1px solid red"}) : '';
            (!$("#KinName").val()) ? $("#KinName").css({"border": "1px solid red"}) : '';
            (!$("#KinRelationship").val()) ? $("#KinRelationship").css({"border": "1px solid red"}) : '';
            (!$("#KinPhone").val()) ? $("#KinPhone").css({"border": "1px solid red"}) : '';

        }
    },

    'keyup #firstname': function () {
        firstname.set($('#firstname').val());
    },
    'keyup #lastname': function () {
        lastname2.set($('#lastname').val());
    },

});

Template.viewtour.helpers({
    coupon: function () {
        var total = $('#tourMainPrice0').val();
        if (totalPrice.get()) {
            total = totalPrice.get();
        }
        var result = '';
        var price;
        if (coupon.get()) {
            Coupon.find().fetch().forEach(function (item) {
                if (item.code == coupon.get() && (item.tourOn.findIndex(FlowRouter.getQueryParam('id')) > -1) && item.status == true &&
                    item.discountStartDate.isBefore(new Date()) && item.discountEndDate.isAfter(new Date())
                ) {
                    if (item.discountType == 'flat') {
                        price = total - (item.discountValue) > 0 ? (total - (item.discountValue)) : 0;
                        result = '<div class="view-tour-minus-sign">-</div><div class="coupon-deduction view-tour-total-price">$' + item.discountValue + ' </div> <div class="view-tour-minus-sign">=</div> <div class="view-tour-total-price" id="couponAmount">$' + price + '</div>';
                    }
                    else {
                        price = total * ((100 - item.discountValue) / 100) > 0 ? total * ((100 - item.discountValue) / 100) : 0;
                        result = '<div class="view-tour-minus-sign">-</div><div class="coupon-deduction view-tour-total-price" >' + item.discountValue + '%</div> <div class="view-tour-minus-sign">=</div> <div class="view-tour-total-price" id="couponAmount">$' + price + '</div>';

                    }
                }
            })
        }

        return result;
    },

    data: function (travel, trip) {
        //set title meta description
        if (FlowRouter.subsReady() && Tour.findOne({_id: FlowRouter.getQueryParam('tripid')}).homePage) {
            DocHead.setTitle(Tour.findOne({_id: (FlowRouter.getQueryParam('tripid'))}).homePage.title);
            Tour.findOne({_id: (FlowRouter.getQueryParam('tripid'))}).homePage.metaInfo.each(function (item) {
                var metaInfo = {name: item.name, content: item.content};
                DocHead.addMeta(metaInfo);
            })
        }
        return {
            travel: travel,
            trip: trip
        }
    },
    selectFirstMainRate: function (index) {
        if (index === 0) return 'checked';
    },
    data1: function () {
        var queryid = FlowRouter.getQueryParam('tripid');
        if (queryid) {
            return Tour.findOne({_id: queryid});
        }
    },

    travel: function () {
        return Travel.find({_id: FlowRouter.getQueryParam('id')}).fetch()[0];
    },
    other: function () {


        var a = Travel.find({}, {sort: {"createdAt": -1}}).fetch().map(function (item) {

            if (item['tourDateStart'].isBefore('today')) {
                return '';
            }
            else if (item['earlyBookDueDate'].isBefore('today') || (item.peopleInTravel ? item.peopleInTravel : []).count() >= item.maximum) {
                return '';
            }
            return item;
        });

        return a.remove('');
    },

    getMap: function (data) {
        if (data) {
            return data.replace("600", "800");
        }
        return 1;
    },

    image: function (data) {
        var b = [];
        data['planNumberDay'].forEach(function (item) {
            b.push.apply(b, item['Daydescriptions']);
        });
        return b;
    },

    plan: function () {
        if (this && this['DayPlan']) {
            return this['DayPlan']['planNumberDay'].map(function (item) {
                return item['Daytitle']
            })
        }
    },
    tourAvailabilitys: function () {
        if (this['tourAvailability'] === "true") {
            return true;
        }
        return false;
    },

    datetime: function (data) {
        if (data) {
            return (data.getDate() ) + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
        }
    },

    totalPriveTour: function (data) {
        var rate = 0;
        var all = this;
        if (all.tourPrice.Rate) {
            var rateMainCount = all.tourPrice.Rate.count()
            var mainPrice1 = 0;
            for (var i = 0; i < rateMainCount; i++) {
                if ($("#tourMainPrice" + i).is(":checked")) {
                    mainPrice1 = i;
                }
            }
        }
        if (totalPrice.get()) {
            return totalPrice.get();
        }
        return all.tourPrice.Rate[mainPrice1].tourRateIn;
    },
    firstname: function () {
        return firstname.get();
    },
    lastname: function () {
        return lastname2.get();
    }

});

Template.viewtour.onRendered(function () {
    $('html,body').animate({
            scrollTop: $("html,body").offset().top
        },
        'fast');
    Tracker.autorun(function () {
        // console.log("Is myPost ready?:", FlowRouter.subsReady("myPost"));
        // console.log("Are all subscriptions ready?:", FlowRouter.subsReady());
        // if(FlowRouter.subsReady()){
        //     $('head').append('<title> aaaaaaaaaaaaaaa</title>')
        // }
    });

});