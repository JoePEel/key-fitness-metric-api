const {Metric} = require('../db/models')
const {Result} = require('../db/models')
const moment = require('moment');

module.exports = {

    create: async (req, res) => {

        const metric = await Metric.findOne({
            where: {
                id: req.body.id,
                user_id: req.user.id
            }
        });

        if(metric == null){
            return res.json({
                success: false,
                message: 'The record could not be found'
            }, 404)
        }

        const result = await Result.create({
            metric_id: metric.id,
            value: req.body.value,
            date: moment(req.body.date)
        })

        return res.json({
            success: true,
            result
        }, 200)
    },


    update: async (req, res) => {
        console.log(req.body)
        const metric = await Metric.findOne({
            where: {
                id: req.body.metric_id,
                user_id: req.user.id
            }
        });

        if(metric == null){
            return res.json({
                success: false,
                message: 'The record could not be found'
            }, 404)
        }

        let result = await Result.findOne({
            where: {
                id: req.body.id,
                metric_id: metric.id
            }
        });

        if(result == null){
            return res.json({
                success: false,
                message: 'The record could not be found'
            }, 404)
        }

        result = await result.update({
            value: req.body.value,
            date: moment(req.body.date)
        })

        return res.json({
            success: true,
            result
        }, 200)
    },


    delete: async (req, res) => {

        const metric = await Metric.findOne({
            where: {
                id: req.body.metric_id,
                user_id: req.user.id
            }
        });

        console.log(req.body, 'frdewfedwdes')

        if(metric == null){
            return res.json({
                success: false,
                message: 'The record could not be found'
            }, 404)
        }

        let result = await Result.findOne({
            where: {
                id: req.body.id,
                metric_id: metric.id
            }
        });

        result.destroy();

        return res.json({
            success: true,
        }, 200)
    }


}