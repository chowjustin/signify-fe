import React, {
  useRef,
  useState,
  useEffect,
  MouseEvent,
  TouchEvent,
} from "react";

interface SignatureCanvasProps {
  onSignatureChange: (file: File | null) => void;
  disabled?: boolean;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }, []);

  const getCoordinates = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
      }
    }
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineTo(x, y);
        context.stroke();
      }
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.closePath();
        const dataUrl = canvas.toDataURL("image/png");
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "signature.png", {
              type: "image/png",
            });
            onSignatureChange(file);
          });
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="signature-canvas">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        onTouchCancel={endDrawing}
        className="w-full aspect[5/3] border-2 border-dashed border-typo-secondary rounded-md"
      />
      <div className="flex w-full justify-center">
        <button
          type="button"
          onClick={clearCanvas}
          className="mt-2 px-4 py-2 border-2 border-gray-300 rounded-md"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
