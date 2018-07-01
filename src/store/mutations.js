import * as types from './mutation-types';

 // [types.SET_SINGER]的写法：1、为了书写方便，2、为了eslint可以检测出错误
const matutaions = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  }
}

export default matutaions
