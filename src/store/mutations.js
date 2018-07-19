import * as types from './mutation-types';

/**
 * 定义设置state中的变量的方法
 * 参数：第一个state ， 第二个是设置的值
 * 形如[types.SET_SINGER]的就是方法名(function name)
 * [types.SET_SINGER]的写法：1、为了书写方便，2、为了eslint可以检测出错误
 */
const matutaions = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;    // 设置state中的singer变量的值为传入的singer值
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAY_LIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList;
  }
}

export default matutaions
