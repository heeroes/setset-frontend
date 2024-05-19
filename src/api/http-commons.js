import axios from "axios";

function localAxios(){
    const instance=axios.create({
        baseURL:"http://localhost:80/api/v1"
    })
    instance.defaults.headers.common["Authorization"] = "";
    return instance;
} 
export {localAxios};