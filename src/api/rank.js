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

export function getRankMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  const data = Object.assign({}, commonParams, {
    g_tk: 5318,
    topid,
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    page: 'detail',
    type: 'top',
  });

  return jsonp(url, data, options);
}
