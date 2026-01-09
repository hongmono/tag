import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '../common';
import LatexInput from './LatexInput';
import LatexOutput from './LatexOutput';
import type { LatexJsonData } from '../../types';
import { readJsonFile } from '../../utils/fileUtils';

const LatexRenderer: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [outputContent, setOutputContent] = useState('');
  const [jsonData, setJsonData] = useState<LatexJsonData | null>(null);
  const [versionOptions, setVersionOptions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [jsonPreview, setJsonPreview] = useState<string | null>(null);
  const [generatable, setGeneratable] = useState<boolean | null>(null);

  // 일반 텍스트 입력 시 렌더링
  useEffect(() => {
    if (!jsonData) {
      // 백슬래시 처리
      const processed = inputValue.replace(/\\\\/g, '\\');
      setOutputContent(processed);
      setGeneratable(null);
    }
  }, [inputValue, jsonData]);

  // JSON 버전 선택 시 렌더링
  useEffect(() => {
    if (jsonData && selectedVersion) {
      const block = jsonData[selectedVersion as keyof LatexJsonData] as Record<string, string> | undefined;
      if (block && typeof block === 'object') {
        const fields = ['question', 'choice', 'answer', 'explanation'];
        let html = '';
        fields.forEach((f) => {
          if (block[f]) {
            html += `<div class="font-semibold my-3 mb-1">${f}</div><div>${block[f]}</div>`;
          }
        });
        setOutputContent(html);
      }
    }
  }, [jsonData, selectedVersion]);

  const handleFileChange = useCallback(async (file: File) => {
    try {
      const data = await readJsonFile<LatexJsonData>(file);
      setJsonData(data);
      setJsonPreview(JSON.stringify(data, null, 2));

      // 버전 옵션 설정
      const versions: string[] = [];
      if (data.origin_version) versions.push('origin_version');
      if (data.instantiated_version) versions.push('instantiated_version');
      setVersionOptions(versions);

      if (versions.length > 0) {
        setSelectedVersion(versions[0]);
      }

      // generatable 상태 설정
      if (typeof data.generatable === 'boolean') {
        setGeneratable(data.generatable);
      } else {
        setGeneratable(null);
      }
    } catch {
      alert('유효한 JSON 파일이 아닙니다.');
      setJsonData(null);
      setVersionOptions([]);
      setJsonPreview(null);
      setGeneratable(null);
    }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    // 직접 입력 시 JSON 데이터 초기화
    setJsonData(null);
    setVersionOptions([]);
    setJsonPreview(null);
    setGeneratable(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-5">
      <Header title="LaTeX to KaTeX Renderer" subtitle="실시간으로 LaTeX 수식을 렌더링해보세요" />

      <div className="mb-5 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-600 mb-2">사용 예시:</h4>
        <div className="text-gray-600 leading-relaxed">
          • 인라인 수식: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$E = mc^2$</code> 또는 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">\(E = mc^2\)</code>
          <br />
          • 블록 수식: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$$\int_&#123;-\infty&#125;^&#123;\infty&#125; e^&#123;-x^2&#125; dx = \sqrt&#123;\pi&#125;$$</code>
          <br />
          • 분수: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">\frac&#123;a&#125;&#123;b&#125;</code>, 제곱근: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">\sqrt&#123;x&#125;</code>, 합: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">\sum_&#123;i=1&#125;^&#123;n&#125;</code>
        </div>
      </div>

      <div className="flex flex-1 gap-5 min-h-0">
        <LatexInput
          value={inputValue}
          onChange={handleInputChange}
          onFileChange={handleFileChange}
          versionOptions={versionOptions}
          selectedVersion={selectedVersion}
          onVersionChange={setSelectedVersion}
          showVersionSelect={versionOptions.length > 0}
          jsonPreview={jsonPreview}
        />
        <LatexOutput content={outputContent} generatable={generatable} />
      </div>
    </div>
  );
};

export default LatexRenderer;
