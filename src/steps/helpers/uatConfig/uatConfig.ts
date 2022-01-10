import {merge} from "lodash";
import {
    booleanCast,
    booleanFromProcessEnv,
    isNullOrUndefined,
    numberFromProcessEnv,
    stringFromProcessEnv
} from "../misc.helpers";

const {execSync, spawn} = require('child_process');

export interface UatConfig {
    serve?: {
        dir?: string,
        port?: number
    },
    env?: { [key: string]: any },
    configuration?: {
        headless?: boolean,
        slowMotion?:number,
        debug?: boolean,
        screenshotOnError?: boolean,
        browser?:string ,
        slack?:{
            channel:string,
            token:string
        };
    }
}


export const defaultUATConfig: UatConfig = {
    configuration: {
        headless: booleanFromProcessEnv('headless', true),
        debug: booleanFromProcessEnv('headless', false),
        screenshotOnError: booleanFromProcessEnv('headless', false),
        slowMotion:numberFromProcessEnv('slowMotion',150),
        //'chromium', 'firefox', 'webkit'
        browser:stringFromProcessEnv('browser','chromium')
    }
};
export const fromProcessEnv: UatConfig = {
    configuration: {
        headless: booleanFromProcessEnv('headless', undefined),
        debug: booleanFromProcessEnv('headless', undefined),
        screenshotOnError: booleanFromProcessEnv('headless', undefined),
        slowMotion:numberFromProcessEnv('slowMotion',undefined),
        //'chromium', 'firefox', 'webkit'
        browser:stringFromProcessEnv('browser',undefined)
    }
};

export const extractuatConfiguration = (customConfig: UatConfig = {}): UatConfig => {
    const config = merge(defaultUATConfig, customConfig,fromProcessEnv);

    if (config.env) {
        Object.keys(config.env)
            .forEach(key => {
                process.env[key] = config.env[key];
            })
    }
    Object.keys(config.configuration)
        .forEach(key => {
            process.env[key] = config.configuration[key];
        });

    return config;
};

export function start(customConfig: UatConfig = {}) {

    let preparedConfig = typeof customConfig === 'string' ? JSON.parse(customConfig) : customConfig;

    const configuration = extractuatConfiguration(preparedConfig);

    const start = async () => {
        if (configuration.serve) {
            let serverProcess;
            const port = configuration.serve.port || 4200;
            await new Promise(resolve => {
                const url = `http://localhost:${port}?`;

                serverProcess = spawn('lite-server',
                    ["-c", "lite-server.conf.json"]);

                serverProcess.stdout.on('data', resolve);
            });

            return serverProcess
        }

    };

    return {
        configuration,
        serve: start
    };
}
