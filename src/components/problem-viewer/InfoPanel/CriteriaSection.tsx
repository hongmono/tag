import React from 'react';
import type { Criteria, UnitInfo } from '../../../types';
import { escapeHtml } from '../../../utils/dataUtils';

interface CriteriaSectionProps {
  criteria: Criteria[];
  unitsData: Record<number, UnitInfo>;
}

const CriteriaSection: React.FC<CriteriaSectionProps> = ({ criteria, unitsData }) => {
  if (!criteria || criteria.length === 0) {
    return null;
  }

  const categoryNames: string[] = [];
  const seenCategories = new Set<string>();
  criteria.forEach((item) => {
    if (item.category_base_name && !seenCategories.has(item.category_base_name)) {
      seenCategories.add(item.category_base_name);
      categoryNames.push(item.category_base_name);
    }
  });

  const unitGroups: Record<
    number,
    {
      unit_id: number;
      unit_name: string;
      curriculum_name: string;
      knowledges: { knowledge_id: number; knowledge_name: string; knowledge_checked: boolean }[];
    }
  > = {};

  criteria.forEach((item) => {
    const unitId = item.unit_id;
    if (!unitGroups[unitId]) {
      const unitInfo = unitsData[unitId] || {};
      unitGroups[unitId] = {
        unit_id: unitId,
        unit_name: unitInfo.unit_name || '알 수 없음',
        curriculum_name: unitInfo.curriculum_name || '알 수 없음',
        knowledges: [],
      };
    }

    const knowledgeExists = unitGroups[unitId].knowledges.some((k) => k.knowledge_id === item.knowledge_id);
    if (!knowledgeExists && item.knowledge_id) {
      unitGroups[unitId].knowledges.push({
        knowledge_id: item.knowledge_id,
        knowledge_name: item.knowledge_name,
        knowledge_checked: item.knowledge_checked || false,
      });
    }
  });

  return (
    <>
      {categoryNames.length > 0 && (
        <div className="mb-6 pb-5 border-b border-gray-200">
          <h3 className="text-indigo-500 mb-3 text-lg pb-2 border-b-2 border-indigo-500">통합 유형</h3>
          {categoryNames.map((name, idx) => (
            <div key={idx} className="text-gray-800 p-2 bg-gray-50 rounded leading-relaxed mb-2">
              {escapeHtml(name)}
            </div>
          ))}
        </div>
      )}

      {Object.keys(unitGroups).length > 0 && (
        <div className="mb-6 pb-5 border-b border-gray-200 last:border-b-0">
          <h3 className="text-indigo-500 mb-3 text-lg pb-2 border-b-2 border-indigo-500">DB 기준</h3>
          {Object.values(unitGroups).map((unit) => (
            <div key={unit.unit_id} className="p-2.5 mb-2.5 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-600">{escapeHtml(unit.unit_name)}</span>
                  <span className="text-sm text-gray-500">{escapeHtml(unit.curriculum_name)}</span>
                </div>
              </div>

              {unit.knowledges.map((knowledge) => (
                <div key={knowledge.knowledge_id} className="mt-2 p-2 bg-white border-l-[3px] border-indigo-500 ml-2.5">
                  <div className="font-semibold text-gray-600 inline-flex items-center gap-1.5">
                    <span>{escapeHtml(knowledge.knowledge_name || '알 수 없음')}</span>
                    {knowledge.knowledge_checked && <span className="text-lg">✅</span>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CriteriaSection;
