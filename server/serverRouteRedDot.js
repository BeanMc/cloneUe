/**
 * Created by HuycongNguyen on 12/9/2016.
 */
Sugar = Npm.require('sugar');

Picker.route('/rdp', function (params, req, response, next) {
    var obj = {};
    (Sugar.String(decodeURIComponent(req['url'])).removeAll(" ").removeAll('/').removeAll("rdp").removeAll('?')).split('&').forEach(function (item) {
        obj[item.split('=')[0]] = item.split('=')[1]
    });
    //calculator signature
    var objSign = {};
    objSign = Object.clone(obj);
    delete objSign['signature'];
    delete objSign['merchant_data1'];
    delete objSign['merchant_data2'];
    delete objSign['merchant_data3'];
    delete objSign['merchant_data4'];
    delete objSign['merchant_data5'];
    var keys = Object.keys(objSign).sort();
    var requestsString = '';
    keys.forEach(function (item) {
        requestsString += item + "=" + objSign[item] + '&';
    });

    //Secret key==========================================
    var secret_key = "15bbf1";
    // var secret_key = "388322";
    //=====================================================
    requestsString += 'secret_key=' + secret_key;
    objSign['signature'] = CryptoJS.MD5(requestsString).toString();
    console.log(requestsString);
    console.log(objSign['signature']);
    console.log(obj['signature']);
    //--------------------------------------------------------
    obj['signature'] = objSign['signature']; // test payment
    //============================================================
    //&& obj['signature'] === objSign['signature']


    //get data about tour
    var data = {};
    data['trip'] = Travel.findOne({_id: obj['merchant_data4']})
    data['trip']['tourPrice']['totalPrice'] = obj['amount'];

    data['travel'] = Tour.findOne({_id: data['trip']['trip']});

    //sucess to depoit

    var rawCustomers = Customers.findOne({_id: obj['merchant_data1']});
    var rawPrice = rawCustomers.historyBook.findAll(function (item) {
        return item.idTour == obj.merchant_data4;
    }).last();
    //check depoit or full payment
    //check customers in tour
    var aboutCustomer = {};
    aboutCustomer = Sugar.Array(data.trip.peopleInTravel).find(function (item) {
        return item.idCustomer == obj['merchant_data1'];
    });

    // var customerPrice = rawPrice.mainPrice + rawPrice.optionalPrice;


    //check coupon
    var couponPrice = 0;
    var coupon = {};
    if (rawPrice.discount) {
        coupon = Coupon.findOne({code: obj.merchant_data2});
        if (coupon) {
            if (coupon.status == true && coupon.status == true && coupon.discountStartDate.isBefore(new Date()) && coupon.discountEndDate.isAfter(new Date())
            ) {
                if (coupon.discountType == 'flat') {
                    couponPrice = coupon.discountValue;
                }
                else {
                    couponPrice = ((rawPrice.mainPrice + rawPrice.optionalPrice) * (coupon.discountValue / 100));
                }
            }
        }
    }

//arr link
    var arr = '';
    var setmerchant_id = '';
    var setkey = '';
    var reUrl = '';
    if (rawPrice.paymentMethod === 'bookviavisa') {
        setmerchant_id = "0000021474";
        setkey = "716fd56c3699eaa34aaa9f15bbf10cde7a6a1604";
    }
    else if (rawPrice.paymentMethod === 'bookviaunion') {
        setmerchant_id = "0000021476";
        setkey = "7c96bc5cd1a28e5e9871211009b068888a4b479f";
    }

    if (process.env.NODE_ENV == 'development') {
        reUrl = 'http://vk1viettel.ddns.me:4500/rdp';
    }
    else {
        reUrl = process.env.ROOT_URL + '/rdp'
    }
    arr = {
        // order_number:  Random.id(5),
        order_number: obj['order_number'],
        merchant_id: setmerchant_id,
        currency_code: obj['currency_code'],
        transaction_type: 'Sale',
        key: setkey,
        return_url: reUrl,
        email: rawCustomers.email,
        first_name: rawCustomers.firstname,
        lastname: rawCustomers.lastname,
        amount: rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice - data.trip.depositPayable,
        merchant_data1: obj.merchant_data1,
        merchant_data2: obj.merchant_data2,//main tour rate
        merchant_data3: rawPrice.optionalNote,//optional of tour
        merchant_data4: obj.merchant_data4,
        merchant_data5: rawPrice.mainPrice + rawPrice.optionalPrice,//this is total price of optional tour rate and main tour rate
    };

//---------------------------payment success------------------------------------1
    if (obj['result'] === 'Paid' && obj['signature'] === objSign['signature']) {
        var linkFullPayment;
        //if deposit
        if ((Sugar.Object(aboutCustomer.raw).isEmpty().raw || aboutCustomer.raw.payment == 'none') && parseInt(obj['amount']) >= data.trip['depositPayable']) {
            // create fullpayment link======================================================

            linkFullPayment = 'https://connect.reddotpayment.com/merchant/cgi-bin-live?' + Object.toQueryString(arr);
            if (aboutCustomer.paymentMethod === 'bookviabank') {
                linkFullPayment = reUrl + '/singapore/banking'
            }
        }


        Meteor.call('paymentSuccess', obj, aboutCustomer, rawCustomers, data, rawPrice, coupon, linkFullPayment);
        Assets.getText('result.html', function (err, res) {
            if (res) {
                SSR.compileTemplate('emailText', res);
                var html = SSR.render('emailText', {
                    result: obj['result'],
                    //tour code
                    tour_code: (data.trip.tourDateStart.format('{MM}')) + (data.trip.tourDateStart.format('{yy}')) + (data.trip.tourDateStart.format('{dd}')) + data.travel.Location + data.trip.tourDateStart.daysAgo(data.trip.tourDateEnd) + 'D' + data.travel.Instructor,
                    email: rawCustomers['email'],
                    passport: rawCustomers['passportNo'],
                    phoneNumber: rawCustomers['phone'],
                    mid: obj['mid'],
                    card_number: obj['card_number'],
                    amount: obj['amount'],
                    transaction_id: obj['transaction_id'],
                    authorization_code: obj['order_number'],
                    linkFullPayment: linkFullPayment,
                });

                // RenderPDF(rawCustomers['email'], rawCustomers.firstname + rawCustomers.lastname, data, html, obj.amount, aboutCustomer, rawCustomers,obj['order_number']);
                response.writeHeader(200, {"Content-Type": "text/html"});
                response.write(html);
                response.end();
            }
        })

    }



    //---------------------------payment error------------------------------------1
    else {
        if (obj['error_code'] == 'CANCEL') {

            Meteor.call('paymentRejected', obj, aboutCustomer, rawCustomers, data, rawPrice, couponPrice, coupon, arr, function (res, err) {
                if (process.env.NODE_ENV == 'development') {
                    response.writeHeader(302, {'Location': 'http://vk1viettel.ddns.me:4500'});
                    // response.write(html);
                    response.end();
                }
                response.writeHeader(302, {'Location': process.env.ROOT_URL});
                // response.write(html);
                response.end();
            });

        }
        else {
            Meteor.call('paymentRejected', obj, aboutCustomer, rawCustomers, data, rawPrice, couponPrice, coupon, arr);
            console.log("----------------------rejected-----------------------------");

            //respose
            Assets.getText('result.html', function (err, res) {
                if (res) {
                    SSR.compileTemplate('emailText', res);
                    var html = SSR.render('emailText', {
                        result: obj['result'],
                        tour_code: (data.trip.tourDateStart.getMonth() + 1) + ((data.trip.tourDateStart.getYear()).toString().substring(1, 4)) + (data.trip.tourDateStart.getDate()) + data.travel.Location + data.trip.tourDateStart.daysAgo(data.trip.tourDateEnd) + 'D' + data.travel.Instructor,
                        email: rawCustomers['email'],
                        passport: rawCustomers['passportNo'],
                        phoneNumber: rawCustomers['phone'],
                        mid: obj['mid'],
                        card_number: obj['card_number'],
                        amount: obj['amount'],
                        transaction_id: obj['transaction_id'],
                        authorization_code: obj['order_number'],
                        name: rawCustomers.firstname,
                        tourname: data['travel'].tourName,
                        dateoftour: data['trip'].tourDateStart.format('{Dow}, {dd}/{MM}/{yyyy} ') + ' - ' + data['trip'].tourDateEnd.format('{Dow}, {dd}/{MM}/{yyyy} '),
                        totalAmout: rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                        deposit: data['trip'].depositPayable,
                    });
                    response.writeHeader(200, {"Content-Type": "text/html"});
                    response.write(html);
                    response.end();
                }
            })


        }

    }

});


