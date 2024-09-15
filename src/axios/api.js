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

// 获取单篇文章
export  function takeDoc(url){
    return axios({
        method:"get",
        url
    })
}
// 更新对应的文档
export function createSummary(url,data) {
  return axios({
    method: "put",
    url,
    data: {
        "public": 0,
        "format": "markdown",
        ...data
    },
})
}