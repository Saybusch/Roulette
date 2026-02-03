import './App.css';
import {useRef, useState} from "react"
import array from './questions.json';

const questionArray = array;

function App() {

  const trackRef = useRef(null)
  const [isSpinning, setIsSpinning] = useState(false);

  const itemWidth = 300;
  const gap = 40;
  const fullWidth = itemWidth + gap;
  const positionsRef = useRef(
    questionArray.map((_, i) => i * fullWidth)
  )

  const startRoulette = () => {
    if (isSpinning) return
    setIsSpinning(true);

    const targetIndex = Math.floor(Math.random() * questionArray.length);
    console.log("chosen: ", targetIndex)
    const centerX = (trackRef.current.offsetWidth / 2) - (itemWidth / 2);

    let speed = 30;
    let deceleration = 0.1;
    
    const spin = () => {
      const positions = positionsRef.current;
      for (let i = 0; i < positions.length; i++) {
        positions[i] -= speed;

        if (positions[i] < -fullWidth) {
          const maxPos = Math.max(...positions);
          positions[i] = maxPos + fullWidth
        }
      }
      const items = trackRef.current.children;
      for (let i = 0; i < items.length; i++) {
        items[i].style.transform = `translateX(${positions[i]}px)`;
      }
      if (speed > 0.5) { 
        speed -= deceleration; 
        requestAnimationFrame(spin); 
      } else { 
        stopAtTarget(targetIndex, centerX); 
      }
    };
    const stopAtTarget = (targetIndex, centerX) => {
      const positions = positionsRef.current;
      const targetPos = positions[targetIndex]; 
      const diff = centerX - targetPos;
      if (Math.abs(diff) < 1) {
        positions[targetIndex] = centerX;
        const items = trackRef.current.children;
        items[targetIndex].style.transform = `translateX(${centerX}px)`;
        setIsSpinning(false);
        return;
      }
        for (let i = 0; i < positions.length; i++) {
          positions[i] += diff * 0.1
        }
        const items = trackRef.current.children;
        for (let i = 0; i < items.length; i++) {
          items[i].style.transform = `translateX(${positions[i]}px)`;
        }
        requestAnimationFrame(() => stopAtTarget(targetIndex, centerX));
    };
    spin();
  };

  return (
    <div className='App'>
      <div className='RouletteParent'>
        <div className='RouletteTrack' ref={trackRef}>
          {questionArray.map((item, index) => (
            <div className='RouletteItem' style={{borderColor: item["kolor"]}} key={index}>
              <div className='RouletteItemInside'>
                <p>{JSON.stringify(item["kategoria"])}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className='startRoulette' onClick={() => startRoulette()}>Losuj</button>
    </div>
    
  );
}

export default App;
