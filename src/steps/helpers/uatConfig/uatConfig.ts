import {merge} from "lodash";
import {booleanFromProcessEnv, numberFromProcessEnv, stringFromProcessEnv} from "../misc.helpers";
import {ChildProcess, spawn} from "child_process";

export interface UatConfig {
    serve?: {
        dir?: string,
        port?: number
    },
    env?: { [key: string]: any },
    configuration?: {
        headless?: boolean,
        slowMotion?: number,
        debug?: boolean,
        screenshotOnError?: boolean,
        pathLogs?: string,
        /** 'chromium' | 'firefox' | 'webkit' */
        browser?: string,
        slack?: {
            channel: string,
            token: string
        };
        httpMocksPath?: string
    }
}

export const defaultUATConfig: UatConfig = {
    configuration: {
        headless: true,
        debug: false,
        screenshotOnError: false,
        slowMotion: 150,
        pathLogs: "./uat-debug",
        browser: 'chromium'
    }
};

/**
 * Every configuration key can be overridden by an environment variable of the same name
 * (e.g. `headless=false uat ...`). Undefined values are ignored by the merge.
 */
const configurationFromProcessEnv = (): UatConfig => ({
    configuration: {
        headless: booleanFromProcessEnv('headless', undefined),
        debug: booleanFromProcessEnv('debug', undefined),
        screenshotOnError: booleanFromProcessEnv('screenshotOnError', undefined),
        slowMotion: numberFromProcessEnv('slowMotion', undefined),
        pathLogs: stringFromProcessEnv('pathLogs', undefined),
        browser: stringFromProcessEnv('browser', undefined)
    }
});

export const extractuatConfiguration = (customConfig: UatConfig = {}): UatConfig => {
    const config: UatConfig = merge({}, defaultUATConfig, customConfig, configurationFromProcessEnv());

    Object.entries(config.env || {})
        .forEach(([key, value]) => {
            process.env[key] = value;
        });
    Object.entries(config.configuration)
        .forEach(([key, value]) => {
            process.env[key] = value as any;
        });

    return config;
};

export function start(customConfig: UatConfig | string = {}) {
    const preparedConfig: UatConfig = typeof customConfig === 'string' ? JSON.parse(customConfig) : customConfig;
    const configuration = extractuatConfiguration(preparedConfig);

    const serve = async (): Promise<ChildProcess | undefined> => {
        if (!configuration.serve) {
            return undefined;
        }

        const port = configuration.serve.port || 4200;
        const url = `http://localhost:${port}?`;
        const serverProcess = spawn('npx',
            ['http-server', configuration.serve.dir, '--port', String(port), '--proxy', url],
            {shell: process.platform === 'win32'});

        await new Promise(resolve => serverProcess.stdout.once('data', resolve));
        return serverProcess;
    };


    return {
        configuration,
        serve
    };
}
