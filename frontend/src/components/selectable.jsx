import React, { useState, useRef } from 'react';
import './selectable.css';

const SelectableSection = ({ children, onSelect, onUnlock, predefinedAreas, userType }) => {
  const [selection, setSelection] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const containerRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseDown = (e) => {
    if (userType !== 'Admin') return;
    if (e.button === 0 && !isLocked) {
      const rect = containerRef.current.getBoundingClientRect();
      setStartX(e.clientX - rect.left);
      setStartY(e.clientY - rect.top);
      setIsSelecting(true);
      setSelection({ startX: e.clientX - rect.left, startY: e.clientY - rect.top, endX: e.clientX - rect.left, endY: e.clientY - rect.top });
    }
  };

  const handleMouseMove = (e) => {
    if (userType !== 'Admin' || !isSelecting) return;
    const rect = containerRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    setSelection({ startX, startY, endX, endY });
  };

  const handleMouseUp = () => {
    if (userType !== 'Admin' || !isSelecting) return;
    setIsSelecting(false);
    onSelect(selection);
    setIsLocked(true);
  };

  const handleAreaClick = (area) => {
    if (userType === 'Admin') return;
    setSelection(area);
    setIsLocked(true);
    onSelect(area);
  };

  const handleUnlock = () => {
    setIsLocked(false);
    setSelection(null);
    onUnlock();
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="selectable-section"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {children}
        {predefinedAreas.map((area, index) => (
          <div
            key={index}
            className={`predefined-area ${area.isCorrect ? 'correct' : 'incorrect'}`}
            style={{
              position: 'absolute',
              left: `${area.startX}px`,
              top: `${area.startY}px`,
              width: `${area.endX - area.startX}px`,
              height: `${area.endY - area.startY}px`,
              border: area.isCorrect === undefined ? '2px solid red' : area.isCorrect ? '2px solid green' : '2px solid red',
              zIndex: 999,
            }}
            onClick={() => handleAreaClick(area)}
          />
        ))}
        {isSelecting && selection && (
          <div
            className="selection-box"
            style={{
              position: 'absolute',
              left: `${Math.min(selection.startX, selection.endX)}px`,
              top: `${Math.min(selection.startY, selection.endY)}px`,
              width: `${Math.abs(selection.endX - selection.startX)}px`,
              height: `${Math.abs(selection.endY - selection.startY)}px`,
              backgroundColor: 'rgba(0, 0, 255, 0.3)',
              zIndex: 1000,
            }}
          />
        )}
        {isLocked && selection && (
          <div
            className="selection-box locked-selection"
            style={{
              position: 'absolute',
              left: `${Math.min(selection.startX, selection.endX)}px`,
              top: `${Math.min(selection.startY, selection.endY)}px`,
              width: `${Math.abs(selection.endX - selection.startX)}px`,
              height: `${Math.abs(selection.endY - selection.startY)}px`,
              backgroundColor: 'rgba(0, 0, 255, 0.3)',
              zIndex: 1000,
            }}
          />
        )}
      </div>
      {isLocked && <button onClick={handleUnlock}>Unlock Selection</button>}
    </div>
  );
};

export default SelectableSection;