Meteor.methods({
    paymentRejected: function (obj, aboutCustomer, rawCustomers, data, rawPrice, couponPrice, coupon, arr) {
        var rejectedCustomers = Sugar.Array(data.trip.peopleInTravel).find(function (item) {
            return item.idCustomer == obj['merchant_data1'];
        });
        //link deposit again
        arr['amount'] = data['trip'].depositPayable;

        var linkdeposit = 'https://connect.reddotpayment.com/merchant/cgi-bin-live?' + Object.toQueryString(arr);
        var indexRejectedCustomers = Sugar.Array(data.trip.peopleInTravel).findIndex(function (item) {
            return item.idCustomer == obj['merchant_data1'];
        });
        //if customers not in tour

        if (indexRejectedCustomers.raw < 0) {
            // console.log("this rejected");
            arr['order_number'] = obj['order_number'];
            Travel.update({_id: obj['merchant_data4']}, {
                $push: {
                    peopleInTravel: {
                        idCustomer: obj['merchant_data1'],
                        email: rawCustomers['email'],
                        request: rawCustomers['request'] || '',
                        room: rawPrice.room,
                        optionalRate: rawPrice.optionalNote,
                        totalPrice: rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                        deposit: data['trip']['depositPayable'],
                        meal: rawCustomers['meal'] || '',
                        extra: rawCustomers['extra'],
                        payment: 'none',
                        paymentStatus: "DEPOSIT FAILED",
                        // firstPayment: obj['amount'],
                        paymentMethod: rawPrice.paymentMethod,
                        order_number: obj['order_number'],
                        // linkFullPayment:linkFullPayment,
                        createdAt: new Date(),
                    }
                }
            });


            //send email fail deposit

            Assets.getText('failpayvisa.html', function (err, res) {
                if (res) {
                    SSR.compileTemplate('emailText', res);
                    var html = SSR.render('emailText', {

                        name: rawCustomers.firstname,
                        tourname: data['travel'].tourName,
                        dateoftour: data['trip'].tourDateStart.format('{Dow}, {dd}/{MM}/{yyyy} ') + ' ' + data['trip'].tourDateEnd.format('{Dow}, {dd}/{MM}/{yyyy} '),
                        totalAmout: rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                        deposit: data['trip'].depositPayable,
                        link: linkdeposit,
                    });

                    process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin1234@@smtp.gmail.com:465/";
                    Email.send({
                        to: rawCustomers['email'],
                        cc: 'unusualexpeditionsingapore@gmail.com',
                        from: 'unusualexpeditionsingapore@gmail.com',
                        subject: 'UNUNUSUAL EXPEDITION',
                        // text: text,
                        html: html,
                        // attachments: attachments
                    });

                    try {
                        Email.send({
                            to: 'contact@unusualexpedition.com',
                            cc: 'unusualexpeditionsingapore@gmail.com',
                            from: 'unusualexpeditionsingapore@gmail.com',
                            subject: 'UNUNUSUAL EXPEDITION',
                            // text: text,
                            html: html,
                            // attachments: attachments
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
            })


        }

        // customer deposite reject but in tour

        else if (rejectedCustomers.raw.payment === 'none') {
            // arr['order_number']=obj['order_number'];

            var index2 = Sugar.Array(data.trip.peopleInTravel).findIndex(function (item) {
                return item.idCustomer == obj['merchant_data1'];
            });
            aboutCustomer.secondPayment = obj['amount'];
            aboutCustomer.payment = 'fullPayment';
            var test4 = {};
            // test4['peopleInTravel.' + index2.raw + '.email'] = rawCustomers['email'];
            // test4['peopleInTravel.' + index2.raw + '.idCustomer'] = obj['merchant_data1'];
            // test4['peopleInTravel.' + index2.raw + '.request'] = rawCustomers['request'];
            // test4['peopleInTravel.' + index2.raw + '.room'] = rawPrice.room;
            // test4['peopleInTravel.' + index2.raw + '.optionalRate'] = obj['merchant_data3'];
            // test4['peopleInTravel.' + index2.raw + '.totalPrice'] = rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice;
            // test4['peopleInTravel.' + index2.raw + '.meal'] = rawCustomers['meal'];
            // if (coupon) {
            //     test4['peopleInTravel.' + index2.raw + '.discountType'] = coupon.discountType || '';
            //     test4['peopleInTravel.' + index2.raw + '.discountValue'] = coupon.discountValue || 0;
            // }
            //
            // test4['peopleInTravel.' + index2.raw + '.extra'] = rawCustomers['extra'];
            // test4['peopleInTravel.' + index2.raw + '.payment'] = 'none';
            // test4['peopleInTravel.' + index2.raw + '.firstPayment'] = aboutCustomer.firstPayment;
            // test4['peopleInTravel.' + index2.raw + '.paymentMethod'] = rawPrice.paymentMethod;
            // test4['peopleInTravel.' + index2.raw + '.createdAt'] = new Date();
            //     test4['peopleInTravel.' + index2.raw + '.order_number'] = obj['order_number'];
            test4['peopleInTravel.' + index2.raw + '.paymentStatus'] = "DEPOSIT FAILED";

            Travel.update(
                {_id: obj.merchant_data4},
                {
                    $set: test4

                }
            );

            //send email fail deposit
            //send email fail deposit

            Assets.getText('failpayvisa.html', function (err, res) {
                if (res) {
                    SSR.compileTemplate('emailText', res);
                    var html = SSR.render('emailText', {
                        // result: obj['result'],
                        // tour_code: (data.trip.tourDateStart.getMonth() + 1) + ((data.trip.tourDateStart.getYear()).toString().substring(1, 4)) + (data.trip.tourDateStart.getDate()) + data.travel.Location + data.trip.tourDateStart.daysAgo(data.trip.tourDateEnd) + 'D' + data.travel.Instructor,
                        // email: rawCustomers['email'],
                        // passport: rawCustomers['passportNo'],
                        // phoneNumber: rawCustomers['phone'],
                        // mid: obj['mid'],
                        // card_number: obj['card_number'],
                        // amount: obj['amount'],
                        // transaction_id: obj['transaction_id'],
                        // authorization_code: obj['order_number'],

                        name: rawCustomers.firstname,
                        tourname: data['travel'].tourName,
                        dateoftour: data['trip'].tourDateStart.format('{Dow}, {dd}/{MM}/{yyyy} ') + ' ' + data['trip'].tourDateEnd.format('{Dow}, {dd}/{MM}/{yyyy} '),
                        totalAmout: rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                        deposit: data['trip'].depositPayable,
                        link: linkdeposit,
                    });

                    process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin1234@@smtp.gmail.com:465/";
                    Email.send({
                        to: rawCustomers['email'],
                        cc: 'unusualexpeditionsingapore@gmail.com',
                        from: 'unusualexpeditionsingapore@gmail.com',
                        subject: 'UNUNUSUAL EXPEDITION',
                        // text: text,
                        html: html,
                        // attachments: attachments
                    });
                    try {
                        Email.send({
                            to: 'contact@unusualexpedition.com',
                            cc: 'unusualexpeditionsingapore@gmail.com',
                            from: 'unusualexpeditionsingapore@gmail.com',
                            subject: 'UNUNUSUAL EXPEDITION',
                            // text: text,
                            html: html,
                            // attachments: attachments
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
            })


        }

        else if (indexRejectedCustomers.raw > 0 || rejectedCustomers.raw.payment === 'deposit') {
            console.log("----------------- fullpayment rejected----------------------");
            // var aboutCustomer2 = {};
            // aboutCustomer2 = Sugar.Array(data.trip.peopleInTravel).find(function (item) {
            //     return item.idCustomer = obj['merchant_data1'];
            // });

            // var arr2 = {
            //     order_number: 'web',
            //     merchant_id: '0000021474',
            //     currency_code: 'SGD',
            //     transaction_type: 'Sale',
            //     key: '716fd56c3699eaa34aaa9f15bbf10cde7a6a1604',
            //     return_url: "http://unusualexpedition.com/rdp",
            //     email: rawCustomers.email,
            //     first_name: rawCustomers.firstname,
            //     lastname: rawCustomers.lastname,
            //     amount: rawPrice.mainPrice + rawPrice.optionalPrice,
            //     merchant_data1: obj.merchant_data1,
            //     merchant_data2: rawPrice.room,//main tour room
            //     merchant_data3: rawPrice.optionalNote,//optional of tour
            //     merchant_data4: obj.merchant_data4,
            //     merchant_data5: rawPrice.mainPrice + rawPrice.optionalPrice,//this is total price of optional tour rate and main tour rate
            // };


            var linkFullPayment2 = 'https://connect.reddotpayment.com/merchant/cgi-bin-live?' + Object.toQueryString(arr);
            var test2 = {};

            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.email'] = rawCustomers['email'];
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.idCustomer'] = obj['merchant_data1'];
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.request'] = rawCustomers['request'];
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.room'] = rawPrice.room;
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.optionalRate'] = obj['merchant_data3'];
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.totalPrice'] = rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice;
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.meal'] = rawCustomers['meal'];
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.extra'] = rawCustomers['extra'];
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.payment'] = 'deposit';

            //dadasds
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.linkFullPayment'] = linkFullPayment2;

            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.firstPayment'] = rejectedCustomers.firstPayment;
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.createdAt'] = new Date();
            test2['peopleInTravel.' + indexRejectedCustomers.raw + '.paymentStatus'] = "FULL PAYMENT FAILED";
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.discountType'] = indexRejectedCustomers.raw.discountType;
            // test2['peopleInTravel.' + indexRejectedCustomers.raw + '.discountValue'] = indexRejectedCustomers.raw.discountValue;
            //
            Travel.update(
                {_id: obj.merchant_data4},
                {
                    $set: test2
                }
            );

            //send email fail fullpayment
            Assets.getText('failpayfull.html', function (err, res) {
                if (res) {
                    SSR.compileTemplate('emailText', res);
                    var html = SSR.render('emailText', {
                        result: obj['result'],
                        tour_code: (data.trip.tourDateStart.getMonth() + 1) + ((data.trip.tourDateStart.getYear()).toString().substring(1, 4)) + (data.trip.tourDateStart.getDate()) + data.travel.Location + data.trip.tourDateStart.daysAgo(data.trip.tourDateEnd) + 'D' + data.travel.Instructor,
                        email: rawCustomers['email'],
                        passport: rawCustomers['passportNo'],
                        phoneNumber: rawCustomers['phone'],
                        mid: obj['mid'],
                        card_number: obj['card_number'],
                        amount: obj['amount'],
                        transaction_id: obj['transaction_id'],
                        authorization_code: obj['order_number'],

                        name: rawCustomers.firstname,
                        tourname: data['travel'].tourName,
                        dateoftour: data['trip'].tourDateStart.format('{Dow}, {dd}/{MM}/{yyyy} ') + ' ' + data['trip'].tourDateEnd.format('{Dow}, {dd}/{MM}/{yyyy} '),
                        totalAmout: rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                        // deposit: data['trip'].depositPayable,
                        // onlinefullpayment:
                        fullpaymentAmout: aboutCustomer.raw.totalPrice - data['trip'].depositPayable,
                        link: aboutCustomer.raw.linkFullPayment,

                    });
                    process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin1234@@smtp.gmail.com:465/";
                    Email.send({
                        to: rawCustomers['email'],
                        cc: 'unusualexpeditionsingapore@gmail.com',
                        from: 'unusualexpeditionsingapore@gmail.com',
                        subject: 'UNUNUSUAL EXPEDITION',
                        // text: text,
                        html: html,
                        // attachments: attachments
                    });

                    try {
                        Email.send({
                            to: 'contact@unusualexpedition.com',
                            cc: 'unusualexpeditionsingapore@gmail.com',
                            from: 'unusualexpeditionsingapore@gmail.com',
                            subject: 'UNUNUSUAL EXPEDITION',
                            // text: text,
                            html: html,
                            // attachments: attachments
                        });
                    } catch (e) {
                        console.log(e);
                    }
                    //
                    // response.writeHeader(200, {"Content-Type": "text/html"});
                    // response.write(html);
                    // response.end();
                }
            })
        }
    },

    paymentSuccess: function (obj, aboutCustomer, rawCustomers, data, rawPrice, coupon, linkFullPayment) {
        var couponPrice = 0;
        if (coupon && coupon._id) {
            var rawcoupon = Coupon.findOne({_id: coupon._id});
            if (rawcoupon.status == true && rawcoupon.status == true && rawcoupon.discountStartDate.isBefore(new Date()) && rawcoupon.discountEndDate.isAfter(new Date())
            ) {
                if (rawcoupon.discountType == 'flat') {
                    couponPrice = rawcoupon.discountValue;
                }
                else {
                    couponPrice = ((rawPrice.mainPrice + rawPrice.optionalPrice) * (rawcoupon.discountValue / 100));
                }
            }
        }
        //total price and rate add when booking

        //check booking by method
        var file = "sucessVisa.html";
        if (rawPrice.paymentMethod == 'bookviabank') {
            file = 'sucessPaybank.html';
        }


        //get coupon
        // rawCustomers.historyBook.discount

        if ((data['trip'].fullPaymentDueDate).isBefore('today')) {
            if (!(Sugar.Object(aboutCustomer).isEmpty().raw) && parseInt(obj['amount']) >= (rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice)) {
                console.log("=============================full payment=============================")
                var index = Sugar.Array(data.trip.peopleInTravel).findIndex(function (item) {
                    return item.idCustomer == obj['merchant_data1'];
                });
                aboutCustomer.secondPayment = obj['amount'];
                aboutCustomer.payment = 'fullPayment';
                index = index.raw;
                var test = {};
                test['peopleInTravel.' + index + '.payment'] = 'fullPayment';
                test['peopleInTravel.' + index + '.fullPaymentAt'] = new Date();
                test['peopleInTravel.' + index + '.secondPayment'] = obj['amount'];
                test['peopleInTravel.' + index + '.order_number2'] = obj['order_number2'];
                test['peopleInTravel.' + index + '.paymentStatus'] = "FULLY PAID ACCEPTED";

                Travel.update(
                    {_id: obj.merchant_data4},
                    {
                        $set: test
                    }
                );

                Assets.getText(file, function (err, res) {
                    if (res) {
                        SSR.compileTemplate('emailText', res);
                        var html = SSR.render('emailText', {
                            firstname: rawCustomers.firstname,
                            lastname: rawCustomers.lastname,
                            email: rawCustomers.email,
                            gender: rawCustomers.gender,
                            nationality: rawCustomers.nationality,
                            dayofbirth: rawCustomers.dayofbirth,
                            address: rawCustomers.address1,
                            phone: rawCustomers.phoneCode + '  ' + rawCustomers.phone,
                            passport: rawCustomers.passportNo,
                            passportissue: rawCustomers.passportIssue,
                            passportexpiry: rawCustomers.passportExpiryDate,
                            kindname: rawCustomers.kinName,
                            kindrelationship: rawCustomers.kinRelationship,
                            kindphone: rawCustomers.kinPhoneNo,
                            meal: rawCustomers['meal'] || '',
                            comment: rawCustomers['request'] || '',
                            tourcode: (data['trip'].tourDateStart.format('{MM}')) + ((data['trip'].tourDateStart.format('{yy}'))) + (data['trip'].tourDateEnd.format('{dd}')) + data['travel'].Location + data['trip'].tourDateStart.daysAgo(data['trip'].tourDateEnd) + 'D' + data['travel'].Instructor,
                            tourselection: rawPrice.room + '- $' + rawPrice.mainPrice,
                            touroption: (rawPrice.optionalNote || '') + '- $' + rawPrice.optionalPrice,
                            touramout: rawPrice.mainPrice + rawPrice.optionalPrice,
                            discount: ' $' + couponPrice,
                            datebooking: (new Date()).format('{Dow}, {dd}/{MM}/{yyyy} '),
                            //http://dev.chord:4500/singapore/viewtour?id=aGtkJPvhxv4KzFocu&tripid=SgC8iGSRyNT4wbrGS
                            url: process.env.ROOT_URL + '/singapore/viewtour?id=' + data['trip']._id + '&tripid=' + data['travel']._id,
                            tourdate: data['trip'].tourDateStart.format('{Dow}, {dd}/{MM}/{yyyy} ') + ' - ' + data['trip'].tourDateEnd.format('{Dow}, {dd}/{MM}/{yyyy} '),
                            // totalAmout:rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                            // deposit: data['trip'].depositPayable,
                            //link full payment
                            // onlinefullpayment: linkFullPayment,
                            tourname: data['travel'].tourName,


                        });
                        Meteor.call("RenderPDF",rawCustomers['email'], rawCustomers.firstname + rawCustomers.lastname, data, html, obj.amount, aboutCustomer, rawCustomers, obj['order_number'], 'fullpayment', rawPrice, couponPrice);
                    }
                });
            }
        }
        else {
            if ((Sugar.Object(aboutCustomer.raw).isEmpty().raw || aboutCustomer.raw.payment == 'none') && parseInt(obj['amount']) >= data.trip['depositPayable']) {
                console.log("-------------------------DEPOSIT------------------------------")

                // create fullpayment link======================================================
                // var arr = {
                //     order_number: 'web',
                //     merchant_id: '0000021474',
                //     currency_code: 'SGD',
                //     transaction_type: 'Sale',
                //     key: '716fd56c3699eaa34aaa9f15bbf10cde7a6a1604',
                //     return_url: "http://dev.eznetcafe.com:4500/rdp",
                //     email: rawCustomers.email,
                //     first_name: rawCustomers.firstname,
                //     lastname: rawCustomers.lastname,
                //     amount: rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice- data.trip.depositPayable,
                //     merchant_data1: obj.merchant_data1,
                //     merchant_data2: obj.merchant_data2,//main tour rate
                //
                //     merchant_data3: rawPrice.optionalNote,//optional of tour
                //     merchant_data4: obj.merchant_data4,
                //     merchant_data5: rawPrice.mainPrice + rawPrice.optionalPrice,//this is total price of optional tour rate and main tour rate
                //
                // };
                // var linkFullPayment = 'https://connect.reddotpayment.com/merchant/cgi-bin-live?' + Object.toQueryString(arr);

                if (Sugar.Object(aboutCustomer.raw).isEmpty().raw) {
                    //=============================================================================
                    if (!coupon) {
                        coupon = {};
                        coupon.discountType = '';
                        coupon.discountValue = '';
                        coupon._id = '';
                    }
                    Travel.update({_id: obj['merchant_data4']}, {
                        $push: {
                            peopleInTravel: {
                                idCustomer: obj['merchant_data1'],
                                email: rawCustomers['email'],
                                request: rawCustomers['request'] || '',
                                room: rawPrice.room,
                                optionalRate: rawPrice.optionalNote,
                                totalPrice: rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                                discountType: coupon.discountType,
                                discountValue: coupon.discountValue,
                                coupon: coupon._id,
                                // deposit: data['trip']['depositPayable'],
                                paymentStatus: "DEPOSIT ACCEPTED",
                                meal: rawCustomers['meal'] || '',
                                extra: rawCustomers['extra'],
                                payment: 'deposit',
                                depositAt: new Date,
                                firstPayment: obj['amount'],
                                linkFullPayment: linkFullPayment,
                                paymentMethod: rawPrice.paymentMethod,
                                order_number: obj['order_number'],
                                createdAt: new Date(),
                            }
                        }
                    });


                    //send email success to deposit


                    Assets.getText(file, function (err, res) {
                        if (res) {
                            SSR.compileTemplate('emailText', res);
                            var html = SSR.render('emailText', {
                                firstname: rawCustomers.firstname,
                                lastname: rawCustomers.lastname,
                                email: rawCustomers.email,
                                gender: rawCustomers.gender,
                                nationality: rawCustomers.nationality,
                                dayofbirth: rawCustomers.dayofbirth,
                                address: rawCustomers.address1,
                                phone: rawCustomers.phoneCode + '  ' + rawCustomers.phone,
                                passport: rawCustomers.passportNo,
                                passportissue: rawCustomers.passportIssue,
                                passportexpiry: rawCustomers.passportExpiryDate,
                                kindname: rawCustomers.kinName,
                                kindrelationship: rawCustomers.kinRelationship,
                                kindphone: rawCustomers.kinPhoneNo,
                                meal: rawCustomers['meal'] || '',
                                comment: rawCustomers['request'] || '',
                                tourcode: (data['trip'].tourDateStart.format('{MM}')) + ((data['trip'].tourDateStart.format('{yy}'))) + (data['trip'].tourDateEnd.format('{dd}')) + data['travel'].Location + data['trip'].tourDateStart.daysAgo(data['trip'].tourDateEnd) + 'D' + data['travel'].Instructor,
                                tourselection: rawPrice.room + '- $' + rawPrice.mainPrice,
                                touroption: (rawPrice.optionalNote || '') + '- $' + rawPrice.optionalPrice,
                                touramout: rawPrice.mainPrice + rawPrice.optionalPrice,
                                discount: ' $' + couponPrice,
                                datebooking: (new Date()).format('{Dow}, {dd}/{MM}/{yyyy} '),
                                //http://dev.chord:4500/singapore/viewtour?id=aGtkJPvhxv4KzFocu&tripid=SgC8iGSRyNT4wbrGS
                                url: process.env.ROOT_URL + '/singapore/viewtour?id=' + data['trip']._id + '&tripid=' + data['travel']._id,
                                tourdate: data['trip'].tourDateStart.format('{Dow}, {dd}/{MM}/{yyyy} ') + ' - ' + data['trip'].tourDateEnd.format('{Dow}, {dd}/{MM}/{yyyy} '),
                                // totalAmout:rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                                // deposit: data['trip'].depositPayable,
                                //link full payment
                                onlinefullpayment: linkFullPayment,
                                tourname: data['travel'].tourName,

                            });
                            Meteor.call("RenderPDF",rawCustomers['email'], rawCustomers.firstname + rawCustomers.lastname, data, html, obj.amount, aboutCustomer, rawCustomers, obj['order_number'], 'deposit', rawPrice, couponPrice);
                            // process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin1234@@smtp.gmail.com:465/";
                            // Email.send({
                            //     to: rawCustomers['email'],
                            //     cc: 'unusualexpeditionsingapore@gmail.com',
                            //     from: 'unusualexpeditionsingapore@gmail.com',
                            //     subject: 'UNUNUSUAL EXPEDITION',
                            //     // text: text,
                            //     html: html,
                            //     // attachments: attachments
                            // });
                            //

                            // response.writeHeader(200, {"Content-Type": "text/html"});
                            // response.write(html);
                            // response.end();
                        }
                    })

                }


                else {
                    var indexDepoitCustomer = Sugar.Array(data.trip.peopleInTravel).findIndex(function (item) {
                        return item.idCustomer == obj['merchant_data1'];
                    });
                    aboutCustomer.secondPayment = obj['amount'];
                    aboutCustomer.payment = 'fullPayment';
                    var test3 = {};
                    // test['peopleInTravel.2.email'] = 4;
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.email'] = rawCustomers['email'];
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.idCustomer'] = obj['merchant_data1'];
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.request'] = rawCustomers['request'];
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.room'] = rawPrice.room;
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.optionalRate'] = rawPrice.optionalNote;
                    test3['peopleInTravel.' + indexDepoitCustomer.raw + '.totalPrice'] = rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice;
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.meal'] = rawCustomers['meal'];
                    if (coupon) {
                        test3['peopleInTravel.' + indexDepoitCustomer.raw + '.discountType'] = coupon.discountType;
                        test3['peopleInTravel.' + indexDepoitCustomer.raw + '.discountValue'] = coupon.discountValue;
                        test3['peopleInTravel.' + indexDepoitCustomer.raw + '.coupon'] = coupon._id;
                    }
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.extra'] = rawCustomers['extra'];
                    test3['peopleInTravel.' + indexDepoitCustomer.raw + '.payment'] = 'deposit';
                    test3['peopleInTravel.' + indexDepoitCustomer.raw + '.firstPayment'] = obj['amount'];
                    test3['peopleInTravel.' + indexDepoitCustomer.raw + '.linkFullPayment'] = linkFullPayment;
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.firstPayment'] = obj['amount'];
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.paymentMethod'] = rawPrice.paymentMethod;
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.createdAt'] = new Date();
                    test3['peopleInTravel.' + indexDepoitCustomer.raw + '.depositAt'] = new Date();
                    // test3['peopleInTravel.' + indexDepoitCustomer.raw + '.depositAt'] = new Date();
                    test3['peopleInTravel.' + indexDepoitCustomer.raw + '.order_number'] = obj['order_number'];
                    test3['peopleInTravel.' + indexDepoitCustomer.raw + '.paymentStatus'] = "DEPOSIT ACCEPTED";
                    Travel.update(
                        {_id: obj.merchant_data4},
                        {
                            $set: test3
                        }
                    );
                    //send mail deposit success
                    Assets.getText(file, function (err, res) {
                        if (res) {
                            SSR.compileTemplate('emailText', res);
                            var html = SSR.render('emailText', {
                                firstname: rawCustomers.firstname,
                                lastname: rawCustomers.lastname,
                                email: rawCustomers.email,
                                gender: rawCustomers.gender,
                                nationality: rawCustomers.nationality,
                                dayofbirth: rawCustomers.dayofbirth,
                                address: rawCustomers.address1,
                                phone: rawCustomers.phoneCode + '  ' + rawCustomers.phone,
                                passport: rawCustomers.passportNo,
                                passportissue: rawCustomers.passportIssue,
                                passportexpiry: rawCustomers.passportExpiryDate,
                                kindname: rawCustomers.kinName,
                                kindrelationship: rawCustomers.kinRelationship,
                                kindphone: rawCustomers.kinPhoneNo,
                                meal: rawCustomers['meal'] || '',
                                comment: rawCustomers['request'] || '',
                                tourcode: (data['trip'].tourDateStart.format('{MM}')) + ((data['trip'].tourDateStart.format('{yy}'))) + (data['trip'].tourDateEnd.format('{dd}')) + data['travel'].Location + data['trip'].tourDateStart.daysAgo(data['trip'].tourDateEnd) + 'D' + data['travel'].Instructor,
                                tourselection: rawPrice.room + '- $' + rawPrice.mainPrice,
                                touroption: (rawPrice.optionalNote || '') + '- $' + rawPrice.optionalPrice,
                                touramout: rawPrice.mainPrice + rawPrice.optionalPrice,
                                discount: ' $' + couponPrice,
                                datebooking: (new Date()).format('{Dow}, {dd}/{MM}/{yyyy} '),
                                //http://dev.chord:4500/singapore/viewtour?id=aGtkJPvhxv4KzFocu&tripid=SgC8iGSRyNT4wbrGS
                                url: process.env.ROOT_URL + '/singapore/viewtour?id=' + data['trip']._id + '&tripid=' + data['travel']._id,
                                tourdate: data['trip'].tourDateStart.format('{Dow}, {dd}/{MM}/{yyyy} ') + ' - ' + data['trip'].tourDateEnd.format('{Dow}, {dd}/{MM}/{yyyy} '),
                                // totalAmout:rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                                // deposit: data['trip'].depositPayable,
                                //link full payment
                                onlinefullpayment: linkFullPayment,
                                tourname: data['travel'].tourName,


                            });
                            Meteor.call("RenderPDF",rawCustomers['email'], rawCustomers.firstname + rawCustomers.lastname, data, html, obj.amount, aboutCustomer, rawCustomers, obj['order_number'], 'deposit', rawPrice, couponPrice);
                        }
                    })

                }
            }
            //if full payment
            else if (!(Sugar.Object(aboutCustomer).isEmpty().raw) && parseInt(obj['amount']) >= (rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice - data.trip['depositPayable'])) {
                console.log("=============================full payment=============================")
                var index = Sugar.Array(data.trip.peopleInTravel).findIndex(function (item) {
                    return item.idCustomer == obj['merchant_data1'];
                });
                aboutCustomer.secondPayment = obj['amount'];
                aboutCustomer.payment = 'fullPayment';
                index = index.raw;
                var test = {};
                test['peopleInTravel.' + index + '.payment'] = 'fullPayment';
                test['peopleInTravel.' + index + '.fullPaymentAt'] = new Date();
                test['peopleInTravel.' + index + '.secondPayment'] = obj['amount'];
                test['peopleInTravel.' + index + '.order_number2'] = obj['order_number2'];
                test['peopleInTravel.' + index + '.paymentStatus'] = "FULLY PAID ACCEPTED";

                Travel.update(
                    {_id: obj.merchant_data4},
                    {
                        $set: test
                    }
                );

                Assets.getText(file, function (err, res) {
                    if (res) {
                        SSR.compileTemplate('emailText', res);
                        var html = SSR.render('emailText', {
                            firstname: rawCustomers.firstname,
                            lastname: rawCustomers.lastname,
                            email: rawCustomers.email,
                            gender: rawCustomers.gender,
                            nationality: rawCustomers.nationality,
                            dayofbirth: rawCustomers.dayofbirth,
                            address: rawCustomers.address1,
                            phone: rawCustomers.phoneCode + '  ' + rawCustomers.phone,
                            passport: rawCustomers.passportNo,
                            passportissue: rawCustomers.passportIssue,
                            passportexpiry: rawCustomers.passportExpiryDate,
                            kindname: rawCustomers.kinName,
                            kindrelationship: rawCustomers.kinRelationship,
                            kindphone: rawCustomers.kinPhoneNo,
                            meal: rawCustomers['meal'] || '',
                            comment: rawCustomers['request'] || '',
                            tourcode: (data['trip'].tourDateStart.format('{MM}')) + ((data['trip'].tourDateStart.format('{yy}'))) + (data['trip'].tourDateEnd.format('{dd}')) + data['travel'].Location + data['trip'].tourDateStart.daysAgo(data['trip'].tourDateEnd) + 'D' + data['travel'].Instructor,
                            tourselection: rawPrice.room + '- $' + rawPrice.mainPrice,
                            touroption: (rawPrice.optionalNote || '') + '- $' + rawPrice.optionalPrice,
                            touramout: rawPrice.mainPrice + rawPrice.optionalPrice,
                            discount: ' $' + couponPrice,
                            datebooking: (new Date()).format('{Dow}, {dd}/{MM}/{yyyy} '),
                            //http://dev.chord:4500/singapore/viewtour?id=aGtkJPvhxv4KzFocu&tripid=SgC8iGSRyNT4wbrGS
                            url: process.env.ROOT_URL + '/singapore/viewtour?id=' + data['trip']._id + '&tripid=' + data['travel']._id,
                            tourdate: data['trip'].tourDateStart.format('{Dow}, {dd}/{MM}/{yyyy} ') + ' - ' + data['trip'].tourDateEnd.format('{Dow}, {dd}/{MM}/{yyyy} '),
                            // totalAmout:rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                            // deposit: data['trip'].depositPayable,
                            //link full payment
                            // onlinefullpayment: linkFullPayment,
                            tourname: data['travel'].tourName,


                        });
                        Meteor.call("RenderPDF",rawCustomers['email'], rawCustomers.firstname + rawCustomers.lastname, data, html, obj.amount, aboutCustomer, rawCustomers, obj['order_number'], 'fullpayment', rawPrice, couponPrice);
                    }
                });
            }
        }

    },

});


Picker.route('/htmlServer', function (params, req, response, next) {
    var idTour = Object.fromQueryString(req['url']).id;
    if (idTour) {
        var dataTour = Travel.findOne({_id: idTour});
        var dataTrip = Tour.findOne({_id: dataTour.trip});

        HTTP.get(Meteor.absoluteUrl('/gethtml/trip-note.html'), function (err, res) {
            if (res) {
                SSR.compileTemplate('htmlPDF', res.content);
                //
                Template.htmlPDF.helpers({
                    tour: function () {
                        return dataTour;
                    },
                    trip: function () {
                        return dataTrip;
                    },
                    dateFomat1: function (time) {
                        if (time) {
                            return time.format('{Dow}, {dd}/{MM}/{yyyy} ');
                        }
                    },
                    voltage: function (item) {
                        return {
                            text: Assets.getText("noteV/" + item + ".txt"),
                            image: Assets.getText("image/" + item + ".txt")
                        };
                    },


                    image: function () {
                        return Assets.getText("image/logo02.txt");
                    },
                    tourCode: function (tour, trip) {
                        return (tour.tourDateStart.format('{MM}')) + ((tour.tourDateStart.format('{yy}'))) + (tour.tourDateEnd.format('{dd}')) + trip.Location + tour.tourDateStart.daysAgo(tour.tourDateEnd) + 'D' + trip.Instructor;
                    }


                });

                var html = SSR.render('htmlPDF', {});

                //-------------------------------------

                var pdf = Npm.require('html-pdf');
                config = {

                    // "directory": "/tmp",       // The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp'
                    // "height": "10.5in",        // allowed units: mm, cm, in, px
                    // "width": "8in",            // allowed units: mm, cm, in, px
                    "format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                    "orientation": "portrait", // portrait or landscape
                    // Page options
                    // "border": "0",
                    // default is 0, units: mm, cm, in, px
                    "border": {
                        "top": "0.1in",            // default is 0, units: mm, cm, in, px
                        "right": "0.1in",
                        "bottom": "0.5in",
                        "left": "0.1in"
                    },

                    "header": {
                        "height": "20mm",
                        // first:'<div class="tripnote-header-text">TRIP NOTE</div>',
                        // // "contents": '<div class="tripnote-header w-clearfix"><div class="tripnote-header-text">TRIP NOTE</div><img style="height: 25px;margin-top: 20px;float: right;" sizes="165.703125px" src="'+ Assets.getText("image/TypeA.txt")+ '"></div>'
                        // "contents": '<img style="height: 50px; float: right;" sizes="165.703125px" src="'+ Assets.getText("image/logo02.txt")+ '">'
                    },
                    "footer": {
                        // "height": "28mm",
                        "contents": {
                            // first: 'Cover page',
                            // 2: 'Second page', // Any page number is working. 1-based index
                            default: '<div  style="display: inline-block;line-height: 14px;font-size: 10px;padding: 20px 50px;">UNUSUAL EXPEDITION PTE LTD<div style="float: right;font-size: 8px;font-weight: 700;text-align: right;">© Copyright. ALL RIGHTS RESERVED.</div><div style="  line-height: 10px;  font-size: 8px; color: #5c5c5c;  padding-bottom: 10px; display: inline-block;" ">TA License: 02513 Company Registration: 201400451K<br>1, Rochor Canal Road, #06‐34C, <br>Sim Lim Square, Singapore 188504<br>Tel: +65 6591 8811 Email: contact@unusualexpedition.com</div></div>' // fallback value
                            // last: 'Last Page'
                        }
                    }
                };

                // response.writeHeader(200, {"Content-Type": "text/html"});
                // response.end(html);
                // var filepath=process.env.PWD + '/server/pdfs';
                pdf.create(html, config).toBuffer(function (err, buffer) {
                    response.writeHeader(200, {"Content-Type": "application/pdf"});
                    response.end(buffer);
                });

            }


        })
    }

    else {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.end("Please take tour ID from admin and make link like this http://dev.eznetcafe.com:4500/htmlServer?id=KsAzvC4PBYkcnQ4bW");
    }

});

Picker.route('/hello', function (params, req, response, next) {

    // if(process.env.NODE_ENV=='development'){
    //     response.writeHeader(302,{'Location': 'http://vk1viettel.ddns.me:4500'});
    //     // response.write(html);
    //     response.end();
    // }

    response.writeHeader(302, {'Location': process.env.ROOT_URL + '/singapore/banking/'});
    // response.write(html);
    response.end();
});


Picker.route('/refund', function (params, req, response, next) {

    var test3 = {};
    test3['peopleInTravel.' + params.query.index + '.paymentStatus'] = "REFUND";
    test3['peopleInTravel.' + params.query.index + '.refundAt'] = new Date;
    test3['peopleInTravel.' + params.query.index + '.refundAmount'] = params.query.amount;
    Travel.update(
        {_id: params.query.idTour},
        {
            $set: test3
        }
    );

    // response.writeHeader(302,{'Location': process.env.ROOT_URL+'/singapore/banking'});
    // response.write(html);
    response.end();
});



















