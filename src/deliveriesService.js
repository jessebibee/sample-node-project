export default {
    getPickupLocations: function(deliveries) {
        return deliveries.filter(d => d.Location).map(toPickup);
    }
};

function toPickup(d) {
    let pickup = {
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
        pickup.location = {
            deliveryLocationId: d.Location.DeliveryLocationId,
            type: d.Location.Type,
            name: d.Location.Name,
            description: d.Location.Description,
            coordinates: d.Location.LatLon.split(',').reverse().map(c => +c) //following GeoJSON spec for point
        };
    }

    return pickup;
}
