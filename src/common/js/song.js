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
}

/**
 * 扩展一个工厂函数
 * 直接在工厂函数中实例化Song这个类，其他页面如果需要实例化Song这个类的话，直接调用该工厂函数就行了，而不需要每个需要Song的页面都去new Song()
 * 前提是，其他页面需要的Song实例的结构都是一样的
 * @param musicData
 * @returns {Song} 返回一个Song类
 */
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    min: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval, // 单位是秒
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400001Qu4I30eVFYb.m4a?vkey=840447AFDC71CF09B102CC25831A3D2C06227AD76D2D0B8D54B01204A83369C5D7FEC7435B70B95635D1E36BC7C81D35A408C508DF2803FA&guid=2761703576&uin=0&fromtag=66`

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
