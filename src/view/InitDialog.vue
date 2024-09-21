<template>
    <div>
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

<script setup>
import { ref, watch, onMounted,defineProps} from 'vue'
import { ElMessage } from 'element-plus';
const dialogVisible = ref(false);

const accessToken = ref("");

const props = defineProps({
    initializeUserAndBooks:{
        type:Function,
        default:()=>{}
    }
})

//! token检验
const checkAccessToken = () => {
    if (accessToken.value === "") {
        ElMessage.error("accessToken 不能为空");
    } else {
        dialogVisible.value = false;
        // 初始化用户信息
        props.initializeUserAndBooks(); 
    }
}

onMounted(() => {
    //没有token打开弹框，用户输入对应信息
    window.token = window.localStorage.getItem("token");

    dialogVisible.value = !window.token;

    if (window.token) {
        // 初始化用户信息和知识库下拉框
        props.initializeUserAndBooks()
    }
})

watch(accessToken, () => {
    window.localStorage.setItem("token", accessToken.value);
    window.token = accessToken.value
})
</script>

<style scoped lang='less'>
</style>
