<script setup>
import { ref, watch, onMounted, toRefs, toValue } from 'vue'
import { ElMessage } from 'element-plus';
import useStore from "@/store/index";
import { getUserInfo, takeAllBooks, takeDoc, createSummary } from "@/axios/api";
import CataLogLeft from "@/components/CatalogLeft/index.vue";
import CatalogRight from "@/components/CatalogRight/index.vue";
import matchSummary from "@/utils/matchSummaryGroup";
import { generateGroup, mergeSummary, sortTime } from "@/utils/tools.js";



// 定义一个全局状态
const { store, updateUserInfo, setSelectBookInfo } = useStore()

const awaitMergeDocs = ref([]);
// 合并目标文档
const targetDoc = ref([]);
//!获取对应的知识库列表
const books = ref([]);
const selectBook = ref(null);

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
            //设置选择的默认值
            selectBook.value = 24552766
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
const { userInfo } = toRefs(store)

//合并逻辑
async function mergeDoc() {

    if (targetDoc.value.filter((item) => !item.children.length).length !== 1 || awaitMergeDocs.value.length === 0) {
        return ElMessage.error("文档选择不正确");
    }

    // 得到所有的文章数据
    const docs = await getSelectedDocs(toValue(awaitMergeDocs));

    // 将文章转换为分类对象 
    const cryObj = docs.map((doc) => matchSummary(doc)).flat()

    //将分类对象进行分组 
    const cryGroup = generateGroup(cryObj)
    
    //对分类对象进行排序
    Object.keys(cryGroup).forEach((k) => cryGroup[k] = sortTime(cryGroup[k]))
    
    let newDocStr = mergeSummary(cryGroup)
    
    await createSummary(`/repos/${selectBook.value}/docs/${targetDoc.value[0].id}`, {
        slug: targetDoc.value[0].id,
        title: targetDoc.value[0].title,
        body: newDocStr
    })

    ElMessage.success("合并成功!")
}
// 获取所有的文章数据
function getSelectedDocs(docs) {

    const urls = docs.map((item) => `/repos/${selectBook.value}/docs/${item.id}`);

    return Promise.all(urls.map((u) => takeDoc(u)))
}
let leftTree = ref();
let rightTree = ref();
function restCheckedTreeNode(){

    awaitMergeDocs.value = []

    targetDoc.value = []

    leftTree.value.$refs.tree.setCheckedKeys([])
    rightTree.value.$refs.tree.setCheckedKeys([])
}

</script>

<template>
    <div class="common-layout">
        <el-container class="container">
            <el-header class="header">

                <el-row style="margin-top: 15px;">
                    <el-col :span="6">
                        <el-select placeholder="选择知识库" v-model="selectBook">
                            <el-option v-for="item in books" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-col>
                    <el-col :offset="2" :span="4">
                        <el-text>欢迎 {{ userInfo.name }}</el-text>
                    </el-col>
                    <el-col :offset="3" :span="2">
                        <el-button type="primary" @click="mergeDoc">
                            merge
                        </el-button>
                    </el-col>
                    <el-col :offset="3" :span="3">
                        <el-button type="primary" @click="restCheckedTreeNode">
                            rest
                        </el-button>
                    </el-col>
                </el-row>

            </el-header>
            <el-container>
                <el-main>
                    <div class="tree-nodeContainer">
                        <div class="main">
                            <div>
                                <h2 class="title" v-if="awaitMergeDocs.length">已选择 <span
                                        style="color: red;">{{ awaitMergeDocs.length }}</span></h2>
                                <h2 v-else class="title">选择要合并的文档</h2>
                                <CataLogLeft ref="leftTree" v-model="awaitMergeDocs"></CataLogLeft>
                            </div>
                            <div>
                                <h2 class="title" v-if="!targetDoc.length">选择要合并的目标文档</h2>
                                <h2 class="title" v-else>已选择 <span style="color: red;">{{ targetDoc[0]?.title }}</span>
                                </h2>
                                <CatalogRight ref="rightTree" v-model="targetDoc"></CatalogRight>
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

    .main {
        display: flex;
        height: 100%;

        >div {
            flex: 1;
        }
    }

    .tree-nodeContainer {
        display: flex;
        justify-content: center;
        width: 100%;

        .main {
            width: 70%;
        }
    }
}

.title {
    font-size: 25px;
    margin-bottom: 10px
}
</style>
