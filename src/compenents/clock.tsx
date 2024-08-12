import { useEffect, useRef, useState } from "react";

interface ClockProps {
  second: number;
  minute: number;
  hour: number;
  onClick: () => void;
}

function Clock({ second, minute, hour, onClick }: ClockProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasProperties = {
    height: 300, // 400
    width: 300, // 400
  };

  const [clock, setClock] = useState({
    x: canvasProperties.width / 2,
    y: canvasProperties.height / 2,
    radius: canvasProperties.height / 2,
    center: {
      x: canvasProperties.width / 2,
      y: canvasProperties.height / 2,
      radius: 10,
    },
    arm: {
      second: {
        x: canvasProperties.width / 2,
        y: canvasProperties.height / 2,
        lineWidth: 5,
        height: (canvasProperties.height / 2) - 50,
        width: 5,
        angle: 180 + 360 / second
      },
      minute: {
        x: canvasProperties.width / 2,
        y: canvasProperties.height / 2,
        lineWidth: 5,
        height: (canvasProperties.height / 2) - 50,
        width: 10,
        angle: 180 + (360 / minute) * 60
      },
      hour: {
        x: canvasProperties.width / 2,
        y: canvasProperties.height / 2,
        lineWidth: 5,
        height: (canvasProperties.height / 2) - 75, // 80
        width: 10,
        angle: 180 + (360 / hour) * 60
      }
    }
  });

  const drawFace = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(clock.x, clock.y, clock.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 25;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(clock.center.x, clock.center.y, clock.center.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  const convertToRomanNumerals = (num: number): string => {
    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    return romanNumerals[num - 1] || '';
  }

  const drawNumbers = (ctx: CanvasRenderingContext2D) => {
    const radius = clock.radius * 0.8; // 0.825
    ctx.font = clock.radius * 0.175 /* 0.15 */ + "px 'Times New Roman'";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let num = 1; num <= 12; num++) {
      const angle = num * 30 * (Math.PI / 180);
      const x = clock.center.x + radius * Math.cos(angle - Math.PI / 2);
      const y = clock.center.y + radius * Math.sin(angle - Math.PI / 2);
      ctx.fillText(convertToRomanNumerals(num), x, y);
    }
  }

  const drawArms = (ctx: CanvasRenderingContext2D) => {
    const drawArm = (arm: 'second' | 'minute' | 'hour') => {
      ctx.save();
      const centerX = clock.arm[arm].x;
      const centerY = clock.arm[arm].y;
      ctx.translate(centerX, centerY);

      const radians = (clock.arm[arm].angle * Math.PI) / 180;
      ctx.rotate(radians);

      ctx.translate(-centerX, -centerY);

      ctx.beginPath();
      ctx.lineWidth = clock.arm[arm].lineWidth;
      ctx.lineCap = "round";

      const rectX = clock.arm[arm].x - clock.arm[arm].width / 2;
      const rectY = clock.arm[arm].y;
      const rectWidth = clock.arm[arm].width;
      const rectHeight = clock.arm[arm].height;
      const cornerRadius = rectWidth / 2;

      ctx.moveTo(rectX + cornerRadius, rectY);
      ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + rectHeight, cornerRadius);

      ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX, rectY + rectHeight, cornerRadius);

      ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY, cornerRadius);

      ctx.arcTo(rectX, rectY, rectX + rectWidth, rectY, cornerRadius);

      ctx.fill();
      ctx.closePath();

      ctx.restore();
    }

    drawArm('second');
    drawArm('minute');
    drawArm('hour');
  };

  const drawClock = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    drawFace(canvas, ctx);
    drawNumbers(ctx);
    drawArms(ctx);
  }

  useEffect(() => {
    setClock(prevClock => ({
      ...prevClock,
      arm: {
        ...prevClock.arm,
        second: {
          ...prevClock.arm.second,
          angle: 180 + (second % 60) * 6
        },
        minute: {
          ...prevClock.arm.minute,
          angle: 180 + (minute % 60) * 6
        },
        hour: {
          ...prevClock.arm.hour,
          angle: 180 + (hour % 12) * 30
        }
      }
    }));
  }, [second]);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawClock(canvas, ctx);
      }
    }
  }, [clock.arm]);

  return (
    <canvas 
      ref={canvasRef} 
      width={canvasProperties.width} 
      height={canvasProperties.height} 
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        borderRadius: "50%",
        userSelect: "none",
      }} 
      onClick={onClick}
    />
  );
}

export default Clock;