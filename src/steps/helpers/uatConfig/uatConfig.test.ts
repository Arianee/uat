import {defaultUATConfig, extractuatConfiguration, UatConfig} from "./uatConfig";

describe("UATconfig", () => {

    test("it should be default config if no custom config", async (done) => {
        const config = extractuatConfiguration();
        expect(defaultUATConfig).toEqual(config);
        done();
    });
    test("it should merge with configs env", async (done) => {
        const customConfig: UatConfig = {
            env: {
                "anEntry": 'a value'
            }
        };
        const config = extractuatConfiguration(customConfig);
        expect(config.env.anEntry).toBe(customConfig.env.anEntry);
        done()
    });
    test("it should set process env", async (done) => {
        const customConfig: UatConfig = {
            env: {
                "anEntry": 'a value'
            }
        };
        extractuatConfiguration(customConfig);

        expect(process.env.anEntry).toBe(customConfig.env.anEntry);
        done()
    })
});
