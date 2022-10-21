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

  useEffect(() => {
    if (canvasRef.current) {
      resize();
      canvasCtxRef.current = canvasRef.current.getContext('2d');

      if (canvasCtxRef.current) {
        canvasCtxRef.current.lineCap = 'round';
        canvasCtxRef.current.strokeStyle = 'black';
        canvasCtxRef.current.lineWidth = 1;
      }
    }

    for (let i = 0; i < paths.length; i++) {
      canvasCtxRef.current?.beginPath();
      canvasCtxRef.current?.moveTo(paths[i]['x1'], paths[i]['y1']);
      canvasCtxRef.current?.lineTo(paths[i]['x2'], paths[i]['y2']);
      canvasCtxRef.current?.stroke();
      canvasCtxRef.current?.closePath();
    }
  }, [paths]);

  useEffect(() => {
    if (clearCanvas) {
      setPaths([]);
      setPoints([]);
      resize();
    }
  }, [clearCanvas]);

  useEffect(() => {
    
    for (let i = 0; i < points.length; i++) {
      if (canvasCtxRef.current) {
      canvasCtxRef.current.beginPath();
      canvasCtxRef.current.fillStyle = 'red';
      canvasCtxRef.current.moveTo(points[i]['x'], points[i]['y']);
      canvasCtxRef.current.lineTo(points[i]['x'], 5);
      canvasCtxRef.current.moveTo(points[i]['x'], points[i]['y']);
      canvasCtxRef.current.arc(points[i]['x'], points[i]['y'], 5, 0, 180, false)
      canvasCtxRef.current.fill();

    }
    }
  }, [points])

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

        for (let i = 0; i < paths.length; i++) {
          canvasCtxRef.current?.beginPath();
          canvasCtxRef.current?.moveTo(paths[i]['x1'], paths[i]['y1']);
          canvasCtxRef.current?.lineTo(paths[i]['x2'], paths[i]['y2']);
          canvasCtxRef.current?.stroke();
          canvasCtxRef.current?.closePath();
        }

        for (let i = 0; i < points.length; i++) {
          canvasCtxRef.current?.beginPath();
          canvasCtxRef.current?.moveTo(points[i]['x'], points[i]['y']);
          canvasCtxRef.current?.lineTo(points[i]['x'], 5);
          canvasCtxRef.current?.moveTo(points[i]['x'], points[i]['y']);
          canvasCtxRef.current?.arc(points[i]['x'], points[i]['y'], 5, 0, 180, false)
          canvasCtxRef.current?.fill();
        }
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
          if (canvasCtxRef.current) {
            canvasCtxRef.current?.beginPath();
            canvasCtxRef.current.fillStyle = 'red';
            canvasCtxRef.current?.moveTo(point.x, point.y);
            canvasCtxRef.current?.lineTo(point.x, 5);
            canvasCtxRef.current?.moveTo(point.x, point.y);
            canvasCtxRef.current?.arc(point.x, point.y, 5, 0, 180, false)
            canvasCtxRef.current?.fill();
          }
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
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      >
      </canvas>
  )
}