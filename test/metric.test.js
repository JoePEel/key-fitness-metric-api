const expect = require('chai').expect;
const db = require('../db/models')
fs = require('fs')
const app = require('../index')
const Metric = db.Metric
const Result = db.Result
const MetricController = require('../controllers/MetricContoller')

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

describe('metric', function() {

  beforeEach((done) => {
    db.sequelize.sync({ force: true})
      .then(() => {
        done();
      })
  });

  
  it('can can return a single record with all inputed results', async function() {

    await Metric.create({ user_id: 1, name: '5km Run', unit: 'minutes' });
    await Result.create({ metric_id: 1, value: 10 });
    await Result.create({ metric_id: 1, value: 5 });

    const resp = await MetricController.single({
      user: {
        id: 1
      },
      params:{
        id: 1
      }
      }, res);
    
    expect(resp.data.success).to.equal(true);
    expect(resp.data.metric).to.include({
      name: '5km Run', 
      unit: 'minutes'
    });
    expect(resp.data.results.length).to.equal(2);

});


  it('returns all records that belong to them', async function() {

    await Metric.create({ user_id: 1, name: '5km Run', unit: 'minutes' });
    await Metric.create({ user_id: 1, name: '10km Run', unit: null });
    await Metric.create({ user_id: 4, name: 'Bench Press', unit: 'kg' });

    const resp = await MetricController.index(req, res);

    expect(resp.data.success).to.equal(true);
    expect(resp.data.metrics[0]).to.include({
      name: '5km Run',
    });
    expect(resp.data.metrics.length).to.equal(2)

  });


  it('can insert a record', async function() {

    const resp = await MetricController.create({
      user: {
        id: 1
      },
      body: {
        name: '5km Run',
        unit: 'minutes',
      }
    }, res);
    
    expect(resp.data.success).to.equal(true);
    expect(resp.data.metric).to.include({
      name: '5km Run', 
      unit: 'minutes',
      higher_is_better: true
    });


  });


  it('can update a record', async function() {

    await Metric.create({ user_id: 1, name: '5km Run', unit: 'minutes' });

    const resp = await MetricController.update({
      user: {
        id: 1
      },
      body: {
        id: 1,
        name: '1km Run',
        unit: 'seconds',
        higher_is_better: false
      }
    }, res);
    console.log(resp)

    expect(resp.data.success).to.equal(true);
    expect(resp.data.metric).to.include({
      name: '1km Run', 
      unit: 'seconds',
      higher_is_better: false
    });

  });


  it('can delete a record', async function() {

    await Metric.create({ user_id: 1, name: '5km Run', unit: 'minutes' });

    const resp = await MetricController.delete(req, res);
    
    expect(resp.data.success).to.equal(true);

    const all = await Metric.findAll();
    expect(all.length).to.be.equal(0);

    return res;

  });


  it('cant delete someone elses record', async function() {

    await Metric.create({ user_id: 3, name: '5km Run', unit: 'minutes' });

    const resp = await MetricController.delete(req, res);
    
    expect(resp.data.success).to.equal(false);

    const all = await Metric.findAll();
    expect(all.length).to.be.equal(1);

    return res;

  });

});