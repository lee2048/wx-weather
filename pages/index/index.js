let citys = require('../city.js')
let icon  = require('../icon.js')

Page({
  data: {
    weathes: {},
    city: {},
    weathes: {},
    icon: icon,
    animation: '',
  },
  bindKeyInput: function(e){
    this.setData({
      city: {
        currentCity: e.detail.value
      }
    });
  },
  searchWeathes: function (e) {
    let that = this
    //获取cityId
    let cityId = citys[that.data.city.currentCity.replace(/市|县|区|镇|省/g, '')]
    //显示loading状态
    wx.showLoading({
      title: "loading...",
      mask: true,
    })

    //请求天气数据
    wx.request({
      // 'url': 'https://weatherapi.market.xiaomi.com/wtr-v3/weather/all?latitude=' + that.data.city.latitude + '&longitude=' + that.data.city.longitude + '&days=15&appKey=weather20151024&sign=zUFJoAR2ZVrDy1vF3D07&isGlobal=false&locale=zh_cn'
      'url': 'http://aider.meizu.com/app/weather/listWeather?cityIds=' + cityId
      // 'url' : 'https://free-api.heweather.com/v5/weather?city=' + that.data.city.longitude + ',' + that.data.city.latitude + '&key=9f4dca9c8b25446c85429e18d610f8f8'
      ,'method': 'GET'
      ,'success': function(data){
        that.setData({
          weathes: data.data.value[0]
        })
        console.log(that.data.weathes)
      },
      'complete': function(){//请求结束隐藏loading框
        wx.hideLoading()
        that.test();
      }
    })

  },
  //初始状态请求位置信息,得到经纬度
  onReady: function(){
    let that = this;
    wx.getLocation({
      'success': function(e){
        wx.showLoading({
          title: "loading...",
          mask: true,
        })
        //通过经纬度获得城市名称
        wx.request({
          'url': 'http://api.map.baidu.com/geocoder/v2/?',
          'data': {
            'ak': 'S2klOCUBGxt7iiVRXdvG9rmvCpLwZGR0',
            'callback': 'renderReverse',
            'location': e.latitude + ',' + e.longitude,
            'output': 'json',
            'pois': 1
          },
          'success': function(data){
            if (data.statusCode == 200 && /ok/.test(data.errMsg)) {
              data = JSON.parse(data.data.replace(/^renderReverse\&\&renderReverse\(|\)$/g, ''));
              that.setData({
                city: {
                  latitude: e.latitude,
                  longitude: e.longitude,
                  currentCity: data.result.addressComponent.city
                }
              });
              that.searchWeathes();
            }
          },
          'complete': function(){
            wx.hideLoading()
          }
        })
      }
    })
    
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
      delay: 0
    })
  },
  test: function(){
    this.animation.translateY(0).opacity(1).step()
    this.setData({
      animation: this.animation.export()
    })
  }
})
