import PVgrid from "./PVgrid";
import { DragHorizontalIcon } from "@navikt/aksel-icons";
import Draggable from "react-draggable";

const PVgrids = ({ grids, scale, selectGrid, selectedGrid }) => {
  const unitLength = 160 / scale;
  const unitWidth = 150 / scale;
  return (
    <>
      {grids.map((grid, i) => (
        <div
          key={`grid-${i}`}
          style={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Draggable
            handle=".draggable"
            defaultPosition={{ x: 0, y: 0 }}
            grid={[1, 1]}
            scale={1}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  position: "absolute",
                  transform: `rotate(${grid.rotation}deg)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    borderTop: i === selectedGrid ? "4px solid red" : "none",
                    borderRight:
                      i === selectedGrid ? "2px solid black" : "none",
                    borderBottom:
                      i === selectedGrid ? "4px solid blue" : "none",
                    borderLeft: i === selectedGrid ? "2px solid black" : "none",
                    backgroundImage:
                      i === selectedGrid
                        ? "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0px, rgba(0, 0, 0, 0.5) 10px, transparent 10px, transparent 20px)"
                        : "none",
                  }}
                >
                  <PVgrid
                    l={unitLength}
                    w={unitWidth}
                    ncol={grid.ncol}
                    nrow={grid.nrow}
                    layoutid={i}
                  />
                  {i === selectedGrid && (
                    <div
                      className="arrow-up"
                      style={{
                        position: "absolute",
                        top: "-30px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "0",
                        height: "0",
                        borderLeft: "10px solid transparent",
                        borderRight: "10px solid transparent",
                        borderBottom: "10px solid red",
                      }}
                    />
                  )}
                  <DragHorizontalIcon
                    className="draggable"
                    fontSize={48}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "100%",
                      transform: "translateX(-50%)",
                      marginTop: "10px",
                      cursor: "grab",
                      transition: "transform 0.3s ease-in-out",
                      backgroundColor: "yellow",
                    }}
                    onMouseDown={() => selectGrid(i)}
                  />
                </div>
              </div>
            </div>
          </Draggable>
        </div>
      ))}
    </>
  );
};

export default PVgrids;