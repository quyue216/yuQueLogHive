<template>
    <div class="tree-nodeContainer">
        <div class="main">
            <div>
                <h2 class="title" v-if="awaitMergeDocs.length">已选择 <span style="color: red;">{{ awaitMergeDocs.length
                        }}</span></h2>
                <h2 v-else class="title">选择要合并的文档</h2>
                <CataLogTree ref="leftTree" :setCheckTreeNode="setAwaitMergeDocs"></CataLogTree>
            </div>
            <div>
                <h2 class="title" v-if="!targetDoc.length">选择要合并的目标文档</h2>
                <h2 class="title" v-else>已选择 <span class="ellipsis" style="color: red;">{{ targetDoc[0]?.title }}</span>
                </h2>
                <CataLogTree ref="rightTree" :setCheckTreeNode="setTargetDoc"></CataLogTree>
            </div>
        </div>
    </div>
</template>

<script setup>
import CataLogTree from "@/components/CatalogTree/Index.vue";
import { defineExpose , ref} from "vue";

const props = defineProps({
  'set-await-merge-docs': {
    type: Function,
    required: true
  },
  'set-target-doc': {
    type: Function,
    required: true
  },
  'await-merge-docs': {
        type: Array,
        default: () => []
    },
    'target-doc': {
        type: Object,
        default: () => []
    }
});
//!树形结构重置
let leftTree = ref();

let rightTree = ref();
function restCheckedTreeNode(){

    awaitMergeDocs.value = []

    targetDoc.value = []

    leftTree.value.$refs.tree.setCheckedKeys([])

    rightTree.value.$refs.tree.setCheckedKeys([])
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

    .main {
        display: flex;
        height: 100%;
        width: 70%;

        >div {
            flex: 1;
        }
    }

}
</style>
