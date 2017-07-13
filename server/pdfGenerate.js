/**
 * Created by HuycongNguyen on 12/5/2016.
 */
url2pdf = Npm.require("url2pdf");
var pdf = Npm.require('html-pdf');
var fs = Npm.require('fs');
var pdfsPath = process.env.PWD + '/server/pdfs';
var htmlsPath = process.env.PWD + '/server/htmls';
var rootUrl = Meteor.absoluteUrl();
var cheerio = Npm.require('cheerio');
Meteor.methods({
    "RenderPDF": function (customer, nameCustomer, dataTour, html, amount, aboutCustomer, rawCustomers, ordernumber, typePayment, rawPrice, couponPrice) {
        this.unblock();
        var gethtml = '';
        if (typePayment === 'deposit') {
            gethtml = '/gethtml/depositInvoice.html';
        }
        else {
            gethtml = '/gethtml/reInvoice.html';
        }
        HTTP.get(Meteor.absoluteUrl(gethtml), {}, function (err, res) {
            if (res) {
                SSR.compileTemplate('htmlPDF', res.content);

                //
                Template.htmlPDF.helpers({
                    invoiceNumber: function () {
                        return ordernumber;
                    },
                    date: function () {
                        return (new Date()).format('{dd}/{MM}/{yyyy}');
                    },
                    balance: function () {
                        return amount;
                    },

                    fullName: function () {
                        return rawCustomers.firstname + "     " + rawCustomers.lastname
                    },
                    passport: function () {
                        return rawCustomers.passportNo;
                    },
                    email: function () {
                        return rawCustomers.email;
                    },
                    address: function () {
                        return rawCustomers.address1;
                    },
                    phone: function () {
                        return "+" + rawCustomers.phoneCode + "  " + rawCustomers.phone;
                    },
                    name: function () {
                        return dataTour['travel'].tourName;
                    },
                    tourPrice: function () {
                        return rawPrice.mainPrice;
                    },
                    option: function () {
                        return rawPrice;
                    },
                    // options:function () {
                    //
                    // },
                    discount: function () {
                        return couponPrice;
                    },
                    dayPlan: function () {
                        return dataTour['travel']['DayPlan']['planNumberDay'];
                    },

                    inclusion: function () {
                        return dataTour['travel']['tripInclusion'];
                    },
                    exclusion: function () {
                        return dataTour['travel']['tripExclusion'];
                    },

                    total: function () {
                        return rawPrice.mainPrice + rawPrice.optionalPrice;
                    },
                    deposit: function () {
                        return dataTour['trip']['depositPayable'];
                        // return amount;
                    },


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


                    image: function () {
                        return Assets.getText("image/logo02.txt");
                    },
                    tourCode: function () {
                        return (dataTour['trip'].tourDateStart.format('{MM}')) + ((dataTour['trip'].tourDateStart.format('{yy}'))) + (dataTour['trip'].tourDateEnd.format('{dd}')) + dataTour['travel'].Location + dataTour['trip'].tourDateStart.daysAgo(dataTour['trip'].tourDateEnd) + 'D' + dataTour['travel'].Instructor;
                    },
                    totalAmount: function (total, deposit) {
                        return total - deposit - couponPrice;
                    },
                    totalAll: function (balance, firstPayment) {
                        return firstPayment + parseInt(balance);
                    },
                    firstPayment: function () {
                        return aboutCustomer.raw.firstPayment||0;
                    },
                    dateDeposit: function () {
                        if (aboutCustomer.raw.depositAt) {
                            return aboutCustomer.raw.depositAt.format('{dd}/{MM}/{yyyy}');
                        }
                    },

                });

                var html1 = SSR.render('htmlPDF', {});
                //-------------------------------------
                var pdf = Npm.require('html-pdf');
                config = {
                    "directory": pdfsPath,
                    // "directory": "/tmp",       // The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp'
                    // "height": "10.5in",        // allowed units: mm, cm, in, px
                    // "width": "8in",            // allowed units: mm, cm, in, px
                    "format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                    "orientation": "landscape", // portrait or landscape
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
                    // "footer": {
                    //     // "height": "28mm",
                    //     "contents": {
                    //         // first: 'Cover page',
                    //         // 2: 'Second page', // Any page number is working. 1-based index
                    //         default: '<div  style="display: inline-block;line-height: 14px;font-size: 10px;padding: 20px 50px;">UNUSUAL EXPEDITION PTE LTD<div style="float: right;font-size: 8px;font-weight: 700;text-align: right;">© Copyright. ALL RIGHTS RESERVED.</div><div style="  line-height: 10px;  font-size: 8px; color: #5c5c5c;  padding-bottom: 10px; display: inline-block;" ">TA License: 02513 Company Registration: 201400451K<br>1, Rochor Canal Road, #06‐34C, <br>Sim Lim Square, Singapore 188504<br>Tel: +65 6591 8811 Email: contact@unusualexpedition.com</div></div>' // fallback value
                    //         // last: 'Last Page'
                    //     }
                    // }
                };
                pdf.create(html1, config).toFile(pdfsPath + '/' + Random.id(8) + '.pdf', Meteor.bindEnvironment(function (err, resq) {
                    var cid_value = Date.now() + '.image.jpg';
                    var attachments = [];
                    var attachments2 = [];
                    // process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin123@@smtp.gmail.com:465/";

                    if (typePayment === 'deposit') {
                        attachments = [
                            {
                                fileName: 'unusual-expedition-TripInvoice.pdf',
                                filePath: resq.filename,
                                // contentType: 'application/pdf',
                                cid: cid_value,
                            },
                        ];


                        // attachments2 = [
                        //     {
                        //         fileName: 'unusual-expedition-TripInvoice.pdf',
                        //         filePath: 'http://dev.chord:4500/htmlServer?id=aGtkJPvhxv4KzFocu',
                        //         cid: cid_value
                        //     },
                        // ];
                        // Meteor.call('sendEmail',customer, 'unusualexpeditionsingapore@gmail.com',subject,html,attachments);
                        process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin1234@@smtp.gmail.com:465/";
                        Email.send({
                            to: customer,
                            cc: 'unusualexpeditionsingapore@gmail.com',
                            from: 'unusualexpeditionsingapore@gmail.com',
                            subject: 'Unusual-Expedition -' + dataTour['travel'].tourName + '- ' + (dataTour['trip'].tourDateStart.format('{MM}')) + ((dataTour['trip'].tourDateStart.format('{yy}'))) + (dataTour['trip'].tourDateEnd.format('{dd}')) + dataTour['travel'].Location + dataTour['trip'].tourDateStart.daysAgo(dataTour['trip'].tourDateEnd) + 'D' + dataTour['travel'].Instructor,
                            text: "Trip Invoice",
                            html: html,
                            attachments: attachments
                        });
                    }

                    else {
                        attachments = [
                            {
                                fileName: 'unusual-expedition-TripInvoice.pdf',
                                filePath: resq.filename,
                                cid: cid_value
                            },
                            {
                                fileName: 'unusual-expedition-TripNote.pdf',
                                filePath: rootUrl + 'htmlServer?id=' + dataTour['trip']._id,
                                cid: cid_value
                            }
                        ];
                        // attachments2 = [
                        //     {
                        //         fileName: 'unusual-expedition-TripInvoice.pdf',
                        //         filePath: resq.filename,
                        //         cid: cid_value
                        //     },
                        //
                        // ];
                        process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin1234@@smtp.gmail.com:465/";
                        Email.send({
                            to: customer,
                            cc: 'unusualexpeditionsingapore@gmail.com',
                            from: 'unusualexpeditionsingapore@gmail.com',
                            subject: 'Unusual-Expedition -' + dataTour['travel'].tourName + '- ' + (dataTour['trip'].tourDateStart.format('{MM}')) + ((dataTour['trip'].tourDateStart.format('{yy}'))) + (dataTour['trip'].tourDateEnd.format('{dd}')) + dataTour['travel'].Location + dataTour['trip'].tourDateStart.daysAgo(dataTour['trip'].tourDateEnd) + 'D' + dataTour['travel'].Instructor,
                            // text: text,
                            html: html,
                            attachments: attachments
                        });

                    }
                }));
            }

            //
            // var $ = cheerio.load(res['content'])
            // var selector = '#invoice_name';
            // $(selector).text(rawCustomers.firstname + rawCustomers.lastname);
            // // $('#id_1').append('<p class="p9 ft11">Day 3 – Pahalgam (Full Day) – (B,L,D)</p>')
            // $('#email').text(customer);
            // var date = dataTour.trip.tourDateStart;
            // var invoiceDate = new Date();
            // $('#invoiceDate').text((invoiceDate.getDate()) + '  / ' + (invoiceDate.getMonth() + 1) + '  /  ' + ((invoiceDate.getFullYear()).toString()));
            // $('#priceTour').text(amount);
            // $('#orderNumber').text(ordernumber);
            // $('#id_2_1').append('<p class="p14 ft1">INCLUSION</p>');
            // dataTour['travel']['tripInclusion'].forEach(function (item) {
            //     $('#id_2_1').append('<p class="p9 ft11">' + item + '</p>')
            // })
            //
            // $('#id_2_1').append('<p class="p14 ft1">TRIP EXCLUSION</p>');
            // dataTour['travel']['tripExclusion'].forEach(function (item) {
            //     $('#id_2_1').append('<p class="p9 ft11">' + item + '</p>')
            // })
            //
            // $('#id_2_1').append(' <p class="p15 ft1">Terms</p> <p class="p12 ft13">UNUSUAL EXPEDITION PTE LTD</p> <p class="p12 ft14">DUE UPON RECEIPT</p> <p class="p12 ft1">808, FRENCH ROAD, <nobr>#07-163,</nobr> KITCHENER COMPLEX, SINGAPORE 200808</p> <p class="p14 ft1">PHONE: +65 <nobr>6591-8811</nobr></p> <p class="p14 ft1">EMAIL: contact@unusualexpedition.com</p>')
            // var i = 1;
            // dataTour['travel']['DayPlan']['planNumberDay'].forEach(function (item) {
            //     $('#id_1').append('<td class="tr6 td16"><p class="p5 ft8">&nbsp;<p class="p9 ft11">Day ' + i + ' – ' + item['Daytitle'] + '</p></td>')
            //     i++;
            // })
            // $('#blanceDue').text(dataTour['trip']['tourPrice']['totalPrice']);
            //
            // $('#code nobr').text((dataTour.trip.tourDateStart.format('{MM}')) + (dataTour.trip.tourDateStart.format('{yy}')) + (dataTour.trip.tourDateStart.format('{dd}')) + dataTour.travel.Location + dataTour.trip.tourDateStart.daysAgo(dataTour.trip.tourDateEnd) + 'D' + dataTour.travel.Instructor);
            //
            // $('#dateBook').text((date.getDate()) + '  / ' + (date.getMonth() + 1) + '  /  ' + ((date.getFullYear()).toString()));
            // $('#price').text('$ ' + dataTour['trip']['tourPrice']['totalPrice']);
            // $('#price2').text('$ ' + dataTour['trip']['tourPrice']['totalPrice']);
            // $('#priceTour').text('$ ' + dataTour['trip']['tourPrice']['totalPrice']);
            // $('#blanceDue').text('$ ' + dataTour['trip']['tourPrice']['totalPrice']);
            // $('#allPrice').text('$ ' + dataTour['trip']['tourPrice']['totalPrice']);
            // $('#location').text(dataTour['travel'].tourName);
            //
            // url2pdf.renderFromHTML($('html').html(), {
            //     autoCleanFileAgeInSec: 24 * 3600,
            //     paperSize: {format: "A4", orientation: 'portrait'}, //Pretty self explanatory, adjust as needed
            //     saveDir: pdfsPath, //This is where the temporary files will be kept
            //     idLength: 30,
            // }).then(function (path) {
            //     var cid_value = Date.now() + '.image.jpg';
            //     var attachments = [];
            //     var attachments2 = [];
            //     // process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin123@@smtp.gmail.com:465/";
            //
            //     if (typePayment === 'deposit') {
            //         attachments = [
            //             {
            //                 fileName: 'unusual-expedition-TripInvoice.pdf',
            //                 filePath: path,
            //                 cid: cid_value
            //             },
            //         ];
            //         // attachments2 = [
            //         //     {
            //         //         fileName: 'unusual-expedition-TripInvoice.pdf',
            //         //         filePath: 'http://dev.chord:4500/htmlServer?id=aGtkJPvhxv4KzFocu',
            //         //         cid: cid_value
            //         //     },
            //         // ];
            //         // Meteor.call('sendEmail',customer, 'unusualexpeditionsingapore@gmail.com',subject,html,attachments);
            //         process.env.MAIL_URL = "smtp://unusualexpeditionsingapore%40gmail.com:admin1234@@smtp.gmail.com:465/";
            //         Email.send({
            //             to: customer,
            //             cc: 'unusualexpeditionsingapore@gmail.com',
            //             from: 'unusualexpeditionsingapore@gmail.com',
            //             subject: 'Unusual-Expedition -' + dataTour['travel'].tourName + '- ' + (dataTour['trip'].tourDateStart.format('{MM}')) + ((dataTour['trip'].tourDateStart.format('{yy}'))) + (dataTour['trip'].tourDateEnd.format('{dd}')) + dataTour['travel'].Location + dataTour['trip'].tourDateStart.daysAgo(dataTour['trip'].tourDateEnd) + 'D' + dataTour['travel'].Instructor,
            //             text: "Trip Invoice",
            //             html: html,
            //             attachments: attachments
            //         });
            //     }
            //     else {
            //         attachments = [
            //             {
            //                 fileName: 'unusual-expedition-TripInvoice.pdf',
            //                 filePath: path,
            //                 cid: cid_value
            //             },
            //         ];
            //         attachments2 = [
            //             {
            //                 fileName: 'unusual-expedition-TripInvoice.pdf',
            //                 filePath: path,
            //                 cid: cid_value
            //             },
            //
            //         ];
            //         Email.send({
            //             to: customer,
            //             cc: 'unusualexpeditionsingapore@gmail.com',
            //             from: 'unusualexpeditionsingapore@gmail.com',
            //             subject: 'Unusual-Expedition -' + dataTour['travel'].tourName + '- ' + (dataTour['trip'].tourDateStart.format('{MM}')) + ((dataTour['trip'].tourDateStart.format('{yy}'))) + (dataTour['trip'].tourDateEnd.format('{dd}')) + dataTour['travel'].Location + dataTour['trip'].tourDateStart.daysAgo(dataTour['trip'].tourDateEnd) + 'D' + dataTour['travel'].Instructor,
            //             // text: text,
            //             html: html,
            //             attachments: attachments
            //         });
            //         Email.send({
            //             to: customer,
            //             cc: 'unusualexpeditionsingapore@gmail.com',
            //             from: 'unusualexpeditionsingapore@gmail.com',
            //             subject: 'Unusual-Expedition -' + dataTour['travel'].tourName + '- ' + (dataTour['trip'].tourDateStart.format('{MM}')) + ((dataTour['trip'].tourDateStart.format('{yy}'))) + (dataTour['trip'].tourDateEnd.format('{dd}')) + dataTour['travel'].Location + dataTour['trip'].tourDateStart.daysAgo(dataTour['trip'].tourDateEnd) + 'D' + dataTour['travel'].Instructor,
            //             // text: text,
            //             html: html,
            //             attachments: attachments2
            //         });
            //
            //     }
            //
            //     console.log(attachments);
            //
            // })
        });


    },
    "sendEmail": function (to, from, subject, html, attachments) {
        console.log(subject, attachments);
        this.unblock();
        Email.send({to: to, from: from, subject: subject, html: html, attachments: attachments});
    }
});




