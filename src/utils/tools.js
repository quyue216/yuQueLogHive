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