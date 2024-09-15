<script setup>
import useStore from "@/store/index";
import { ref, watch, computed, toValue } from 'vue'
import { useFetch } from "@/store/useFetch";
import { getChildren } from "@/utils/tree.js";
// 定义一个全局状态
const { store } = useStore()

const url = ref("/repos/24552766/toc");

const { data, error } = useFetch(url);

// 选择了下拉框数据
watch(() => store.selectBookInfo, (val) => {

    if (Object.keys(val).length > 0) {

        url.value = `/repos/${val.id}/toc`
    }
})

// 加工目录结构
const catalogue = computed(() => {

    if (!data.value) {
        return [];
    } else {
        //1. 先获取对应的一级目录
        const treeRoots = data.value.filter((item) => !item.parent_uuid);
        //!将数据按照目录顺序转换为树结构
        return treeRoots.map((treeNode) => ({...treeNode,children:getChildren(toValue(data), treeNode)}))
    }
})
const defaultProps = {
  children: 'children',
  label: 'title',
}

const treeNodeChecked = defineModel()

const tree = ref(null);
const handleCheckChange = (data, checked) => {
    treeNodeChecked.value = tree.value.getCheckedNodes()

};
</script>

<template>
    <div>
        <el-tree :data="catalogue"
        ref="tree"
        show-checkbox 
        :props="defaultProps" 
        :default-expanded-keys="catalogue.map((item)=>item.uuid)"
        @check-change="handleCheckChange"
        class="custom-font-size" node-key="uuid"/>
    </div>
</template>

<style scoped>
.custom-font-size {
  font-size: 18px; /* 调整为你想要的大小 */
}
</style>
