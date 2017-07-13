// /**
//  * Created by HuycongNguyen on 1/2/2017.
//  */
//
// var pdfsPath = process.env.PWD + '/server/pdfs';
// HTTP.get(Meteor.absoluteUrl('trip-note.html'),{},function (err, res) {
//
//     var cheerio = Npm.require('cheerio');
//     var $ = cheerio.load(res['content']);
//
//     $('#tripNoteWelcome').text("Viet Nam...........................................");
//     $('#tripName').text("hohohohohohoh");
//     $('#prelude').append("<div class='tripnote-section-subtitle'>Tuscany Rolling Hills</div><ul class='tripnote-list'><li class='tripnote-list-item'><div class='tripnote-read-text'>One of Italy’s most romanticised regions, Tuscany’s rolling hills, varied coastline and postcard-ready towns. The stunning landscapes of rolling hills lined with cypress trees, where vineyards alternate with olive groves to create a patchwork of incomparable natural beauty that will leave you in awe.</div> </li></ul>" );
//     $('#prelude').append("<div class='tripnote-section-subtitle'>Tuscany Rolling Hills</div><ul class='tripnote-list'><li class='tripnote-list-item'><div class='tripnote-read-text'>One of Italy’s most romanticised regions, Tuscany’s rolling hills, varied coastline and postcard-ready towns. The stunning landscapes of rolling hills lined with cypress trees, where vineyards alternate with olive groves to create a patchwork of incomparable natural beauty that will leave you in awe.</div> </li></ul>" );
//     $('#prelude').append("<div class='tripnote-section-subtitle'>Tuscany Rolling Hills</div><ul class='tripnote-list'><li class='tripnote-list-item'><div class='tripnote-read-text'>One of Italy’s most romanticised regions, Tuscany’s rolling hills, varied coastline and postcard-ready towns. The stunning landscapes of rolling hills lined with cypress trees, where vineyards alternate with olive groves to create a patchwork of incomparable natural beauty that will leave you in awe.</div> </li></ul>" );
//     $('#prelude').append("<div class='tripnote-section-subtitle'>Tuscany Rolling Hills</div><ul class='tripnote-list'><li class='tripnote-list-item'><div class='tripnote-read-text'>One of Italy’s most romanticised regions, Tuscany’s rolling hills, varied coastline and postcard-ready towns. The stunning landscapes of rolling hills lined with cypress trees, where vineyards alternate with olive groves to create a patchwork of incomparable natural beauty that will leave you in awe.</div> </li></ul>" );
//     $('#prelude').append("<div class='tripnote-section-subtitle'>Tuscany Rolling Hills</div><ul class='tripnote-list'><li class='tripnote-list-item'><div class='tripnote-read-text'>One of Italy’s most romanticised regions, Tuscany’s rolling hills, varied coastline and postcard-ready towns. The stunning landscapes of rolling hills lined with cypress trees, where vineyards alternate with olive groves to create a patchwork of incomparable natural beauty that will leave you in awe.</div> </li></ul>" );
//
//
//
//     url2pdf.renderFromHTML($('html').html(), {
//         paperSize: {format: "A4", orientation: 'portrait'}, //Pretty self explanatory, adjust as needed
//         saveDir: pdfsPath, //This is where the temporary files will be kept
//         idLength: 30 //The length of the file ID, adjust if you need to avoid conflicts or just want smaller filenames
//     }).then(function (path) {
//         console.log("-------------"+path+"-------------------");
//         // pathTripNote=path;
//         // sendEmail2('nguyenhuyconglove@gmail.com', 'CLONE UEEEEEEEEEEEEEEEEEEEEEEE Send test Invoice from Huan', 'Hi Jos, this is your invoice for your trip', path,path, path);
//         // sendEmail(customer, 'UNUNUSUAL EXPEDITION', 'Hi , this is your invoice for your trip', pathInvoice,pathTripNote, '',html);
//
//     })
//
// })