import { useState, useCallback } from 'react';
import type {
  MergedProblem,
  UnitKnowledge,
  UnitInfo,
  KnowledgeSearchState,
} from '../types';

interface UseProblemDataReturn {
  mergedData: MergedProblem[];
  setMergedData: React.Dispatch<React.SetStateAction<MergedProblem[]>>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  unitKnowledgeList: UnitKnowledge[];
  setUnitKnowledgeList: React.Dispatch<React.SetStateAction<UnitKnowledge[]>>;
  unitsData: Record<number, UnitInfo>;
  setUnitsData: React.Dispatch<React.SetStateAction<Record<number, UnitInfo>>>;
  knowledgeSearchStates: Record<number, KnowledgeSearchState>;
  getKnowledgeSearchState: (problemId: number) => KnowledgeSearchState;
  updateKnowledgeSearchState: (problemId: number, state: Partial<KnowledgeSearchState>) => void;
  setUnitNecessity: (problemIndex: number, unitIndex: number, value: boolean | null) => void;
  setKnowledgeNecessity: (problemIndex: number, unitIndex: number, knowledgeIndex: number, value: boolean | null) => void;
  setBehaviorAreaConfirmed: (problemIndex: number, value: string) => void;
  updateComment: (problemIndex: number, value: string) => void;
  addUnitFromSearch: (problemIndex: number) => void;
  removeUnitAdded: (problemIndex: number, addIndex: number, knowledgeIndex: number) => void;
  goToIndex: (index: number) => void;
  goToFirst: () => void;
  goToLast: () => void;
  changeProblem: (delta: number) => void;
  searchByProblemId: (problemId: number) => boolean;
}

