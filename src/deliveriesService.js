import deliveries from './../data/availableDeliveries.json';

const availableDeliveries = deliveries.map(transformDelivery);

export default {
    getPickupLocations: function() {
        return availableDeliveries.filter(d => d.location);
        //TODO - within X miles? //pass predicate as argument?
    }
};

function transformDelivery(d) {
    let delivery = {
        deliveryId: d.DeliveryId,
        date: d.Date,
        slot: {
            deliverySlotId: d.Slot.DeliverySlotId,
            day: d.Slot.Day,
            startTime: d.Slot.StartTime,
            endTime: d.Slot.EndTime,
            orderDaysInAdvance: d.Slot.OrderDaysInAdvance
        }
    };

    if (d.Location) {
        delivery.location = {
            deliveryLocationId: d.Location.DeliveryLocationId,
            type: d.Location.Type,
            name: d.Location.Name,
            description: d.Location.Description,
            coordinates: d.Location.LatLon.split(',').reverse().map(c => +c) //following GeoJSON spec for point
        };
    }

    return delivery;
}
