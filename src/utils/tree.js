/* 

排序到底在什么时候去做

在查找子节点的时候需要根据顺序去进行查找并push
child_uuid    子级第一个子节点
prev_uuid     前一个子节点 
sibling_uuid  同级后一个子节点
*/
export function getChildren(arr,treeNode) {
    
    const res = []
    
    let pointer_uuid = treeNode.child_uuid; //指针
    //! 创建一个快捷映射表，用于快速查找uuid对应的节点
    const uuidMap = new Map(arr.map(item => [item.uuid, item]));
    
    while (pointer_uuid){
    
        const treeChildNode = uuidMap.get(pointer_uuid);
        
        if(!treeChildNode) break;

        const children = getChildren(arr,treeChildNode)
    
        res.push({...treeChildNode,children})  

        pointer_uuid = treeChildNode.sibling_uuid;
    }
    
    return res;
}


