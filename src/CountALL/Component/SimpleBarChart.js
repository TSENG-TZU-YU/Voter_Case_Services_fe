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
