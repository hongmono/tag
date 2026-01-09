import type {
  CombinedInputData,
  ResultData,
  Criteria,
  UnitKnowledge,
  UnitInfo,
  MergedProblem,
  UnitCandidate,
} from '../types';

// Unit 정보 맵 생성
export const createUnitsMap = (unitKnowledgeList: UnitKnowledge[]): Record<number, UnitInfo> => {
  const unitsData: Record<number, UnitInfo> = {};

  unitKnowledgeList.forEach((row) => {
    if (!unitsData[row.unit_id]) {
      unitsData[row.unit_id] = {
        unit_id: row.unit_id,
        unit_name: row.unit_name,
        curriculum_name: row.curriculum_name,
      };
    }
  });

  return unitsData;
};

// 데이터 병합
export const mergeData = (
  resultsData: ResultData[],
  combinedInputData: CombinedInputData[],
  criteriaData: Criteria[],
  unitsData: Record<number, UnitInfo>
): MergedProblem[] => {
  // combined_input.jsonl 맵
  const combinedMap: Record<number, CombinedInputData> = {};
  combinedInputData.forEach((item) => {
    combinedMap[item.problem_id] = item;
  });

  // criteria.jsonl 맵 (problem_id별로 배열로 저장)
  const criteriaMap: Record<number, Criteria[]> = {};
  criteriaData.forEach((item) => {
    if (!criteriaMap[item.problem_id]) {
      criteriaMap[item.problem_id] = [];
    }
    criteriaMap[item.problem_id].push(item);
  });

  // 병합
  return resultsData.map((result) => {
    const problemId = result.problem_id;
    const combined = combinedMap[problemId] || { problem_id: problemId, problem_html: {} };
    const criteria = criteriaMap[problemId] || [];

    // unit_candidates의 unit_id로 units.json 조인
    const enrichedUnitCandidates: UnitCandidate[] = (result.unit_candidates || []).map((candidate) => {
      const unitInfo = unitsData[candidate.unit_id] || {};
      const enrichedCandidate: UnitCandidate = {
        ...candidate,
        unit_name: unitInfo.unit_name || '알 수 없음',
        curriculum_name: unitInfo.curriculum_name || '알 수 없음',
        unit_necessity: candidate.unit_necessity ?? null,
      };

      // valid_knowledges 또는 knowledges에 necessity 필드 추가
      const knowledges = enrichedCandidate.valid_knowledges || enrichedCandidate.knowledges || [];
      if (knowledges.length > 0) {
        const enrichedKnowledges = knowledges.map((k) => ({
          ...k,
          knowledge_necessity: k.knowledge_necessity ?? null,
        }));
        if (enrichedCandidate.valid_knowledges) {
          enrichedCandidate.valid_knowledges = enrichedKnowledges;
        } else if (enrichedCandidate.knowledges) {
          enrichedCandidate.knowledges = enrichedKnowledges;
        }
      }

      return enrichedCandidate;
    });

    return {
      problem_id: problemId,
      problem_html: combined.problem_html || {},
      behavior_area: result.behavior_area,
      behavior_reason: result.behavior_reason,
      behavior_area_confirmed: result.behavior_area_confirmed || '',
      unit_added: Array.isArray(result.unit_added) ? result.unit_added : [],
      comment: result.comment || '',
      unit_candidates: enrichedUnitCandidates,
      criteria: criteria,
    };
  });
};

// 저장용 Results 데이터로 변환
export const convertToResultsData = (mergedData: MergedProblem[]): ResultData[] => {
  return mergedData.map((item) => ({
    problem_id: item.problem_id,
    behavior_area: item.behavior_area,
    behavior_reason: item.behavior_reason,
    behavior_area_confirmed: item.behavior_area_confirmed || '',
    unit_added: Array.isArray(item.unit_added) ? item.unit_added : [],
    comment: item.comment || '',
    unit_candidates: item.unit_candidates.map((unit) => {
      const knowledges = unit.valid_knowledges || unit.knowledges || [];
      return {
        unit_id: unit.unit_id,
        confidence_score: unit.confidence_score,
        unit_necessity: unit.unit_necessity ?? null,
        valid_knowledges: knowledges.map((k) => ({
          knowledge_id: k.knowledge_id,
          knowledge_name: k.knowledge_name,
          knowledge_necessity: k.knowledge_necessity ?? null,
        })),
      };
    }),
  }));
};

// HTML 이스케이프
export const escapeHtml = (text: string | undefined | null): string => {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
