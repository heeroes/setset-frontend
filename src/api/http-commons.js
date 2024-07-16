import axios from "axios";

function localAxios(){
    const instance=axios.create({
        baseURL:"https://setset.site/api/v1"
    })
    instance.defaults.headers.common["Authorization"] = "";
    return instance;
} 
export {localAxios};