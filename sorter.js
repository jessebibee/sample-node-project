import turfDistance from 'turf-distance';
import point from 'turf-point';

export function distance(fromCoordinates, accessor) {
    const fromLocation = point(fromCoordinates);

    return function (a, b) {
        const distanceToA = turfDistance(fromLocation, point(accessor(a)));
        const distanceToB = turfDistance(fromLocation, point(accessor(b)));

        return distanceToA - distanceToB;
    };
}

export function distanceFromMultipleCoordinates(fromCoordinates, accessor) {
    const fromLocations = fromCoordinates.map(c => point(c));

    return function (a, b) {
        const pointA = point(accessor(a));
        const pointB = point(accessor(b));

        const nearestDistanceToA = Math.min(fromLocations.map(l => turfDistance(l, pointA)));
        const nearestDistanceToB = Math.min(fromLocations.map(l => turfDistance(l, pointB)));

        return nearestDistanceToA - nearestDistanceToB;
    }
}

//TODO - timeslots, days, ??
