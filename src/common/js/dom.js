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
