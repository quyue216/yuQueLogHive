<script setup>
import useStore from "@/store/index";
import { ref, watch, computed, toValue } from 'vue'
import { useFetch } from "@/store/useFetch";
import { getChildren } from "@/utils/tree.js";
import Tree from "./Tree.vue";
// 定义一个全局状态
const { store } = useStore()

const url = ref("/repos/24552766/toc");
const tree = ref(null);
const { data, error , isLoading} = useFetch(url);

// 选择了下拉框数据
watch(() => store.selectBookInfo, (val,oldVal) => {

    if (Object.keys(val).length > 0 && val!==oldVal) {
        // 避免url相同请求失效
        url.value = `/repos/${val.id}/toc?name=`+Date.now();        
    }
})

// 加工目录结构
const catalogue = computed(() => {

    if (!data.value) {
        return [];
    } else {
        //1. 先获取对应的一级目录
        const treeRoots = data.value.filter((item) => !item.parent_uuid);

        return treeRoots.map((treeNode) => ({ 
            ...treeNode, 
            children: getChildren(toValue(data), treeNode) }))
    }
})
defineExpose({
    tree
});

</script>
<template>
    <!-- 还可以扩展error的处理 -->
    <div>
        <Tree ref="tree" v-bind="$attrs" :catalogue="catalogue"  
        v-loading="isLoading"/>
    </div>
</template>

<style scoped>
.custom-font-size {
    font-size: 18px;
    /* 调整为你想要的大小 */
}
</style>
