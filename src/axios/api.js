import axios from "./index.js";


export function getUserInfo(params) {
    return axios({
        method:"get",
        url:"/user"
    })
}
// 获取创建的所有知识库
export  function takeAllBooks(userID){
    return axios({
        method:"get",
        url:`users/${userID}/repos`
    })
}