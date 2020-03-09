export default {
  history: 'hash',
  outputPath: `../../dist/renderer`,
  publicPath: './',
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: true,
        title: 'YouComic Studio',
        dll: true,
        hardSource: false,
        routes: {
          exclude: [/components/],
        },
      },
    ],
  ],
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
          path: '/',
          component: '../pages/Home/index',
          routes: [],
        },

      ],
    },
  ],
};
