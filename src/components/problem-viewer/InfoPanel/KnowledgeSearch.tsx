import React from 'react';
import { Dropdown } from '../../common';
import type { UnitKnowledge, KnowledgeSearchState } from '../../../types';

interface KnowledgeSearchProps {
  unitKnowledgeList: UnitKnowledge[];
  searchState: KnowledgeSearchState;
  onSelectCurriculum: (value: string) => void;
  onSelectUnit: (unitId: number | null) => void;
  onSelectKnowledge: (knowledgeId: number | null) => void;
  onAdd: () => void;
}

const KnowledgeSearch: React.FC<KnowledgeSearchProps> = ({
  unitKnowledgeList,
  searchState,
  onSelectCurriculum,
  onSelectUnit,
  onSelectKnowledge,
  onAdd,
}) => {
  if (!unitKnowledgeList || unitKnowledgeList.length === 0) {
    return null;
  }

  const getFilteredList = () => {
    let list = unitKnowledgeList;
    if (searchState.curriculum_name) {
      list = list.filter((item) => item.curriculum_name === searchState.curriculum_name);
    }
    if (searchState.unit_id) {
      list = list.filter((item) => item.unit_id === searchState.unit_id);
    }
    if (searchState.knowledge_id) {
      list = list.filter((item) => item.knowledge_id === searchState.knowledge_id);
    }
    return list;
  };

  const filteredList = getFilteredList();

  const curriculumOptions: { value: string; label: string }[] = [];
  const seenCurriculums = new Set<string>();
  filteredList.forEach((item) => {
    if (!seenCurriculums.has(item.curriculum_name)) {
      seenCurriculums.add(item.curriculum_name);
      curriculumOptions.push({ value: item.curriculum_name, label: item.curriculum_name });
    }
  });

  const unitOptions: { value: string; label: string }[] = [];
  const seenUnits = new Set<number>();
  filteredList.forEach((item) => {
    if (!seenUnits.has(item.unit_id)) {
      seenUnits.add(item.unit_id);
      unitOptions.push({ value: String(item.unit_id), label: item.unit_name });
    }
  });

  const knowledgeOptions: { value: string; label: string }[] = [];
  const seenKnowledges = new Set<number>();
  filteredList.forEach((item) => {
    if (!seenKnowledges.has(item.knowledge_id)) {
      seenKnowledges.add(item.knowledge_id);
      knowledgeOptions.push({ value: String(item.knowledge_id), label: item.knowledge_name });
    }
  });

  return (
    <div className="mt-4 mb-6">
      <div className="grid grid-cols-[1fr_1fr_1fr_40px] gap-2.5 items-end w-full">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-sm text-gray-500 whitespace-nowrap leading-6">교육과정</div>
          <Dropdown
            options={curriculumOptions}
            value={searchState.curriculum_name || ''}
            placeholder="교육과정 선택"
            onChange={(val) => onSelectCurriculum(val)}
            searchable
          />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-sm text-gray-500 whitespace-nowrap leading-6">단원</div>
          <Dropdown
            options={unitOptions}
            value={searchState.unit_id ? String(searchState.unit_id) : ''}
            placeholder="단원 선택"
            onChange={(val) => onSelectUnit(val ? parseInt(val, 10) : null)}
            searchable
          />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-sm text-gray-500 whitespace-nowrap leading-6">개념</div>
          <Dropdown
            options={knowledgeOptions}
            value={searchState.knowledge_id ? String(searchState.knowledge_id) : ''}
            placeholder="개념 선택"
            onChange={(val) => onSelectKnowledge(val ? parseInt(val, 10) : null)}
            searchable
          />
        </div>

        <div className="w-10 min-w-10 max-w-10">
          <button
            type="button"
            className="w-10 h-10 border border-green-500 bg-white text-green-500 text-2xl rounded-full cursor-pointer flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"
            onClick={onAdd}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSearch;
