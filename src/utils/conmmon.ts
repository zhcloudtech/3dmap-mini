
export const formatNumber = (n: number | string) : string => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 经纬度浮点 转 度分秒 116°20’43”
 * @param value
 * @returns {string}
 */
export const formatDegree = (value: string) => {
  if(value != null && value != '') {
    let newValue = parseFloat(value)
    newValue = Math.abs(newValue) // 返回数的绝对值
    var v1 = Math.floor(newValue)  //度  对数进行下舍入
    var v2 = Math.floor((newValue - v1) * 60)  // 分
    var v3 = Math.round((newValue - v1) * 3600 % 60) //秒 把数四舍五入为最接近的整数
    return `${v1}°${v2}'${v3}"`
  } else {
    return ''
  }
}

