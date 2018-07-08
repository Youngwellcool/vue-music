<template>
  <transition name="slider">
    <music-list :songs="songs" :title="title" :bg-img="bgImg"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex' // mapGetters语法糖(获取state中的数据的简写映射)
    import {getSingerDetail, getSingerVkey} from 'api/singer'
    import {ERR_OK} from 'api/config'
    import {createSong} from 'common/js/song'
    import MusicList from 'components/music-list/music-list'
    export default {
      data() {
        return {
          songs: []
        }
      },
      computed: {
        // 使用对象展开运算符将 getter 混入 computed 对象中
        ...mapGetters([
          'singer' // 将this.singer映射为this.$store.getters.singer,相当于在vue实例上挂载了singer属性，值就等于this.$store.getters.singer的值
        ]),
        title() {
          return this.singer.name
        },
        bgImg() {
          return this.singer.avatar
        }
      },
      created() {
        this._getDetail();
      },
      methods: {
        _getDetail() {
          // 防止用户在歌手详情页面刷新，获取不到歌手数据的问题(在这个页面刷新，从vuex中获取不到singer对象，因为state中的singer对象是用户在歌手列表页面点击歌手时触发mutations写入state中的，不经过点击歌手这个操作state.singer就是空对象)
          if(!this.singer.id){
            this.$router.push('/singer'); // 回跳到歌手列表页面
            return
          }
            // 根据this.singer.id获取歌手的歌曲
          getSingerDetail(this.singer.id).then((res) => {
            if(res.code === ERR_OK){
              this.songs = this._normalizeSong(res.data.list);
              console.log(this.songs)
            }
          })

        },
        /**
         * 对getSingerDetail()方法获取到的歌手的歌曲项进行再加工
         * 只提取歌曲项的musicData对象中，符合createSong()工厂方法实例化的对象结构
         * @param list
         * @returns {Array}
         * @private
         */
        _normalizeSong(list) {
          let ret = [];
          list.forEach((item) => {
            let {musicData} = item; // 相当于 musicData=item.musicData;
            console.log(musicData)
            if(musicData.songid && musicData.albummid){ // songid和ablummid是必传字段
              getSingerVkey(musicData.songmid).then((res) => {
                if(res.code === ERR_OK){
                  let songVkey = res.data.items[0].vkey;
                  const newSong = createSong(musicData, songVkey);
                  ret.push(newSong)
                }
              })
            }
          })
          return ret;
        }
      },
      components: {
        MusicList
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"
  .slider-enter-active,.slider-leave-active
    transition: all 0.3s
  .slider-enter,.slider-leave-to
    transform: translate3d(100%, 0, 0)
</style>
