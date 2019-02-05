const {Metric} = require('../db/models')
const {Result} = require('../db/models')

module.exports = {

    index: async (req, res) => {
      
        const metrics = await Metric.findAll({
            where: {
                user_id: req.user.id
            }
        });

        return res.json({
            success: true,
            metrics
        }, 200)

    },

    single: async (req, res) => {
      
        const metric = await Metric.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        });

        if(metric == null){
            return res.json({
                success: false,
                message: 'The record could not be found'
            })
        }

        const results = await Result.findAll({
            where: {
                metric_id: metric.id
            },
            order: [
                ['date', 'desc']
            ]
        });

        return res.json({
            success: true,
            metric,
            results
        }, 200)

    },


    create: async (req, res) => {

        console.log(req.body)
        const metric = await Metric.create({
            user_id: req.user.id,
            name: req.body.name,
            unit: req.body.unit,
            time: req.body.time,
            higher_is_better: req.body.higher_is_better ? req.body.higher_is_better : true
        });
    
        return res.json({
            success: true,
            metric
        }, 200)

    },


    update: async (req, res) => {

        const metric = await Metric.findOne({
            where: {
                user_id: req.user.id,
                id: req.body.id
            }
          }).catch(err => {
            console.log(err);
        })
        console.log(req.body)
        if(metric == null){
            return res.json({
                success: false,
                message: 'The record could not be found'
            })
        }

       await metric.update(req.body)
            .catch(err => {
                return res.json({
                    success: false,
                    message: err.message
                }, 403)
            })
    
        return res.json({
            success: true,
            metric
        }, 200)

    },


    delete: async (req, res) => {

        const metric = await Metric.findOne({
            where: {
                user_id: req.user.id,
                id: req.body.id
            }
          }).catch(err => {
            return res.json({
                success: false,
                message: err.message
            }, 403)
        })

        if(!metric){
            return res.json({
                success: false,
                message: 'The record could not be found'
            }, 403)
        }
    
       await metric.destroy();
    
        return res.json({
            success: true
        }, 200)
    
    }


}