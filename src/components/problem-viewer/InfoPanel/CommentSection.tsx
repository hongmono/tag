import React from 'react';

interface CommentSectionProps {
  comment: string;
  onChange: (value: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comment, onChange }) => {
  return (
    <div className="mt-5 pt-5 border-t border-gray-200">
      <h3 className="text-gray-600 mb-3 text-lg pb-2 border-b-2 border-indigo-500">검수 코멘트</h3>
      <textarea
        className="w-full min-h-[100px] p-2.5 border border-gray-300 rounded font-inherit text-sm leading-relaxed resize-y focus:outline-none focus:border-indigo-500"
        value={comment}
        onChange={(e) => onChange(e.target.value)}
        placeholder="코멘트를 입력하세요..."
      />
    </div>
  );
};

export default CommentSection;
