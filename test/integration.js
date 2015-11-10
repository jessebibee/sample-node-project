import chai from 'chai';
import recommender from '../src/pickupsRecommender';
import deliveries from '../data/availableDeliveries.json';
import deliveriesService from '../src/deliveriesService';
chai.should();

let pickups;

before(() => pickups = deliveriesService.getPickupLocations(deliveries));

describe('Pickups recommender', () => {
    it('can recommend pickups by day', () => {
        var days = recommender.byDay(pickups, [[-77.392502, 38.983965]]);
        days.should.have.length.above(0);
    });

    it('can recommend pickups by location', () => {
        var locations = recommender.byPickupLocation(pickups, [[-77.392502, 38.983965]]);
        locations.should.have.length.above(0);
    });
});
