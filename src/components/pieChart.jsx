/* eslint-disable react/prop-types */
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { memo } from "react";
import { animated, useTransition, interpolate } from "@react-spring/web";
import { maxHeight, maxWidth } from "../config";
import { useState } from "react";

const margin = { top: 10, right: 10, bottom: 10, left: 10 };

const PieChart = memo(({ width, height, data }) => {
  const value = (d) => d.value;
  const [selectedSlice, setSelectedSlice] = useState(null);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const pieSortValues = (a, b) => b - a;

  const h = Math.min(height, maxHeight);
  const w = Math.min(width, maxWidth);

  return (
    <svg width={w} height={h}>
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={
            selectedSlice ? data.filter(({ id }) => id === selectedSlice) : data
          }
          pieValue={value}
          pieSortValues={pieSortValues}
          outerRadius={radius}
          innerRadius={radius / 1.5}
        >
          {(pie) => {
            return (
              <>
                <AnimatedPie
                  {...pie}
                  animate={true}
                  getKey={() => {}}
                  onMouseEnterDatum={({ data }) => {
                    setTimeout(() => setSelectedSlice(data.id), 500);
                  }}
                  onMouseLeaveDatum={() => {
                    setTimeout(() => setSelectedSlice(null), 500);
                  }}
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

function AnimatedPie({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onMouseEnterDatum,
  onMouseLeaveDatum,
}) {
  const transitions = useTransition(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc) => {
    const { data } = arc;
    const { id } = data;
    return (
      <g key={id}>
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
          onMouseEnter={() => onMouseEnterDatum(arc)}
          onMouseLeave={() => onMouseLeaveDatum(arc)}
        />
      </g>
    );
  });
}
