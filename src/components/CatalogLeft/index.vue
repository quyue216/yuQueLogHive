<script setup>
import useStore from "@/store/index";
import { ref, watch, onMounted, toRefs, computed, toValue } from 'vue'
import { useFetch } from "@/store/useFetch";
import { getChildren } from "@/utils/tree.js";
// 定义一个全局状态
const { store, updateUserInfo, setSelectBookInfo } = useStore()

const url = ref("/repos/24552766/toc");

const { data, error } = useFetch(url);

// 选择了下拉框数据
watch(() => store.selectBookInfo, (val) => {

    if (Object.keys(val).length > 0) {

        url.value = `/repos/${val.id}/toc`
    }
})


const catalogue = computed(() => {

    if (!data.value) {
        return [];
    } else {
        //1. 先获取对应的一级目录
        const treeRoots = data.value.filter((item) => !item.parent_uuid);
        console.log('-----', treeRoots);

        return treeRoots.map((treeNode) => ({...treeNode,children:getChildren(toValue(data), treeNode)}))
    }
})
</script>

<template>
    <div>
        你好世界Left {{ store.userInfo.name }} {{catalogue}}
    </div>
</template>

<style scoped></style>
