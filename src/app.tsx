import logoG2b from '@/assets/logo.png';
import { AvatarDropdown, AvatarName, Footer } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { Flex, Switch } from 'antd';
import type { RequestOptionsInit } from 'umi-request';
import defaultSettings from '../config/defaultSettings';
import LogoOnly from './components/LogoOnly';
import { NoticeIconView } from './components/RightContent';
import { errorConfig } from './requestErrorConfig';
import { queryCurrentUser } from './services/auth';
import { getSrcImg } from './utils';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

//const isDev = process.env.NODE_ENV === 'development';
const loginPath = ['/', '/login'];

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.user;
    } catch (error) {
      history.push(loginPath[0]);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (!loginPath.includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {
        ...defaultSettings as Partial<LayoutSettings>,
        navTheme: localStorage.getItem('theme') === 'true' ? 'realDark' : 'light',
      },
    };
  }
  localStorage.setItem('umi_locale', 'en-US');

  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
    loading: false,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    actionsRender: () => [],
    logo: <LogoOnly />,
    avatarProps: {
      src: initialState?.currentUser?.avatar
        ? getSrcImg(initialState?.currentUser?.avatar)
        : logoG2b,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return (
          <Flex gap={24}>
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              defaultChecked={localStorage.getItem('theme') === 'true' ? true : false}
              onChange={(checked: any) => {
                localStorage.setItem('theme', checked );
                window.location.reload();
              }}
            />
            <NoticeIconView />
            <AvatarDropdown>{avatarChildren}</AvatarDropdown>
          </Flex>
        );
      },
    },

    loading: false,

    footerRender: () => <Footer />,
    onPageChange: () => {
      //const { location } = history;
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: [],
    menuHeaderRender: undefined,
    breadcrumbRender(routers) {
      return routers;
    },
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;

      return (
        <>
          {children}
          {/* {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                  loading: false,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */

const authRequestInterceptor = (url: string, options: RequestOptionsInit) => {
  const headers: any = {};
  headers.authorization = `Bearer ${localStorage.getItem('token')}`;
  return {
    url: `${BASE_URL}${url}`,

    options: {
      ...options,
      interceptors: true,
      headers: {
        ...headers,
        // 'Access-Control-Allow-Origin': '*',
      },
      params: {
        ...options.params,
      },
    },
  };
};

export const request = {
  ...errorConfig,
  requestInterceptors: [authRequestInterceptor],
};
