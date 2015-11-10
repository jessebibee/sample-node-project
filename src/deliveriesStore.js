let currentDeliveries = [];
let listeners = [];

const deliveriesStore = {
    subscribe: function(listener) {
        listeners.push(listener);

        return function unsubscribe() {
            var index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        }
    },

    setDeliveries: function(deliveries) {
        currentDeliveries = deliveries;
        listeners.forEach(cb => cb());
    },

    getAvailableDeliveries: function() {
        return currentDeliveries;
    }
};

export default deliveriesStore;