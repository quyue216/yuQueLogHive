import {reactive} from "vue";

const store =  reactive({
    userInfo:{}, 
    selectBookInfo:{}
})

// 一个小的微型仓库
function useStore(){
  
    const updateUserInfo = (userInfo)=>{
        store.userInfo = userInfo
    }

    const setSelectBookInfo = (bookInfo)=>{
        store.selectBookInfo = bookInfo
    }
    
    return {
        store,
        updateUserInfo,
        setSelectBookInfo
    }
}

export default useStore;