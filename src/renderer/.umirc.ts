import { defineConfig } from 'umi';

export default defineConfig({
  outputPath: `../../dist/renderer`,
  publicPath: './',
  title: 'YouComic Studio',
  history: { type: 'hash' },
  antd: {
    dark:true,
  },
  dva: {
    hmr: true,
  },
  locale: {
    default: 'zh-CN',
    baseNavigator: true,
  },
  // routes: {
  //   exclude: [/components/],
  // },
  routes: [
    {
      path: '/',
      component: '../layout/BlankLayout/index',
      routes: [
        {
          path: '/file',
          component: '../pages/List/index',
          routes: [
            {
              path: '/file/directory/home',
              component: '../pages/Directory/Home/index',
            },
          ],
        },
        {
          path: '/book/create',
          component: '../pages/Create/index',
        },
        {
          path: '/scan/list',
          component: '../pages/Scan/List/index',
        },
        {
          path: '/setting',
          component: '../pages/Setting/index',
        },
        {
          path: '/library/create/path',
          component: '../pages/Library/Create/SelectPath/index',
        },
        {
          path: '/',
          component: '../pages/Home/index',
          routes: [],
        },

      ],
    },
  ],
});
