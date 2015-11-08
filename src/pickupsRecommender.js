import { minDistance, date } from './sorter';

const recommender = {
    byDay: function (pickups, locations, pickupLocationsPerDay = 3) {
        let pickupDays = [];

        pickups.reduce(toDays, new Map()).forEach((value, key) => {
            pickupDays.push({
                date: key,
                pickups: value.sort(minDistance(locations, v => v.location.coordinates))
                    .slice(0, pickupLocationsPerDay)
            });
        });

        return pickupDays.sort(date(d => d.date));
    }
    //byLocation
};

function toDays(map, pickup) {
    map.has(pickup.date) ?
        map.get(pickup.date).push(pickup) :
        map.set(pickup.date, [pickup]);

    return map;
}

export default recommender;