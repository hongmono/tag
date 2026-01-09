import { useState, useCallback } from 'react';
import type { SelectedFiles, CombinedInputData, ResultData, Criteria, UnitKnowledge } from '../types';
import { identifyFileType, readTextFile, readJsonFile, parseJsonl } from '../utils/fileUtils';

interface UseFileHandlingReturn {
  selectedFiles: SelectedFiles;
  isLoading: boolean;
  loadingMessage: string;
  resultsFileHandle: FileSystemFileHandle | null;
  handleFilesSelected: (files: FileList) => void;
  canLoad: boolean;
  loadAllFiles: () => Promise<{
    combinedInputData: CombinedInputData[];
    resultsData: ResultData[];
    criteriaData: Criteria[];
    unitKnowledgeList: UnitKnowledge[];
  } | null>;
  enableEditMode: () => Promise<boolean>;
  saveResultsFile: (content: string) => Promise<boolean>;
}

export const useFileHandling = (): UseFileHandlingReturn => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFiles>({
    combined: null,
    results: null,
    criteria: null,
    unitKnowledge: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [resultsFileHandle, setResultsFileHandle] = useState<FileSystemFileHandle | null>(null);

  const handleFilesSelected = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      const fileType = identifyFileType(file.name);
      if (fileType) {
        setSelectedFiles((prev) => ({
          ...prev,
          [fileType]: file,
        }));
      }
    });
  }, []);

  const canLoad = Boolean(selectedFiles.combined && selectedFiles.results && selectedFiles.unitKnowledge);

  const loadAllFiles = useCallback(async () => {
    if (!canLoad) return null;

    setIsLoading(true);
    try {
      // combined_input.jsonl 로드
      setLoadingMessage('combined_input.jsonl 처리 중...');
      const combinedText = await readTextFile(selectedFiles.combined!);
      const combinedInputData = parseJsonl<CombinedInputData>(combinedText);

      // results.jsonl 로드
      setLoadingMessage('results.jsonl 처리 중...');
      const resultsText = await readTextFile(selectedFiles.results!);
      const resultsData = parseJsonl<ResultData>(resultsText);

      // unitKnowledge.json 로드
      setLoadingMessage('unitKnowledge.json 처리 중...');
      const ukJson = await readJsonFile<Record<string, UnitKnowledge[]>>(selectedFiles.unitKnowledge!);
      const unitKnowledgeList = Object.values(ukJson)[0] || [];

      // criteria.jsonl 로드 (선택사항)
      let criteriaData: Criteria[] = [];
      if (selectedFiles.criteria) {
        setLoadingMessage('criteria.jsonl 처리 중...');
        const criteriaText = await readTextFile(selectedFiles.criteria);
        criteriaData = parseJsonl<Criteria>(criteriaText);
      }

      setLoadingMessage('데이터 조인 중...');

      return {
        combinedInputData,
        resultsData,
        criteriaData,
        unitKnowledgeList,
      };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [canLoad, selectedFiles]);

  const enableEditMode = useCallback(async (): Promise<boolean> => {
    if (!('showOpenFilePicker' in window)) {
      alert('File System Access API가 지원되지 않습니다. Chrome/Edge 브라우저를 사용하세요.');
      return false;
    }

    try {
      const [fileHandle] = await (window as unknown as { showOpenFilePicker: (options: object) => Promise<FileSystemFileHandle[]> }).showOpenFilePicker({
        types: [
          {
            description: 'JSONL files',
            accept: { 'application/jsonl': ['.jsonl'] },
          },
        ],
        multiple: false,
      });

      if (fileHandle) {
        setResultsFileHandle(fileHandle);
        return true;
      }
    } catch (err) {
      const error = err as Error;
      if (error.name !== 'AbortError') {
        alert('파일 열기 오류: ' + error.message);
        console.error('파일 열기 오류:', error);
      }
    }
    return false;
  }, []);

  const saveResultsFile = useCallback(
    async (content: string): Promise<boolean> => {
      if (!resultsFileHandle) {
        alert('파일 핸들이 없습니다. Chrome/Edge에서 파일을 다시 열어주세요.');
        return false;
      }

      try {
        const writable = await resultsFileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        return true;
      } catch (error) {
        alert('파일 저장 중 오류가 발생했습니다: ' + (error as Error).message);
        console.error('Save error:', error);
        return false;
      }
    },
    [resultsFileHandle]
  );

  return {
    selectedFiles,
    isLoading,
    loadingMessage,
    resultsFileHandle,
    handleFilesSelected,
    canLoad,
    loadAllFiles,
    enableEditMode,
    saveResultsFile,
  };
};
