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
 * @param arr 歌曲列表
 * @returns {*}
 */
export function shuffle(arr) {
  let _arr = arr.slice();  // 这里要创建一个arr的副本_arr，因为如果不创建，以下的打乱顺序操作就会直接改变了arr的顺序，而state中的playlist和state中的sequenceList都是引用该arr歌曲列表的，就会因此而把歌曲的默认顺序给改变了
  for(let i=0;i<_arr.length;i++) {
    let j = getRandomInt(0, i); // 获取当前索引前面的任意一个索引
    let t = _arr[i]; // 将当前值赋值给t
    _arr[i] = _arr[j]; // 将当前值之前的任意一个值赋值给当前值
    _arr[j] = t; // 将当前值赋值给当前值之前的任意一个值
  }
  return _arr;
}
