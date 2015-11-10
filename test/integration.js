import chai from 'chai';
import deliveries from '../data/availableDeliveries.json';
import deliveriesStore from '../src/deliveriesStore';
import pickupsEngine from '../src/pickupsEngine';
chai.should();

before(() => deliveriesStore.setDeliveries(deliveries));

describe('Pickups recommender', () => {
    it('can recommend pickups by day', () => {
        var days = pickupsEngine.closestByDay([[-77.392502, 38.983965]]);
        days.should.have.length.above(0);
    });

    it('can recommend pickups by location', () => {
        var locations = pickupsEngine.closestLocations([[-77.392502, 38.983965]]);
        locations.should.have.length.above(0);
    });
});

