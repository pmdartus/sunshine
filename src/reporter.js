const { mean, median, standardDeviation } = require('simple-statistics');

function report(results, config) {
    const { logger } = config;
    const passed = results.filter(res => res.data);
    const failed = results.filter(res => res.error);

    logger.complete(`SUMMARY - passed: ${passed.length} - failed: ${failed.length}`);

    const eptValues = passed.map(res => res.data.ept);
    logger.complete(`EPT - mean: ${mean(eptValues)}s - median ${median(eptValues)}s - ${standardDeviation(eptValues)}`);
}

module.exports = {
    report,
};
