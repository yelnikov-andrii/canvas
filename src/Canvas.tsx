/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Coords } from './types';
import { Point } from './types';
import { findIntersection } from './findIntersection';

type Props = {
  clearCanvas: boolean;
  start: () => void;
}

export const Canvas: React.FC <Props> = ({clearCanvas, start}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null); 

  const [isDrawing, setIsDrawing] = useState(false);
  const [offset1, setOffsetX1] = useState({x: 0, y: 0});
  const [offset2, setOffset2] = useState({x: 0, y: 0});
  const [paths, setPaths] = useState<Coords[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const requestRef: any = useRef();

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  const createLine = (
    x1: number,
    y1: number, 
    x2: number, 
    y2: number,
    color: string
  ) => {
    if (canvasCtxRef.current) {
      canvasCtxRef.current.beginPath();
      canvasCtxRef.current.strokeStyle = color;
      canvasCtxRef.current.moveTo(x1, y1);
      canvasCtxRef.current.lineTo(x2, y2);
      canvasCtxRef.current.stroke();
      canvasCtxRef.current.closePath();
    }
  }

  const createPoint = (x: number, y: number, color: string) => {
    if (canvasCtxRef.current) {
      canvasCtxRef.current.beginPath();
      canvasCtxRef.current.fillStyle = color;
      canvasCtxRef.current.moveTo(x, y);
      canvasCtxRef.current.lineTo(x, 5);
      canvasCtxRef.current.moveTo(x, y);
      canvasCtxRef.current.arc(x, y, 5, 0, 180, false)
      canvasCtxRef.current.fill();
    }
  }

  useEffect(() => {
      if (canvasRef.current) {
        resize();
        canvasCtxRef.current = canvasRef.current.getContext('2d');
  
        if (canvasCtxRef.current) {
          canvasCtxRef.current.lineCap = 'round';
          canvasCtxRef.current.lineWidth = 1;
        }
      }
      if (!clearCanvas) {
        paths.forEach(path => createLine(path['x1'], path['y1'], path['x2'], path['y2'], 'black'));
      }

  }, [paths, isDrawing]);

  useEffect(() => {
      points.forEach(point => createPoint(point['x'], point['y'], 'red'));
  }, [points, isDrawing]);

  const clearPaths = () => {
    const copyPaths = paths.map(path => {
      let k1 = ((path.y2) - (path.y1)) / ((path.x2) - (path.x1));
      let b1 = (path.y1) - (((path.y2) - (path.y1)) / ((path.x2) - (path.x1)) * (path.x1));
      const len = (Math.sqrt(Math.abs((((path.x2 - path.x1 ** 2)) + (((path.y2 - path.y1) ** 2))))));

      const center = {
        x: 0,
        y: 0
      }

      if (path.x1 > path.x2) {
        center.x = path.x1 - (Math.abs((path.x2 - path.x1)) / 2);
      } else {
        center.x = path.x1 + ((path.x2 - path.x1) / 2);
      }

      if (path.y1 > path.y2) {
        center.y = path.y1 + (Math.abs((path.y2 - path.y1)) / 2);
      } else {
        center.y = path.y1 - ((path.y2 - path.y1) / 2);
      }

      const diffStep = len / 360;

      const copyPath = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      }

      if (center.x > path.x1) {
        copyPath.x1 = path.x1 + diffStep;
        copyPath.x2 =  path.x2 - diffStep;
        copyPath.y1 =  k1 * (path.x1 + diffStep) + b1;
        copyPath.y2 = k1 * (path.x2 - diffStep) + b1;
      } else {
        copyPath.x1 = path.x1 - diffStep;
        copyPath.y1 =  k1 * (path.x1 - diffStep) + b1;
        copyPath.x2 = path.x2 + diffStep;
        copyPath.y2 = k1 * (path.x2 + diffStep) + b1;
      }

      if (Math.abs(center.x - path.x1) < 1 && Math.abs(center.y - path.y1) < 1) {
        return {x1: 0, y1: 0, x2: 0, y2: 0};
      }

      return {...copyPath};
    });

    setPaths([...copyPaths]);
    paths.forEach(path => createLine(path['x1'], path['y1'], path['x2'], path['y2'], 'black'));

    for (let i = 0; i < paths.length - 1; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        const point = findIntersection(
          paths[i].x1,
          paths[i].y1,
          paths[i].x2,
          paths[i].y2,
          paths[j].x1,
          paths[j].y1,
          paths[j].x2,
          paths[j].y2
        )
        if (point) {
          setPoints(points => [...points, point]);
        }
      }
    }

    points.forEach(point => createPoint(point['x'], point['y'], 'red'));
  }

  useEffect(() => {
    if (clearCanvas) {
      resize();
        requestRef.current = requestAnimationFrame(clearPaths);
        setPoints([]);
    }
  }, [paths, clearCanvas])

  const resize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = 500;
      canvasRef.current.height = 500;
    }
  }

  const startDrawing = (e: any) => {
    const {offsetX, offsetY} = e.nativeEvent;
    start();
    if (canvasCtxRef.current) {
      setOffsetX1({x: offsetX, y: offsetY});
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

        paths.forEach(path => createLine(path['x1'], path['y1'], path['x2'], path['y2'], 'black'));
        points.forEach(point => createPoint(point['x'], point['y'], 'red'));
      }

      setOffset2({x: offsetX2, y: offsetY2});

      canvasCtxRef.current.beginPath();
      canvasCtxRef.current.moveTo(offset1.x, offset1.y);
      canvasCtxRef.current.lineTo(offsetX2, offsetY2);
      canvasCtxRef.current.stroke();
      e.preventDefault();

      for (let i = 0; i < paths.length; i++) {
        const point = findIntersection(
          offset1.x, 
          offset1.y, 
          offsetX2, 
          offsetY2, 
          paths[i]['x1'], 
          paths[i]['y1'], 
          paths[i]['x2'], 
          paths[i]['y2']
        );

        if (point) {
          createPoint(point.x, point.y, 'red');
        }
      }
    }  
  }

  const stopDrawing = (e: any) => {
    if (canvasCtxRef.current) {
      canvasCtxRef.current.closePath();
      setPaths(
        paths => [...paths, {
          x1: offset1.x, 
          y1: offset1.y, 
          x2: offset2.x, 
          y2: offset2.y
        }]);

      e.preventDefault();

      for (let i = 0; i < paths.length; i++) {
        const point = findIntersection(
          offset1.x, 
          offset1.y, 
          offset2.x, 
          offset2.y, 
          paths[i]['x1'], 
          paths[i]['y1'], 
          paths[i]['x2'], 
          paths[i]['y2']
        )

        if (point) {
          setPoints(points => [...points, point]);
        }
      }
    }
    setIsDrawing(false);
  }
  return (
      <canvas 
        className='canvas' 
        ref={canvasRef}
        onClick={(e) => {
          if (isDrawing) {
            stopDrawing(e);
          } else {
            startDrawing(e)
          }
        }}
        onMouseDown={(e) => {
          if (e.button === 2) {
            e.preventDefault();
            setIsDrawing(false);
          }
        }}
        onMouseMove={draw}
      >
      </canvas>
  )
}