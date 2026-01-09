import React from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '../common';

interface LatexInputProps {
  value: string;
  onChange: (value: string) => void;
  onFileChange: (file: File) => void;
  versionOptions: string[];
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  showVersionSelect: boolean;
  jsonPreview: string | null;
}

const LatexInput: React.FC<LatexInputProps> = ({
  value,
  onChange,
  onFileChange,
  versionOptions,
  selectedVersion,
  onVersionChange,
  showVersionSelect,
  jsonPreview,
}) => {
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleInsertExample = () => {
    onChange(`$E=mc^2$ 와 같은 예시를 입력했습니다.

블록 수식 예시:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

분수: $\\frac{a}{b}$, 제곱근: $\\sqrt{x}$, 합: $\\sum_{i=1}^{n} x_i$`);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">
        LaTeX 입력 / JSON 업로드
      </div>
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 flex-wrap">
        <Button variant="primary" onClick={handleInsertExample}>
          예시 입력
        </Button>
        <Button onClick={handleClear}>지우기</Button>

        <input
          type="file"
          accept=".json"
          className="text-sm"
          onChange={handleFileInputChange}
        />

        {showVersionSelect && (
          <select
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
            value={selectedVersion}
            onChange={(e) => onVersionChange(e.target.value)}
          >
            {versionOptions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        )}
      </div>

      <textarea
        className="flex-1 p-3 border-none resize-none font-mono text-sm leading-relaxed focus:outline-none min-h-[200px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="여기에 LaTeX 코드를 입력하세요... (또는 JSON 파일을 업로드하세요)"
      />

      {jsonPreview && (
        <div className="max-h-[200px] overflow-auto border-t border-gray-200 bg-gray-50 p-3">
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">{jsonPreview}</pre>
        </div>
      )}
    </div>
  );
};

export default LatexInput;
