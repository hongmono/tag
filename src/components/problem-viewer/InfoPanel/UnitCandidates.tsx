import React from 'react';
import type { UnitCandidate, Criteria, UnitInfo } from '../../../types';
import { escapeHtml } from '../../../utils/dataUtils';
import NecessityControls from './NecessityControls';

interface UnitCandidatesProps {
  unitCandidates: UnitCandidate[];
  unitAdded: UnitCandidate[];
  criteria: Criteria[];
  unitsData: Record<number, UnitInfo>;
  onSetUnitNecessity: (unitIndex: number, value: boolean) => void;
  onSetKnowledgeNecessity: (unitIndex: number, knowledgeIndex: number, value: boolean) => void;
  onRemoveUnitAdded: (addIndex: number, knowledgeIndex: number) => void;
}

const UnitCandidates: React.FC<UnitCandidatesProps> = ({
  unitCandidates,
  unitAdded,
  criteria,
  unitsData,
  onSetUnitNecessity,
  onSetKnowledgeNecessity,
  onRemoveUnitAdded,
}) => {
  const criteriaKnowledgeMap: Record<number, boolean> = {};
  criteria.forEach((item) => {
    if (item.knowledge_id && item.knowledge_checked !== undefined) {
      criteriaKnowledgeMap[item.knowledge_id] = item.knowledge_checked;
    }
  });

  if (unitCandidates.length === 0 && unitAdded.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 pb-5 border-b border-gray-200">
      <h3 className="text-gray-600 mb-3 text-lg pb-2 border-b-2 border-indigo-500">단원 후보</h3>

      {unitCandidates.map((candidate, unitIdx) => {
        const knowledges = candidate.valid_knowledges || candidate.knowledges || [];

        return (
          <div key={`candidate-${unitIdx}`} className="p-2.5 mb-2.5 border border-gray-200 rounded-md bg-gray-50">
            <div className="flex justify-between items-center gap-3 mb-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="font-semibold text-gray-600">{escapeHtml(candidate.unit_name || '알 수 없음')}</span>
                <span className="text-sm text-gray-500">{escapeHtml(candidate.curriculum_name || '')}</span>
                <span className="bg-indigo-500 text-white px-2 py-0.5 rounded-xl text-sm">
                  신뢰도: {candidate.confidence_score ? (candidate.confidence_score * 100).toFixed(2) + '%' : 'N/A'}
                </span>
              </div>
              <NecessityControls
                value={candidate.unit_necessity ?? null}
                onSetTrue={() => onSetUnitNecessity(unitIdx, true)}
                onSetFalse={() => onSetUnitNecessity(unitIdx, false)}
              />
            </div>

            {knowledges.map((knowledge, knowIdx) => {
              const knowledgeChecked = criteriaKnowledgeMap[knowledge.knowledge_id] || false;

              return (
                <div key={`knowledge-${knowIdx}`} className="mt-2 p-2 bg-white border-l-[3px] border-indigo-500 ml-2.5">
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex-1 font-semibold text-gray-600 inline-flex items-center gap-1.5">
                      <span>{escapeHtml(knowledge.knowledge_name || '알 수 없음')}</span>
                      {knowledgeChecked && <span className="text-lg">✅</span>}
                    </div>
                    <NecessityControls
                      value={knowledge.knowledge_necessity ?? null}
                      onSetTrue={() => onSetKnowledgeNecessity(unitIdx, knowIdx, true)}
                      onSetFalse={() => onSetKnowledgeNecessity(unitIdx, knowIdx, false)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {unitAdded.map((ua, addIdx) => {
        const unitInfo = unitsData[ua.unit_id] || {};
        const knowledgesAdded = ua.valid_knowledges || ua.knowledges || [];

        return (
          <div key={`added-${addIdx}`} className="p-2.5 mb-2.5 border border-red-500 rounded-md bg-gray-50">
            <div className="flex justify-between items-center gap-3 mb-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="font-semibold text-gray-600">{escapeHtml(unitInfo.unit_name || '알 수 없음')}</span>
                <span className="text-sm text-gray-500">{escapeHtml(unitInfo.curriculum_name || '')}</span>
              </div>
            </div>

            {knowledgesAdded.map((k, kIdx) => {
              const knowledgeChecked = criteriaKnowledgeMap[k.knowledge_id] || false;

              return (
                <div key={`added-knowledge-${kIdx}`} className="mt-2 p-2 bg-white border-l-[3px] border-red-500 ml-2.5 flex justify-between items-center gap-3">
                  <div className="font-semibold text-gray-600 inline-flex items-center gap-1.5">
                    <span>{escapeHtml(k.knowledge_name || '알 수 없음')}</span>
                    {knowledgeChecked && <span className="text-lg">✅</span>}
                  </div>
                  <button
                    type="button"
                    className="border border-red-500 bg-white text-red-500 px-2.5 py-1 rounded-xl cursor-pointer text-sm hover:bg-red-500 hover:text-white transition-all"
                    onClick={() => onRemoveUnitAdded(addIdx, kIdx)}
                  >
                    삭제
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default UnitCandidates;
