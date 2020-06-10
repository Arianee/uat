export const envReplace=(str:string)=>{
    if(str.startsWith('FromEnv=')){
        const variableName=str.split('FromEnv=')[1];
        return process.env[variableName];
    }else {
        return str;
    }
}

export const interpolateFromStore=(value, store)=>{
    const reg = new RegExp(/.*(##\w*##).*$/)

    if(reg.test(value)){
        const storeValue=reg.exec(value)[1];
        return value.replace(storeValue,store[storeValue]);
    }else{
        return value;
    }
}


export const interpolate=(value,store)=>{
   const interpolatedValue= interpolateFromStore(value,store);
    return envReplace(interpolatedValue)
}



