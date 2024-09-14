<script setup>
import axios from "@/axios/index";
import { ref, watch, onMounted ,toRefs} from 'vue'
import { ElMessage } from 'element-plus';
import useStore from "@/store/index";
import { getUserInfo, takeAllBooks } from "@/axios/api";
import CataLogLeft from "@/components/CatalogLeft/index.vue";
import CatalogRight from "@/components/CatalogRight/index.vue";
import data from "@/utils/test-stage.json";
import matchSummary from "@/utils/matchSummaryGroup";

let result = matchSummary(data.data);

// 定义一个全局状态
const  { store, updateUserInfo, setSelectBookInfo} = useStore()
/* axios({
    method: "put",
    url: "/repos/24552766/docs/185648517",
    data: {
        "slug": "lx5un2zxkecy6fuc",
        "title": "测试合并",
        "public": 0,
        "format": "markdown",
        "body": str
    },
}).then((res) => {
    console.log('-----res', res);
}).catch((reject) => {
    console.log('-----1', reject);

}) */

//!获取对应的知识库列表
const books = ref([]);
const selectBook = ref("");

//!处理输入对应的token
const dialogVisible = ref(false);

const accessToken = ref("");
const checkAccessToken = () => {
    if (accessToken.value === "") {
        ElMessage.error("accessToken 不能为空");
    } else {
        dialogVisible.value = false;
    }
}
onMounted(() => {
    //没有token打开弹框，用户输入对应信息
    window.token = window.localStorage.getItem("token");

    dialogVisible.value = !window.token;

    if (window.token) {

        getUserInfo().then(async (res) => {
            //!设置用户信息
            updateUserInfo(res)
            //!获取知识库列表
            const result = await takeAllBooks(res.id);

            books.value = result;

        })
    }
})
// 缓存token到本地
watch(accessToken, () => {
    window.localStorage.setItem("token", accessToken.value);
    window.token = accessToken.value
})

watch(selectBook, () => {

    if (selectBook.value !== "") {

        let result = books.value.find((item) => item.id === selectBook.value)

        setSelectBookInfo(result);
    }
})
watch(()=>store.selectBookInfo,(val)=>{

  console.log('值调用了哈哈哈---',val);


})
const { userInfo, selectBookInfo } =toRefs(store)

</script>

<template>
    <div class="common-layout">
        <el-container class="container">
            <el-header class="header">

                <el-row style="margin-top: 15px;">
                    <el-col :span="8">
                        <el-select placeholder="选择知识库" v-model="selectBook">
                            <el-option v-for="item in books" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-col>
                    <el-col :offset="3" :span="3">
                        <el-text>欢迎 {{userInfo.name}}</el-text>
                    </el-col>
                    <el-col :offset="3" :span="7">
                        <el-button type="primary">
                            merge
                        </el-button>
                    </el-col>
                </el-row>

            </el-header>
            <el-container>
                <el-main>
                   <div class="tree-nodeContainer">
                        <div class="main">
                            <div>
                               <h2 class="title">选择要合并的文档</h2>
                                <CataLogLeft></CataLogLeft>
                            </div>
                            <div>
                                <h2 class="title">选择要合并的目标文档</h2>
                                <CatalogRight></CatalogRight>
                            </div>
                        </div>
                   </div>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog :show-close="false" :close-on-click-modal="false" align-center v-model="dialogVisible"
            title="语雀token" width="500">
            <el-input v-model="accessToken"></el-input>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="checkAccessToken">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped lang="less">
.common-layout {
    height: 80%;
    width: 70%;
    margin: 5% auto;

    .container {
        height: 100%;

        .header {
            border: 1px solid #000;
        }
    }

    .main{
        display: flex;
        height: 100%;
        >div{
            flex:1;
        }
    }
    .tree-nodeContainer{
        display: flex;
        justify-content: center;
        width: 100%;
        .main{
           width: 70%;
        }
    }
}

.title{
font-size: 25px;
margin-bottom: 10px
}
</style>
