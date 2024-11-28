import { Column } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Space } from 'antd';

type TabUsersProps = {
  charts: any;
};

const TabUsers = ({ charts }: TabUsersProps) => {
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

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <ProCard title="User Input Static" style={{ backgroundColor: 'white' }}>
          <Column {...config} colorField={'#febd21'} />
        </ProCard>
      </div>
    </Space>
  );
};

export default TabUsers;
