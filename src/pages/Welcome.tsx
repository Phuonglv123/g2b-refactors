import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Typography, theme } from 'antd';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  console.log(initialState);
  return (
    <PageContainer title={`Xin chào, ${initialState?.currentUser?.username}`} className="mainC">
      <div>
        <Card
          style={{
            borderRadius: 8,
          }}
          styles={{
            body: {
              backgroundImage:
                initialState?.settings?.navTheme === 'realDark'
                  ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                  : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
            },
          }}
        >
          <div
          // style={{
          //   backgroundPosition: '100% -30%',
          //   backgroundRepeat: 'no-repeat',
          //   backgroundSize: '274px auto',
          //   backgroundImage:
          //     "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          // }}
          >
            <div
              style={{
                fontSize: '20px',
                //color: token.colorTextHeading,
                color: '#febd21',
              }}
            >
              G2B Admin
            </div>
            <p
              style={{
                fontSize: '14px',
                // color: token.colorTextSecondary,
                color: '#febd21',
                lineHeight: '22px',
                marginTop: 16,
                marginBottom: 32,
                width: '65%',
              }}
            >
              Welcome to G2B Admin, a world-class digital education platform for the Vietnamese
              market.
            </p>
            <br />
            <Typography.Title level={4} style={{ color: '#febd21' }}>
              {' '}
              G2B MEDIA CORPORATION
            </Typography.Title>
            <Typography.Text style={{ color: '#febd21' }}>
              Address: Floor 3 - 98 Nguyen Thi Nhung, Khu Do Thị Van Phuc, Hiep Binh Phuoc Ward, Thu
              Duc City, Ho Chi Minh City
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: '#febd21' }}>Phone: 0937 95 30 30</Typography.Text>
            <br />
            <Typography.Text style={{ color: '#febd21' }}>Email: /</Typography.Text>
            <br />
            <Typography.Text style={{ color: '#febd21' }}>
              Website: https://g2bmedia.vn
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: '#febd21' }}>MST: 0316567204</Typography.Text>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Welcome;
