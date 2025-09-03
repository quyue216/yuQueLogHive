<script setup>
import { ref ,defineProps ,computed} from 'vue'

// 定义Props
const defaultProps = {
    children: 'children',
    label: 'title',
}

const props = defineProps({
    catalogue:{ //目录
        type:Array,
        default:[]
    },
    setCheckTreeNode:{ // 选中节点
        type:Function,
        default:()=>{}
    }
})

const tree = ref(null);
const handleCheckChange = () => {
   
   let checkNode = tree.value.getCheckedNodes()
   // 传递给顶层组件
   props.setCheckTreeNode(checkNode)
};

// 计算默认展开的节点键
const expandedKeys = computed(() => {
    return  props.catalogue.map(item => item.uuid);
});
// 为清空节点提供支持
const clearTreeCheck = ()=>{
    tree.value.setCheckedKeys([])
}
defineExpose({
    clearTreeCheck,
});
</script>

<template>
    <div class="treeContainer">
        <el-tree ref="tree" 
        :data="catalogue" 
        show-checkbox 
        :props="defaultProps"
        :default-expanded-keys="expandedKeys" 
        @check-change="handleCheckChange"
        class="custom-font-size" 
        node-key="uuid" />
    </div>
</template>

<style scoped>
.custom-font-size {
    font-size: 18px;
    /* 调整为你想要的大小 */
}
.treeContainer{
    height: 100%;
}
</style>
