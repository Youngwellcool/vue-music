/**
 * 此文件存放vuex维护的各个变量
 */

import {playMode} from "../common/js/config";

const state = {
  singer: {}, // 歌手，包括id，姓名，头像
  playing: false,  // 歌曲播放状态，false为暂停，true为播放
  fullScreen: false, // 播放器页是否全屏
  playlist: [], // 播放的歌曲列表，默认顺序
  sequenceList: [], // 播放的歌曲列表，随机顺序
  mode: playMode.loop, // 播放模式 loop:循环播放 sequence：顺序播放  random:随机播放
  currentIndex: -1,  // 当前播放歌曲的索引 (通过currentIndex和playList或者sequenceList就可以计算出当前播放的歌曲playList[currentIndex] 或者 sequenceList[currentIndex])
};

export default state;
