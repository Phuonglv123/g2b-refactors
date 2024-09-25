import { Button, Col, Image, Layout, Menu, Row } from 'antd';
import React from 'react';
import styles from './Welcome.less';
//@ts-ignore
import logo from '@/assets/g2b-dark.webp';
import { history } from 'umi';

const { Header, Footer, Content } = Layout;

const Home: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header className={styles.header}>
        <Row>
          <Col md={12} sm={6}>
            <div className={styles.logo}>
              <Image src={logo} width={150} preview={false} />
            </div>
          </Col>
          <Col md={12} sm={18}>
            <Menu
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
              color="white"
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={['login']}
              items={[]}
            />
          </Col>
        </Row>
      </Header>
      <Content className={styles.content}>
        <Row align="middle" style={{ color: '#fff', height: '70vh' }}>
          <Col sm={24} md={12} style={{ verticalAlign: 'middle', padding: 40 }}>
            <h1 className={styles.title}>G2B MEDIA</h1>
            <p className={styles.description}>
              Bring the best-quality and world-class digital education platform to the Vietnamese
              market.
            </p>
            <Button
              type="primary"
              size="large"
              shape="default"
              onClick={() => history.push('/login')}
            >
              Đăng nhập ngay
            </Button>
          </Col>
          <Col xs={0} sm={0} md={12} style={{ textAlign: 'center' }}>
            <Row align="middle" justify="center">
              <Col>
                <img className={styles.background} src="/background.png" alt="" />
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
      {/* <Footer style={{ background: '#333', color: '#fff' }} className={styles.footer}>
        <Row align="middle" justify="center">
          <Col md={12}>
            <Image src={logo} width={300} preview={false} />
          </Col>
          <Col md={12} className="contact"></Col>
        </Row>
        <Row align="middle" justify="center"></Row>
      </Footer> */}
    </Layout>
  );
};

export default Home;
