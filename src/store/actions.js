import * as types from './mutation-types';

/**
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
