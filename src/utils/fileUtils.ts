// 파일명으로 파일 타입 자동 구분
export const identifyFileType = (fileName: string): 'combined' | 'results' | 'criteria' | 'unitKnowledge' | null => {
  const name = fileName.toLowerCase();

  if (name.includes('combined') && name.includes('input') && name.endsWith('.jsonl')) {
    return 'combined';
  } else if (name.includes('results') && name.endsWith('.jsonl')) {
    return 'results';
  } else if (name.includes('criteria') && name.endsWith('.jsonl')) {
    return 'criteria';
  } else if ((name.includes('unitknowledge') || name.includes('unit_knowledge')) && name.endsWith('.json')) {
    return 'unitKnowledge';
  }
  return null;
};

// 파일을 텍스트로 읽기
export const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsText(file, 'utf-8');
  });
};

// 파일을 JSON으로 읽기
export const readJsonFile = <T>(file: File): Promise<T> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target?.result as string) as T);
      } catch (err) {
        reject(new Error('JSON 파싱 실패: ' + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsText(file, 'utf-8');
  });
};

// JSONL 파싱
export const parseJsonl = <T>(text: string): T[] => {
  return text
    .trim()
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      try {
        return JSON.parse(line) as T;
      } catch {
        console.warn('JSON 파싱 오류:', line);
        return null;
      }
    })
    .filter((item): item is T => item !== null);
};

// File System Access API 지원 확인
export const isFileSystemAccessSupported = (): boolean => {
  return 'showOpenFilePicker' in window;
};
