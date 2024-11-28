import TabProducts from '@/components/Dashboard/TabProducts';
import TabTasks from '@/components/Dashboard/TabTasks';
import TabUsers from '@/components/Dashboard/TabUsers';
import {
  chartFilterTypeProduct,
  chartProductByCountry,
  chartProductByProvice,
  chartTaskByUser,
  chartTypeProductByUser,
  chartUserTask,
  staticProduct,
} from '@/services/dashboard';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormGroup,
  ProFormSelect,
  StatisticCard,
} from '@ant-design/pro-components';
import { Row, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statics, setStatics] = useState<any>([]);
  const [charts, setCharts] = useState<any>([]);
  const [chartTypeProduct, setChartTypeProduct] = useState<any>([]);

  const [chartProductByCountrys, setChartProductByCountrys] = useState<any>([]);
  const [chartProductByProvices, setChartProductByProvices] = useState<any>([]);

  const [chartUserTasks, setChartUserTasks] = useState<any>([]);
  const [chartTasksByUser, setChartTasksByUser] = useState<any>([]);

  const onRequestGetStatics = async (values: any) => {
    try {
      const payload: any = {};
      if (values?.date === 'pick') {
        const [fromDate, toDate] = values?.rangeDate;

        payload.fromDate = fromDate;
        payload.toDate = toDate;
      } else {
        payload.fromDate = dayjs()
          .subtract(Number(values?.date || 1), 'week')
          .format('YYYY-MM-DD');
        payload.toDate = dayjs().format('YYYY-MM-DD');
      }
      setLoading(true);
      const res = await staticProduct(payload);
      const chart = await chartTypeProductByUser(payload);
      const typeProduct = await chartFilterTypeProduct();
      const chartProductByCountrys = await chartProductByCountry();
      const chartProductByProvices = await chartProductByProvice();
      const chartUserTasks = await chartUserTask();
      const chartUser = await chartTaskByUser();
      setChartTypeProduct(typeProduct);
      setCharts(chart.map((item: any) => ({ ...item, value: item.productCount })));
      setChartProductByCountrys(chartProductByCountrys);
      setChartProductByProvices(chartProductByProvices);
      setChartUserTasks(chartUserTasks);
      setChartTasksByUser(chartUser);
      console.log(res);
      setStatics(res);
      return true;
    } catch (error) {
    } finally {
      setLoading(false);
      return true;
    }
  };

  return (
    <PageContainer>
      <ProCard>
        <Row justify={'end'}>
          <ProForm
            title="Search"
            layout="inline"
            loading={loading}
            initialValues={{
              date: 1,
            }}
            submitter={{
              resetButtonProps: {
                style: {
                  display: 'none',
                },
              },
            }}
            request={onRequestGetStatics}
            onFinish={onRequestGetStatics}
          >
            <ProFormGroup>
              <ProFormSelect
                label="Pick a date"
                name="date"
                options={[
                  {
                    label: '1 week',
                    value: 1,
                  },
                  {
                    label: '3 weeks',
                    value: 3,
                  },
                  {
                    label: '1 month',
                    value: 4,
                  },

                  {
                    label: 'Pick a other date',
                    value: 'pick',
                  },
                ]}
              />
              <ProFormDependency name={['date']}>
                {({ date }) => {
                  if (date === 'pick') {
                    return <ProFormDateRangePicker label="Select date" name="rangeDate" />;
                  }
                  return null;
                }}
              </ProFormDependency>
            </ProFormGroup>
          </ProForm>
        </Row>
      </ProCard>
      <br />

      <StatisticCard.Group direction="row">
        <StatisticCard
          statistic={{
            title: 'Total positions',
            value: statics?.totalProduct || 0,
            icon: (
              <img
                style={imgStyle}
                src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: 'Total LED',
            value: statics?.totalProductTypeLed || 0,
            icon: (
              <img
                style={imgStyle}
                src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: 'Total Billboard',
            value: statics?.totalProductTypeBILL || 0,
            icon: (
              <img
                style={imgStyle}
                src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                alt="icon"
              />
            ),
          }}
        />
        <StatisticCard
          statistic={{
            title: 'Country',
            value: statics?.totalCountry || 0,
            icon: (
              <img
                style={imgStyle}
                src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"
                alt="icon"
              />
            ),
          }}
        />
      </StatisticCard.Group>
      <br />
      <Tabs
        type="card"
        defaultActiveKey="user"
        items={[
          {
            key: 'user',
            label: 'User',
            children: <TabUsers charts={charts} />,
          },
          {
            key: 'products',
            label: 'Products',
            children: (
              <TabProducts
                chartTypeProduct={chartTypeProduct}
                chartProductByCountrys={chartProductByCountrys}
                chartProductByProvices={chartProductByProvices}
              />
            ),
          },
          {
            key: 'tasks',
            label: 'Tasks',
            children: <TabTasks charts={chartUserTasks} chartTasksByUser={chartTasksByUser} />,
          },
        ]}
        onChange={(e) => console.log(e)}
      />
    </PageContainer>
  );
};

export default Dashboard;
