import { Bar, Column } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Space } from 'antd';

type TabProductsProps = {
  chartTypeProduct: any;
  chartProductByCountrys: any;
  chartProductByProvices: any;
};
const TabProducts = ({
  chartTypeProduct,
  chartProductByCountrys,
  chartProductByProvices,
}: TabProductsProps) => {
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
        const tooltipItem = chartTypeProduct[Math.floor(Math.random() * chartTypeProduct.length)];
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
  const configProductByCountry = {
    title: 'Product by Country',
    data: chartProductByCountrys,
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
        const tooltipItem =
          chartProductByCountrys[Math.floor(Math.random() * chartProductByCountrys.length)];
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

  const configProductByProvince = {
    title: 'Product by Province',
    data: chartProductByProvices,
    xField: '_id',
    yField: 'count',

    meta: {
      count: {
        alias: 'Amount',
      },
    },
    label: {
      text: 'count',
      formatter: '0',
      style: {
        textAlign: (d: any) => (+d.frequency > 0.008 ? 'right' : 'start'),
        fill: (d: any) => (+d.frequency > 0.008 ? '#fff' : '#000'),
        dx: (d: any) => (+d.frequency > 0.008 ? -5 : 5),
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
        const tooltipItem =
          chartProductByProvices[Math.floor(Math.random() * chartProductByProvices.length)];
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
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <ProCard title="Type Product Static" style={{ backgroundColor: 'white' }}>
          <Column {...configType} colorField={'#febd21'} />
        </ProCard>
      </div>
      <div>
        <ProCard title="Product by Country" style={{ backgroundColor: 'white' }}>
          <Column {...configProductByCountry} colorField={'#febd21'} />
        </ProCard>
      </div>
      <div>
        <ProCard title="Product by Province" style={{ backgroundColor: 'white' }}>
          <Bar {...configProductByProvince} colorField={'#febd21'} />
        </ProCard>
      </div>
    </Space>
  );
};

export default TabProducts;
