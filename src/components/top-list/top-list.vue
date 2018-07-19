<template>
  <transition name="slide">
    <music-list :title="title" :bg-img="bgImg" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
    import MusicList from 'components/music-list/music-list';
    import {mapGetters} from 'vuex';
    import {getRankMusicList} from 'api/rank';
    import {ERR_OK} from 'api/config';
    import {getSingerVkey} from 'api/singer'
    import {createSong} from 'common/js/song'

    export default {
      data() {
        return {
          songs: [],
          rank: true, // 开启排行(此rank会传给子组件music-list.vue，然后再传给孙子组件song-list.vue)
        }
      },
      computed: {
        title() {
          return this.topList.topTitle;
        },
        bgImg() {
          if(this.songs.length) {
            return this.songs[0].image; // 将排名为第一名的图片作为背景图片
          }
          return ''
        },
        ...mapGetters([
          'topList'
        ])
      },
      created() {
        this._getRankMusicList();
      },
      methods: {
        _getRankMusicList() {
          if(!this.topList.id) {  // 如果没有this.topList.id(也就是在该页面刷新)就跳转到rank.vue页面
            this.$router.push('/rank');
            return;
          }
          getRankMusicList(this.topList.id).then((res) => {
            console.log(res);
            if(res.code === ERR_OK) {
              this.songs = this._normalizeSong(res.songlist);
            }
          })
        },
        /**
         * 对_getRankMusicList()方法获取到的歌手的歌曲项进行再加工
         * 只提取歌曲项对象中，符合createSong()工厂方法实例化的对象结构
         * @param list
         * @returns {Array}
         * @private
         */
        _normalizeSong(list) {
          let ret = [];
          list.forEach((item) => {
            if(item.data.songid && item.data.albummid){ // songid和ablummid是必传字段
              getSingerVkey(item.data.songmid).then((res) => {
                if(res.code === ERR_OK){
                  let songVkey = res.data.items[0].vkey;
                  const newSong = createSong(item.data, songVkey);
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
  .slide-enter-active, .slide-leave-active
    transition all 0.3s ease

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
