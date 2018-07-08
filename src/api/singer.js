import jsonp from 'common/js/jsonp'
import {commonParams, options} from "./config";
import axios from 'axios'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: singerId
  })
  return jsonp(url, data, options)
}

  // export function getSingerVkey(singerId) {
  //   const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
  //   const data = Object.assign({}, commonParams, {
  //     g_tk:5381,
  //     hostUin: 0,
  //     needNewCode: 0,
  //     platform: 'yqq',
  //     songstatus: 1,
  //     cid:205361747,
  //     uin: 0,
  //     songmid: singerId,
  //     filename: `C400${singerId}.m4a`,
  //     guid: 1263780407,
  //   });
  //   return jsonp(url, data, options)
  // }

export function getSingerVkey(singerId) {
  const url = '/api/getMusic'; // 一定要加上/api

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    songstatus: 1,
    cid: 205361747,
    uin: 0,
    songmid: singerId, // 之前songmid字段写成了singerId导致请求成功了，但请求结果无数据，错误提示为filename size not equal songmid size(粗心！！)
    filename: `C400${singerId}.m4a`,
    guid: 3690129696,
  })
  return axios.get(url, {
    params: data,
  }).then((res) => {
    // console.log(res.data)
    return Promise.resolve(res.data) // 返回一个Promise对象，且直接执行[成功后的回调resolve函数]，抛出res.data数据给then方法作为参数 (供recommend.vue中的_getDiscList方法使用)
  })
}
