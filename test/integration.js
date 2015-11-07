import chai from 'chai';
import recommender from '../src/pickupsRecommender';
import deliveries from '../data/availableDeliveries.json';
import deliveriesService from '../src/deliveriesService';
chai.should();

let pickups;

before(() => pickups = deliveriesService.getPickupLocations(deliveries));

describe('Pickups recommender', () => {
    it('returns top 2 locations', () => {
        var values = recommender.byDistance(pickups, [-77.392502, 38.983965], 2);
        values.should.have.length(2);
    });
});
