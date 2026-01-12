// 문제 HTML 구조
export interface ProblemHtml {
  question_html?: string;
  choice_html?: string;
  explanation_html?: string;
  correct_answer_html?: string;
}

// 지식 정보
export interface Knowledge {
  knowledge_id: number;
  knowledge_name: string;
  knowledge_necessity?: boolean | null;
}

// 단원 후보
export interface UnitCandidate {
  unit_id: number;
  unit_name?: string;
  curriculum_name?: string;
  confidence_score?: number | null;
  unit_necessity?: boolean | null;
  valid_knowledges?: Knowledge[];
  knowledges?: Knowledge[];
}

// 기준 데이터
export interface Criteria {
  problem_id: number;
  unit_id: number;
  knowledge_id: number;
  knowledge_name: string;
  knowledge_checked?: boolean;
  category_base_name?: string;
}

// 병합된 문제 데이터
export interface MergedProblem {
  problem_id: number;
  problem_html: ProblemHtml;
  behavior_area?: string;
  behavior_reason?: string;
  behavior_area_confirmed?: string;
  unit_added: UnitCandidate[];
  comment: string;
  unit_candidates: UnitCandidate[];
  criteria: Criteria[];
}

// 원본 Results 데이터
export interface ResultData {
  problem_id: number;
  behavior_area?: string;
  behavior_reason?: string;
  behavior_area_confirmed?: string;
  unit_added?: UnitCandidate[];
  comment?: string;
  unit_candidates?: UnitCandidate[];
}

// 원본 Combined Input 데이터
export interface CombinedInputData {
  problem_id: number;
  problem_html: ProblemHtml;
}

// Unit Knowledge 데이터
export interface UnitKnowledge {
  curriculum_name: string;
  unit_id: number;
  unit_name: string;
  knowledge_id: number;
  knowledge_name: string;
}

// Unit 정보
export interface UnitInfo {
  unit_id: number;
  unit_name: string;
  curriculum_name: string;
}

// 파일 선택 상태
export interface SelectedFiles {
  combined: File | null;
  results: File | null;
  criteria: File | null;
  unitKnowledge: File | null;
}

// 지식 검색 상태
export interface KnowledgeSearchState {
  curriculum_name: string;
  unit_id: number | null;
  knowledge_id: number | null;
}

// LaTeX 렌더러용 JSON 데이터
export interface LatexJsonData {
  generatable?: boolean;
  origin_version?: {
    question?: string;
    choice?: string;
    answer?: string;
    explanation?: string;
  };
  instantiated_version?: {
    question?: string;
    choice?: string;
    answer?: string;
    explanation?: string;
  };
}

// 행동 영역 옵션
export const BEHAVIOR_AREA_OPTIONS = [
  { value: '계산 능력', label: '계산 능력' },
  { value: '이해 능력', label: '이해 능력' },
  { value: '추론 능력', label: '추론 능력' },
  { value: '문제 해결 능력', label: '문제 해결 능력' },
] as const;
