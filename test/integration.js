import chai from 'chai';
import recommender from '../src/pickupsRecommender';
import deliveries from '../data/availableDeliveries.json';
import deliveriesService from '../src/deliveriesService';
chai.should();

let pickups;

before(() => pickups = deliveriesService.getPickupLocations(deliveries));

describe('Pickups recommender', () => {
    it('can recommend pickups by day', () => {
        var values = recommender.byDay(pickups, [-77.392502, 38.983965]);
        console.log(values);
    });
});
