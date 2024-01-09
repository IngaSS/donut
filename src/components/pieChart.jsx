/* eslint-disable react/prop-types */
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { memo } from "react";
import { animated, useTransition, interpolate } from "@react-spring/web";
import { LinearGradient } from "@visx/gradient";

const margin = { top: 10, right: 10, bottom: 10, left: 10 };

const PieChart = memo(({ width, height, data }) => {
  const value = (d) => d.value;
  // const { gradient } = data;
  // const { from, to } = gradient;
  // console.log(from);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const pieSortValues = (a, b) => b - a;

  const maxHeight = 300;
  const maxWidth = 300;
  const h = Math.min(height, maxHeight);
  const w = Math.min(width, maxWidth);

  return (
    <svg width={w} height={h}>
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        {/* <LinearGradient from={from} to={to} />; */}
        <Pie
          data={data}
          pieValue={value}
          pieSortValues={pieSortValues}
          outerRadius={radius}
          innerRadius={radius / 1.5}
        >
          {(pie) => {
            console.log(pie);
            return (
              <>
                <AnimatedPie
                  {...pie}
                  animate={true}
                  getKey={() => {}}
                  onClickDatum={() => {}}
                  getColor={(arc) => arc.data.color}
                />
              </>
            );
          }}
        </Pie>
      </Group>
    </svg>
  );
});
PieChart.displayName = "PieChart";

export default PieChart;

const fromLeaveTransition = ({ endAngle }) => ({
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

function AnimatedPie({ animate, arcs, path, getKey, getColor, onClickDatum }) {
  const transitions = useTransition(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc) => {
    console.log(props);
    const { data } = arc;
    const { gradient, id } = data;
    const { from, to } = gradient;
    return (
      <g key={id}>
        <LinearGradient from={from} to={to} id={`gradient${id}`} />
        <animated.path
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              })
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
      </g>
    );
  });
}
