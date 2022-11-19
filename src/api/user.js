import request from "@/utils/request";

export default {
    login(user){
        return request({
            url:`/validLogin`,
            method:'post',
            data:user
        })
    }
}
