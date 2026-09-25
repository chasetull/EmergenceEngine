import { useEffect, useRef } from "react";

type Relationship = "mirror" | "phi";

interface DualFibonacciCanvasProps {
  sequence: number[];
  relationship: Relationship;
}

interface Point {
  x: number;
  y: number;
  value: number;
  index: number;
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
    const direction = (i - 2) % 4;

    let x = 0;
    let y = 0;

    switch (direction) {
      case 0:
        x = minX;
        y = maxY;
        break;

      case 1:
        x = minX - size;
        y = minY;
        break;

      case 2:
        x = minX;
        y = minY - size;
        break;

      case 3:
        x = maxX;
        y = minY;
        break;
    }

    squares.push({ x, y, size, value: size });

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + size);
    maxY = Math.max(maxY, y + size);
  }

  return squares;
}

function drawSpiral(
  ctx: CanvasRenderingContext2D,
  squares: Square[],
  scale: number,
  offsetX: number,
  offsetY: number
): Point[] {
  const points: Point[] = [];

  squares.forEach((square, index) => {
    const x = square.x * scale + offsetX;
    const y = square.y * scale + offsetY;
    const size = square.size * scale;

    // Draw square
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);

    const direction = index < 2 ? index : (index - 2) % 4;

    let centerX = 0;
    let centerY = 0;
    let startAngle = 0;
    let endAngle = 0;

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
      switch (direction) {
        case 0:
          centerX = x;
          centerY = y;
          startAngle = 0;
          endAngle = Math.PI / 2;
          break;

        case 1:
          centerX = x + size;
          centerY = y;
          startAngle = Math.PI / 2;
          endAngle = Math.PI;
          break;

        case 2:
          centerX = x + size;
          centerY = y + size;
          startAngle = Math.PI;
          endAngle = Math.PI * 1.5;
          break;

        case 3:
          centerX = x;
          centerY = y + size;
          startAngle = Math.PI * 1.5;
          endAngle = Math.PI * 2;
          break;
      }
    }

    // Draw spiral arc
    ctx.beginPath();
    ctx.strokeStyle = "#eeeeee";
    ctx.lineWidth = 2;

    ctx.arc(
      centerX,
      centerY,
      size,
      startAngle,
      endAngle
    );

    ctx.stroke();

    // Find midpoint of this arc.
    const midAngle = (startAngle + endAngle) / 2;

    const pointX =
      centerX + Math.cos(midAngle) * size;

    const pointY =
      centerY + Math.sin(midAngle) * size;

    points.push({
      x: pointX,
      y: pointY,
      value: square.value,
      index,
    });
  });

  return points;
}

export default function DualFibonacciCanvas({
  sequence,
  relationship,
}: DualFibonacciCanvasProps) {
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
    if (!squares.length) return;

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

    /*
     * Each spiral gets roughly half of the canvas.
     */
    const halfWidth = width / 2;
    const padding = 35;

    const scale = Math.min(
      (halfWidth - padding * 2) / geometryWidth,
      (height - padding * 2) / geometryHeight
    );

    const geometryPixelWidth = geometryWidth * scale;
    const geometryPixelHeight = geometryHeight * scale;

    const localX =
      (halfWidth - geometryPixelWidth) / 2 -
      minX * scale;

    const localY =
      (height - geometryPixelHeight) / 2 -
      minY * scale;

    /*
     * LEFT SPIRAL
     */
    ctx.save();

    const leftPoints = drawSpiral(
        ctx,
        squares,
        scale,
        localX,
        localY
    );

    ctx.restore();

    /*
     * RIGHT SPIRAL
     *
     * Flip the entire coordinate system horizontally.
     */
    ctx.save();

    ctx.translate(width, 0);
    ctx.scale(-1, 1);

    const rawRightPoints = drawSpiral(
        ctx,
        squares,
        scale,
        localX,
        localY
    );

    ctx.restore();

    const rightPoints = rawRightPoints.map((point) => ({
        ...point,
        x: width - point.x,
    }));

    ctx.save();

    leftPoints.forEach((leftPoint, index) => {
    let rightPoint: Point | undefined;

    if (relationship === "mirror") {
        rightPoint = rightPoints[index];
    }

    if (relationship === "phi") {
        rightPoint = rightPoints[index + 1];
    }

    if (!rightPoint) return;

    ctx.beginPath();

    ctx.moveTo(
        leftPoint.x,
        leftPoint.y
    );

    ctx.lineTo(
        rightPoint.x,
        rightPoint.y
    );

    ctx.strokeStyle = "rgba(238, 238, 238, 0.16)";
    ctx.lineWidth = 1;

    ctx.stroke();

    // Left node
    ctx.beginPath();
    ctx.arc(
        leftPoint.x,
        leftPoint.y,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#aaa";
    ctx.fill();

    // Right node
    ctx.beginPath();
    ctx.arc(
        rightPoint.x,
        rightPoint.y,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.fill();
    });

    ctx.restore();

    /*
     * Center axis
     */
    ctx.beginPath();
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    ctx.moveTo(width / 2, 30);
    ctx.lineTo(width / 2, height - 30);
    ctx.stroke();
  }, [sequence, relationship]);

  return (
    <div className="fibonacci-canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}