<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList"><!--绑定props属性data=discList，当discList数据发生了变化时，会触发scroll组件中的watch，从而更新better-scroll，重新获取页面的宽高，而不需要调用者自己手动来更新better-scroll-->
      <div>
        <div v-if="recommends.length" class="slider-wrapper"> <!--当recommends有数据时，才开始渲染该div，也就是才开始加载slider组件，不然slider组件中的mounted方法(better-scroll初始化)都开始执行了，页面中还没有加载出数据(导致better-scroll获取不到dom元素的宽高)-->
          <slider>
            <div v-for="(item,index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img  @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item,index) in discList" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-show="!discList.length" class="loading-container">
        <loading text="歌单载入中……"></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import {getRecommend, getDiscList} from 'api/recommend';
  import {ERR_OK} from 'api/config'
  export default {
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      this._getRecommend();
      this._getDiscList();
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if(res.code == ERR_OK){
//            console.log(res.data.slider)
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if(res.code == ERR_OK){

//            setTimeout(()=>{
              this.discList = res.data.list;
//            },2000)

          }
        })
      },
      /**
       * 当轮播图片加载后，更新scroll组件，使better-scroll重新计算页面的宽高
       * 使用this.checkImage变量 使scroll组件只更新一次
       * TODO discList数据变化和轮播图加载完成都会使scroll组件更新，这样双重触发，使better-scroll能够准确计算出页面的宽高，使页面能完美的滚动
       */
      loadImage() {
        if (!this.checkImage) {
          this.$refs.scroll.refresh();
          this.checkImage = true;
        }
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
