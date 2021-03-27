export const booleanCast = (value): boolean => (value == 'true');
export const isNullOrUndefined = (value) => value === null || value === undefined;
export const booleanFromProcessEnv = (key: string, defaultValue:boolean):boolean => {
    const value = process.env[key];
    return !isNullOrUndefined(value) ? booleanCast(value) : defaultValue;
};
export const numberFromProcessEnv = (key: string, defaultValue:number):number => {
    const value = process.env[key];
    return !isNullOrUndefined(value) ? +value : defaultValue;
};

export const stringFromProcessEnv = (key: string, defaultValue:string):string => {
    const value = process.env[key];
    return !isNullOrUndefined(value) ? value : defaultValue;
};
