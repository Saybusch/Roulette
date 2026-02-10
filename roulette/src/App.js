import './App.css';
import {useRef, useState, useEffect} from "react"
import array from './questions.json';

// Hex Codes for JSON:
// White  - "#B0C3D9"
// Blue   - "#4B69FF"
// Purple - "#8847FF"
// Pink   - "#D32CE6"
// Red    - "#EB4B4B"
// Gold   - "#FFD700"

let questionArray = [...array];

function shuffle(arr) { 
  for (let i = arr.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [arr[i], arr[j]] = [arr[j], arr[i]]; 
  } 
  return arr; 
} 
questionArray = shuffle(questionArray);

function App() {
  useEffect(() => {
    renderItems(0);
  }, []);
  const trackRef = useRef(null)
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  var targetIndexRef = useRef(0);
  const itemWidth = 300;
  const gap = 40;
  const fullWidth = itemWidth + gap;
  const itemCount = questionArray.length;
    const totalWidth = fullWidth * itemCount;
  const renderItems = (offset) => {
    const items = trackRef.current.children;
    for(let i = 0; i < items.length; i++){
      let x = i * fullWidth - offset;
      x = wrap(x + totalWidth / 2, totalWidth) - totalWidth / 2
      items[i].style.setProperty("--x", `${x}px`);
    }
  };
  const wrap = (x, w) => ((x % w) + w) % w;
  const startRoulette = () => {
    if (isSpinning) return
    setIsSpinning(true);
    setHasSpun(true);
    setCorrect(false);
    setIncorrect(false);

    const centerX = trackRef.current.offsetWidth / 2;
    targetIndexRef.current = Math.floor(Math.random() * questionArray.length);
    questionArray[targetIndexRef.current].kolor = "#00FF00"
    const finalOffset = targetIndexRef.current * fullWidth - centerX - (fullWidth*(window.innerWidth % fullWidth));
    console.log("chosen: ", targetIndexRef.current)
    const minFinalOffset = 3 * totalWidth;
    const adjustedFinalOffset = finalOffset + Math.ceil((minFinalOffset - finalOffset) / totalWidth) * totalWidth;
    let offset = 0;
    let speed = 100;
    
    const spin = () => {
      const remaining = adjustedFinalOffset - offset;
      if (offset < adjustedFinalOffset - totalWidth) {
        offset += speed;
        renderItems(offset);
        requestAnimationFrame(spin);
        return;
      }
      if (Math.abs(remaining) > 0.5) {
        renderItems(offset)
        offset += remaining * 0.03;
        renderItems(offset);
        requestAnimationFrame(spin);
        return
      }
      offset = finalOffset;
      renderItems(offset);
      setIsSpinning(false);
    };
    spin();
  };

  const checkAnswer = (answer) => {
    const ifCorrect = answer.target.textContent == questionArray[targetIndexRef.current].correct ? true : false
    if(ifCorrect) setCorrect(true)
    else {
      setIncorrect(true)
    }
  }

  return (
    <div className='App'>
      <div className={`RouletteParent ${!isSpinning ? "shiftUp" : ""}`}>
        <div className='RouletteTrack' ref={trackRef}>
          {questionArray.map((item, index) => (
            <div className='RouletteItem' style={{borderColor: item["kolor"]}} key={index}>
              <div className='RouletteItemInside'>
                <p>{JSON.stringify(item["kategoria"])}</p>
              </div>
            </div>
          ))}
        </div>
        <div className='RouletteDivider'></div>
      </div>
      <button className={`startRoulette ${!isSpinning ? "shiftUp" : ""}`} onClick={() => startRoulette()}>Losuj</button>
      <div className={`answerParent ${(!isSpinning && hasSpun) ? "vis" : ""}`}>
        <div className='answerQuestion'>Kategoria: {questionArray[targetIndexRef.current].kategoria} Pytanie: {questionArray[targetIndexRef.current].pytanie}</div>
        <div className='answerBox'>
          <div className={`answer ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""}`} onClick={(e) => checkAnswer(e)}>{questionArray[targetIndexRef.current].ans1}</div>
          <div className={`answer ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""}`} onClick={(e) => checkAnswer(e)}>{questionArray[targetIndexRef.current].ans2}</div>
          <div className={`answer ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""}`} onClick={(e) => checkAnswer(e)}>{questionArray[targetIndexRef.current].ans3}</div>
          <div className={`answer ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""}`} onClick={(e) => checkAnswer(e)}>{questionArray[targetIndexRef.current].ans4}</div>
        </div>
      </div>
    </div>
    
  );
}

export default App;
