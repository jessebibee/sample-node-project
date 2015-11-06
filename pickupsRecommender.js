import deliveriesService from './deliveriesService';
import { distance } from './sorter';

const recommender = {
    byLocation: function (locationCoordinates, number) {
        return deliveriesService.getPickupLocations()
            .sort(distance(locationCoordinates, l => l.location.coordinates))
            .slice(0, number);
    }
};

export default recommender;