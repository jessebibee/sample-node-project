import deliveriesStore from './deliveriesStore'
import pickupsRecommender from './pickupsRecommender';

let currentPickups = [];

deliveriesStore.subscribe(() =>
    currentPickups = deliveriesStore.getAvailableDeliveries()
        .filter(d => d.Location) //deliveries with a Location are pickup spots
        .map(toPickup)
);

const pickupsEngine = {
    closestLocations: function (locations) {
        return pickupsRecommender.byPickupLocation(currentPickups, locations);
    },
    closestByDay: function (locations) {
        return pickupsRecommender.byDay(currentPickups, locations);
    }
};

export default pickupsEngine;

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


