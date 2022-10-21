import { useState } from 'react';
import './App.scss';
import { Button } from './Button';
import { Canvas } from './Canvas';

function App() {
  const [clearCanvas, setClearCanvas] = useState(false);
  const clear = () => {
    setClearCanvas(true);
  }

  const start = () => {
    setClearCanvas(false);
  }
  return (
    <div className="App">
      <Canvas clearCanvas={clearCanvas} start={start} />
      <Button clear={clear} />
    </div>
  );
}

export default App;
