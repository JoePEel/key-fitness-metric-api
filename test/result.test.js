const expect = require('chai').expect;
const db = require('../db/models')
fs = require('fs')
const app = require('../index')
const Metric = db.Metric
const Result = db.Result
const ResultController = require('../controllers/ResultController')

const req = {
  user: {
    id: 1
  },
  body: {
    id: 1
  }
}

const res = {
  json(obj, status){
    return {data:obj,status}
  }
}

describe('result', function() {

  beforeEach((done) => {
    db.sequelize.sync({ force: true})
      .then(() => {
        done();
      })
  });

  
    it('can add a result', async function() {

        await Metric.create({ user_id: 1, name: '5km Run', unit: 'minutes' });

        const resp = await ResultController.create({
            user: {
                id: 1
            },
            body:{
                id: 1,
                value: 5
            }
            }, res);

        expect(resp.data.success).to.equal(true);
        expect(resp.data.result).to.include({ 
            value: 5
        });
     
    })


    it('can add can update a value', async function() {

        await Metric.create({ user_id: 1, name: '5km Run', unit: 'minutes' });
        await Result.create({ metric_id: 1, value: 10 });

        const resp = await ResultController.update({
            user: {
                id: 1
            },
            body:{
                metric_id: 1,
                id: 1,
                value: 5
            }
            }, res);

        expect(resp.data.success).to.equal(true);
        expect(resp.data.result).to.include({ 
            value: 5
        });
     
    })


    it('can add can delete a result', async function() {

        await Metric.create({ user_id: 1, name: '5km Run', unit: 'minutes' });
        await Result.create({ metric_id: 1, value: 10 });

        const resp = await ResultController.delete({
            user: {
                id: 1
            },
            body:{
                metric_id: 1,
                id: 1,
                value: 5
            }
            }, res);

        expect(resp.data.success).to.equal(true);
        const result = await Result.findAll();
        expect(result.length).to.equal(0)
     
    })


});