import component from './vi-VN/component';
import globalHeader from './vi-VN/globalHeader';
import menu from './vi-VN/menu';
import pages from './vi-VN/pages';
import pwa from './vi-VN/pwa';
import settingDrawer from './vi-VN/settingDrawer';
import settings from './vi-VN/settings';

export default {
  'navBar.lang': 'Ngôn ngữ',
  'layout.user.link.help': 'Giúp đỡ',
  'layout.user.link.privacy': 'Chính sách',
  'layout.user.link.terms': 'Điều kiện',
  'app.preview.down.block': 'Tải trang này xuống dự án địa phương của bạn',
  'app.copyright.produced': 'phuonglv',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
