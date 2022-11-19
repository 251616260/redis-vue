import request from "@/utils/request";

export default {
    send(msg){
        return request({
            url:`msg/`,
            method: 'post',
            data:msg
        })
    },
    getAllMsg(send,receiver){
        return request({
            url:`msg/getMsg/${send}/${receiver}`,
            method:'get'
        })
    },
    deleteMsg(send,receiver){
        return request({
            url:`msg/deleteAll/${send}/${receiver}`,
            method:'delete'
        })
    },
    receive(send,receiver){
        return request({
            url:`/msg/receive/${send}/${receiver}`,
            method:'get'
        })
    }
}
