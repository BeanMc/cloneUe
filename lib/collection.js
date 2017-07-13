/**
 * Created by lvhln on 10/2/2016.
 */
//
// var gaScript = 'https://www.google-analytics.com/analytics.js';
// DocHead.loadScript(gaScript, function() {
//     // Google Analytics loaded
//     ga('create', 'UA-92199017-1', 'auto');
//     ga('send', 'pageview');
// });


Tour = new Mongo.Collection('trip');
Imagegallery = new Mongo.Collection('imagehome');
Imagehome = new Mongo.Collection('imagegallery');
Article = new Mongo.Collection('article');
Linkvideo = new Mongo.Collection('linkvideo');
Travel = new Mongo.Collection('tour');
Customers = new Mongo.Collection('customers');
Coupon = new Mongo.Collection('coupon');
MySeo = new Mongo.Collection('mySeo');


Customers.attachSchema(new SimpleSchema({
    email: {
        type: String,
        optional: true,
    },
    firstname: {
        type: String,
        optional: true,
    },
    lastname: {
        type: String,
        optional: true,
    },
    dateofbird: {
        type: Date,
        optional: true,
    },
    gender: {
        type: String,
        optional: true,
    },
    nationality: {
        type: String,
        optional: true,
    },
    address1: {
        type: String,
        optional: true,
    },
    address2: {
        type: String,
        optional: true,
    },
    city: {
        type: String,
        optional: true,
    },
    zip: {
        type: String,
        optional: true,
    },
    phone: {
        type: String,
        optional: true,
    },
    phoneCode: {
        type: String,
        optional: true,
    },
    passportNo: {
        type: String,
        optional: true,
    },
    passportIssue: {
        type: String,
        optional: true,
    },
    passportExpiryDate: {
        type: String,
        optional: true,
    },
    meal: {
        type: String,
        optional: true,
    },
    extra: {
        type: String,
        optional: true,
    },
    request: {
        type: String,
        optional: true,
    },
    createdAt: {
        type: Date,
        optional: true,
    },

    kinName: {
        type: String,
        optional: true,
    },
    kinRelationship: {
        type: String,
        optional: true,

    },
    kinPhoneNo: {
        type: String,
        optional: true,
    },
    // agentCode: agentcode,
    agentCode: {
        type: String,
        optional: true,
    },

    historyBook: {
        type: [Object],
        optional: true,
    },
    'historyBook.$.idTour': {
        type: String,
        optional: true,
    },
    'historyBook.$.room': {
        type: String,
        optional: true,
    },
    'historyBook.$.mainPrice': {
        type: Number,
        optional: true,
    },
    'historyBook.$.optionalNote': {
        type: String,
        optional: true,
    },
    'historyBook.$.optionalPrice': {
        type: Number,
        optional: true,
    },
    'historyBook.$.discount': {
        type: String,
        optional: true,
    },
    'historyBook.$.paymentMethod': {
        type: String,
        optional: true,
    },
    'historyBook.$.createdAt': {
        type: Date,
        optional: true,
    },


}))


Travel.attachSchema(new SimpleSchema({

    // status:{
    //     type: String,
    //     // label: "Customers In",
    //     optional: true,
    // },
    peopleInTravel: {
        type: [Object],
        label: "Customers In",
        optional: true,
        // defaultValue:[],

    },

    //
    'peopleInTravel.$': {
        type: Object,
        optional: true,

    },

    'peopleInTravel.$.idCustomer': {
        type: String,
        optional: function () {
            return true
        },

    },


    'peopleInTravel.$.request': {
        type: String,
        optional: true,
    },
    'peopleInTravel.$.discountType': {
        type: String,
        optional: true,
    },
    'peopleInTravel.$.discountValue': {
        type: String,
        optional: true,
    },
    'peopleInTravel.$.coupon': {
        type: String,
        optional: true,
    },

    'peopleInTravel.$.email': {
        type: String,
        optional: true,
    },
    'peopleInTravel.$.room': {
        type: String,
        optional: true,
    },
    'peopleInTravel.$.optionalRate': {
        type: String,
        optional: true,
    },

    'peopleInTravel.$.meal': {
        type: String,
        optional: true,
    },
    'peopleInTravel.$.extra': {
        type: String,
        optional: true,
    },
    'peopleInTravel.$.payment': {
        type: String,
        optional: true,
    },

    'peopleInTravel.$.createdAt': {
        type: Date,
        optional: true

    },
    'peopleInTravel.$.secondPayment': {
        type: Number,
        optional: true

    },
    'peopleInTravel.$.firstPayment': {
        type: Number,
        optional: true

    },
    'peopleInTravel.$.totalPrice': {
        type: Number,
        optional: true

    },
    'peopleInTravel.$.linkFullPayment': {
        type: String,
        optional: true

    },
    //paymentStatus
    'peopleInTravel.$.paymentStatus': {
        type: String,
        optional: true

    },
    'peopleInTravel.$.paymentMethod': {
        type: String,
        optional: true

    },
    'peopleInTravel.$.order_number': {
        type: String,
        optional: true

    },
    'peopleInTravel.$.refundAt': {
        type: Date,
        optional: true,
    },
    'peopleInTravel.$.linkdeposit': {
        type: String,
        optional: true,
    },
    'peopleInTravel.$.depositAt': {
        type: Date,
        optional: true,
    },
    'peopleInTravel.$.fullPaymentAt': {
        type: Date,
        optional: true,
    },
    'peopleInTravel.$.refundAmount': {
        type: Number,
        optional: true,
    },
}))
;

MyImage = new FS.Collection('image', {
    stores: [new FS.Store.GridFS('image', {})]
})


