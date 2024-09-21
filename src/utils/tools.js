// 阶段总结格式化
let stageFormat = {
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
export function convertDateToTimestamp(dateStr) {
    //exec匹配换成match匹配
    const dateParts = dateStr.match(/\d+/g).map(Number);
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).getTime();
}

// 针对数据排序的工具函数
export function sortTime(cgyData) {

    let verifyDate = /^#\s\d{4}年\d{1,2}月\d{1,2}日/gm

    let correctFormatData = cgyData.filter((cry) => cry.time.search(verifyDate) !== -1);

    let unCorrectFormatData = cgyData.filter((cry) => cry.time.search(verifyDate) === -1);
    // 按照时间进行排序
    correctFormatData.sort((a, b) => {

        let aTimeStr = extractTimeStr(a.time);

        let bTimeStr = extractTimeStr(b.time);

        return convertDateToTimestamp(aTimeStr) - convertDateToTimestamp(bTimeStr)
    })
    // 处理不规范的排序
    unCorrectFormatData = sortUnCorrectFormat(unCorrectFormatData)

    return correctFormatData.concat(unCorrectFormatData)
}
// 处理不规范格式
function sortUnCorrectFormat(cryList) {

    let newArr = new Array(cryList.length).fill(0);

    let staged = [] //暂存标题不合法数据

    cryList.forEach((cry) => {

        let time = cry.time.slice(-4);

        let stageTitle = stageFormat[time];

        if (stageTitle!== undefined) {
            newArr[stageTitle] = cry;
        } else {
            staged.push(cry);
        }
    })
    return newArr.filter((item) => item !== 0).concat(staged)
}

function sortArrayByTime(cgyData) {
//! 去掉全局和多行匹配
    let verifyDate = /^#\s\d{4}年\d{1,2}月\d{1,2}日/
    let correctFormatData = cgyData.filter((cry) => cry.time.search(verifyDate) !== -1);

    correctFormatData.sort((a, b) => {
        //!抽取复用代码
        let aTimeStr =  extractTimeStr(a.time);

        let bTimeStr =  extractTimeStr(b.time);

        return convertDateToTimestamp(aTimeStr) - convertDateToTimestamp(bTimeStr)
    });

    return correctFormatData;
}
//!抽取的单行代码
function extractTimeStr(timeStr) {
    return timeStr.split(" ").pop();
}
// 得到文章的标题
export function getMergeTitle(arr) {

    let correctFormatData = sortArrayByTime(arr)

    let firstElm = correctFormatData[0];

    let lastElm = correctFormatData[correctFormatData.length - 1];

    if (correctFormatData.length === 1) {  //只有一个值

        return extractTimeStr(firstElm.time)    
    }

    return `${extractTimeStr(firstElm.time)} - ${extractTimeStr(lastElm.time)}`;
}
