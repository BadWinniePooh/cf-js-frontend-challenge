import {expect} from 'chai';
import request from 'supertest';
import {createApp} from '../src/ticket-pricing/ticket-pricing-app.js';

describe('ticket-pricing', () => {
  let app;
  let connection;

  before(async () => {
    const created = await createApp();
    app = created.app;
    connection = created.connection;
  });

  it('this is your first test case!', async () => {
    const response = await request(app)
      .get('/prices')
      .query({whatever: 'you want'});

    expect(response.status).to.equal(200);
    expect(response.body).to.eql({you: 'can', return: 'any', what: 'you want!'});
  }).timeout(10000);
});
