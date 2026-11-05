export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detail/index',
    'pages/stats/index'
  ],
  subPackages: [
    {
      root: 'packages/solution',
      pages: ['pages/view/index']
    }
  ],
  tabBar: {
    color: '#9aa0a6',
    selectedColor: '#4c6ef5',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      { pagePath: 'pages/index/index', text: '题库', iconPath: 'assets/tab-home.png', selectedIconPath: 'assets/tab-home-active.png' },
      { pagePath: 'pages/stats/index', text: '统计', iconPath: 'assets/tab-stats.png', selectedIconPath: 'assets/tab-stats-active.png' }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4c6ef5',
    navigationBarTitleText: '代码随想录 150 题',
    navigationBarTextStyle: 'white'
  }
})
