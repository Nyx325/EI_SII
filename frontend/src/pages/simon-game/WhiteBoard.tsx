import React, { useRef, useState, useEffect } from "react";
import "./WhiteBoard.css";

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
    <div className="whiteboard-container">
      <canvas
        ref={canvasRef}
        className={`whiteboard-canvas ${isErasing ? "erasing" : "drawing"}`}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        onMouseLeave={endDrawing}
      />
      <aside className="button-container">
        <button
          onClick={() => setIsErasing(false)}
          aria-label="Modo dibujar"
          className={`icon-button ${!isErasing ? "button-selected" : ""}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M11.4001 18.1612L11.4001 18.1612L18.796 10.7653C17.7894 10.3464 16.5972 9.6582 15.4697 8.53068C14.342 7.40298 13.6537 6.21058 13.2348 5.2039L5.83882 12.5999L5.83879 12.5999C5.26166 13.1771 4.97307 13.4657 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L7.47918 20.5844C8.25351 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5343 19.0269 10.823 18.7383 11.4001 18.1612Z"
                fill="#ffffff"
              ></path>{" "}
              <path
                d="M20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178L14.3999 4.03882C14.4121 4.0755 14.4246 4.11268 14.4377 4.15035C14.7628 5.0875 15.3763 6.31601 16.5303 7.47002C17.6843 8.62403 18.9128 9.23749 19.85 9.56262C19.8875 9.57563 19.9245 9.58817 19.961 9.60026L20.8482 8.71306Z"
                fill="#ffffff"
              ></path>{" "}
            </g>
          </svg>
        </button>
        <button
          onClick={() => setIsErasing(true)}
          aria-label="Modo borrar"
          className={`icon-button ${isErasing ? "button-selected" : ""}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M21.0302 22H13.9902C13.5702 22 13.2402 21.66 13.2402 21.25C13.2402 20.84 13.5802 20.5 13.9902 20.5H21.0302C21.4502 20.5 21.7802 20.84 21.7802 21.25C21.7802 21.66 21.4502 22 21.0302 22Z"
                fill="#ffffff"
              ></path>{" "}
              <path
                d="M13.64 16.6894C14.03 17.0794 14.03 17.7094 13.64 18.1094L10.66 21.0894C9.55 22.1994 7.77 22.2594 6.59 21.2694C6.52 21.2094 6.46 21.1494 6.4 21.0894L5.53 20.2194L3.74 18.4294L2.88 17.5694C2.81 17.4994 2.75 17.4294 2.69 17.3594C1.71 16.1794 1.78 14.4194 2.88 13.3194L5.86 10.3394C6.25 9.94938 6.88 9.94938 7.27 10.3394L13.64 16.6894Z"
                fill="#ffffff"
              ></path>{" "}
              <path
                d="M21.1194 10.6414L16.1194 15.6414C15.7294 16.0314 15.0994 16.0314 14.7094 15.6414L8.33937 9.29141C7.94938 8.90141 7.94938 8.27141 8.33937 7.87141L13.3394 2.88141C14.5094 1.71141 16.4294 1.71141 17.5994 2.88141L21.1194 6.39141C22.2894 7.56141 22.2894 9.47141 21.1194 10.6414Z"
                fill="#ffffff"
              ></path>{" "}
            </g>
          </svg>
        </button>
      </aside>
    </div>
  );
};
