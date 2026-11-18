import {defaultUATConfig, extractuatConfiguration, UatConfig} from "./uatConfig";

describe("UATconfig", () => {
    const envBackup = {...process.env};
    afterEach(() => {
        process.env = {...envBackup};
    });

    test("it should be default config if no custom config", () => {
        const config = extractuatConfiguration();
        expect(config).toEqual(defaultUATConfig);
    });

    test("it should not mutate the default config", () => {
        extractuatConfiguration({configuration: {headless: false}});
        expect(defaultUATConfig.configuration.headless).toBe(true);
    });

    test("it should merge with configs env", () => {
        const customConfig: UatConfig = {env: {anEntry: 'a value'}};
        const config = extractuatConfiguration(customConfig);
        expect(config.env.anEntry).toBe(customConfig.env.anEntry);
    });

    test("it should set process env", () => {
        const customConfig: UatConfig = {env: {anEntry: 'a value'}};
        extractuatConfiguration(customConfig);
        expect(process.env.anEntry).toBe(customConfig.env.anEntry);
    });

    test("it should keep pathLogs from the config file", () => {
        const config = extractuatConfiguration({configuration: {pathLogs: './custom-logs'}});
        expect(config.configuration.pathLogs).toBe('./custom-logs');
    });

    test("each configuration key can be overridden by its own env variable", () => {
        process.env.headless = 'false';
        process.env.debug = 'true';
        process.env.screenshotOnError = 'true';
        const config = extractuatConfiguration({configuration: {headless: true, debug: false, screenshotOnError: false}});
        expect(config.configuration.headless).toBe(false);
        expect(config.configuration.debug).toBe(true);
        expect(config.configuration.screenshotOnError).toBe(true);
    });

    test("headless env variable should not enable debug mode", () => {
        process.env.headless = 'true';
        const config = extractuatConfiguration();
        expect(config.configuration.debug).toBe(false);
        expect(config.configuration.screenshotOnError).toBe(false);
    });
});
