/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import './App.scss';

type Coords = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

type Point = {
  x: number;
  y: number;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  let context: CanvasRenderingContext2D | null;

  const [isDrawing, setIsDrawing] = useState(false);
  const [offset1, setOffset1] = useState({x: 0, y: 0});
  const [offset2, setOffset2] = useState({x: 0, y: 0});
  const [paths, setPaths] = useState<Coords[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    if (canvasRef.current) {
      resize();

      canvasCtxRef.current = canvasRef.current.getContext('2d');
    }

      for (let i = 0; i < paths.length; i++) {
        canvasCtxRef.current?.beginPath();
      canvasCtxRef.current?.moveTo(paths[i]['x1'], paths[i]['y1']);
      canvasCtxRef.current?.lineTo(paths[i]['x2'], paths[i]['y2']);
      canvasCtxRef.current?.stroke();
      canvasCtxRef.current?.closePath();

      if (paths.length >= 2 && i < paths.length - 1) {
        const point = findIntersection(
          paths[i]['x1'], paths[i]['y1'], paths[i]['x2'], paths[i]['y2'],
          paths[i + 1]['x1'], paths[i + 1]['y1'], paths[i + 1]['x2'], paths[i + 1]['y2']
          );
          if (point) {
            setPoints(points => [...points, point]);
          }
      }
      }
  
    if (canvasCtxRef.current) {
      canvasCtxRef.current.lineCap = 'round';
      canvasCtxRef.current.strokeStyle = 'black';
      canvasCtxRef.current.lineWidth = 1;
    }
    
  }, [paths]);

  useEffect(() => {
    
    for (let i = 0; i < points.length; i++) {
      if (context) {
        context.fillStyle = 'red';
      }
      canvasCtxRef.current?.beginPath();
      canvasCtxRef.current?.moveTo(points[i]['x'], points[i]['y']);
      canvasCtxRef.current?.lineTo(points[i]['x'], 5);
      canvasCtxRef.current?.moveTo(points[i]['x'], points[i]['y']);
      canvasCtxRef.current?.arc(points[i]['x'], points[i]['y'], 5, 0, 180, false)
      canvasCtxRef.current?.fill();

    }
  }, [points])

  const resize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = 500;
      canvasRef.current.height = 500;
    }
  }

  const findIntersection = (x11: number
    , y11: number, x21: number, y21: number, x12: number, y12: number, x22: number, y22: number) => {
    let k1 = (Math.ceil(y21) - Math.ceil(y11)) / (Math.ceil(x21) - Math.ceil(x11));
    let b1 = Math.ceil(y11) - ((Math.ceil(y21) - Math.ceil(y11)) / (Math.ceil(x21) - Math.ceil(x11)) * Math.ceil(x11));

    let k2 = (Math.ceil(y22) -Math.ceil(y12)) / (Math.ceil(x22) - Math.ceil(x12));
    let b2 = Math.ceil(y12) - ((Math.ceil(y22) - Math.ceil(y12)) / (Math.ceil(x22) - Math.ceil(x12)) * Math.ceil(x12));

    let x = Math.ceil((b2 - b1) / (k1 - k2));

    let y = Math.ceil((k1 * x + b1));

    const xDif1 = Math.ceil(x21) - Math.ceil(x11);
    const xDif2 = Math.ceil(x22) - Math.ceil(x12);
    const yDif1 = Math.ceil(y21) - Math.ceil(y11);
    const yDif2 = Math.ceil(y22) - Math.ceil(y12);

    const distDistX11 = Math.ceil(x21) - Math.ceil(x);
    const distDistX12 = Math.ceil(x11) - Math.ceil(x);
    const distDistY11 = Math.ceil(y21) - Math.ceil(y);
    const distDistY12 = Math.ceil(y11) - Math.ceil(y);

    const distDistX21 = Math.ceil(x12) - Math.ceil(x);
    const distDistX22 = Math.ceil(x22) - Math.ceil(x);
    const distDistY21 = Math.ceil(y12) - Math.ceil(y);
    const distDistY22 = Math.ceil(y22) - Math.ceil(y);

    const lenght1 = Math.ceil(Math.sqrt(Math.abs(Math.ceil((xDif1 ** 2)) + Math.ceil((yDif1 ** 2)))));
    const lenght2 = Math.ceil(Math.sqrt(Math.abs(Math.ceil((xDif2 ** 2)) + Math.ceil((yDif2 ** 2)))));

    const distToPoint11 = Math.ceil(Math.sqrt(Math.ceil(Math.abs((distDistX11 ** 2) + (distDistY11 ** 2)))));
    const distToPoint12 = Math.ceil(Math.sqrt(Math.ceil(Math.abs((distDistX12 ** 2) + (distDistY12 ** 2)))));

    const distToPoint21 = Math.ceil(Math.sqrt(Math.ceil(Math.abs((distDistX21 ** 2) + (distDistY21 ** 2)))));
    const distToPoint22 = Math.ceil(Math.sqrt(Math.ceil(Math.abs((distDistX22 ** 2) + (distDistY22 ** 2)))));

    const distToPoint1 = distToPoint11 + distToPoint12;
    const distToPoint2 = distToPoint21 + distToPoint22;


    console.log(lenght1, lenght2);
    console.log(distToPoint1);
    console.log(distToPoint2);

    if (lenght1 !== distToPoint1 || lenght2 !== distToPoint2) {
      return;
    }

    const point = {
      x,
      y
    };

    console.log(point);
    console.log(paths)

    return point;
  }

  const startDrawing = (e: any) => {
    const {offsetX, offsetY} = e.nativeEvent;
    if (canvasCtxRef.current) {
      
      setOffset1({x: offsetX, y: offsetY});
      setIsDrawing(true);
      e.preventDefault();
    }
  }

  const draw = (e: any) => {
    if (!isDrawing) {
      return;
    }
    const offsetX2 = e.nativeEvent.offsetX;
    const offsetY2 = e.nativeEvent.offsetY;
    if (canvasCtxRef.current) {
      if (offset2.x !== offsetX2 || offset2.y !== offsetY2) {
        canvasCtxRef.current.clearRect(0, 0, 500, 500);
        for (let i = 0; i < paths.length; i++) {
          canvasCtxRef.current?.beginPath();
        canvasCtxRef.current?.moveTo(paths[i]['x1'], paths[i]['y1']);
        canvasCtxRef.current?.lineTo(paths[i]['x2'], paths[i]['y2']);
        canvasCtxRef.current?.stroke();
        canvasCtxRef.current?.closePath();
        }

        console.log(points)
      }
      setOffset2({x: offsetX2, y: offsetY2});
      canvasCtxRef.current.beginPath();
      canvasCtxRef.current.moveTo(offset1.x, offset1.y);
      canvasCtxRef.current.lineTo(offsetX2, offsetY2);
      canvasCtxRef.current.stroke();
      e.preventDefault();
    }  
  }

  const stopDrawing = (e: any) => {
    if (canvasCtxRef.current) {
      canvasCtxRef.current.closePath();
      setPaths(paths => [...paths, {x1: offset1.x, y1: offset1.y, x2: offset2.x, y2: offset2.y}]);
      e.preventDefault();
    }  
    
    setIsDrawing(false);
  }

  return (
    <div className="App">
      <canvas 
        className='canvas' 
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      >
      </canvas>
    </div>
  );
}

export default App;
