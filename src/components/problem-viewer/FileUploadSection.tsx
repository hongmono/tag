import React, { useEffect } from 'react';
import { FileDropZone, Button } from '../common';
import type { SelectedFiles } from '../../types';

interface FileUploadSectionProps {
  selectedFiles: SelectedFiles;
  onFilesSelected: (files: FileList) => void;
  onLoad: () => void;
  canLoad: boolean;
  isLoading: boolean;
  loadingMessage: string;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  selectedFiles,
  onFilesSelected,
  onLoad,
  canLoad,
  isLoading,
  loadingMessage,
}) => {
  // Enter 키로도 "데이터 로드하기" 실행 (입력 필드/버튼 포커스 시에는 무시)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = (target?.tagName || '').toLowerCase();
      const isEditable = target?.isContentEditable;
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || isEditable) {
        return;
      }
      if (e.key === 'Enter' && canLoad && !isLoading) {
        e.preventDefault();
        onLoad();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canLoad, isLoading, onLoad]);

  const getFileStatus = (file: File | null, required: boolean) => {
    if (file) {
      return { text: `✓ ${file.name}`, className: 'bg-green-100 text-green-800' };
    }
    return required
      ? { text: '필요', className: 'bg-red-100 text-red-800' }
      : { text: '선택사항', className: 'bg-yellow-100 text-yellow-800' };
  };

  const fileItems = [
    { key: 'combined', name: 'combined_input.jsonl', type: '필수', file: selectedFiles.combined, required: true },
    { key: 'results', name: 'results.jsonl', type: '필수', file: selectedFiles.results, required: true },
    { key: 'unitKnowledge', name: 'unitKnowledge.json', type: '필수', file: selectedFiles.unitKnowledge, required: true },
    { key: 'criteria', name: 'criteria.jsonl', type: '선택', file: selectedFiles.criteria, required: false },
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-5 mx-8 my-2.5">
      <h3 className="text-gray-600 mb-4 text-lg">파일 업로드</h3>

      <FileDropZone onFilesSelected={onFilesSelected} />

      <div className="mt-5">
        {fileItems.map((item) => {
          const status = getFileStatus(item.file, item.required);
          return (
            <div key={item.key} className="flex items-center justify-between p-2.5 mb-2 bg-white border border-gray-200 rounded">
              <div className="flex-1 font-semibold text-gray-600">{item.name}</div>
              <div className="text-sm text-gray-500 ml-2.5">{item.type}</div>
              <div className={`text-sm px-2 py-1 rounded-xl ml-2.5 ${status.className}`}>{status.text}</div>
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 my-2.5 text-sm">
          {loadingMessage}
        </div>
      )}

      <div className="mt-5 flex justify-center">
        <Button variant="primary" onClick={onLoad} disabled={!canLoad || isLoading}>
          데이터 로드하기
        </Button>
      </div>
    </div>
  );
};

export default FileUploadSection;
