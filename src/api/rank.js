import jsonp from 'common/js/jsonp'
import {commonParams, options} from "./config";

export function getRankList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    g_tk: 5381,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
  });

  return jsonp(url, data, options);
}
