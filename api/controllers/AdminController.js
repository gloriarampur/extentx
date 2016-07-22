/**
 * ReportController
 *
 * @description :: Server-side logic for managing Report details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require('lodash');

module.exports = {
    destroyReport: function(req, res) {
        var reportId = req.body.query;

        Report.destroy({ id: reportId }).exec(function(err) {});
        Author.destroy({ report: reportId }).exec(function(err) {});
        Category.destroy({ report: reportId }).exec(function(err) {});
        Log.destroy({ report: reportId }).exec(function(err) {});
        Node.destroy({ report: reportId }).exec(function(err) {});
        Test.destroy({ report: reportId }).exec(function(err) {});
        
        res.send(200);
    },

    deleteOlderThanXDays: function(req, res) {
        var days = req.body.query,
            dt = new Date(),
            dt = dt.setDate(dt.getDate() - days),
            dt = new Date(dt);
        var reportIds = [];
        
        function deleteRels() {
            if (reportIds.length > 0) {
                console.log('destroying report + relationships with reportId: ' + reportIds);

                Report.destroy({ id: reportIds }).exec(function(err) { if (err) console.log(err); });
                Author.destroy({ report: reportIds }).exec(function(err) { if (err) console.log(err); });
                Category.destroy({ report: reportIds }).exec(function(err) { if (err) console.log(err); });
                Log.destroy({ report: reportIds }).exec(function(err) { if (err) console.log(err); });
                Node.destroy({ report: reportIds }).exec(function(err) { if (err) console.log(err); });
                Test.destroy({ report: reportIds }).exec(function(err) { if (err) console.log(err); });
            } 
            else {
                console.log('No items match search criteria');
            }
        }

        Report.find({ startTime: { '<': dt } }).exec(function(err, result) {
            _(result).forEach(function(element) {
                reportIds.push(element.id);
            });

            deleteRels();
        });

        res.send(200);
    },
};