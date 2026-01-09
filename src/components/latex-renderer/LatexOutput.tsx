import React, { useEffect, useRef } from 'react';
import { renderKatex } from '../../utils/katexUtils';

interface LatexOutputProps {
  content: string;
  generatable: boolean | null;
}

const LatexOutput: React.FC<LatexOutputProps> = ({ content, generatable }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      renderKatex(outputRef.current);
    }
  }, [content]);

  const copyOutput = () => {
    if (outputRef.current) {
      const range = document.createRange();
      range.selectNode(outputRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      try {
        document.execCommand('copy');
        alert('렌더링된 결과가 클립보드에 복사되었습니다!');
      } catch {
        alert('복사에 실패했습니다.');
      }
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 py-3 px-4 border-b border-gray-200 font-semibold text-gray-600 flex justify-between items-center">
        렌더링 결과
        <button
          className="px-3 py-1.5 bg-indigo-500 text-white text-sm rounded cursor-pointer hover:bg-indigo-600 transition-colors"
          onClick={copyOutput}
        >
          결과 복사
        </button>
      </div>

      {generatable !== null && (
        <div className="flex items-center gap-2 p-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Twin 생성 가능 여부:</span>
          <span
            className={`px-2 py-0.5 rounded text-sm font-semibold ${
              generatable
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            GENERATABLE: {generatable ? 'TRUE' : 'FALSE'}
          </span>
        </div>
      )}

      <div className="flex-1 p-4 overflow-auto" ref={outputRef}>
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p className="text-gray-400 italic">
            왼쪽에 LaTeX 코드를 입력하거나 JSON 파일을 업로드하면 여기에 렌더링된 결과가 표시됩니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default LatexOutput;
