import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

interface FileDropZoneProps {
  onFilesSelected: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  accept = '.json,.jsonl',
  multiple = true,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300 mb-5 ${
        isDragOver
          ? 'border-green-500 bg-green-50'
          : 'border-indigo-500 bg-white hover:border-indigo-600 hover:bg-indigo-50'
      }`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="text-lg text-gray-600 mb-2.5">파일을 드래그 앤 드롭하거나 클릭하여 선택</div>
      <div className="text-sm text-gray-500">여러 파일을 한번에 선택할 수 있습니다</div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
    </div>
  );
};

export default FileDropZone;
