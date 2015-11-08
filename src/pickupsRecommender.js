import { minDistance, date } from './sorter';

const recommender = {
    byDay: function (pickups, locations, pickupLocationsPerDay = 3) {
        const pickupDays = [];

        pickups.reduce(toDays, new Map()).forEach((value, key) => {
            pickupDays.push({
                date: key,
                pickups: value.sort(minDistance(locations, v => v.location.coordinates))
                    .slice(0, pickupLocationsPerDay)
            });
        });

        return pickupDays.sort(date(d => d.date));
    },
    byPickupLocation: function (pickups, locations) {
        return Array.from(pickups.reduce(toLocations, new Map()).values())
            .sort(minDistance(locations, p => p.coordinates));
    }
};

function toDays(map, pickup) {
    map.has(pickup.date) ?
        map.get(pickup.date).push(pickup) :
        map.set(pickup.date, [pickup]);

    return map;
}

function toLocations(map, pickup) {
    map.has(pickup.location.deliveryLocationId) ?
        map.get(pickup.location.deliveryLocationId).slots.push(pickup.slot) :
        map.set(pickup.location.deliveryLocationId, Object.assign(pickup.location, { slots: [pickup.slot] }));

    return map;
}

export default recommender;