import React, { useState, useCallback } from 'react';
import { Header } from '../common';
import FileUploadSection from './FileUploadSection';
import NavigationBar from './NavigationBar';
import ProblemContent from './ProblemContent';
import { InfoPanel } from './InfoPanel';
import { useProblemData, useFileHandling } from '../../hooks';
import { createUnitsMap, mergeData, convertToResultsData } from '../../utils/dataUtils';
import { isFileSystemAccessSupported } from '../../utils/fileUtils';

const ProblemViewer: React.FC = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    selectedFiles,
    isLoading,
    loadingMessage,
    resultsFileHandle,
    handleFilesSelected,
    canLoad,
    loadAllFiles,
    enableEditMode,
    saveResultsFile,
  } = useFileHandling();

  const {
    mergedData,
    setMergedData,
    currentIndex,
    unitKnowledgeList,
    setUnitKnowledgeList,
    unitsData,
    setUnitsData,
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
  } = useProblemData();

  const handleLoad = useCallback(async () => {
    try {
      setLoadError(null);
      const result = await loadAllFiles();
      if (result) {
        const { combinedInputData, resultsData, criteriaData, unitKnowledgeList: ukList } = result;

        const unitMap = createUnitsMap(ukList);
        setUnitsData(unitMap);
        setUnitKnowledgeList(ukList);

        const merged = mergeData(resultsData, combinedInputData, criteriaData, unitMap);
        setMergedData(merged);

        setIsDataLoaded(true);
      }
    } catch (error) {
      setLoadError((error as Error).message);
    }
  }, [loadAllFiles, setMergedData, setUnitKnowledgeList, setUnitsData]);

  const handleEnableEditMode = useCallback(async () => {
    const success = await enableEditMode();
    if (success) {
      alert('편집 모드가 활성화되었습니다. 이제 수정한 내용을 파일에 저장할 수 있습니다.');
    }
  }, [enableEditMode]);

  const handleSave = useCallback(async () => {
    const resultsToSave = convertToResultsData(mergedData);
    const jsonlContent = resultsToSave.map((item) => JSON.stringify(item)).join('\n') + '\n';

    const success = await saveResultsFile(jsonlContent);
    if (success) {
      alert('결과가 성공적으로 저장되었습니다!');
    }
  }, [mergedData, saveResultsFile]);

  const currentProblem = mergedData[currentIndex];

  const handleSelectCurriculum = useCallback(
    (value: string) => {
      if (currentProblem) {
        updateKnowledgeSearchState(currentProblem.problem_id, {
          curriculum_name: value,
          unit_id: null,
          knowledge_id: null,
        });
      }
    },
    [currentProblem, updateKnowledgeSearchState]
  );

  const handleSelectUnit = useCallback(
    (unitId: number | null) => {
      if (currentProblem) {
        const updates: { unit_id: number | null; knowledge_id: null; curriculum_name?: string } = {
          unit_id: unitId,
          knowledge_id: null,
        };

        if (unitId) {
          const match = unitKnowledgeList.find((item) => item.unit_id === unitId);
          if (match) {
            updates.curriculum_name = match.curriculum_name;
          }
        }

        updateKnowledgeSearchState(currentProblem.problem_id, updates);
      }
    },
    [currentProblem, unitKnowledgeList, updateKnowledgeSearchState]
  );

  const handleSelectKnowledge = useCallback(
    (knowledgeId: number | null) => {
      if (currentProblem) {
        const updates: { knowledge_id: number | null; unit_id?: number; curriculum_name?: string } = {
          knowledge_id: knowledgeId,
        };

        if (knowledgeId) {
          const match = unitKnowledgeList.find((item) => item.knowledge_id === knowledgeId);
          if (match) {
            updates.unit_id = match.unit_id;
            updates.curriculum_name = match.curriculum_name;
          }
        }

        updateKnowledgeSearchState(currentProblem.problem_id, updates);
      }
    },
    [currentProblem, unitKnowledgeList, updateKnowledgeSearchState]
  );

  return (
    <div className="max-w-[1800px] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Header
        title="문항 태그 및 분류 검수 editor"
      />

      {!isDataLoaded && (
        <FileUploadSection
          selectedFiles={selectedFiles}
          onFilesSelected={handleFilesSelected}
          onLoad={handleLoad}
          canLoad={canLoad}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />
      )}

      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mx-8 my-2.5 text-red-600">
          오류 발생: {loadError}
        </div>
      )}

      {isDataLoaded && (
        <>
          <NavigationBar
            currentIndex={currentIndex}
            totalCount={mergedData.length}
            onFirst={goToFirst}
            onPrev10={() => changeProblem(-10)}
            onPrev={() => changeProblem(-1)}
            onNext={() => changeProblem(1)}
            onNext10={() => changeProblem(10)}
            onLast={goToLast}
            onGoToIndex={goToIndex}
            onSearchByProblemId={searchByProblemId}
            onEnableEditMode={handleEnableEditMode}
            isEditModeEnabled={!!resultsFileHandle || !isFileSystemAccessSupported()}
          />

          <div className="grid grid-cols-2 h-[calc(100vh-250px)] min-h-[600px] max-lg:grid-cols-1 max-lg:grid-rows-2">
            {currentProblem && (
              <>
                <ProblemContent problemHtml={currentProblem.problem_html} />
                <InfoPanel
                  problem={currentProblem}
                  problemIndex={currentIndex}
                  unitKnowledgeList={unitKnowledgeList}
                  unitsData={unitsData}
                  knowledgeSearchState={getKnowledgeSearchState(currentProblem.problem_id)}
                  canSave={!!resultsFileHandle}
                  onSetUnitNecessity={(unitIdx, val) => setUnitNecessity(currentIndex, unitIdx, val)}
                  onSetKnowledgeNecessity={(unitIdx, knowIdx, val) =>
                    setKnowledgeNecessity(currentIndex, unitIdx, knowIdx, val)
                  }
                  onSetBehaviorAreaConfirmed={(val) => setBehaviorAreaConfirmed(currentIndex, val)}
                  onUpdateComment={(val) => updateComment(currentIndex, val)}
                  onSelectCurriculum={handleSelectCurriculum}
                  onSelectUnit={handleSelectUnit}
                  onSelectKnowledge={handleSelectKnowledge}
                  onAddUnitFromSearch={() => addUnitFromSearch(currentIndex)}
                  onRemoveUnitAdded={(addIdx, knowIdx) => removeUnitAdded(currentIndex, addIdx, knowIdx)}
                  onSave={handleSave}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProblemViewer;
