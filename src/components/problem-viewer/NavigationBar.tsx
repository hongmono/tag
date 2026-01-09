import React, { useState } from 'react';
import { Button } from '../common';

interface NavigationBarProps {
  currentIndex: number;
  totalCount: number;
  onFirst: () => void;
  onPrev10: () => void;
  onPrev: () => void;
  onNext: () => void;
  onNext10: () => void;
  onLast: () => void;
  onGoToIndex: (index: number) => void;
  onSearchByProblemId: (problemId: number) => boolean;
  onEnableEditMode: () => void;
  isEditModeEnabled: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentIndex,
  totalCount,
  onFirst,
  onPrev10,
  onPrev,
  onNext,
  onNext10,
  onLast,
  onGoToIndex,
  onSearchByProblemId,
  onEnableEditMode,
  isEditModeEnabled,
}) => {
  const [indexInput, setIndexInput] = useState('');
  const [problemIdInput, setProblemIdInput] = useState('');

  const handleIndexSearch = () => {
    const index = parseInt(indexInput);
    if (index >= 1 && index <= totalCount) {
      onGoToIndex(index - 1);
      setIndexInput('');
    } else {
      alert(`올바른 번호를 입력하세요 (1-${totalCount})`);
    }
  };

  const handleProblemIdSearch = () => {
    const problemId = parseInt(problemIdInput);
    if (!problemId || isNaN(problemId)) {
      alert('올바른 Problem ID를 입력하세요');
      return;
    }

    const found = onSearchByProblemId(problemId);
    if (found) {
      setProblemIdInput('');
    } else {
      alert(`Problem ID ${problemId}를 찾을 수 없습니다`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="bg-gray-50 py-4 px-8 border-b border-gray-200 flex items-center justify-between gap-5 flex-wrap">
      <div className="flex items-center gap-2.5">
        <Button variant="nav" onClick={onFirst} disabled={currentIndex === 0}>
          ⏮ 맨 앞
        </Button>
        <Button variant="nav" onClick={onPrev10} disabled={currentIndex === 0}>
          ⏪ 10개 앞
        </Button>
        <Button variant="nav" onClick={onPrev} disabled={currentIndex === 0}>
          ◀ 이전
        </Button>
        <div className="font-semibold text-gray-600 min-w-[150px] text-center">
          {currentIndex + 1} / {totalCount}
        </div>
        <Button variant="nav" onClick={onNext} disabled={currentIndex === totalCount - 1}>
          다음 ▶
        </Button>
        <Button variant="nav" onClick={onNext10} disabled={currentIndex >= totalCount - 1}>
          10개 뒤 ⏩
        </Button>
        <Button variant="nav" onClick={onLast} disabled={currentIndex === totalCount - 1}>
          맨 뒤 ⏭
        </Button>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-sm text-gray-500">번호:</span>
        <input
          type="number"
          className="px-3 py-1.5 border border-gray-300 rounded text-sm w-[120px]"
          placeholder="번호 입력"
          min="1"
          value={indexInput}
          onChange={(e) => setIndexInput(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleIndexSearch)}
        />
        <button
          className="px-3 py-1.5 border border-gray-300 bg-white rounded text-sm cursor-pointer hover:bg-gray-100"
          onClick={handleIndexSearch}
        >
          이동
        </button>

        <span className="text-sm text-gray-500 ml-4">Problem ID:</span>
        <input
          type="number"
          className="px-3 py-1.5 border border-gray-300 rounded text-sm w-[120px]"
          placeholder="ID 입력"
          value={problemIdInput}
          onChange={(e) => setProblemIdInput(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleProblemIdSearch)}
        />
        <button
          className="px-3 py-1.5 border border-gray-300 bg-white rounded text-sm cursor-pointer hover:bg-gray-100"
          onClick={handleProblemIdSearch}
        >
          검색
        </button>

        <button
          className={`ml-4 px-3 py-1.5 rounded text-sm cursor-pointer transition-all ${
            isEditModeEnabled
              ? 'bg-gray-400 text-white border-gray-400 opacity-70 cursor-not-allowed'
              : 'bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600'
          }`}
          onClick={onEnableEditMode}
          disabled={isEditModeEnabled}
        >
          {isEditModeEnabled ? '✓ 편집 모드 활성화됨' : '편집 모드로 열기'}
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
