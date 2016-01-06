import 'babel-polyfill';
import fs from 'fs';
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

        writeSampleResultFile('by-day.json', days);
    });

    it('can recommend pickups by location', () => {
        var locations = pickupsEngine.closestLocations([[-77.392502, 38.983965]]);
        locations.should.have.length.above(0);

        writeSampleResultFile('by-location.json', locations);
    });
});

function writeSampleResultFile(name, obj) {
    fs.writeFile('sample-results/' + name, JSON.stringify(obj, null, 2), function (err) {
        if (err) throw err;
    });
}

