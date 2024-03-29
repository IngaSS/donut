import "./App.css";
import { ParentSize } from "@visx/responsive";
import PieChart from "./components/pieChart";
import { pieChartData } from "./config";

function App() {
  return (
    <div className="diagram">
      <ParentSize className="graph_container">
        {({ width, height }) => (
          <PieChart width={width} height={height} data={pieChartData} />
        )}
      </ParentSize>

      <div className="indicators">
        {pieChartData.map(({ label, color, numbers, value }, key) => {
          return (
            <div key={key} className="indicator-line">
              <div
                className="indicator-color"
                style={{
                  background: color,
                }}
              />
              <div className="indicator-name">
                <span className="indicator-label">{label}</span>
                <span className="indicator-value">
                  {numbers} ({value}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
