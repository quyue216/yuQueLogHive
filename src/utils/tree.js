/* 

排序到底在什么时候去做

在查找子节点的时候需要根据顺序去进行查找并push
child_uuid    子级第一个子节点
prev_uuid   前一个子节点 
sibling_uuid  同级后一个子节点
*/
export function getChildren(arr,treeNode) {
    
    const res = []
    
    let pointer_uuid = treeNode.child_uuid; //指针
        
    while (pointer_uuid){
        
     let treeChildNode =  arr.find((item)=> item.uuid === pointer_uuid)
       
     pointer_uuid = treeChildNode.sibling_uuid;

     res.push({...treeChildNode,children:getChildren(arr,treeChildNode)})  
    }
    
    return res;
}


