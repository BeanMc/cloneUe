/**
 * Created by HuycongNguyen on 11/4/2016.
 */

Sugar = Npm.require('sugar')
Meteor.methods({

    payByBank: function (obj, emailCustomer) {
        var data = {};
        data['trip'] = Travel.findOne({_id: obj['merchant_data4']});
        data['trip']['tourPrice']['totalPrice'] = obj['amount'];

        data['travel'] = Tour.findOne({_id: data['trip']['trip']});

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

        var customerPrice = rawPrice.mainPrice + rawPrice.optionalPrice;


        // check coupon
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
                        couponPrice =((rawPrice.mainPrice + rawPrice.optionalPrice) * (coupon.discountValue/100));
                    }
                }

            }

        }

        Meteor.call('sendEmailpaybybank', emailCustomer,data,rawPrice,rawCustomers,couponPrice);
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
                    paymentStatus: "REJECTED",
                    // firstPayment: obj['amount'],
                    paymentMethod:rawPrice.paymentMethod,
                    order_number:obj['order_number'],
                    refund:false,
                    // linkFullPayment:linkFullPayment,
                    createdAt: new Date(),
                }
            }
        });
        return rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice;
        // Meteor.call('paymentRejected', obj, aboutCustomer, rawCustomers, data, rawPrice, couponPrice, coupon)
    },

    paybyvisa:function (obj,emailCustomer,link) {
        var data = {};
        var linkdeposit='https://connect.reddotpayment.com/merchant/cgi-bin-live?' + Object.toQueryString(obj);
        data['trip'] = Travel.findOne({_id: obj['merchant_data4']});
        data['trip']['tourPrice']['totalPrice'] = obj['amount'];

        data['travel'] = Tour.findOne({_id: data['trip']['trip']});

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
        var customerPrice = rawPrice.mainPrice + rawPrice.optionalPrice;


        // check coupon
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
                        couponPrice = ((rawPrice.mainPrice + rawPrice.optionalPrice) * (coupon.discountValue/100));
                    }
                }

            }

        }

        // Meteor.call('sendEmailpaybybank', emailCustomer,data,rawPrice,rawCustomers,couponPrice);
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
                    paymentStatus: "DEPOSIT REJECTED",
                    // firstPayment: obj['amount'],
                    paymentMethod:rawPrice.paymentMethod,
                    order_number:obj['order_number'],
                    linkdeposit:linkdeposit,
                    refund:false,
                    // linkFullPayment:linkFullPayment,
                    createdAt: new Date(),
                }
            }
        });

    },

    addcustomers: function (email, firstname, lastname,Dateofbird, gender, nationality, address1, address2, city, zip, phone,
                            passportNo, passportIssue, passportExpiryDate, meal, extra, request, booking,
                            kinName, kinRelationship, kinPhoneNo, phoneCode, agentcode,paymentMethod) {
        console.log('------------------method addcustomers---------------------')
        if ((Customers.find({passportNo: passportNo}).fetch()).isEmpty()) {
            // if(true){
            var idCustomer = Customers.insert({
                    email: email || '',
                    firstname: firstname,
                    lastname: lastname,
                    dateofbird:Dateofbird,
                    gender: gender || '',

                    address1: address1 || '',
                    address2: address2 || '',
                    city: city || '',
                    zip: zip || '',

                    phoneCode: phoneCode || '',
                    phone: phone || '',

                    nationality: nationality || '',
                    passportNo: passportNo || '',
                    passportIssue: passportIssue || '',
                    passportExpiryDate: passportExpiryDate || '',


                    kinName: kinName,
                    kinRelationship: kinRelationship,
                    kinPhoneNo: kinPhoneNo,
                    agentCode: agentcode,
                    meal: meal || '',
                    extra: extra || '',
                    request: request || '',
                    historyBook: [{
                        idTour: booking.idTour,
                        room: booking.room,
                        mainPrice: booking.mainPrice,
                        optionalNote: booking.optionalNote,
                        optionalPrice: booking.optionalPrice,
                        discount: booking.discountCode,
                        paymentMethod:paymentMethod,

                        createdAt: new Date(),
                    }],
                    createdAt: new Date(),

                }
            );
            return idCustomer

        }
        else {
            var id = Customers.update(
                {passportNo: passportNo},
                {
                    $set: {
                        email: email || '',
                        firstname: firstname,
                        lastname: lastname,
                        gender: gender || '',
                        nationality: nationality || '',
                        address1: address1 || '',
                        address2: address2 || '',
                        city: city || '',
                        zip: zip || '',
                        phone: phone || '',
                        passportNo: passportNo || '',
                        passportIssue: passportIssue || '',
                        passportExpiryDate: passportExpiryDate || '',

                        kinName: kinName,
                        kinRelationship: kinRelationship,
                        kinPhoneNo: kinPhoneNo,
                        agentCode: agentcode,
                        createdAt: new Date(),
                        meal: meal || '',
                        extra: extra || '',
                        request: request || '',
                    },

                    $push: {
                        historyBook: {
                            idTour: booking.idTour,
                            room: booking.room,
                            mainPrice: booking.mainPrice,
                            optionalNote: booking.optionalNote,
                            optionalPrice: booking.optionalPrice,
                            discount: booking.discountCode,
                            paymentMethod:paymentMethod,
                            createdAt: new Date(),
                        }
                    }
                }
            );
            return Customers.findOne({passportNo: passportNo})._id;
        }

    },


    checkPriceAndDiscount: function (data) {
        // console.log(data)
        var dataTour = Travel.findOne({_id: data.idOfTour});
        // dataTour.find(dataTour)
        var bookingHistory = {};

        bookingHistory.idTour = data.idOfTour;
        // keep in mind division discount
        bookingHistory.room = dataTour.tourPrice.Rate[data.mainPrice].room;
        bookingHistory.mainPrice = dataTour.tourPrice.Rate[data.mainPrice].tourRateIn;

        // bookingHistory.mainPrice = mainPrice;

        //
        bookingHistory.optionalNote = '';
        bookingHistory.optionalPrice = 0;
        if (data.optionalPrice) {
            data.optionalPrice.forEach(function (item) {
                bookingHistory.optionalNote += ' ' + dataTour.tourPrice.optionalTour[item].optionalTourRateInNote;
                bookingHistory.optionalPrice += dataTour.tourPrice.optionalTour[item].optionalTourRateIn;
            })
        }


        bookingHistory.discountCode = data.discountCode;
        return bookingHistory;
    },

    sendEmailpaybybank: function (email,data,rawPrice,rawCustomer,couponPrice) {
        this.unblock();
        var tour=data['trip'];
        var trip=data['travel'];
        var tourcode = (tour.tourDateStart.format('{MM}')) + ((tour.tourDateStart.format('{yy}'))) + (tour.tourDateEnd.format('{dd}')) + trip.Location + tour.tourDateStart.daysAgo(tour.tourDateEnd) + 'D' + trip.Instructor;
        process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin123@@smtp.gmail.com:465/";
        Assets.getText('emailPaymentByBank.html', function (err, res) {
            if (res) {
                SSR.compileTemplate('emailText', res);
                var html = SSR.render('emailText', {
                    firstname: rawCustomer.firstname,
                    tourname:data['travel'].tourName,
                    dateoftour:data['trip'].tourDateStart.format('{Dow}, {dd}/{MM}/{yyyy} ')+' '+data['trip'].tourDateEnd.format('{Dow}, {dd}/{MM}/{yyyy} '),
                    totalAmout:rawPrice.mainPrice + rawPrice.optionalPrice - couponPrice,
                    deposit: data['trip'].depositPayable,
                });
                process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin1234@@smtp.gmail.com:465/";
                Email.send({
                    to: email,
                    cc: 'unusualexpeditionsingapore@gmail.com',
                    from: 'unusualexpeditionsingapore@gmail.com',
                    subject: 'UNUSUAL EXPEDITION PAYMENT VIA BANK TRANSFER ' + tourcode,
                    // text: text,
                    html: html,
                    // attachments: attachments
                });

            }
        })
    },
    "recordCustomer": function (idCustomer, idTour) {
        // http://dev.eznetcafe.com:4500/rdp?mid=0000021474&order_number=web&result=Paid&error_code=9967&merchant_reference=RDP&currency_code=SGD&amount=1523.00&merchant_data1=NRMBEzMopjJ2zujvY&merchant_data4=MoNjggFpcr5czWYmA&signature=6c1f80237471ec4e5b421b06fad2be21
        var obj = {
            amount: 0,
            currency_code: "SGD",
            merchant_data1: idCustomer,
            merchant_data4: idTour,
            merchant_reference: "RDP",
            mid: 21474,
            order_number: "web",
            result: "rejected",
            signature: "6c1f80237471ec4e5b421b06fad2be21",
        };

        var rootUrl = process.env.ROOT_URL;
        //http://unusualexpedition.com
        HTTP.call("GET", rootUrl + "/rdp?" + Object.toQueryString(obj),
            function (error, result) {
                if (!error) {
                    return "ok";
                }
                return error;
            });
        return "DONE";
    },

    checkPassport: function (passport, idTour) {
        var customers = (Travel.findOne(idTour)).peopleInTravel;
        var index = (customers||[]).findIndex(function (item) {
            return (Customers.findOne(item.idCustomer)).passportNo == passport;
        });
        console.log(index);
        if (index === -1) {
            return true;
        }
        return false;
    },
    signature:function (objSign) {
        var requestsString2= '';
        (Object.keys(objSign)).forEach(function (item) {
            requestsString2 += item + "=" + objSign[item] + '&';
        });
        var keys = Object.keys(objSign).sort();
        var requestsString = '';
        //merchant_data1: res,
        keys.forEach(function (item) {
            if(item!=="merchant_data1"&&item!=="merchant_data2"&&item!=="merchant_data3"&&item!=="merchant_data4"&&item!=="merchant_data5"){
                requestsString += item + "=" + objSign[item] + '&';
            }
        });
        //Secret key==========================================
        var secret_key = "15bbf1";
        // var secret_key = "388322";
        //=====================================================
        requestsString += 'secret_key=' + secret_key;
        objSign['signature'] = CryptoJS.MD5(requestsString).toString();
        // requestsString2 += 'signature' + "=" + objSign['signature'] ;
        return requestsString2;
    },
    "sendTripNote": function (email, id) {
        this.unblock();
        var cid_value = Date.now() + '.image.jpg';
        var attachments = [
            {
                fileName: 'unusual-expedition-TripNote.pdf',
                filePath: Meteor.absoluteUrl('htmlServer?id=' + id),
                cid: cid_value
            }
        ];

        console.log(attachments);
        process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin1234@@smtp.gmail.com:465/";
        Email.send({
            to: email,
            // cc: 'unusualexpeditionsingapore@gmail.com',
            from: 'unusualexpeditionsingapore@gmail.com',
            subject: 'Unusual-Expedition',
            text: "Trip notedadas",
            attachments: attachments
        });
        // Meteor.call("sendEmail2", email);

    },

    test: function () {
        console.log( process.env);
    }
})
