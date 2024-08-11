import { useEffect, useState, useRef } from "react";

function clock() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasProperties = {
    height: 400,
    width: 400,
  };

  const [clock, setClock] = useState({
    x: canvasProperties.height / 2,
    y: canvasProperties.width / 2,
    radius: canvasProperties.height / 2,
    /* Its sometimes called pivot, clocks center, arbor, spindle 
    Picked center since it just sounds normal, and makes sense for other people*/
    center: {
      x: canvasProperties.height / 2,
      y: canvasProperties.width / 2,
      radius: 10,
    }
  });

  const drawFace = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Draws the border
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(clock.x, clock.y, clock.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 25;
    ctx.stroke();
    ctx.closePath();

    // Draws the dot in the middle of the clock
    ctx.beginPath();
    ctx.arc(clock.center.x, clock.center.y, clock.center.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  
  const drawNumbers = (ctx: CanvasRenderingContext2D) => {
    const radius = clock.radius * 0.825;
    // Times new roman looks nice for roman numerals
    ctx.font = clock.radius * 0.15 + "px 'Times New Roman'";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let num = 1; num <= 12; num++) {
        const angle = num * 30 * (Math.PI / 180);
        const x = clock.center.x + radius * Math.cos(angle - Math.PI / 2);
        const y = clock.center.y + radius * Math.sin(angle - Math.PI / 2);
        ctx.fillText(num.toString(), x, y);
    }
  }

  const drawClock = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // https://www.w3schools.com/graphics/canvas_clock.asp
    drawFace(canvas, ctx);
    drawNumbers(ctx);
  }

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawClock(canvas, ctx);
      }
    }
  }, [clock]);

  return (
    <canvas 
      ref={canvasRef} 
      width={canvasProperties.height} 
      height={canvasProperties.width} 
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        borderRadius: "50%",
      }} 
    />
  );
}

export default clock;