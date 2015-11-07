import { distance } from './sorter';

const recommender = {
    byDistance: function (pickups, locationCoordinates, number) {
        return pickups
            .sort(distance(locationCoordinates, l => l.location.coordinates))
            .slice(0, number);
    }
};

export default recommender;