<script setup>
import { ref ,defineProps ,computed} from 'vue'

// 定义Props
const defaultProps = {
    children: 'children',
    label: 'title',
}

const props = defineProps({
    catalogue:{
        type:Array,
        default:[]
    },
    setCheckTreeNode:{
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
</script>

<template>
    <div>
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
</style>
