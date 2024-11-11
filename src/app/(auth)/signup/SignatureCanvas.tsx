import Button from "@/components/buttons/Button";
import React, { useRef, useState, useEffect, MouseEvent } from "react";

interface SignatureCanvasProps {
  onSignatureChange: (file: File | null) => void;
  disabled?: boolean; // Add this line to make `disabled` optional
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

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const rect = canvas.getBoundingClientRect();
        context.beginPath();
        context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setIsDrawing(true);
      }
    }
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const rect = canvas.getBoundingClientRect();
        context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
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
        // Convert the data URL to a file and call the callback to update the form data
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
        className="w-full aspect[5/3] border-2 border-dashed border-typo-secondary rounded-md"
      />
      <div className="flex w-full justify-center">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={clearCanvas}
          className="mt-2"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
