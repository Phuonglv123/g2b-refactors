﻿/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/login',
    layout: false,
    component: './Login',
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/crm',
    name: 'CRM',
    icon: 'smile',
    access: 'canAdmin',
    routes: [
      {
        path: '/crm',
        component: './Crm',
      },
      {
        path: '/crm/opportunity',
        component: './Crm',
      },
      {
        path: '/crm/opportunity/create',
        component: './Crm/Opportunity/Create',
      },
      {
        path: '/crm/opportunity/:id/edit',
        component: './Crm/Opportunity/Create',
      },
      {
        path: "/crm/opportunity/:id",
        component: './Crm/Opportunity/Detail',
      },
      {
        path: '/crm/potential',
        component: './Crm',
      },
      {
        path: '/crm/potential/:id',
        component: './Crm/Potential/Detail',
      },
      {
        path: "/crm/activity",
        component: './Crm',
      },
      {
        path: "/crm/desktop",
        component: './Crm',
      }
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    component: './Dashboard',
    access: 'canAdmin',
  },
  {
    path: '/tasks',
    name: 'tasks',
    icon: 'desktop',
    access: 'canTask',
    key: 'tasks',
    routes: [
      {
        path: '/tasks',
        component: './Tasks',
        key: 'taskss',
      },
      {
        path: '/tasks/detail/:id',
        key: 'task-detail',
        component: './Tasks/TaskDetail',
      },
    ],
  },
  {
    name: 'products',
    icon: 'rest',
    path: '/products',
    key: 'products',
    access: 'canSale',
    routes: [
      {
        path: '/products',
        component: './Products',
        key: 'products',
      },
      {
        path: '/products/create',
        component: './Products/CreateProduct',
      },
      {
        path: '/products/update/:id',
        component: './Products/CreateProduct',
      },
      {
        path: '/products/:id',
        component: './Products/DetailProduct',
      },
    ],
  },
  {
    path: '/users',
    name: 'users',
    icon: 'user',
    access: 'canAdmin',
    component: './Customer',
  },
  {
    path: '/provider',
    name: 'vendor',
    icon: 'global',
    access: 'canAdmin',
    component: './Provider',
  },
  {
    path: '/locations',
    name: 'locations',
    icon: 'AimOutlined',
    access: 'canEditor',
    key: 'locations',
    component: './Locations',
  },
  {
    path: '/business',
    name: 'business',
    icon: 'AccountBookOutlined',
    key: 'business',
    component: './Business',
    access: 'canAdmin',
  },

  {
    path: '/list-product-card',
    name: 'list-product-card',
    icon: 'AppstoreOutlined',
    key: 'card',
    exact: true,
    routes: [
      {
        path: '/list-product-card',
        component: './ListProductCard',
        key: 'ListProductCard',
        exact: true,
      },
      {
        path: '/list-product-card/:id',
        component: './ListProductCard/DetailProductCard',
        key: 'Detail',
      },
    ],
  },
  {
    path: '/maps',
    key: 'maps',
    name: 'maps',
    icon: 'GlobalOutlined',
    routes: [
      {
        path: '/maps',
        key: 'maps',
        component: './Maps',
      },
      {
        path: '/maps/:id',
        key: 'maps-detail',
        component: './Maps/MapsDetail',
      },
    ],
  },

  {
    path: '/',
    layout: false,
    component: './Home',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
