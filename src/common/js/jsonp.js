import originJSONP from 'jsonp'
  // export 一个自定义的jsonp方法
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => { // jsonp库的api方法
      if (!err) {
        // console.log(url);
        // console.log(data);
        // console.log(option);
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) {
  let url = '';
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '' // 去掉url中的第一个’&‘符
}
