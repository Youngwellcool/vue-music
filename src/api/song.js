import {commonParams} from "./config";
import axios from 'axios'

export function getLyric(mid) {
  let url = 'api/getLyric';

  let data = Object.assign({}, commonParams, {
    songmid: mid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    needNewCode: 0,
    platform: 'yqq',
    pcachetime: +new Date(),
  });

  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data);
  })
}
