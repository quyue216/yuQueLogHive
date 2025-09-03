<template>
    <div class="tree-nodeContainer">
        <div class="main">
            <div >
                <h2 class="title" v-if="awaitMergeDocs.length">已选择 <span style="color: red;font-weight: bold;">{{ awaitMergeDocs.length
                        }}</span> 篇文档</h2>
                <h2 v-else class="title">源文档（被合并）</h2>
                <div class="tree-panel">
                    <CataLogTree ref="leftTree" :setCheckTreeNode="setAwaitMergeDocs"></CataLogTree>
                </div>
            </div>
            <div >
                <h2 class="title" v-if="!targetDoc.length">主文档（合并至）</h2>
                <h2 class="title" v-else>已选择 <span class="ellipsis" style="color: red;font-weight: bold;">{{ targetDoc[0]?.title }}</span>
                </h2>
                <div class="tree-panel">
                    <CataLogTree ref="rightTree" :setCheckTreeNode="setTargetDoc"></CataLogTree>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import CataLogTree from "@/components/CatalogTree/Index.vue";
import { defineExpose , ref} from "vue";

const props = defineProps({
  'setAwaitMergeDocs': {
    type: Function,
    required: true
  },
  'setTargetDoc': {
    type: Function,
    required: true
  },
  'awaitMergeDocs': {
        type: Array,
        default: () => []
    },
    'targetDoc': {
        type: Object,
        default: () => []
    }
});
//!树形结构重置
let leftTree = ref();
let rightTree = ref();

// 整合树节点的重置选项
function restCheckedTreeNode(){    
    leftTree.value.tree.clearTreeCheck()
    rightTree.value.tree.clearTreeCheck()
}
defineExpose({
  restCheckedTreeNode
});
</script>

<style scoped lang='less'>
.tree-nodeContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    .title{
     margin: 8px;
    }

    .main {
        display: flex;
        height: 100%;
        width: 70%;
        font-size: 18px;
        >div {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
            .tree-panel{
                flex: 1;
                // height: 100%;
            }
        }
    }

}
</style>
