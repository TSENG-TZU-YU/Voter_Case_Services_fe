import '../../styles/chart/_chart.scss';
import { useLocation } from 'react-router-dom';
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
const COLORS = [
  '#2c75c8',
  '#c09e82',
  '#1f9998',
  '#f2ac33',
  '#e77979',
  '#817161',
];

function SimpleBarChart({ chart }) {
  const location = useLocation();
  let params = new URLSearchParams(location.search);
  let chartPage = parseInt(params.get('chartPage'));

  let newData = [];
  for (let i = 0; i < chart.length; i++) {
    newData.push({
      name: chart[i].name,
      案件量: chart[i].value,
    });
  }
  return (
    <div
      className={
        chartPage === 1
          ? 'CategoryPageChart'
          : chartPage === 2
          ? 'StatusPageChart'
          : chartPage === 3
          ? 'appUnitPageChart'
          : chartPage === 4
          ? 'appUserPage'
          : chartPage === 5
          ? 'handlerUnitPage'
          : 'UserPageChart'
      }
      style={{ width: '100%', height: '120%' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={newData}
          margin={{
            top: 5,
            right: 5,
            left: 100,
            bottom: 5,
          }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />

          <Bar
            dataKey="案件量"
            fill="#817161"
            // style={{ whiteSpace: 'normal' }}
            // label={CustomizedLabel}
          >
            {chart.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// import React, { useMemo } from 'react';
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Cell,
//   Text,
// } from 'recharts';

// // import './styles.css';

// const blues = [
//   ['#457AA6'],
//   ['#457AA6', '#E3EBF2'],
//   ['#264F73', '#457AA6', '#E3EBF2'],
//   ['#264F73', '#457AA6', '#A2BBD2', '#E3EBF2'],
//   ['#1A334A', '#264F73', '#457AA6', '#A2BBD2', '#E3EBF2'],
// ];

// const getColor = (length, index) => {
//   if (length <= blues.length) {
//     return blues[length - 1][index];
//   }

//   return blues[blues.length - 1][index % blues.length];
// };

// const data = [
//   { name: 'Page A', pv: 240 },
//   { name: 'B', pv: 2210 },
//   { name: 'C', pv: 2300 },
//   { name: 'Page D', pv: 2000 },
//   { name: 'Zero', pv: 0 },
//   { name: 'Hi', pv: 123 },
//   { name: 'Bye', pv: 2091 },
// ];

// const YAxisLeftTick = ({ y, payload: { value } }) => {
//   return (
//     <Text x={0} y={y} textAnchor="start" verticalAnchor="middle" scaleToFit>
//       {value}
//     </Text>
//   );
// };

// let ctx;

// export const measureText14HelveticaNeue = (text) => {
//   if (!ctx) {
//     ctx = document.createElement('canvas').getContext('2d');
//     ctx.font = "14px 'Helvetica Neue";
//   }

//   return ctx.measureText(text).width;
// };

// const BAR_AXIS_SPACE = 10;

// const SimpleBarChart = ({ chart }) => {
//   const maxTextWidth = useMemo(
//     () =>
//       data.reduce((acc, cur) => {
//         const value = cur[data.pv];
//         const width = measureText14HelveticaNeue(value.toLocaleString());
//         if (width > acc) {
//           return width;
//         }
//         return acc;
//       }, 0),
//     [data, data.pv]
//   );

//   let newData = [];
//   for (let i = 0; i < chart.length; i++) {
//     newData.push({
//       name: chart[i].name,
//       案件量: chart[i].value,
//     });
//   }

//   return (
//     <ResponsiveContainer width={'100%'} height={50 * data.length} debounce={50}>
//       <BarChart
//         data={data}
//         layout="vertical"
//         margin={{ left: 10, right: maxTextWidth + (BAR_AXIS_SPACE - 8) }}
//       >
//         <XAxis hide axisLine={false} type="number" />
//         <YAxis
//           yAxisId={0}
//           dataKey={data.name}
//           type="category"
//           axisLine={false}
//           tickLine={false}
//           tick={YAxisLeftTick}
//         />
//         <YAxis
//           orientation="right"
//           yAxisId={1}
//           dataKey={data.pv}
//           type="category"
//           axisLine={false}
//           tickLine={false}
//           tickFormatter={(value) => value.toLocaleString()}
//           mirror
//           tick={{
//             transform: `translate(${maxTextWidth + BAR_AXIS_SPACE}, 0)`,
//           }}
//         />
//         <Bar dataKey={data.pv} minPointSize={2} barSize={32}>
//           {data.map((d, idx) => {
//             return (
//               <Cell key={d[data.name]} fill={getColor(data.length, idx)} />
//             );
//           })}
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

export default SimpleBarChart;
