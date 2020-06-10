import {interpolate, interpolateFromStore} from "./fromEnv";
import {selectorFactory} from "./selectDataAttribute";

export const utils=(store)=>{

    return {
        interpolate:(value)=>interpolate(value,store),
        selectorFactory:(value)=>{
            const selectorInterpolated=interpolate(value,store);
            return selectorFactory(selectorInterpolated);
        }
    }
};
