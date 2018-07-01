// dom操作 库

/**
 *给el元素添加className
 * @param el
 * @param className
 */
export function addClass(el, className) {
  if (hasClass(el, className)){
    return
  }
  //console.log(el.className); // tab-item router-link-exact-active router-link-active
  let newClass = el.className.split(' '); // ["tab-item", "router-link-exact-active", "router-link-active"]
  newClass.push(className); // ["tab-item", "router-link-exact-active", "router-link-active", "className"]
  el.className = newClass.join(' ') // tab-item router-link-exact-active router-link-active className
}



/**
 *判断el元素是否已经有className
 * @param el
 * @param className
 */
export function hasClass(el,className) {
  let reg = new RegExp('(^|\\s)'+className+'(\\s|$)');
  return reg.test(el.className)
}



/**
 * 获取dom的 data- 属性
 * 如果传入了val，就set data-name=val；如果没有传入val，就get data-name的值
 * @param el 操作的dom元素
 * @param name 指定的 data-name 属性名
 * @param val data-name属性的 值
 * @returns {*}
 */
export function getDataProp(el, name, val) {
  let prefix = 'data-';
  name = prefix + name;
  if(val){
    return el.setAttribute(name, val);
  }else {
    return el.getAttribute(name);
  }
}



  // 给写在js中的CSS样式加前缀 (写在css中的样式有webpack插件自动加前缀)
let elementStyle = document.createElement('div').style; // 获取元素的所有支持的样式
let vendor = (() => {
  let transformName = {  // 以css3的transform属性来作为例子
    webkit: 'webkitTransform',
    moz: 'mozTransform',
    O: 'oTransform',
    ms: 'msTransform',
    standard: 'transform',
  };
  for(let key in transformName) {
    if(elementStyle[transformName[key]] !== undefined) { // elementStyle支持的样式中有[transformName.key]这个属性
      return key
    }
  }
  return false // for循环结束，都不支持
})();
/**
 * 给写在js中的CSS样式加前缀 (写在css中的样式有webpack插件自动加前缀)
 * @param styleName  // css样式名
 * @returns {*}
 */
export function prefixStyle(styleName) {
  if(vendor === false) { // 都不支持
    return false
  }
  if(vendor === 'standard') { // 只支持标准的，就直接返回该标准样式名，不需要加前缀
    return styleName;
  }
  return vendor + styleName.charAt(0).toUpperCase() + styleName.substr(1); // 加前缀vendor，且样式名的首字母需要转为大写
}
