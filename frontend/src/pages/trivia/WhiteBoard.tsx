import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./WhiteBoard.css";

const RADIOUS = 10;

interface WhiteboardProps {
  boardColor?: string;
  drawColor?: string;
}

export interface WhiteBoardRef {
  getCanvasDataUrl: () => string | null;
}

export const Whiteboard = forwardRef<WhiteBoardRef, WhiteboardProps>(
  ({ boardColor = "#fff", drawColor = "#000" }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [, setUndoStack] = useState<string[]>([]);
    const [, setRedoStack] = useState<string[]>([]);

    // Exponer métodos al componente padre
    useImperativeHandle(ref, () => ({
      getCanvasDataUrl: () => {
        if (canvasRef.current) {
          return canvasRef.current.toDataURL("image/png");
        }
        return null;
      },
    }));

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
              fill="currentColor"
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
                  fill="currentColor"
                ></path>{" "}
                <path
                  d="M20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178L14.3999 4.03882C14.4121 4.0755 14.4246 4.11268 14.4377 4.15035C14.7628 5.0875 15.3763 6.31601 16.5303 7.47002C17.6843 8.62403 18.9128 9.23749 19.85 9.56262C19.8875 9.57563 19.9245 9.58817 19.961 9.60026L20.8482 8.71306Z"
                  fill="currentColor"
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
              fill="currentColor"
              viewBox="0 0 36 36"
              version="1.1"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>eraser-solid</title>{" "}
                <path
                  d="M28,32H15.33L19,28.37l-9.9-9.9L3.54,24a1.83,1.83,0,0,0,0,2.6L9,32H3a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z"
                  className="clr-i-solid clr-i-solid-path-1"
                ></path>
                <path
                  d="M34.08,10.65l-7.3-7.3a1.83,1.83,0,0,0-2.6,0L10.47,17.06l9.9,9.9L34.08,13.25A1.85,1.85,0,0,0,34.08,10.65Z"
                  className="clr-i-solid clr-i-solid-path-2"
                ></path>{" "}
                <rect
                  x="0"
                  y="0"
                  width="36"
                  height="36"
                  fill-opacity="0"
                ></rect>{" "}
              </g>
            </svg>
          </button>
        </aside>
      </div>
    );
  },
);
