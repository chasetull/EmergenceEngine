import { useState } from "react";
import "./App.css";
import FibonacciCanvas from "./components/FibonacciCanvas";

import {
  fibonacci,
  fibonacciRatio,
  phiDelta,
  PHI,
} from "./math/fibonacci";

// const PHI = (1 + Math.sqrt(5)) / 2;

// function fibonacci(count: number): number[] {
//   if (count <= 0) return [];
//   if (count === 1) return [1];

//   const sequence = [1, 1];

//   for (let i = 2; i < count; i++) {
//     sequence.push(sequence[i - 1] + sequence[i - 2]);
//   }

//   return sequence;
// }

function App() {
  const [iterations, setIterations] = useState(12);

  const sequence = fibonacci(iterations);
  const current = sequence[sequence.length - 1];
  //const previous = sequence[sequence.length - 2];

  // const ratio =
  //   previous !== undefined ? current / previous : 1;

  // const delta = Math.abs(PHI - ratio);
  const ratio = fibonacciRatio(sequence);
  const delta = phiDelta(ratio);

  return (
    <main className="engine">
      <header>
        <p className="eyebrow">EMERGENCE ENGINE / 01</p>
        <h1>Fibonacci</h1>
        <p className="subtitle">
          Order emerging from recursion.
        </p>
      </header>

      <FibonacciCanvas sequence={sequence} />

      <section className="sequence">
        {sequence.map((number, index) => (
          <span key={index}>{number}</span>
        ))}
      </section>

      <section className="metrics">
        <div>
          <label>ITERATION</label>
          <strong>{iterations}</strong>
        </div>

        <div>
          <label>F(n)</label>
          <strong>{current}</strong>
        </div>

        <div>
          <label>F(n) / F(n-1)</label>
          <strong>{ratio.toFixed(8)}</strong>
        </div>

        <div>
          <label>φ</label>
          <strong>{PHI.toFixed(8)}</strong>
        </div>

        <div>
          <label>DELTA</label>
          <strong>{delta.toFixed(8)}</strong>
        </div>
      </section>

      <section className="controls">
        <label htmlFor="iterations">
          ITERATIONS
          <span>{iterations}</span>
        </label>

        <input
          id="iterations"
          type="range"
          min="2"
          max="30"
          value={iterations}
          onChange={(event) =>
            setIterations(Number(event.target.value))
          }
        />
      </section>
    </main>
  );
}

export default App;