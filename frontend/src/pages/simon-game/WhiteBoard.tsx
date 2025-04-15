import React, { useRef, useState, useEffect } from "react";

const RADIOUS = 10;

interface WhiteboardProps {
  boardColor?: string;
  drawColor?: string;
}

export const Whiteboard: React.FC<WhiteboardProps> = ({
  boardColor = "#fff",
  drawColor = "#000",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [, setUndoStack] = useState<string[]>([]);
  const [, setRedoStack] = useState<string[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = boardColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [boardColor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        setUndoStack((prevUndo) => {
          if (prevUndo.length === 0) return prevUndo;

          const newUndo = [...prevUndo];
          const last = newUndo.pop()!;
          setRedoStack((prevRedo) => {
            const canvas = canvasRef.current;
            if (canvas) {
              const current = canvas.toDataURL();
              return [...prevRedo, current];
            }
            return prevRedo;
          });
          restoreImage(last);
          return newUndo;
        });
      } else if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        setRedoStack((prevRedo) => {
          if (prevRedo.length === 0) return prevRedo;

          const newRedo = [...prevRedo];
          const next = newRedo.pop()!;
          setUndoStack((prevUndo) => {
            const canvas = canvasRef.current;
            if (canvas) {
              const current = canvas.toDataURL();
              return [...prevUndo, current];
            }
            return prevUndo;
          });
          restoreImage(next);
          return newRedo;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const snapshot = canvas.toDataURL();
    setUndoStack((prev) => [...prev, snapshot]);
    setRedoStack([]);

    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = isErasing ? boardColor : drawColor;
    ctx.beginPath();
    ctx.arc(x, y, RADIOUS, 0, Math.PI * 2);
    ctx.fill();
  };

  const restoreImage = (dataUrl: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="whiteboard-canvas"
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        onMouseLeave={endDrawing}
        style={{
          border: "1px solid #ccc",
          width: "600px",
          height: "400px",
          cursor: isErasing ? "not-allowed" : "crosshair",
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setIsErasing(false)}>Dibujar</button>
        <button onClick={() => setIsErasing(true)}>Borrar</button>
      </div>
    </div>
  );
};
