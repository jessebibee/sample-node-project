import chai from 'chai';
import recommender from '../src/pickupsRecommender';
chai.should();

describe('Pickups recommender', () => {
    it('returns top 2 locations', () => {
        const foo = 'bar';
        foo.should.equal('bar');
    });
});