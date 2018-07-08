/**
 * 获取min到max之前的随机整数，包括max
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 打乱arr数组的顺序
 * 经典算法：遍历arr，将遍历的(当前值)与(当前值之前[包括当前值]的任意一个值)对换
 * @param arr 数组
 * @returns {*}
 */
export function shuffle(arr) {
  for(let i=0;i<arr.length;i++) {
    let j = getRandomInt(0, i); // 获取当前索引前面的任意一个索引
    let t = arr[i]; // 将当前值赋值给t
    arr[i] = arr[j]; // 将当前值之前的任意一个值赋值给当前值
    arr[j] = t; // 将当前值赋值给当前值之前的任意一个值
  }
  return arr;
}
