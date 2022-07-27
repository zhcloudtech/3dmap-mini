export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/variationt/index',
    'pages/variationtDetail/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '净空评估',
    navigationBarTextStyle: 'black'
  },
  usingComponents: {
    "ec-canvas": "./components/ec-canvas/ec-canvas"
  }
})
