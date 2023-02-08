import '../../styles/chart/_chart.scss';
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';

function SimplePieChart({ chart }) {
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          // transform="rotate(-35)"
        >{`${payload.name}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`案件% : (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  const COLORS = [
    '#2c75c8',
    '#c09e82',
    '#1f9998',
    '#f2ac33',
    '#e77979',
    '#817161',
  ];
  return (
    <div className="pieCharts" style={{ width: '140%', height: '50%' }}>
      <ResponsiveContainer>
        <PieChart width={400} height={400}>
          <Pie
            // activeIndex={this.state.activeIndex}
            label={renderActiveShape}
            data={chart.filter((item) => item.value !== 0)}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="none"
            dataKey="value"
            // onMouseEnter={this.onPieEnter}
          >
            {chart.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SimplePieChart;

function rdmRgbColor() {
  //?机生成RGB?色
  let arr = [];
  for (var i = 0; i < 3; i++) {
    // 暖色
    arr.push(Math.floor(Math.random() * 128 + 64));
    // 亮色
    arr.push(Math.floor(Math.random() * 128 + 128));
  }
  let [r, g, b] = arr;
  // rgb?色
  // var color=`rgb(${r},${g},${b})`;
  // 16?制?色
  var color = `#${
    r.toString(16).length > 1 ? r.toString(16) : '0' + r.toString(16)
  }${g.toString(16).length > 1 ? g.toString(16) : '0' + g.toString(16)}${
    b.toString(16).length > 1 ? b.toString(16) : '0' + b.toString(16)
  }`;
  return color;
}
