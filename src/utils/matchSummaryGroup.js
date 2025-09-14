// 匹配一级标题日期
const matchRegex = {
    matchTime: /^#\s\d{4}年\d{1,2}月.*?日/gm,  //提取时间
}

let docInfo = null;
// 入口函数 返回提取的本篇文章的总结对象, 一般调用至少调用三十次，
export default function main(data) {
    // 保存文章对象
    docInfo = data

    let summaryText =  data.body; //得到md文件格式
    // 表示是单元
    let isStage = data.title.includes("单元");

    const dates = summaryText.match(matchRegex.matchTime) ?? [];

    // 提取的rethinks
    let rethinks = handelRethinks(summaryText,isStage);

    const stageSummary = rethinks.flatMap((item, index) =>
        summaryGroupAdapter(isStage, item, dates[index])
    );

    return stageSummary;
}

function summaryGroupAdapter(isStage,str,time){
    //!不是总结
    return summaryGroup(str, time, !isStage ? "\n# rethink" : "\n## rethink");
}

//!2. 将总结转换为分类对象
function summaryGroup(str, time, startStr = "\n## rethink") {

    let source = str.replace(startStr, "")
    //！总结的分类就是三级标题
    return source.split("###").filter((item) =>{
        let index = item.indexOf("\n");
        let suyContent = item.slice(index)  //! 截取标题后的内容
        // 必须大于三个字
        return suyContent.replace(/[\n\t]/g, '').trim().length > 3;
    }).map((item) => {
        let index = item.indexOf("\n");
        let  contentObj =  {
             group: item.slice(0, index),//标题结尾有一个换行
             content: item.slice(index).replace(/\n(?!:::)/g,`\n   `).replace(/\n\n(?!:::)/g, '\n\n   '),
            time:startStr ===  "\n## rethink" ? time : `# ${docInfo.title}`
        }

        return contentObj
    })
}
// 截取反思字符串
function handelRethinks(text, isStage) {
    return isStage ? sliceRethinks(text)   //!单元总结
    : sliceRethinks(text, "\n# rethink", "\n# idea"); //! 阶段总结
}


//!1.截取反思字符串 包括标题
function sliceRethinks(str, startStr = "\n## rethink", endStr = "\n## idea") {

    let results = [];

    let sourceStr = str;

    while (sourceStr.search(startStr) !== -1) {

        let startIndex = sourceStr.search(startStr);

        let endIndex = sourceStr.search(endStr);
        // 
        let rethinks = sourceStr.slice(startIndex, endIndex);

        results.push(rethinks);

        sourceStr = sourceStr.slice(endIndex + endStr.length) //! 从下一个位置开始截取
    }

    return results;
}
