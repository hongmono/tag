import React, { useEffect, useRef } from 'react';
import type { MergedProblem, UnitKnowledge, UnitInfo, KnowledgeSearchState } from '../../../types';
import { renderKatex } from '../../../utils/katexUtils';
import { Button } from '../../common';
import BehaviorArea from './BehaviorArea';
import UnitCandidates from './UnitCandidates';
import KnowledgeSearch from './KnowledgeSearch';
import CriteriaSection from './CriteriaSection';
import CommentSection from './CommentSection';

interface InfoPanelProps {
  problem: MergedProblem;
  problemIndex: number;
  unitKnowledgeList: UnitKnowledge[];
  unitsData: Record<number, UnitInfo>;
  knowledgeSearchState: KnowledgeSearchState;
  canSave: boolean;
  onSetUnitNecessity: (unitIndex: number, value: boolean) => void;
  onSetKnowledgeNecessity: (unitIndex: number, knowledgeIndex: number, value: boolean) => void;
  onSetBehaviorAreaConfirmed: (value: string) => void;
  onUpdateComment: (value: string) => void;
  onSelectCurriculum: (value: string) => void;
  onSelectUnit: (unitId: number | null) => void;
  onSelectKnowledge: (knowledgeId: number | null) => void;
  onAddUnitFromSearch: () => void;
  onRemoveUnitAdded: (addIndex: number, knowledgeIndex: number) => void;
  onSave: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  problem,
  unitKnowledgeList,
  unitsData,
  knowledgeSearchState,
  canSave,
  onSetUnitNecessity,
  onSetKnowledgeNecessity,
  onSetBehaviorAreaConfirmed,
  onUpdateComment,
  onSelectCurriculum,
  onSelectUnit,
  onSelectKnowledge,
  onAddUnitFromSearch,
  onRemoveUnitAdded,
  onSave,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      renderKatex(contentRef.current);
    }
  }, [problem]);

  return (
    <div className="flex flex-col min-h-0">
      <div className="bg-gray-50 py-4 px-5 border-b border-gray-200 font-semibold text-gray-600">문제 정보</div>
      <div className="flex-1 p-5 overflow-y-auto bg-white min-h-0" ref={contentRef}>
        {/* 문제 정보 */}
        <div className="mb-6 pb-5 border-b border-gray-200">
          <h3 className="text-gray-600 mb-3 text-lg pb-2 border-b-2 border-indigo-500">문제 정보</h3>
          <div className="mb-3">
            <div className="font-semibold text-gray-500 mb-1 text-sm">문항ID</div>
            <div className="text-gray-800 p-2 bg-gray-50 rounded leading-relaxed">{problem.problem_id}</div>
          </div>
        </div>

        {/* 행동 영역 */}
        <BehaviorArea
          behaviorArea={problem.behavior_area}
          behaviorReason={problem.behavior_reason}
          behaviorAreaConfirmed={problem.behavior_area_confirmed || ''}
          onConfirmedChange={onSetBehaviorAreaConfirmed}
        />

        {/* 단원 후보 */}
        <UnitCandidates
          unitCandidates={problem.unit_candidates}
          unitAdded={problem.unit_added}
          criteria={problem.criteria}
          unitsData={unitsData}
          onSetUnitNecessity={onSetUnitNecessity}
          onSetKnowledgeNecessity={onSetKnowledgeNecessity}
          onRemoveUnitAdded={onRemoveUnitAdded}
        />

        {/* 지식 검색 */}
        {(problem.unit_candidates.length > 0 || problem.unit_added.length > 0) && (
          <KnowledgeSearch
            unitKnowledgeList={unitKnowledgeList}
            searchState={knowledgeSearchState}
            onSelectCurriculum={onSelectCurriculum}
            onSelectUnit={onSelectUnit}
            onSelectKnowledge={onSelectKnowledge}
            onAdd={onAddUnitFromSearch}
          />
        )}

        {/* 기준 섹션 */}
        <CriteriaSection criteria={problem.criteria} unitsData={unitsData} />

        {/* 코멘트 섹션 */}
        <CommentSection comment={problem.comment} onChange={onUpdateComment} />

        {/* 저장 섹션 */}
        {canSave && (
          <div className="mt-5 p-4 bg-gray-50 rounded-md text-center">
            <Button variant="save" onClick={onSave}>
              결과 저장
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
