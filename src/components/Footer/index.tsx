import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
        padding: 0,
        margin: 0,
        paddingBlock: 0,
        marginBlock: 0,
      }}
      links={[
        {
          key: 'Ant Design Pro',
          title: 'G2B MEDIA',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        // {
        //   key: 'github',
        //   title: <GithubOutlined />,
        //   href: 'https://github.com/ant-design/ant-design-pro',
        //   blankTarget: true,
        // },
        {
          key: 'Ant Design',
          title: 'copyRight 2024 ',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
