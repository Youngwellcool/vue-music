import jsonp from 'common/js/jsonp'
import {commonParams, options} from "./config";
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({},commonParams,{
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  // console.log(url)
  // console.log(data)
  // console.log(options)
  return jsonp(url,data,options)
}

export function getDiscList() {
  const url = '/api/getDiscList'; // 一定要加上/api

  const data = Object.assign({},commonParams,{
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein:29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd:Math.random(),
    format: 'json'
  })
  return axios.get(url,{
    params: data,
  }).then((res) => {
    // console.log(res.data)
    return Promise.resolve(res.data) // 返回一个Promise对象，且直接执行[成功后的回调resolve函数]，抛出res.data数据给then方法作为参数 (供recommend.vue中的_getDiscList方法使用)
  })
}

export function getDiscSongList(disstid) {
  const url = '/api/getDiscSongList';
  const data = Object.assign({},commonParams,{
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: disstid,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  });
  return axios.get(url, {
    params: data,
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
