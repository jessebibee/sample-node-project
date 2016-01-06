import 'babel-polyfill';
import chai from 'chai';
import recommender from '../src/pickupsRecommender';
import Guid from 'guid';
import distance from 'turf-distance';
import point from 'turf-point';
chai.should();

describe('Pickups recommender', () => {
    const baltimoreCoords = [-76.603546, 39.283294];
    const bethesdaCoords = [-77.091751, 38.979695];
    const charlottesvilleCoords = [-78.482208, 38.019968];
    const justOutsideBaltimoreCoords = [-76.668434, 39.377834];

    describe('when recommending by day', () => {

        it('returns pickups for each day ordered by day', () => {
            const baltimore = buildPickup('Baltimore', '2015-11-06', baltimoreCoords);
            const bethesda = buildPickup('Bethesda', '2015-08-05', bethesdaCoords);
            const charlottesville = buildPickup('Charlottesville', '2015-11-05', charlottesvilleCoords);
            const pickups = [baltimore, bethesda, charlottesville];

            var result = recommender.byDay(pickups, [charlottesvilleCoords], 3);

            result[0].date.should.equal('2015-08-05');
            result[1].date.should.equal('2015-11-05');
            result[2].date.should.equal('2015-11-06');
        });

        it('orders pickup locations each day by distance from one location', () => {
            const baltimore = buildPickup('Baltimore', '2015-11-05', baltimoreCoords);
            const bethesda = buildPickup('Bethesda', '2015-11-05', bethesdaCoords);
            const charlottesville = buildPickup('Charlottesville', '2015-11-05', charlottesvilleCoords);
            const pickups = [baltimore, bethesda, charlottesville];

            var result = recommender.byDay(pickups, [charlottesvilleCoords], 3);

            const resultPickups = result[0].pickups;
            resultPickups.should.have.length(3);
            resultPickups[0].deliveryId.should.equal(charlottesville.deliveryId);
            resultPickups[1].deliveryId.should.equal(bethesda.deliveryId);
            resultPickups[2].deliveryId.should.equal(baltimore.deliveryId);
        });

        it('orders pickup locations each day by minimum distance from multiple locations', () => {
            const baltimore = buildPickup('Baltimore', '2015-11-05', baltimoreCoords);
            const bethesda = buildPickup('Bethesda', '2015-11-05', bethesdaCoords);
            const charlottesville = buildPickup('Charlottesville', '2015-11-05', charlottesvilleCoords);
            const pickups = [baltimore, bethesda, charlottesville];

            var result = recommender.byDay(pickups, [charlottesvilleCoords, justOutsideBaltimoreCoords], 3);

            const resultPickups = result[0].pickups;
            resultPickups.should.have.length(3);
            resultPickups[0].deliveryId.should.equal(charlottesville.deliveryId);
            resultPickups[1].deliveryId.should.equal(baltimore.deliveryId);
            resultPickups[2].deliveryId.should.equal(bethesda.deliveryId);
        });

        it('only returns a specified number of locations per day', () => {
            const baltimore = buildPickup('Baltimore', '2015-11-05', baltimoreCoords);
            const bethesda = buildPickup('Bethesda', '2015-11-05', bethesdaCoords);
            const charlottesville = buildPickup('Charlottesville', '2015-11-05', charlottesvilleCoords);
            const pickups = [baltimore, bethesda, charlottesville];

            var result = recommender.byDay(pickups, [charlottesvilleCoords], 1);

            const resultPickups = result[0].pickups;
            resultPickups.should.have.length(1);
        });

        it('appends distance in miles for each inputted location', () => {
            const bethesda = buildPickup('Bethesda', '2015-11-05', bethesdaCoords);
            const pickups = [bethesda];

            var result = recommender.byDay(pickups, [charlottesvilleCoords], 1);

            const expectedDistance = distance(point(charlottesvilleCoords), point(bethesdaCoords), 'miles');
            result[0].pickups[0].distances[0].location.should.equal(charlottesvilleCoords);
            result[0].pickups[0].distances[0].distanceInMiles.should.equal(expectedDistance);
        });

    });

    describe('when recommending by pickup location', () => {

        it('orders pickup locations', () => {
            const baltimore = buildPickup('Baltimore', '2015-11-05', baltimoreCoords);
            const bethesda = buildPickup('Bethesda', '2015-11-05', bethesdaCoords);
            const charlottesville = buildPickup('Charlottesville', '2015-11-05', charlottesvilleCoords);
            const pickups = [baltimore, bethesda, charlottesville];

            var locations = recommender.byPickupLocation(pickups, [charlottesvilleCoords]);

            locations.should.have.length(3);
            locations[0].deliveryLocationId.should.equal(charlottesville.location.deliveryLocationId);
            locations[1].deliveryLocationId.should.equal(bethesda.location.deliveryLocationId);
            locations[2].deliveryLocationId.should.equal(baltimore.location.deliveryLocationId);
        });

        it('orders pickup locations by minimum distance from multiple locations', () => {
            const baltimore = buildPickup('Baltimore', '2015-11-05', baltimoreCoords);
            const bethesda = buildPickup('Bethesda', '2015-11-05', bethesdaCoords);
            const charlottesville = buildPickup('Charlottesville', '2015-11-05', charlottesvilleCoords);
            const pickups = [baltimore, bethesda, charlottesville];

            var locations = recommender.byPickupLocation(pickups, [charlottesvilleCoords, justOutsideBaltimoreCoords]);

            locations.should.have.length(3);
            locations[0].deliveryLocationId.should.equal(charlottesville.location.deliveryLocationId);
            locations[1].deliveryLocationId.should.equal(baltimore.location.deliveryLocationId);
            locations[2].deliveryLocationId.should.equal(bethesda.location.deliveryLocationId);
        });

        it('each pickup location contains all of its available time slots', () => {
            const deliveryLocationId = Guid.raw();
            const baltimoreSlot1 = buildPickup('Baltimore1', '2015-11-05', baltimoreCoords, deliveryLocationId);
            const baltimoreSlot2 = buildPickup('Baltimore2', '2015-11-06', baltimoreCoords, deliveryLocationId);
            const pickups = [baltimoreSlot1, baltimoreSlot2];

            var locations = recommender.byPickupLocation(pickups, [baltimoreCoords]);

            locations.should.have.length(1);
            locations[0].slots.should.have.length(2);
            locations[0].slots[0].deliverySlotId.should.equal(baltimoreSlot1.slot.deliverySlotId);
            locations[0].slots[1].deliverySlotId.should.equal(baltimoreSlot2.slot.deliverySlotId);
        });

        it('appends distance in miles for each inputted location', () => {
            const bethesda = buildPickup('Bethesda', '2015-11-05', bethesdaCoords);
            const pickups = [bethesda];

            var result = recommender.byPickupLocation(pickups, [charlottesvilleCoords], 1);

            const expectedDistance = distance(point(charlottesvilleCoords), point(bethesdaCoords), 'miles');
            result[0].distances[0].location.should.equal(charlottesvilleCoords);
            result[0].distances[0].distanceInMiles.should.equal(expectedDistance);
        });
    });
});


function buildPickup(name, date, coordinates, deliveryLocationId = Guid.raw()) {
    return {
        deliveryId: Guid.raw(),
        date: date,
        slot: {
            deliverySlotId: Guid.raw()
        },
        location: {
            deliveryLocationId: deliveryLocationId,
            name: name,
            coordinates: coordinates
        }
    };
}