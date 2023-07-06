import React, { useState, useRef, useEffect } from "react";
import "../css/SetScale.css";
import RoofOutline from "./RoofOutline";
import useImage from "use-image";
import { Stage, Layer, Image, Line, Circle } from "react-konva";
import { TextField, HelpText, Button } from "@navikt/ds-react";
import Compass from "../Komponenter/Compass";
import { MapInteractionCSS } from "react-map-interaction";

const SetScale = ({ selectedPhoto }) => {
  const [lines, setLines] = useState([]);
  const [line, setLine] = useState([]);
  const [imgScale, setImgScale] = useState(0.2);
  const lineRef = useRef(); // Ref to access the line component
  const circleLayerRef = useRef(); // Ref to access the circle layer
  const [wimage] = useImage(selectedPhoto);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showRoofOutline, setShowRoofOutline] = useState(false);

  const getImgLen = (line) => {
    const [x1, y1, x2, y2] = line;
    const x = x2 - x1;
    const y = y2 - y1;
    return Math.sqrt(x * x + y * y);
  };

  useEffect(() => {
    if (line.length === 4) {
      setLines([...lines, [line, (getImgLen(line) * imgScale).toFixed(2)]]);
      setLine([]);
    }
  }, [line, lines, imgScale, getImgLen]);

  const handleInputChange = (e) => {
    setLines([[lines[0][0], e.target.value], ...lines.slice(1)]);
    setImgScale(e.target.value / getImgLen(lines[0][0]));
    setShowNextButton(true);
  };

  if (!wimage) return null;

  const img = new window.Image();
  img.src = wimage.src;
  const targetW = 1000;
  const targetH = 800;

  const widthFit = targetW / img.width;
  const heightFit = targetH / img.height;

  const scale = widthFit > heightFit ? heightFit : widthFit;

  const imageWidth = parseInt(img.width * scale, 10);
  const imageHeight = parseInt(img.height * scale, 10);

  const handleStageClick = () => {
    if (lines.length === 1) return;
    else {
      const liner = lineRef.current;
      const stage = liner.getStage();
      const point = stage.getPointerPosition();
      setLine([...line, point.x, point.y]);
      console.log("Added sum points", line);
    }
  };

  const handleCircleDragMove = (e, lineIndex, endPointIndex) => {
    const newLines = [...lines];
    newLines[lineIndex][0][endPointIndex * 2] = e.target.x();
    newLines[lineIndex][0][endPointIndex * 2 + 1] = e.target.y();
    setLines(newLines);
  };

  return (
    <>
      {!showRoofOutline ? (
        <div className="lenScale">
          <div className="drawStage">
            <MapInteractionCSS
              showControls
              defaultValue={{
                scale: 1,
                translation: { x: 0, y: 0 },
              }}
              minScale={0.2}
              maxScale={4}
              translationBounds={{
                xMax: 1000,
                yMax: 1000,
              }}
            >
              <Stage width={1000} height={750} onClick={handleStageClick}>
                <Layer>
                  {img && (
                    <Image
                      x={0}
                      y={0}
                      height={imageHeight}
                      width={imageWidth}
                      image={img}
                    />
                  )}
                  {line.length === 2 && (
                    <Circle x={line[0]} y={line[1]} radius={12} stroke="blue" />
                  )}
                  {lines.map((line, index) => (
                    <React.Fragment key={index}>
                      <Line
                        key={index}
                        points={line[0]}
                        stroke="#df4b26"
                        strokeWidth={2}
                      />
                      <Circle
                        className="vertex"
                        x={line[0][0]}
                        y={line[0][1]}
                        radius={12}
                        stroke="blue"
                        draggable
                        onDragMove={(e) => handleCircleDragMove(e, index, 0)}
                        onMouseDown={(e) => e.evt.stopPropagation()}
                      />
                      <Circle
                        className="vertex"
                        x={line[0][2]}
                        y={line[0][3]}
                        radius={12}
                        stroke="blue"
                        draggable
                        onDragMove={(e) => handleCircleDragMove(e, index, 1)}
                        onMouseDown={(e) => e.evt.stopPropagation()}
                      />
                    </React.Fragment>
                  ))}
                  <Line
                    ref={lineRef}
                    points={[]}
                    stroke="red"
                    strokeWidth={3}
                  />
                </Layer>
              </Stage>
            </MapInteractionCSS>
          </div>
          <div className="Line">
            {lines.length >= 1 && (
              <div>
                <HelpText id="lineHelp">
                  Longer lines reduce the effect of errors
                </HelpText>
                <TextField
                  id="lineLengthInput"
                  type="text"
                  label="Set length of line"
                  description="Drag to adjust"
                  onChange={handleInputChange}
                ></TextField>
                <span id="unitlabel">m</span>
                <div className="showScale">
                  <p>Line: {lines && getImgLen(lines[0][0]).toFixed(2)} px</p>
                  <br />
                  <p>
                    Scale:{" "}
                    {lines &&
                      (
                        (parseFloat(lines[0][1]) * 100) /
                        getImgLen(lines[0][0])
                      ).toFixed(2)}{" "}
                    cm/px
                  </p>
                </div>

                <div>
                  <br></br>
                  <Compass />
                </div>
                <div className="nextButton">
                  {showNextButton && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowNextButton(true);
                        setShowRoofOutline(true);
                        setImgScale(
                          (parseFloat(lines[0][1]) * 100) /
                            getImgLen(lines[0][0])
                        );
                        sessionStorage.setItem(scale, imgScale);
                      }}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            )}
            {!lines.length && (
              <h4>
                Set a line where distance is known <br /> Click to add points,
                drag to adjust.
              </h4>
            )}
          </div>
        </div>
      ) : (
        <RoofOutline
          img={img}
          imageHeight={imageHeight}
          imageWidth={imageWidth}
          scale={imgScale}
        />
      )}
    </>
  );
};

export default SetScale;
