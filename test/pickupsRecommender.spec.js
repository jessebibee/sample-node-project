import chai from 'chai';
import recommender from '../src/pickupsRecommender';
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
            resultPickups[0].should.equal(charlottesville);
            resultPickups[1].should.equal(bethesda);
            resultPickups[2].should.equal(baltimore);
        });

        it('orders pickup locations each day by minimum distance from multiple locations', () => {
            const baltimore = buildPickup('Baltimore', '2015-11-05', baltimoreCoords);
            const bethesda = buildPickup('Bethesda', '2015-11-05', bethesdaCoords);
            const charlottesville = buildPickup('Charlottesville', '2015-11-05', charlottesvilleCoords);
            const pickups = [baltimore, bethesda, charlottesville];

            var result = recommender.byDay(pickups, [charlottesvilleCoords, justOutsideBaltimoreCoords], 3);

            const resultPickups = result[0].pickups;
            resultPickups.should.have.length(3);
            resultPickups[0].should.equal(charlottesville);
            resultPickups[1].should.equal(baltimore);
            resultPickups[2].should.equal(bethesda);
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
    });
});



function buildPickup(name, date, coordinates) {
    return {
        date: date,
        slot: {

        },
        location: {
            name: name,
            coordinates: coordinates
        }
    };
}