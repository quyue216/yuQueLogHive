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

    let stageSummary = [];
    
    // 表示是单元
    let isStage = data.title.includes("单元");

    const dates = summaryText.match(matchRegex.matchTime) ?? [];

    // 提取的rethinks
    let rethinks = handelRethinks(summaryText,isStage);

    rethinks.forEach((item, index) => {
        stageSummary = stageSummary.concat(...summaryGroupAdapter(isStage,item, dates[index]))
    })

    return stageSummary;
}

function summaryGroupAdapter(isStage,...rest){
    //!不是总结
    if(!isStage){
        return  summaryGroup(...rest,"\n# rethink")
    }else{
         return  summaryGroup(...rest)
    }
}

//!2. 将总结转换为分类对象
function summaryGroup(str, time, startStr = "\n## rethink") {

    let source = str.replace(startStr, "")
    //！总结的分类就是三级标题
    return source.split("###").filter((item) => item !== "\n" && item).map((item) => ({
        group: item.slice(0, item.indexOf("\n")).trim(),//标题结尾有一个换行
        content: item.slice(item.indexOf("\n")),
        time:startStr ===  "\n## rethink" ? time : docInfo.title
    }))
}
// 截取反思字符串
function handelRethinks(text, isStage) {
    if (isStage) {
        return sliceRethinks(text)
    } else {
        return sliceRethinks(text, "\n# rethink", "\n# idea")
    }
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

        sourceStr = sourceStr.slice(endIndex + endStr.length)
    }

    return results;
}
