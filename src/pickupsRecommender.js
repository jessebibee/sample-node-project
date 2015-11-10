import { minDistance, date } from './sorter';
import distance from 'turf-distance';
import point from 'turf-point';

const recommender = {
    byDay: function (pickups, locations, pickupLocationsPerDay = 3) {
        const pickupDays = [];

        pickups.reduce(toDays, new Map()).forEach((value, key) => {
            pickupDays.push({
                date: key,
                pickups: value.sort(minDistance(locations, v => v.location.coordinates))
                    .slice(0, pickupLocationsPerDay)
                    .map(p => appendDistances(p, locations, r => r.location.coordinates))
            });
        });

        return pickupDays.sort(date(d => d.date));
    },
    byPickupLocation: function (pickups, locations) {
        return Array.from(pickups.reduce(toLocations, new Map()).values())
            .sort(minDistance(locations, p => p.coordinates))
            .map(p => appendDistances(p, locations, r => r.coordinates))
    }
};

function toDays(map, pickup) {
    map.has(pickup.date) ?
        map.get(pickup.date).push(pickup) :
        map.set(pickup.date, [pickup]);

    return map;
}

function toLocations(map, pickup) {
    const pickupSlot = Object.assign({}, pickup.slot, { date: pickup.date });

    map.has(pickup.location.deliveryLocationId) ?
        map.get(pickup.location.deliveryLocationId).slots.push(pickupSlot) :
        map.set(pickup.location.deliveryLocationId, Object.assign({}, pickup.location, { slots: [pickupSlot] }));

    return map;
}

function appendDistances(obj, locations, resultCoordsAccessor) {
    return Object.assign({}, obj, {
            distances: locations.map(l => ({
                location: l,
                distanceInMiles: distance(point(l), point(resultCoordsAccessor(obj)), 'miles')
        }))
    });
}

export default recommender;