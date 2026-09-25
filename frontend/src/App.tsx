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
  const [showPhiInfo, setShowPhiInfo] = useState(true); // info testr
  const [experiment, setExperiment] =
    useState<Experiment>("fibonacci");

  const [relationship, setRelationship] =
    useState<"mirror" | "phi">("mirror");

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
        <DualFibonacciCanvas
          sequence={sequence}
          relationship={relationship}
        />
      )}
      {experiment === "dual" && (
        <section className="relationship-controls">
          <p>RELATIONSHIP</p>

          <div>
            <button
              className={
                relationship === "mirror" ? "active" : ""
              }
              onClick={() => setRelationship("mirror")}
            >
              MIRROR
              <span>L(n) → R(n)</span>
            </button>

            <button
              className={relationship === "phi" ? "active" : ""}
              onClick={() => {
                setRelationship("phi");
                setShowPhiInfo(true);
              }}
            >
              PHI OFFSET
              <span>L(n) → R(n+1)</span>
            </button>
            {experiment === "dual" &&
              relationship === "phi" &&
              showPhiInfo && (
                <section className="phi-info">
                  <button
                    className="phi-info-close"
                    onClick={() => setShowPhiInfo(false)}
                    aria-label="Close Phi Offset explanation"
                  >
                    ×
                  </button>

                  <div className="phi-info-heading">
                    <span>RELATIONSHIP / PHI OFFSET</span>
                    <strong>φ</strong>
                  </div>

                  <div className="phi-info-content">
                    <div className="phi-info-description">
                      <p>
                        Instead of connecting matching Fibonacci
                        iterations, Phi Offset connects each point on the
                        left spiral to the next Fibonacci point on the
                        right.
                      </p>

                      <div className="phi-equation">
                        L(n) → R(n + 1)
                      </div>

                      <p>
                        This means each bridge connects two consecutive
                        Fibonacci numbers. As the sequence grows, the
                        ratio between those numbers approaches the golden
                        ratio.
                      </p>
                    </div>

                    <div className="phi-info-math">
                      <div>
                        <label>RELATIONSHIP</label>
                        <span>F(n + 1) / F(n)</span>
                      </div>

                      <div>
                        <label>CONVERGES TO</label>
                        <span>φ</span>
                      </div>

                      <div>
                        <label>GOLDEN RATIO</label>
                        <span>1.6180339887...</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}
          </div>
        </section>
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