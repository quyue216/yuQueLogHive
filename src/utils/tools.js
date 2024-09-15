// 阶段总结格式化
let stageFormat={
    "第一阶段": 0,
    "第二阶段": 1,
    "第三阶段": 2,
    "第四阶段": 3,
    "第五阶段": 4,
    "第六阶段": 5,
    "第七阶段": 6,
    "第八阶段": 7,
    "第九阶段": 8,
    "第十阶段": 9,
    "第十一阶段": 10,
    "第十二阶段": 11,
    "第十三阶段": 12,
    "第十四阶段": 13,
    "第十五阶段": 14
  }

// 合并字符串
export function mergeSummary(groupObj) {
    let summary = ""

    Object.keys(groupObj).forEach((key) => {

        let sayCate = ""

        sayCate = groupObj[key].map((item) => `#${item.time}${item.content}`).join("")

        summary += `# ${key}\n${sayCate}`; //设置上key
    })
    return summary
}

// 对数据进行分组
export function generateGroup(cates) {

    return cates.reduce((pre, item) => {

        if (pre[item.group]) {
            pre[item.group].push(item)
        } else {
            pre[item.group] = [item]
        }
        return pre;
    }, {})
}

// 定义一个函数来转换日期格式为时间戳
export function convertDateToTimestamp(dateString) {
    const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日/;
    const matches = regex.exec(dateString);

    if (matches) {
        const year = parseInt(matches[1], 10);
        const month = parseInt(matches[2], 10) - 1; // JavaScript中月份是从0开始的
        const day = parseInt(matches[3], 10);

        // 创建Date对象
        const date = new Date(year, month, day);

        // 返回时间戳
        return date.getTime();
    } else {
        throw new Error('Invalid date format');
    }
}

// 针对数据排序的工具函数
export function sortTime(cgyData) {

    let verifyDate = /^#\s\d{4}年\d{1,2}月\d{1,2}日/gm

   let correctFormatData = cgyData.filter((cry)=>cry.time.search(verifyDate)!==-1);

   let unCorrectFormatData = cgyData.filter((cry)=>cry.time.search(verifyDate)===-1);
    
    correctFormatData.sort((a, b) => {
       
        let aTimeStr = a.time.split(" ")[a.time.split(" ").length-1];

        let bTimeStr = b.time.split(" ")[b.time.split(" ").length-1];
        
        return convertDateToTimestamp(aTimeStr) - convertDateToTimestamp(bTimeStr)
    })

    unCorrectFormatData = sortUnCorrectFormat(unCorrectFormatData)
    
    return correctFormatData.concat(unCorrectFormatData)
}
// 处理不规范格式
function sortUnCorrectFormat(cryList) {
    
    let newArr = new Array(cryList.length).fill(0);
    
    let  staged =[] //暂存标题不合法数据

    cryList.forEach((cry,index)=>{

     let time = cry.time.slice(-4);
     
      if(stageFormat[time]!==undefined){
        newArr[stageFormat[time]] = cry;
      }else{
        staged.push(cry);
      }
    })
    return newArr.filter((item)=>item!==0).concat(staged)
}

