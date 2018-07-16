/**
 * 此文件存放vuex维护的各个变量
 */

import {playMode} from "../common/js/config";

const state = {
  singer: {}, // 歌手，包括id，姓名，头像
  playing: false,  // 歌曲播放状态，false为暂停，true为播放
  fullScreen: false, // 播放器页是否全屏
  playlist: [], // 正在播放的歌曲的列表
  sequenceList: [], // 从服务器获取到的 默认的歌曲列表
  mode: playMode.sequence, // 播放模式 loop:单曲循环播放 sequence：顺序播放  random:随机播放
  currentIndex: -1,  // 当前播放歌曲的索引 (通过currentIndex和playList或者sequenceList就可以计算出当前播放的歌曲playList[currentIndex] 或者 sequenceList[currentIndex])
  disc: {},  // 歌单数据
};

export default state;
