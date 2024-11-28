import { Column } from '@ant-design/charts';
import { DualAxes } from '@ant-design/plots';

import { ProCard } from '@ant-design/pro-components';
import { Space } from 'antd';

type TabTasksProps = {
  charts: any;
  chartTasksByUser: any;
};

const TabTasks = ({ charts, chartTasksByUser }: TabTasksProps) => {
  const config = {
    title: "User's Input Static",
    data: charts,
    xField: '_id',
    yField: 'count',

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
  console.log(chartTasksByUser);

  const configAl = {
    xField: 'time',
    legend: true,
    scale: { color: { range: ['#1783FF', '#5AD8A6', '#5D7092', '#F6BD16'] } },
    interaction: { tooltip: { sort: (d: any) => ['value', 'a', 'b', 'c'].indexOf(d.name) } },
    children: [
      {
        data: chartTasksByUser,
        type: 'line',
        yField: 'count',
        colorField: 'name',
        seriesField: 'name',
        axis: { y: { position: 'right' } },
        style: { lineWidth: 2 },
      },
    ],
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <ProCard title="User Input Static" style={{ backgroundColor: 'white' }}>
          <Column {...config} colorField={'#febd21'} />
        </ProCard>
      </div>
      <div>
        <ProCard style={{ backgroundColor: 'white' }}>
          <DualAxes {...configAl} colorField={'#febd21'} />
        </ProCard>
      </div>
    </Space>
  );
};

export default TabTasks;
