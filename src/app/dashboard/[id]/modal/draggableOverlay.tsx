import React, { useState } from "react";
import { Rnd, RndResizeCallback } from "react-rnd";

interface DraggableOverlayProps {
  src: string;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onPositionChange?: (position: {
    x: number;
    y: number;
    width: number;
  }) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const DraggableOverlay: React.FC<DraggableOverlayProps> = ({
  src,
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 60, height: 35 },
  onPositionChange,
  containerRef,
}) => {
  const [position, setPosition] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [size, setSize] = useState({
    width: initialSize.width,
    height: initialSize.height,
  });
  const [isResizeMode, setIsResizeMode] = useState(false);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    if (isResizeMode) return;

    const newPosition = { x: d.x, y: d.y };
    setPosition(newPosition);

    if (onPositionChange) {
      onPositionChange({
        x: newPosition.x,
        y: newPosition.y,
        width: size.width,
      });
    }
  };

  const handleResizeStop: RndResizeCallback = (
    e,
    direction,
    elementRef,
    delta,
    position,
  ) => {
    const newSize = {
      width: elementRef.style.width,
      height: elementRef.style.height,
    };

    setSize({
      width: parseInt(newSize.width, 10),
      height: parseInt(newSize.height, 10),
    });
    setPosition({ x: position.x, y: position.y });

    if (onPositionChange) {
      onPositionChange({
        x: position.x,
        y: position.y,
        width: parseInt(newSize.width, 10),
      });
    }
  };

  const toggleResizeMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizeMode(!isResizeMode);
  };

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      enableResizing={isResizeMode}
      bounds={containerRef?.current || "parent"}
      lockAspectRatio
      minWidth={20}
      minHeight={20}
      maxWidth={300}
      maxHeight={200}
      className="absolute z-50"
      style={{
        border: isResizeMode ? "2px dashed blue" : "none",
        cursor: isResizeMode ? "se-resize" : "grab",
      }}
    >
      <div className="w-full h-full relative" onClick={toggleResizeMode}>
        <img
          src={src}
          alt="Draggable Overlay"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
        {isResizeMode && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 opacity-50 pointer-events-none"></div>
        )}
      </div>
    </Rnd>
  );
};
