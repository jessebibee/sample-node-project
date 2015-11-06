import chai from 'chai';
import recommender from '../pickupsRecommender';

chai.should();

/*** Run the recommender with real delivery data loaded in from data/availableDeliveries.json ***/

describe('recommender', () => {
    it('returns top 2 locations', () => {
        var values = recommender.byLocation([-77.392502, 38.983965], 2);
        values.should.have.length(2);
    });
});
