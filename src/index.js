const yargs = require('yargs');
const signale = require('signale');

const { run } = require('./runner');
const { publish } = require('./publisher');

const { argv } = yargs
    .config()
    .options({
        instanceUrl: {
            type: 'string',
            description: 'Hostname of the instance',
            demandOption: true,
        },
        username: {
            type: 'string',
            description: 'Username used for the test',
            demandOption: true,
        },
        password: {
            type: 'string',
            description: 'Password used for the test',
            demandOption: true,
        },
        pageLocation: {
            type: 'string',
            description:
                'URL location used for the test. For example: "/one/one.app#/sObject/Opportunity/home"',
            demandOption: true,
        },

        headless: {
            type: 'boolean',
            description: 'Run the test in headless mode',
            default: false,
        },
        iterations: {
            type: 'number',
            description: 'Number of iterations to run',
            default: 10,
        },
    })
    .help();

const config = {
    ...argv,
    logger: signale,
};

(async () => {
    try {
        const results = await run(config);
        publish(results, config);
    } catch (error) {
        // Handle uncaught error
        signale.error(error);
        process.exit(1);
    }
})();
