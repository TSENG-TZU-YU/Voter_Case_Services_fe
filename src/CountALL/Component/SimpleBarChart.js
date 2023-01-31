import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function SimpleBarChart({ chart }) {
  let newData = [];
  for (let i = 0; i < chart.length; i++) {
    newData.push({
      name: chart[i].name,
      案件: chart[i].category,
    });
  }

  // {id: 2, name: '建管', category: 2}
  // console.log('n', newData);
  // const data1 = [
  //   { value: '', label: '----請選擇申請類別----' },
  //   ...newData,
  // ];
  console.log('newData', newData);
  const data = [
    {
      name: 'Page A',
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',

      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',

      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',

      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',

      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',

      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',

      pv: 4300,
      amt: 2100,
    },
  ];
  return (
    <ResponsiveContainer width="90%" height="60%">
      <BarChart
        width={500}
        height={300}
        data={newData}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="案件" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SimpleBarChart;
