import React from 'react';
import { Dropdown } from '../../common';
import { BEHAVIOR_AREA_OPTIONS } from '../../../types';
import { escapeHtml } from '../../../utils/dataUtils';

interface BehaviorAreaProps {
  behaviorArea?: string;
  behaviorReason?: string;
  behaviorAreaConfirmed: string;
  onConfirmedChange: (value: string) => void;
}

const BehaviorArea: React.FC<BehaviorAreaProps> = ({
  behaviorArea,
  behaviorReason,
  behaviorAreaConfirmed,
  onConfirmedChange,
}) => {
  if (!behaviorArea && !behaviorReason) {
    return null;
  }

  const options = BEHAVIOR_AREA_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  return (
    <div className="mb-6 pb-5 border-b border-gray-200">
      <h3 className="text-gray-600 mb-3 text-lg pb-2 border-b-2 border-indigo-500">행동 영역</h3>
      {behaviorArea && (
        <div className="mb-3">
          <div className="font-semibold text-gray-500 mb-1 text-sm">영역</div>
          <div className="flex justify-between items-center gap-3 px-2 py-2.5 bg-gray-50 rounded">
            <div className="flex-1">{escapeHtml(behaviorArea)}</div>
            <div className="w-[260px] min-w-[260px]">
              <Dropdown
                options={options}
                value={behaviorAreaConfirmed}
                placeholder="미선택"
                onChange={onConfirmedChange}
              />
            </div>
          </div>
        </div>
      )}
      {behaviorReason && (
        <div className="mb-3">
          <div className="font-semibold text-gray-500 mb-1 text-sm">이유</div>
          <div className="text-gray-800 p-2 bg-gray-50 rounded leading-relaxed">{escapeHtml(behaviorReason)}</div>
        </div>
      )}
    </div>
  );
};

export default BehaviorArea;
