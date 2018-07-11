import {getLyric} from 'api/song';
import {ERR_OK} from "../../api/config";
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}){
    this.id = id,
    this.mid = mid, // 歌曲ID
    this.singer = singer, // 歌曲的演唱者们
    this.name = name, // 歌曲名字
    this.album = album,// 歌曲的专辑名
    this.duration = duration, // 歌曲播放时长
    this.image = image, // 歌曲图片
    this.url = url // 歌曲源地址
  }

  getSongLyric() {
    if(this.lyric) {  // 如果这首歌曲之前已经获取到歌词了，就直接返回该歌词，而不需要再去执行getLyric发请求获取歌词了
      return new Promise.resolve(this.lyric);
    }
      // getLyric方法返回的就是一个promise对象，但这里仍然要包装为一个promise，是为了在getLyric中需要做获取歌词成功的处理resolve()和获取失败的处理reject()
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if(res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          // console.log(this.lyric);
          resolve(this.lyric)
        }else {
          reject('no lyric');
        }
      })
    })
  }
}

/**
 * 扩展一个工厂函数
 * 直接在工厂函数中实例化Song这个类，其他页面如果需要实例化Song这个类的话，直接调用该工厂函数就行了，而不需要每个需要Song的页面都去new Song()
 * 前提是，其他页面需要的Song实例的结构都是一样的
 * @param musicData
 * @returns {Song} 返回一个Song类
 */
export function createSong(musicData, songVkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval, // 单位是秒
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=3690129696&vkey=${songVkey}&uin=0&fromtag=66`
  })
}

/**
 * 对歌手名进行加工
 * 如果歌曲的歌手有多位，将歌手名用/分开
 * @param singers
 * @returns {*}
 */
function filterSinger(singers) {
  let ret = [];
  if(!singers) {
    return ''
  }
  singers.forEach((singer) => {
    ret.push(singer.name);
  })
  return ret.join('/')
}
