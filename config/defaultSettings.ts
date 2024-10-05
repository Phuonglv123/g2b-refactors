import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',

  colorPrimary: '#febd21',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'G2B MEDIA',
  pwa: true,
  iconfontUrl: '',
  locale: 'en-US',
  token: {},
};

export default Settings;
