Template.viewupcomingtour.helpers({
    images: function (data) {
        if (data && data['planNumberDay'][0] &&data['planNumberDay'][0]['Daydescriptions']) {
            return data['planNumberDay'][0]['Daydescriptions'][0];
        }
    },


    tourAvailabilitys: function (data) {
        if (data === 'true') {
            return true;
        }
        return false;
    },
    datetime: function (data) {
        if (data) {
            return (data.getDate() + 1) + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
        }
    }
})