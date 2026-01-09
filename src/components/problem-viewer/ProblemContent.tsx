import React, { useEffect, useRef } from 'react';
import type { ProblemHtml } from '../../types';
import { renderKatex } from '../../utils/katexUtils';

interface ProblemContentProps {
  problemHtml: ProblemHtml;
}

const ProblemContent: React.FC<ProblemContentProps> = ({ problemHtml }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      renderKatex(contentRef.current);
    }
  }, [problemHtml]);

  const hasContent =
    problemHtml.question_html ||
    problemHtml.choice_html ||
    problemHtml.explanation_html ||
    problemHtml.correct_answer_html;

  return (
    <div className="border-r border-gray-200 flex flex-col min-h-0 max-lg:border-r-0 max-lg:border-b">
      <div className="bg-gray-50 py-4 px-5 border-b border-gray-200 font-semibold text-gray-600">문제 내용</div>
      <div className="flex-1 p-5 overflow-y-auto bg-white min-h-0 [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:border-collapse [&_table]:my-2.5 [&_table_td]:p-1.5" ref={contentRef}>
        {hasContent ? (
          <>
            {problemHtml.question_html && (
              <div className="mb-5">
                <h3 className="mb-2.5">문제</h3>
                <div dangerouslySetInnerHTML={{ __html: problemHtml.question_html }} />
              </div>
            )}
            {problemHtml.choice_html && (
              <div className="mb-5">
                <h3 className="mb-2.5">선택지</h3>
                <div dangerouslySetInnerHTML={{ __html: problemHtml.choice_html }} />
              </div>
            )}
            {problemHtml.explanation_html && (
              <div className="mb-5">
                <h3 className="mb-2.5">해설</h3>
                <div dangerouslySetInnerHTML={{ __html: problemHtml.explanation_html }} />
              </div>
            )}
            {problemHtml.correct_answer_html && (
              <div className="mb-5">
                <h3 className="mb-2.5">정답</h3>
                <div dangerouslySetInnerHTML={{ __html: problemHtml.correct_answer_html }} />
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">문제 내용이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ProblemContent;
