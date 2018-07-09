import * as types from './mutation-types';
import {playMode} from "../common/js/config";
import {shuffle} from "../common/js/util";

/**
 * 点击歌曲列表中的歌曲触发
 * 批量触发store/mutations中定义的方法
 * @param commit  触发mutations中的方法的方法
 * @param state   state.js
 * @param list    歌曲列表
 * @param index   当前被选择的歌曲的索引
 * get：如果页面中的一个动作会同时触发多个mutations中的方法，就可以像这样集中定义一个方法来批量触发mutations中的方法
 */
export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_CURRENT_INDEX, index);
}

/**
 * 点击随机播放全部按钮 触发
 * 批量触发store/mutations中定义的方法
 * @param commit
 * @param state
 * @param list
 */
export const randomPlay = function ({commit, state}, {list}) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_MODE, playMode.random); // 设置播放模式为随机模式
  let randomList = shuffle(list);
  commit(types.SET_PLAY_LIST, randomList); // 设置播放列表为随机顺序的歌曲列表
  commit(types.SET_CURRENT_INDEX, 0); // 设置从播放列表中的第一首歌开始播放
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}
