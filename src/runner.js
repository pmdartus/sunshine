const puppeteer = require('puppeteer');

async function run(config) {
    const { logger, headless, iterations } = config;
    const results = [];

    for (let i = 0; i < iterations; i++) {
        // Create a new scoped logger for the iteration
        const sessionLogger = logger.scope(`iteration #${i + 1}`);

        // Create a new browser session
        sessionLogger.debug('Create new browser session');
        const browser = await puppeteer.launch({
            headless,
        });
        const page = await browser.newPage();

        const iterationConfig = {
            ...config,
            page,
            logger: sessionLogger,
        };

        // Login as the user
        await login(iterationConfig);

        // Gather the page performance
        let iterationResult = undefined;
        try {
            const data = await measurePageEPT(iterationConfig);
            sessionLogger.success('Iteration results', JSON.stringify(data));

            iterationResult = {
                data,
            };
        } catch (error) {
            sessionLogger.error('Iteration error', error);

            iterationResult = {
                error,
            };
        }
        results.push(iterationResult);

        // Close the browser and start again
        await browser.close();
    }

    return results;
}

async function login(config) {
    const { page, logger, instanceUrl, username, password } = config;

    // Navigate to login page
    logger.debug(`Navigate to login page ${instanceUrl}`);
    await page.goto(instanceUrl, {
        timeout: 60 * 1000,
    });

    // Login user
    logger.debug(`Login as user ${username}`);
    await page.type('#username', username);
    await page.type('#password', password);

    // Submit form and wait for navigation
    return Promise.all([
        page.click('#Login'),
        page.waitForNavigation({
            // Only wait until the redirect to the app occurs
            // Don't wai for the full bootstrap to happen, since a new bootstrap
            // will happen when navigating to the page to test.
            waituntil: 'domcontentloaded',
        }),
    ]);
}

async function measurePageEPT(config) {
    const { page, logger, instanceUrl, pageLocation } = config;
    const pageUrl = instanceUrl + pageLocation;

    // Navigate to page
    logger.debug(`Navigating to ${pageUrl}`);
    await page.goto(pageUrl);

    // The page is done loading once the EPT mark get fired.
    logger.debug(`Waiting for page to load`);
    const rawEpt = await page.waitForFunction(
        () => {
            // Disable ESLint in this block since this block gets executed in the browser
            // context and not in Node context.
            /* eslint-disable */

            // We need to defensive about when accessing $A, since this method can get invoked
            // before Aura framework gets initialized.
            const transaction =
                window.$A &&
                window.$A.metricsService &&
                window.$A.metricsService.getCurrentPageTransaction();

            // Early exit when EPT is not yet computed
            if (!transaction) {
                return false;
            }

            // Extract and return EPT value
            return transaction.config.context.ept;

            /* eslint-enable */
        },
        {
            timeout: 60 * 1000, // 1 min.
            polling: 5 * 1000, // 5 sec.
        },
    );

    // Return result
    return {
        ept: await rawEpt.jsonValue(),
    };
}

module.exports = {
    run,
};
