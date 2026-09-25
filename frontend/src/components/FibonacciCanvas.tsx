import { useEffect, useRef } from "react";

interface FibonacciCanvasProps {
  sequence: number[];
}

interface Square {
  x: number;
  y: number;
  size: number;
  value: number;
}

function buildSquares(sequence: number[]): Square[] {
  if (sequence.length === 0) return [];

  const squares: Square[] = [
    {
      x: 0,
      y: 0,
      size: sequence[0],
      value: sequence[0],
    },
  ];

  if (sequence.length === 1) return squares;

  // Second 1 sits directly to the right.
  squares.push({
    x: sequence[0],
    y: 0,
    size: sequence[1],
    value: sequence[1],
  });

  let minX = 0;
  let minY = 0;
  let maxX = sequence[0] + sequence[1];
  let maxY = sequence[0];

  for (let i = 2; i < sequence.length; i++) {
    const size = sequence[i];

    // Placement rotates:
    // down → left → up → right
    const direction = (i - 2) % 4;

    let x = 0;
    let y = 0;

    switch (direction) {
      case 0: // down
        x = minX;
        y = maxY;
        break;

      case 1: // left
        x = minX - size;
        y = minY;
        break;

      case 2: // up
        x = minX;
        y = minY - size;
        break;

      case 3: // right
        x = maxX;
        y = minY;
        break;
    }

    squares.push({
      x,
      y,
      size,
      value: size,
    });

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + size);
    maxY = Math.max(maxY, y + size);
  }

  return squares;
}

export default function FibonacciCanvas({
  sequence,
}: FibonacciCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, width, height);

    const squares = buildSquares(sequence);

    if (squares.length === 0) return;

    const minX = Math.min(...squares.map((s) => s.x));
    const minY = Math.min(...squares.map((s) => s.y));

    const maxX = Math.max(
      ...squares.map((s) => s.x + s.size)
    );

    const maxY = Math.max(
      ...squares.map((s) => s.y + s.size)
    );

    const geometryWidth = maxX - minX;
    const geometryHeight = maxY - minY;

    const padding = 50;

    const scale = Math.min(
      (width - padding * 2) / geometryWidth,
      (height - padding * 2) / geometryHeight
    );

    const offsetX =
      (width - geometryWidth * scale) / 2 -
      minX * scale;

    const offsetY =
      (height - geometryHeight * scale) / 2 -
      minY * scale;

    ctx.lineWidth = 1;

    squares.forEach((square) => {
      const x = square.x * scale + offsetX;
      const y = square.y * scale + offsetY;
      const size = square.size * scale;

      ctx.strokeStyle = "#444";

      ctx.strokeRect(x, y, size, size);

      // Don't try to label microscopic squares.
      if (size > 28) {
        ctx.fillStyle = "#888";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
          String(square.value),
          x + size / 2,
          y + size / 2
        );
      }
    });
  }, [sequence]);

  return (
    <div className="fibonacci-canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}