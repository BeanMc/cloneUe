// /**
//  * Created by HuycongNguyen on 1/7/2017.
//  */
// // var Sugar = Npm.require('sugar');
// var pdfsPath = process.env.PWD + '/public/pdfs';
// fs = Npm.require('fs');
// // var cheerio = Npm.require('cheerio');
// // Picker.route('/pdf', function (params, req, response, next) {
// //
// //     // var res = HTTP.get(Meteor.absoluteUrl('guide-sheet.html'));
// //     // var res = HTTP.get(Meteor.absoluteUrl('htmlServer?id="dsadas"'));
// //     // var $ = cheerio.load(res['content']);
// //     // var idTour = Object.fromQueryString(req['url']).id;
// //     // var aboutTour = Tour.findOne({_id: idTour});
// //     //
// //     // $('#nameTour').text(Trip.findOne(aboutTour.trip).tourName);
// //     //
// //     // aboutTour.peopleInTravel.forEach(function (item, index) {
// //     //     // if(item.payment==="fullPayment"){
// //     //     //     var aboutCustomer = Customers.findOne({_id: item.idCustomer});
// //     //     //     if (index % 2 !== 0) {
// //     //     //         $('#customersInTour').append(' <div class="darken-row sheet-row"><div class="sheet-row-no"> <div>' + index + '</div> </div> <div class="sheet-row-firstname"> <div>' + aboutCustomer.firstname + '</div> </div> <div class="sheet-row-lastname"> <div>' + aboutCustomer.lastname + '</div> </div> <div class="sheet-row-phone"> <div>+' + (aboutCustomer.phoneCode || '') + aboutCustomer.phone + '</div> </div> <div class="sheet-row-passport"> <div>' + aboutCustomer.passportNo + '</div> </div> <div class="sheet-row-email"> <div>' + aboutCustomer.email + '</div> </div> <div class="sheet-row-gender"> <div>' + aboutCustomer.gender + '</div> </div> <div class="sheet-row-nationality"> <div>' + aboutCustomer.nationality + '</div> </div> <div class="sheet-row-meal"> <div>' + aboutCustomer.meal + '</div> </div> <div class="sheet-row-room"> <div>' + item.room + '</div> </div> <div class="sheet-row-request"> <div>' + item.request || '' + '</div> </div> </div>')
// //     //     //     }
// //     //     //     else {
// //     //     //         $('#customersInTour').append(' <div class="sheet-row"><div class="sheet-row-no"> <div>' + index + '</div> </div> <div class="sheet-row-firstname"> <div>' + aboutCustomer.firstname + '</div> </div> <div class="sheet-row-lastname"> <div>' + aboutCustomer.lastname + '</div> </div> <div class="sheet-row-phone"> <div>+' + (aboutCustomer.phoneCode || '') + aboutCustomer.phone + '</div> </div> <div class="sheet-row-passport"> <div>' + aboutCustomer.passportNo + '</div> </div> <div class="sheet-row-email"> <div>' + aboutCustomer.email + '</div> </div> <div class="sheet-row-gender"> <div>' + aboutCustomer.gender + '</div> </div> <div class="sheet-row-nationality"> <div>' + aboutCustomer.nationality + '</div> </div> <div class="sheet-row-meal"> <div>' + aboutCustomer.meal + '</div> </div> <div class="sheet-row-room"> <div>' + item.room + '</div> </div> <div class="sheet-row-request"> <div>' + item.request || '' + '</div> </div> </div>')
// //     //     //     }
// //     //     // }
// //     //
// //     //
// //     //     //TEST PDF #IF TRUE ABOVE
// //     //     var aboutCustomer = Customers.findOne({_id: item.idCustomer});
// //     //     if (index % 2 !== 0) {
// //     //         $('#customersInTour').append(' <div class="darken-row sheet-row"><div class="sheet-row-no"> <div>' + index + '</div> </div> <div class="sheet-row-firstname"> <div>' + aboutCustomer.firstname + '</div> </div> <div class="sheet-row-lastname"> <div>' + aboutCustomer.lastname + '</div> </div> <div class="sheet-row-phone"> <div>+' + (aboutCustomer.phoneCode || '') + aboutCustomer.phone + '</div> </div> <div class="sheet-row-passport"> <div>' + aboutCustomer.passportNo + '</div> </div> <div class="sheet-row-email"> <div>' + aboutCustomer.email + '</div> </div> <div class="sheet-row-gender"> <div>' + aboutCustomer.gender + '</div> </div> <div class="sheet-row-nationality"> <div>' + aboutCustomer.nationality + '</div> </div> <div class="sheet-row-meal"> <div>' + aboutCustomer.meal + '</div> </div> <div class="sheet-row-room"> <div>' + item.room + '</div> </div> <div class="sheet-row-request"> <div>' + item.request || '' + '</div> </div> </div>')
// //     //     }
// //     //     else {
// //     //         $('#customersInTour').append(' <div class="sheet-row"><div class="sheet-row-no"> <div>' + index + '</div> </div> <div class="sheet-row-firstname"> <div>' + aboutCustomer.firstname + '</div> </div> <div class="sheet-row-lastname"> <div>' + aboutCustomer.lastname + '</div> </div> <div class="sheet-row-phone"> <div>+' + (aboutCustomer.phoneCode || '') + aboutCustomer.phone + '</div> </div> <div class="sheet-row-passport"> <div>' + aboutCustomer.passportNo + '</div> </div> <div class="sheet-row-email"> <div>' + aboutCustomer.email + '</div> </div> <div class="sheet-row-gender"> <div>' + aboutCustomer.gender + '</div> </div> <div class="sheet-row-nationality"> <div>' + aboutCustomer.nationality + '</div> </div> <div class="sheet-row-meal"> <div>' + aboutCustomer.meal + '</div> </div> <div class="sheet-row-room"> <div>' + item.room + '</div> </div> <div class="sheet-row-request"> <div>' + item.request || '' + '</div> </div> </div>')
// //     //     }
// //     //
// //     // });
// //
// //     // var html = $.html();
// //     // fs = require('fs');
// //     // fs.writeFileSync(pdfsPath + '.html', html);
// //     // // var gethtml=HTTP.get(Meteor.absoluteUrl('pdfs.html')).content;
// //     //
// //     // var gethtml = fs.readFileSync(pdfsPath + '.html', 'utf8');
// //
// //     console.log(Meteor.absoluteUrl('htmlServer?id='+Object.fromQueryString(req['url']).id));
// //     var gethtml = HTTP.get(Meteor.absoluteUrl('htmlServer?id='+Object.fromQueryString(req['url']).id));
// //     url2pdf.renderFromHTML(gethtml.content, {
// //         paperSize: {format: "A3", orientation: 'landscape'}, //Pretty self explanatory, adjust as needed
// //         saveDir: pdfsPath,
// //         idLength: 30,
// //     }).then(function (path) {
// //         console.log(path);
// //         fs.openSync(path,"r+");
// //         fs.readFile(path, function (err, data) {
// //             response.writeHead(200, {
// //                 "Content-Type": "application/pdf",
// //                 "Content-Length": data.length,
// //             });
// //             response.write(data);
// //             response.end();
// //             fs.unlinkSync(path);
// //         });
// //
// //     }).catch(function (err) {
// //         response.status(500).json(err);
// //     })
// // });
//
// // Picker.route('/htmlServer', function (params, req, response, next) {
// //
// //     var idTour = Object.fromQueryString(req['url']).id;
// //     var aboutCustomers = (Travel.findOne({_id: idTour}).peopleInTravel||[]).map(function (item) {
// //         if(item.payment==='fullPayment'){
// //             item.getCustomer={};
// //             item.getCustomer= Customers.findOne({_id: item.idCustomer})
// //             return item;
// //         }
// //         return '';
// //     }).remove('');
// //     console.log(Tour.findOne({_id:idTour}));
// //     var idTrip= Travel.findOne({_id: idTour}).trip;
// //     var nameTrip=Tour.findOne({_id:idTrip}).tourName;
// //     // response.writeHeader(200, {"Content-Type": "text/html"});
// //     // response.write(html);
// //     // response.end();
// //
// //
// //     Assets.getText('guide-sheet.html', function (err, res) {
// //         if (res) {
// //             SSR.compileTemplate('emailText', res);
// //             var html = SSR.render('emailText', {
// //
// //                 nameTrip: nameTrip,
// //                 customers: aboutCustomers,
// //             });
// //             response.writeHeader(200, {"Content-Type": "text/html"});
// //             response.write(html);
// //             response.end();
// //         }
// //     })
// //
// // })
// //
//
//
//