export const useProblemData = (): UseProblemDataReturn => {
  const [mergedData, setMergedData] = useState<MergedProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unitKnowledgeList, setUnitKnowledgeList] = useState<UnitKnowledge[]>([]);
  const [unitsData, setUnitsData] = useState<Record<number, UnitInfo>>({});
  const [knowledgeSearchStates, setKnowledgeSearchStates] = useState<Record<number, KnowledgeSearchState>>({});

  const getKnowledgeSearchState = useCallback(
    (problemId: number): KnowledgeSearchState => {
      if (!knowledgeSearchStates[problemId]) {
        return {
          curriculum_name: '',
          unit_id: null,
          knowledge_id: null,
        };
      }
      return knowledgeSearchStates[problemId];
    },
    [knowledgeSearchStates]
  );

  const updateKnowledgeSearchState = useCallback(
    (problemId: number, state: Partial<KnowledgeSearchState>) => {
      setKnowledgeSearchStates((prev) => ({
        ...prev,
        [problemId]: {
          ...getKnowledgeSearchState(problemId),
          ...state,
        },
      }));
    },
    [getKnowledgeSearchState]
  );

  const setUnitNecessity = useCallback(
    (problemIndex: number, unitIndex: number, value: boolean | null) => {
      setMergedData((prev) => {
        const newData = [...prev];
        const problem = newData[problemIndex];
        if (problem?.unit_candidates?.[unitIndex]) {
          const candidate = problem.unit_candidates[unitIndex];
          candidate.unit_necessity = candidate.unit_necessity === value ? null : value;
        }
        return newData;
      });
    },
    []
  );

  const setKnowledgeNecessity = useCallback(
    (problemIndex: number, unitIndex: number, knowledgeIndex: number, value: boolean | null) => {
      setMergedData((prev) => {
        const newData = [...prev];
        const problem = newData[problemIndex];
        if (problem?.unit_candidates?.[unitIndex]) {
          const candidate = problem.unit_candidates[unitIndex];
          const knowledges = candidate.valid_knowledges || candidate.knowledges || [];
          if (knowledges[knowledgeIndex]) {
            const knowledge = knowledges[knowledgeIndex];
            knowledge.knowledge_necessity = knowledge.knowledge_necessity === value ? null : value;
          }
        }
        return newData;
      });
    },
    []
  );

  const setBehaviorAreaConfirmed = useCallback((problemIndex: number, value: string) => {
    setMergedData((prev) => {
      const newData = [...prev];
      if (newData[problemIndex]) {
        newData[problemIndex].behavior_area_confirmed = value || '';
      }
      return newData;
    });
  }, []);

  const updateComment = useCallback((problemIndex: number, value: string) => {
    setMergedData((prev) => {
      const newData = [...prev];
      if (newData[problemIndex]) {
        newData[problemIndex].comment = value || '';
      }
      return newData;
    });
  }, []);

  const addUnitFromSearch = useCallback(
    (problemIndex: number) => {
      setMergedData((prev) => {
        const newData = [...prev];
        const problem = newData[problemIndex];
        if (!problem) return prev;

        const state = getKnowledgeSearchState(problem.problem_id);
        if (!state.knowledge_id) {
          alert('추가할 개념을 먼저 선택해주세요.');
          return prev;
        }

        const match = unitKnowledgeList.find((item) => item.knowledge_id === state.knowledge_id);
        if (!match) {
          alert('선택한 개념에 해당하는 단원 정보를 찾을 수 없습니다.');
          return prev;
        }

        if (!Array.isArray(problem.unit_added)) {
          problem.unit_added = [];
        }

        let targetUnit = problem.unit_added.find((ua) => ua.unit_id === match.unit_id);
        if (!targetUnit) {
          targetUnit = {
            unit_id: match.unit_id,
            confidence_score: null,
            unit_necessity: null,
            valid_knowledges: [],
          };
          problem.unit_added.push(targetUnit);
        }

        const knowledges = targetUnit.valid_knowledges || targetUnit.knowledges || [];
        const already = knowledges.some((k) => k.knowledge_id === match.knowledge_id);
        if (!already) {
          knowledges.push({
            knowledge_id: match.knowledge_id,
            knowledge_name: match.knowledge_name,
            knowledge_necessity: null,
          });
          targetUnit.valid_knowledges = knowledges;
        }

        return newData;
      });
    },
    [unitKnowledgeList, getKnowledgeSearchState]
  );

  const removeUnitAdded = useCallback(
    (problemIndex: number, addIndex: number, knowledgeIndex: number) => {
      setMergedData((prev) => {
        const newData = [...prev];
        const problem = newData[problemIndex];
        if (!problem || !Array.isArray(problem.unit_added)) return prev;

        const target = problem.unit_added[addIndex];
        if (!target) return prev;

        const knowledges = target.valid_knowledges || target.knowledges || [];
        if (knowledges[knowledgeIndex]) {
          knowledges.splice(knowledgeIndex, 1);
          if (target.valid_knowledges) target.valid_knowledges = knowledges;
          if (target.knowledges) target.knowledges = knowledges;
        }

        if (knowledges.length === 0) {
          problem.unit_added.splice(addIndex, 1);
        }

        return newData;
      });
    },
    []
  );

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < mergedData.length) {
        setCurrentIndex(index);
      }
    },
    [mergedData.length]
  );

  const goToFirst = useCallback(() => {
    if (mergedData.length > 0) {
      setCurrentIndex(0);
    }
  }, [mergedData.length]);

  const goToLast = useCallback(() => {
    if (mergedData.length > 0) {
      setCurrentIndex(mergedData.length - 1);
    }
  }, [mergedData.length]);

  const changeProblem = useCallback(
    (delta: number) => {
      const newIndex = currentIndex + delta;
      if (newIndex >= 0 && newIndex < mergedData.length) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex, mergedData.length]
  );

  const searchByProblemId = useCallback(
    (problemId: number): boolean => {
      const index = mergedData.findIndex((item) => item.problem_id === problemId);
      if (index !== -1) {
        setCurrentIndex(index);
        return true;
      }
      return false;
    },
    [mergedData]
  );

  return {
    mergedData,
    setMergedData,
    currentIndex,
    setCurrentIndex,
    unitKnowledgeList,
    setUnitKnowledgeList,
    unitsData,
    setUnitsData,
    knowledgeSearchStates,
    getKnowledgeSearchState,
    updateKnowledgeSearchState,
    setUnitNecessity,
    setKnowledgeNecessity,
    setBehaviorAreaConfirmed,
    updateComment,
    addUnitFromSearch,
    removeUnitAdded,
    goToIndex,
    goToFirst,
    goToLast,
    changeProblem,
    searchByProblemId,
  };
};
