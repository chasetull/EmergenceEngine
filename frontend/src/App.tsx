import { useState } from "react";
import "./App.css";
import FibonacciCanvas from "./components/FibonacciCanvas";

import DualFibonacciCanvas from "./components/DualFibonacciCanvas";

import {
  fibonacci,
  fibonacciRatio,
  phiDelta,
  PHI,
} from "./math/fibonacci";

type Experiment = "fibonacci" | "dual";

function App() {
  const [iterations, setIterations] = useState(12);
  const [experiment, setExperiment] =
    useState<Experiment>("fibonacci");

  const sequence = fibonacci(iterations);
  const current = sequence[sequence.length - 1];
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

      <nav className="experiment-tabs">
        <button
          className={
            experiment === "fibonacci" ? "active" : ""
          }
          onClick={() => setExperiment("fibonacci")}
        >
          01 / SINGLE
        </button>

        <button
          className={experiment === "dual" ? "active" : ""}
          onClick={() => setExperiment("dual")}
        >
          02 / DUAL
        </button>
      </nav>

      {experiment === "fibonacci" ? (
        <FibonacciCanvas sequence={sequence} />
      ) : (
        <DualFibonacciCanvas sequence={sequence} />
      )}

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