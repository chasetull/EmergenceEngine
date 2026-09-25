import { useEffect, useRef } from "react";

interface FibonacciCanvasProps {
  sequence: number[];
}

// interface Square {
//   x: number;
//   y: number;
//   size: number;
//   value: number;
// }


type Direction = "start" | "down" | "left" | "up" | "right";

interface Square {
  x: number;
  y: number;
  size: number;
  value: number;
  direction: Direction;
}



function buildSquares(sequence: number[]): Square[] {
  if (sequence.length === 0) return [];

  // const squares: Square[] = [
  //   {
  //     x: 0,
  //     y: 0,
  //     size: sequence[0],
  //     value: sequence[0],
  //   },
  // ];

  // if (sequence.length === 1) return squares;

  // // Second 1 sits directly to the right.
  // squares.push({
  //   x: sequence[0],
  //   y: 0,
  //   size: sequence[1],
  //   value: sequence[1],
  // });


  const squares: Square[] = [
  {
    x: 0,
    y: 0,
    size: sequence[0],
    value: sequence[0],
    direction: "start",
  },
  ];

  if (sequence.length === 1) return squares;

  squares.push({
    x: sequence[0],
    y: 0,
    size: sequence[1],
    value: sequence[1],
    direction: "right",
  });

  let minX = 0;
  let minY = 0;
  let maxX = sequence[0] + sequence[1];
  let maxY = sequence[0];

  for (let i = 2; i < sequence.length; i++) {
    const size = sequence[i];

    // Placement rotates:
    // down → left → up → right
    // const direction = (i - 2) % 4;

    const directionIndex = (i - 2) % 4;

    const directions: Direction[] = [
      "down",
      "left",
      "up",
      "right",
    ];

    const direction = directions[directionIndex];

    let x = 0;
    let y = 0;

    switch (direction) {
      case "down":
        x = minX;
        y = maxY;
        break;

      case "left":
        x = minX - size;
        y = minY;
        break;

      case "up":
        x = minX;
        y = minY - size;
        break;

      case "right":
        x = maxX;
        y = minY;
        break;
    }

    squares.push({
      x,
      y,
      size,
      value: size,
      direction,
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

      

      ctx.beginPath();
      ctx.strokeStyle = "#eeeeee";
      ctx.lineWidth = 2;

      squares.forEach((square, index) => {
        const x = square.x * scale + offsetX;
        const y = square.y * scale + offsetY;
        const size = square.size * scale;

        let centerX = 0;
        let centerY = 0;
        let startAngle = 0;
        let endAngle = 0;

        // The first two 1x1 squares establish the beginning
        // of the spiral.
        if (index === 0) {
          centerX = x + size;
          centerY = y + size;
          startAngle = Math.PI;
          endAngle = Math.PI * 1.5;
        } else if (index === 1) {
          centerX = x;
          centerY = y + size;
          startAngle = Math.PI * 1.5;
          endAngle = Math.PI * 2;
        } else {
          switch (square.direction) {
            case "down":
              centerX = x;
              centerY = y;
              startAngle = 0;
              endAngle = Math.PI / 2;
              break;

            case "left":
              centerX = x + size;
              centerY = y;
              startAngle = Math.PI / 2;
              endAngle = Math.PI;
              break;

            case "up":
              centerX = x + size;
              centerY = y + size;
              startAngle = Math.PI;
              endAngle = Math.PI * 1.5;
              break;

            case "right":
              centerX = x;
              centerY = y + size;
              startAngle = Math.PI * 1.5;
              endAngle = Math.PI * 2;
              break;
          }
        }

        ctx.arc(
          centerX,
          centerY,
          size,
          startAngle,
          endAngle
        );
      });

      ctx.stroke();
    });
  }, [sequence]);

  return (
    <div className="fibonacci-canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}