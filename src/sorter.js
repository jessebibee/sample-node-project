import turfDistance from 'turf-distance';
import point from 'turf-point';

export function minDistance(fromCoordinates, accessor) {
    const fromLocations = fromCoordinates.map(c => point(c));

    return function (a, b) {
        const pointA = point(accessor(a));
        const pointB = point(accessor(b));

        const nearestDistanceToA = Math.min.apply(null, fromLocations.map(l => turfDistance(l, pointA)));
        const nearestDistanceToB = Math.min.apply(null, fromLocations.map(l => turfDistance(l, pointB)));

        return nearestDistanceToA - nearestDistanceToB;
    }
}

export function date(accessor) {
    return function(a, b) {
        return Date.parse(accessor(a)) - Date.parse(accessor(b));
    };
}
