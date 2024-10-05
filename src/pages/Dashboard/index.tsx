import {
  chartFilterTypeProduct,
  chartTypeProductByUser,
  staticProduct,
} from '@/services/dashboard';
import { Column } from '@ant-design/plots';
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
import { Col, Row } from 'antd';
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

  const onRequestGetStatics = async (values: any) => {
    try {
      const payload: any = {};
      if (values?.date === 'pick') {
        const [fromDate, toDate] = values?.dateRange;
        payload.formDate = fromDate;
        payload.toDate = toDate;
      } else {
        payload.formDate = dayjs()
          .subtract(Number(values?.date || 1), 'month')
          .format('YYYY-MM-DD');
        payload.toDate = dayjs().format('YYYY-MM-DD');
      }
      setLoading(true);
      const res = await staticProduct(payload);
      const chart = await chartTypeProductByUser(payload);
      const typeProduct = await chartFilterTypeProduct();
      setChartTypeProduct(typeProduct);
      setCharts(chart.map((item: any) => ({ ...item, value: item.productCount })));
      console.log(res);
      setStatics(res);
      return true;
    } catch (error) {
    } finally {
      setLoading(false);
      return true;
    }
  };

  // useEffect(() => {
  //   onRequestGetStatics();
  // }, [date]);

  const config = {
    title: "User's Input Static",
    data: charts,
    xField: 'username',
    yField: 'productCount',

    meta: {
      productCount: {
        alias: 'Amount',
      },
    },
    axis: {
      label: {
        fill: '#ffffff',
        fontSize: 10,
        style: {
          fill: '#ffffff',
          stroke: '#ffffff',
        },
      },
      line: {
        fill: '#ffffff',
        style: {
          stroke: '#ffffff',
        },
      },
    },
    onReady: ({ chart }: any) => {
      try {
        const { height } = chart._container.getBoundingClientRect();
        const tooltipItem = charts[Math.floor(Math.random() * charts.length)];
        chart.on(
          'afterrender',
          () => {
            chart.emit('tooltip:show', {
              data: {
                data: tooltipItem,
              },
              offsetY: height / 2 - 60,
            });
          },
          true,
        );
      } catch (e) {
        console.error(e);
      }
    },
  };

  const configType = {
    title: 'Type Product Static',
    data: chartTypeProduct,
    xField: '_id',
    yField: 'count',

    meta: {
      count: {
        alias: 'Amount',
      },
    },
    axis: {
      label: {
        fill: '#ffffff',
        fontSize: 10,
        style: {
          fill: '#ffffff',
          stroke: '#ffffff',
        },
      },
      line: {
        fill: '#ffffff',
        style: {
          stroke: '#ffffff',
        },
      },
    },
    onReady: ({ chart }: any) => {
      try {
        const { height } = chart._container.getBoundingClientRect();
        const tooltipItem = charts[Math.floor(Math.random() * charts.length)];
        chart.on(
          'afterrender',
          () => {
            chart.emit('tooltip:show', {
              data: {
                data: tooltipItem,
              },
              offsetY: height / 2 - 60,
            });
          },
          true,
        );
      } catch (e) {
        console.error(e);
      }
    },
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
                    label: '1 month',
                    value: 1,
                  },
                  {
                    label: '3 months',
                    value: 3,
                  },
                  {
                    label: '6 months',
                    value: 6,
                  },
                  {
                    label: '12 months',
                    value: 12,
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
                    return <ProFormDateRangePicker label="Select date" />;
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
            value: statics?.totalProductTypeBill || 0,
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
      <Row gutter={16}>
        <Col span={12}>
          <ProCard title="User Input Static" style={{ backgroundColor: 'white' }}>
            <Column {...config} colorField={'#febd21'} />
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title="Type Product Static" style={{ backgroundColor: 'white' }}>
            <Column {...configType} colorField={'#febd21'} />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
