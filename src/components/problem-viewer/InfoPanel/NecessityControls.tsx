import React from 'react';

interface NecessityControlsProps {
  value: boolean | null;
  onSetTrue: () => void;
  onSetFalse: () => void;
}

const NecessityControls: React.FC<NecessityControlsProps> = ({ value, onSetTrue, onSetFalse }) => {
  return (
    <div className="inline-flex items-center gap-3 shrink-0">
      <div
        className="inline-flex items-center gap-1.5 cursor-pointer"
        onClick={onSetTrue}
      >
        <span className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
          value === true ? 'border-green-500' : 'border-gray-300'
        }`}>
          {value === true && <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>}
        </span>
        <span className="text-sm text-gray-500">필요</span>
      </div>
      <div
        className="inline-flex items-center gap-1.5 cursor-pointer"
        onClick={onSetFalse}
      >
        <span className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
          value === false ? 'border-red-500' : 'border-gray-300'
        }`}>
          {value === false && <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>}
        </span>
        <span className="text-sm text-gray-500">불필요</span>
      </div>
    </div>
  );
};

export default NecessityControls;
