<template>
  <transition name="slide">
    <music-list :songs="songs" :bgImg="bgImg" :title="title"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
    import musicList from 'components/music-list/music-list';
    import {mapGetters} from 'vuex';
    import {getDiscSongList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    import {getSingerVkey} from 'api/singer'
    import {createSong} from 'common/js/song'
    export default {
      data() {
        return {
          songs: [],
        }
      },
      computed: {
        ...mapGetters([
          'disc',
        ]),
        title() {
          return this.disc.dissname
        },
        bgImg() {
          return this.disc.imgurl
        }
      },
      created() {
        this._getDiscSongList();
      },
      methods: {
        _getDiscSongList() {
          // 防止用户在歌单详情页面刷新，获取不到歌单数据的问题(在这个页面刷新，从vuex中获取不到disc对象，因为state中的disc对象是用户在recommend.vue页面点击歌单时触发mutations写入state中的，不经过点击歌单这个操作state.disc就是空对象)
          if(!this.disc.dissid) {
            this.$router.push('/recommend');
            return;
          }
          getDiscSongList(this.disc.dissid).then((res) => {
            console.log(res);
            if(res.code === ERR_OK) {
              console.log(res.cdlist[0].songlist);
              this.songs = this._normalizeSong(res.cdlist[0].songlist);
            }
          })
        },
        /**
         * 对_getDiscSongList()方法获取到的歌手的歌曲项进行再加工
         * 只提取歌曲项对象中，符合createSong()工厂方法实例化的对象结构
         * @param list
         * @returns {Array}
         * @private
         */
        _normalizeSong(list) {
          let ret = [];
          list.forEach((item) => {
            if(item.songid && item.albummid){ // songid和ablummid是必传字段
              getSingerVkey(item.songmid).then((res) => {
                if(res.code === ERR_OK){
                  let songVkey = res.data.items[0].vkey;
                  const newSong = createSong(item, songVkey);
                  ret.push(newSong)
                }
              })
            }
          })
          return ret;
        }
      },
      components: {
        musicList
      },
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
