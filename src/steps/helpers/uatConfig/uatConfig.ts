import {merge} from "lodash";
import {
    booleanCast,
    booleanFromProcessEnv,
    isNullOrUndefined,
    numberFromProcessEnv,
    stringFromProcessEnv
} from "../misc.helpers";
import path from "path";

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
        pathLogs?: string,
        browser?:string ,
        slack?:{
            channel:string,
            token:string
        };
        walletConnectBridge?: boolean
    }
}


export const defaultUATConfig: UatConfig = {
    configuration: {
        headless: booleanFromProcessEnv('headless', true),
        debug: booleanFromProcessEnv('headless', false),
        screenshotOnError: booleanFromProcessEnv('headless', false),
        slowMotion:numberFromProcessEnv('slowMotion',150),
        pathLogs: stringFromProcessEnv('pathLogs', "./uat-debug"),
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
        pathLogs: stringFromProcessEnv('pathLogs', "./uat-debug"),
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
                serverProcess = spawn('npx',
                    ['http-server', configuration.serve.dir, "--port", port, '--proxy', url]);
                serverProcess.stdout.on('data', resolve);
            });

            return serverProcess
        }

    };

    const walletConnectBridgeStart = async ()=>{
        if (configuration.configuration.walletConnectBridge) {
            let wcBridgeProcess;
            const dockercomposePath = path.join(__dirname,'..','..','..', 'docker-compose.yml');
            await new Promise(resolve => {
                wcBridgeProcess = spawn('docker-compose',
                  ['-f', dockercomposePath, 'up', 'wallet-connect-bridge']);
                wcBridgeProcess.stdout.on('data', (data)=>{
                    if(Buffer.from(data).toString().includes('Server listening at http://0.0.0.0:5001')){
                        resolve(true);
                    }
                });
            })
            return wcBridgeProcess;
        }
    }

    return {
        configuration,
        serve: start,
        walletConnectBridgeStart
    };
}
