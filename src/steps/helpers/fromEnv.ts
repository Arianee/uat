export const envReplace=(str:string)=>{
    if(str.startsWith('FromEnv=')){
        const variableName=str.split('FromEnv=')[1];
        return process.env[variableName];
    }else {
        return str;
    }
}

export const interpolateFromStore=(value, store)=>{
    const reg = new RegExp(/.*({{\w*}}).*$/m)

    if(reg.test(value)){
        const storeValue=reg.exec(value)[1];
        const interpolatedValue=value.replace(storeValue,store[storeValue]);
        return interpolateFromStore(interpolatedValue,store);
    }else{
        return value;
    }
}


export const interpolate=(value,store)=>{
   const interpolatedValue= interpolateFromStore(value,store);
    return envReplace(interpolatedValue)
}
