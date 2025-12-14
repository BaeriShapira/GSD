import { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useProjects } from "../hooks/useProjects";
import { STEP1, STEP2_NOT_ACTIONABLE, STEP2_ACTIONABLE } from "../components/ProcessBucket/ProcessBucketSteps";
import { convertToISOString } from "../utils/dateUtils";
import MobileCard from "../components/UI/MobileCard";
import AttachmentList from "../components/UI/AttachmentList";
import Card from "../components/UI/Card";
import ProcessBucketFinished from "../components/ProcessBucket/ProcessBucketFinished";
import ProcessBucketReferenceDetails from "../components/ProcessBucket/ReferenceDetails";
import ProcessBucketSomedayDetails from "../components/ProcessBucket/SomedayDetails";
import WaitingForDetails from "../components/ProcessBucket/WaitingForDetails";
import NextActionDetails from "../components/ProcessBucket/NextActionDetails";
import ProjectDetails from "../components/ProcessBucket/ProjectDetails";

/**
 * Mobile-optimized Process Bucket page
 * Same functionality as desktop but with touch-friendly UI
 */
export default function ProcessBucketMobile() {
    const { tasks, isLoading, isError, error, updateTask, createTask } = useTasks("BUCKET");
    const deleteTaskMutation = useDeleteTask();
    const { projects, createProjectAsync } = useProjects();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [step1Choice, setStep1Choice] = useState(null);
    const [step2Choice, setStep2Choice] = useState(null);
    const [referenceFolder, setReferenceFolder] = useState("");
    const [referenceLabels, setReferenceLabels] = useState([]);
    const [areaOfLifeId, setAreaOfLifeId] = useState(null);
    const [waitingFor, setWaitingFor] = useState("");
    const [expectedDate, setExpectedDate] = useState("");

    // Next Action states
    const [nextActionText, setNextActionText] = useState("");
    const [projectId, setProjectId] = useState(null);
    const [contextId, setContextId] = useState(null);
    const [urgency, setUrgency] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [scheduleType, setScheduleType] = useState("list");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [blockedByTaskId, setBlockedByTaskId] = useState(null);

    // Project states
    const [projectChoice, setProjectChoice] = useState("existing");
    const [existingProjectId, setExistingProjectId] = useState(null);
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectOutcome, setNewProjectOutcome] = useState("");
    const [newProjectAreaId, setNewProjectAreaId] = useState(null);
    const [firstActionText, setFirstActionText] = useState("");

    // First action fields (for projects)
    const [firstActionContextId, setFirstActionContextId] = useState(null);
    const [firstActionUrgency, setFirstActionUrgency] = useState(null);
    const [firstActionEstimatedTime, setFirstActionEstimatedTime] = useState(null);
    const [firstActionScheduleType, setFirstActionScheduleType] = useState("list");
    const [firstActionScheduledDate, setFirstActionScheduledDate] = useState("");
    const [firstActionScheduledTime, setFirstActionScheduledTime] = useState("");
    const [firstActionBlockedByTaskId, setFirstActionBlockedByTaskId] = useState(null);

    // Additional actions as array of objects
    const [additionalActions, setAdditionalActions] = useState([]);

    const total = tasks.length;
    const currentItem = tasks[currentIndex] ?? null;

    useEffect(() => {
        if (total === 0) return;

        if (currentIndex > total - 1) {
            setCurrentIndex(0);
        }
    }, [total, currentIndex]);

    // Set default next action text from current item when Next Action is selected
    useEffect(() => {
        if (step2Choice === STEP2_ACTIONABLE.NEXT_ACTION && currentItem && !nextActionText) {
            setNextActionText(currentItem.text);
        }
    }, [step2Choice, currentItem, nextActionText]);

    // Set default first action text from current item when Project is selected
    useEffect(() => {
        if (step2Choice === STEP2_ACTIONABLE.PROJECT && currentItem && !firstActionText) {
            setFirstActionText(currentItem.text);
        }
    }, [step2Choice, currentItem, firstActionText]);

    function resetChoices() {
        setStep1Choice(null);
        setStep2Choice(null);
        setReferenceFolder("");
        setReferenceLabels([]);
        setAreaOfLifeId(null);
        setWaitingFor("");
        setExpectedDate("");
        setNextActionText("");
        setProjectId(null);
        setContextId(null);
        setUrgency(null);
        setEstimatedTime(null);
        setScheduleType("list");
        setScheduledDate("");
        setScheduledTime("");
        setBlockedByTaskId(null);
        setProjectChoice("existing");
        setExistingProjectId(null);
        setNewProjectName("");
        setNewProjectOutcome("");
        setNewProjectAreaId(null);
        setFirstActionText("");
        setFirstActionContextId(null);
        setFirstActionUrgency(null);
        setFirstActionEstimatedTime(null);
        setFirstActionScheduleType("list");
        setFirstActionScheduledDate("");
        setFirstActionScheduledTime("");
        setFirstActionBlockedByTaskId(null);
        setAdditionalActions([]);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <p className="text-gray-500">Loading items...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <p className="text-sm text-red-500">Error loading items... {error?.message}</p>
            </div>
        );
    }

    if (!currentItem) {
        return <ProcessBucketFinished />;
    }

    function handleStep1Change(choice) {
        setStep1Choice(choice);
        setStep2Choice(null);
    }

    function handleSkip() {
        setCurrentIndex(prev => (prev + 1) % total);
        resetChoices();
    }

    function handleSaveAndContinue() {
        if (!currentItem) return;

        if (
            step1Choice === STEP1.NOT_ACTIONABLE &&
            step2Choice === STEP2_NOT_ACTIONABLE.TRASH
        ) {
            deleteTaskMutation.mutate(currentItem.id, {
                onSuccess: () => {
                    resetChoices();
                },
            });
            return;
        }

        if (
            step1Choice === STEP1.NOT_ACTIONABLE &&
            step2Choice === STEP2_NOT_ACTIONABLE.REFERENCE
        ) {
            const updates = {
                status: "REFERENCE",
                folderId: Number(referenceFolder),
                labels: referenceLabels.join(", "),
                areaOfLifeId: areaOfLifeId,
                projectId: projectId,
            };

            updateTask(currentItem.id, updates);
            resetChoices();
            return;
        }

        if (
            step1Choice === STEP1.NOT_ACTIONABLE &&
            step2Choice === STEP2_NOT_ACTIONABLE.SOMEDAY
        ) {
            const updates = {
                status: "SOMEDAY",
                areaOfLifeId: areaOfLifeId,
            };

            updateTask(currentItem.id, updates);
            resetChoices();
            return;
        }

        if (
            step1Choice === STEP1.ACTIONABLE &&
            step2Choice === STEP2_ACTIONABLE.WAITING
        ) {
            const updates = {
                status: "WAITING_FOR",
                waitingFor: waitingFor,
                expectedDate: expectedDate ? convertToISOString(expectedDate, null) : null,
                areaOfLifeId: areaOfLifeId,
                projectId: projectId,
            };

            updateTask(currentItem.id, updates);
            resetChoices();
            return;
        }

        if (
            step1Choice === STEP1.ACTIONABLE &&
            step2Choice === STEP2_ACTIONABLE.NEXT_ACTION
        ) {
            const updates = {
                status: "NEXT_ACTION",
                text: nextActionText,
                areaOfLifeId: areaOfLifeId,
                projectId: projectId,
                contextId: contextId,
                urgency: urgency,
                estimatedTime: estimatedTime,
                dueDate: scheduleType === "calendar" && scheduledDate
                    ? convertToISOString(scheduledDate, scheduledTime)
                    : null,
                blockedByTaskId: blockedByTaskId,
            };

            console.log("DEBUG ProcessBucketMobile - blockedByTaskId state:", blockedByTaskId);
            console.log("DEBUG ProcessBucketMobile - updates object:", updates);

            updateTask(currentItem.id, updates);
            resetChoices();
            return;
        }

        if (
            step1Choice === STEP1.ACTIONABLE &&
            step2Choice === STEP2_ACTIONABLE.PROJECT
        ) {
            handleProjectSave();
            return;
        }

        console.log("Save & Continue (not handled yet)", {
            itemId: currentItem.id,
            step1Choice,
            step2Choice,
        });
    }

    async function handleProjectSave() {
        try {
            if (projectChoice === "existing") {
                const selectedProject = projects.find(p => p.id === existingProjectId);

                const updates = {
                    status: "NEXT_ACTION",
                    text: firstActionText,
                    projectId: existingProjectId,
                    areaOfLifeId: selectedProject?.areaOfLifeId || null,
                    contextId: firstActionContextId,
                    urgency: firstActionUrgency,
                    estimatedTime: firstActionEstimatedTime,
                    dueDate: firstActionScheduleType === "calendar" && firstActionScheduledDate
                        ? convertToISOString(firstActionScheduledDate, firstActionScheduledTime)
                        : null,
                    blockedByTaskId: firstActionBlockedByTaskId,
                };
                updateTask(currentItem.id, updates);
                resetChoices();
                return;
            }

            if (projectChoice === "new") {
                const newProject = await createProjectAsync(
                    newProjectName,
                    newProjectOutcome || null,
                    newProjectAreaId || null
                );

                const updates = {
                    status: "NEXT_ACTION",
                    text: firstActionText,
                    projectId: newProject.id,
                    areaOfLifeId: newProjectAreaId,
                    contextId: firstActionContextId,
                    urgency: firstActionUrgency,
                    estimatedTime: firstActionEstimatedTime,
                    dueDate: firstActionScheduleType === "calendar" && firstActionScheduledDate
                        ? convertToISOString(firstActionScheduledDate, firstActionScheduledTime)
                        : null,
                    blockedByTaskId: firstActionBlockedByTaskId,
                };
                updateTask(currentItem.id, updates);

                const firstActionId = currentItem.id;

                if (additionalActions.length > 0) {
                    additionalActions.forEach((action) => {
                        if (action.text?.trim()) {
                            createTask({
                                text: action.text.trim(),
                                status: "NEXT_ACTION",
                                projectId: newProject.id,
                                areaOfLifeId: newProjectAreaId,
                                contextId: action.contextId,
                                urgency: action.urgency,
                                estimatedTime: action.estimatedTime,
                                dueDate: action.scheduleType === "calendar" && action.scheduledDate
                                    ? convertToISOString(action.scheduledDate, action.scheduledTime)
                                    : null,
                                blockedByTaskId: action.blockedByTaskId === -1 ? firstActionId : action.blockedByTaskId,
                            });
                        }
                    });
                }

                resetChoices();
                return;
            }
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Failed to save project. Please try again.");
        }
    }

    // Validation logic
    const canSave =
        step2Choice === STEP2_NOT_ACTIONABLE.REFERENCE
            ? Boolean(referenceFolder)
            : step2Choice === STEP2_ACTIONABLE.WAITING
                ? Boolean(waitingFor?.trim())
                : step2Choice === STEP2_ACTIONABLE.NEXT_ACTION
                    ? Boolean(nextActionText?.trim()) &&
                      (scheduleType === "list" || (scheduleType === "calendar" && scheduledDate))
                    : step2Choice === STEP2_ACTIONABLE.PROJECT
                        ? (projectChoice === "existing"
                            ? Boolean(existingProjectId && firstActionText?.trim()) &&
                              (firstActionScheduleType === "list" || (firstActionScheduleType === "calendar" && firstActionScheduledDate))
                            : Boolean(newProjectName?.trim() && firstActionText?.trim()) &&
                              (firstActionScheduleType === "list" || (firstActionScheduleType === "calendar" && firstActionScheduledDate)))
                        : Boolean(step2Choice);

    // Validation message
    function getValidationMessage() {
        if (!step2Choice) return "Please select an option in Step 2";

        if (step2Choice === STEP2_NOT_ACTIONABLE.REFERENCE && !referenceFolder) {
            return "Please select a folder";
        }

        if (step2Choice === STEP2_ACTIONABLE.WAITING && !waitingFor?.trim()) {
            return "Please specify who/what you're waiting for";
        }

        if (step2Choice === STEP2_ACTIONABLE.NEXT_ACTION) {
            if (!nextActionText?.trim()) {
                return "Please define the specific next step";
            }
            if (scheduleType === "calendar" && !scheduledDate) {
                return "Please select a date for the scheduled action";
            }
        }

        if (step2Choice === STEP2_ACTIONABLE.PROJECT) {
            if (projectChoice === "existing") {
                if (!existingProjectId) {
                    return "Please select a project";
                }
                if (!firstActionText?.trim()) {
                    return "Please define the next action for this project";
                }
                if (firstActionScheduleType === "calendar" && !firstActionScheduledDate) {
                    return "Please select a date for the scheduled action";
                }
            } else if (projectChoice === "new") {
                if (!newProjectName?.trim()) {
                    return "Please enter a project name";
                }
                if (!firstActionText?.trim()) {
                    return "Please define the first action for this project";
                }
                if (firstActionScheduleType === "calendar" && !firstActionScheduledDate) {
                    return "Please select a date for the scheduled action";
                }
            }
        }

        return "";
    }

    const validationMessage = getValidationMessage();

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col">
            {/* Fixed Header */}
            <div className="bg-white border-b border-black/10 px-4 py-4 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-lg sm:text-xl font-semibold">Process Bucket</h1>
                    <p className="text-sm text-black/60">
                        {currentIndex + 1}/{total}
                    </p>
                </div>
                <p className="text-xs sm:text-sm text-black/60">
                    Decide, for each item, whether it's actionable. If yes - define the next action.
                </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 pb-20 space-y-4">
                {/* Current Item Card */}
                <MobileCard>
                    <h2 className="text-base sm:text-lg font-medium mb-3 px-2">
                        {currentItem.text}
                    </h2>
                    <AttachmentList attachments={currentItem.attachments} className="px-2" />
                </MobileCard>

                {/* Step 1: Actionable? */}
                <MobileCard>
                    <p className="text-sm font-medium mb-3 px-2">Step 1 - Is it actionable?</p>
                    <div className="grid gap-3 grid-cols-2 px-2">
                        <Card
                            title="Not actionable"
                            description="Reference, someday, trash."
                            selected={step1Choice === STEP1.NOT_ACTIONABLE}
                            onClick={() => handleStep1Change(STEP1.NOT_ACTIONABLE)}
                        />
                        <Card
                            title="Actionable"
                            description="Turn it into a task with a clear next action."
                            selected={step1Choice === STEP1.ACTIONABLE}
                            onClick={() => handleStep1Change(STEP1.ACTIONABLE)}
                        />
                    </div>
                </MobileCard>

                {/* Step 2: What to do? */}
                {step1Choice && (
                    <MobileCard>
                        <p className="text-sm font-medium mb-3 px-2">
                            {step1Choice === STEP1.NOT_ACTIONABLE
                                ? "Step 2 - What should we do with it?"
                                : "Step 2 - What kind of action item is it?"}
                        </p>
                        <div className={`grid gap-3 px-2 ${step1Choice === STEP1.NOT_ACTIONABLE ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'}`}>
                            {step1Choice === STEP1.NOT_ACTIONABLE ? (
                                <>
                                    <Card
                                        title="Reference"
                                        description="Store it, just in case we need it."
                                        selected={step2Choice === STEP2_NOT_ACTIONABLE.REFERENCE}
                                        onClick={() => setStep2Choice(STEP2_NOT_ACTIONABLE.REFERENCE)}
                                    />
                                    <Card
                                        title="Someday"
                                        description="Nice idea, but not for now."
                                        selected={step2Choice === STEP2_NOT_ACTIONABLE.SOMEDAY}
                                        onClick={() => setStep2Choice(STEP2_NOT_ACTIONABLE.SOMEDAY)}
                                    />
                                    <Card
                                        title="Trash"
                                        description="Not useful, get it out of the way."
                                        selected={step2Choice === STEP2_NOT_ACTIONABLE.TRASH}
                                        onClick={() => setStep2Choice(STEP2_NOT_ACTIONABLE.TRASH)}
                                    />
                                </>
                            ) : (
                                <>
                                    <Card
                                        title="Next action"
                                        description="Single concrete step you can do."
                                        selected={step2Choice === STEP2_ACTIONABLE.NEXT_ACTION}
                                        onClick={() => setStep2Choice(STEP2_ACTIONABLE.NEXT_ACTION)}
                                    />
                                    <Card
                                        title="Project"
                                        description="Requires more than one action."
                                        selected={step2Choice === STEP2_ACTIONABLE.PROJECT}
                                        onClick={() => setStep2Choice(STEP2_ACTIONABLE.PROJECT)}
                                    />
                                    <Card
                                        title="Waiting for"
                                        description="You're waiting on someone else."
                                        selected={step2Choice === STEP2_ACTIONABLE.WAITING}
                                        onClick={() => setStep2Choice(STEP2_ACTIONABLE.WAITING)}
                                    />
                                </>
                            )}
                        </div>
                    </MobileCard>
                )}

                {/* Details Forms */}
                {step1Choice === STEP1.NOT_ACTIONABLE &&
                    step2Choice === STEP2_NOT_ACTIONABLE.REFERENCE && (
                        <MobileCard>
                            <div className="px-2">
                                <ProcessBucketReferenceDetails
                                    folder={referenceFolder}
                                    labels={referenceLabels}
                                    areaOfLifeId={areaOfLifeId}
                                    projectId={projectId}
                                    onFolderChange={setReferenceFolder}
                                    onLabelsChange={setReferenceLabels}
                                    onAreaChange={setAreaOfLifeId}
                                    onProjectChange={setProjectId}
                                />
                            </div>
                        </MobileCard>
                    )}

                {step1Choice === STEP1.NOT_ACTIONABLE &&
                    step2Choice === STEP2_NOT_ACTIONABLE.SOMEDAY && (
                        <MobileCard>
                            <div className="px-2">
                                <ProcessBucketSomedayDetails
                                    areaOfLifeId={areaOfLifeId}
                                    onAreaChange={setAreaOfLifeId}
                                />
                            </div>
                        </MobileCard>
                    )}

                {step1Choice === STEP1.ACTIONABLE &&
                    step2Choice === STEP2_ACTIONABLE.WAITING && (
                        <MobileCard>
                            <div className="px-2">
                                <WaitingForDetails
                                    waitingFor={waitingFor}
                                    expectedDate={expectedDate}
                                    areaOfLifeId={areaOfLifeId}
                                    projectId={projectId}
                                    onWaitingForChange={setWaitingFor}
                                    onExpectedDateChange={setExpectedDate}
                                    onAreaChange={setAreaOfLifeId}
                                    onProjectChange={setProjectId}
                                />
                            </div>
                        </MobileCard>
                    )}

                {step1Choice === STEP1.ACTIONABLE &&
                    step2Choice === STEP2_ACTIONABLE.NEXT_ACTION && (
                        <MobileCard>
                            <div className="px-2">
                                <NextActionDetails
                                    nextActionText={nextActionText}
                                    areaOfLifeId={areaOfLifeId}
                                    projectId={projectId}
                                    contextId={contextId}
                                    urgency={urgency}
                                    estimatedTime={estimatedTime}
                                    scheduleType={scheduleType}
                                    scheduledDate={scheduledDate}
                                    scheduledTime={scheduledTime}
                                    blockedByTaskId={blockedByTaskId}
                                    onNextActionTextChange={setNextActionText}
                                    onAreaChange={setAreaOfLifeId}
                                    onProjectChange={setProjectId}
                                    onContextChange={setContextId}
                                    onUrgencyChange={setUrgency}
                                    onEstimatedTimeChange={setEstimatedTime}
                                    onBlockedByTaskChange={setBlockedByTaskId}
                                    onScheduleTypeChange={setScheduleType}
                                    onScheduledDateChange={setScheduledDate}
                                    onScheduledTimeChange={setScheduledTime}
                                />
                            </div>
                        </MobileCard>
                    )}

                {step1Choice === STEP1.ACTIONABLE &&
                    step2Choice === STEP2_ACTIONABLE.PROJECT && (
                        <MobileCard>
                            <div className="px-2">
                                <ProjectDetails
                                    projectChoice={projectChoice}
                                    existingProjectId={existingProjectId}
                                    newProjectName={newProjectName}
                                    newProjectOutcome={newProjectOutcome}
                                    newProjectAreaId={newProjectAreaId}
                                    firstActionText={firstActionText}
                                    additionalActions={additionalActions}
                                    firstActionContextId={firstActionContextId}
                                    firstActionUrgency={firstActionUrgency}
                                    firstActionEstimatedTime={firstActionEstimatedTime}
                                    firstActionScheduleType={firstActionScheduleType}
                                    firstActionScheduledDate={firstActionScheduledDate}
                                    firstActionScheduledTime={firstActionScheduledTime}
                                    firstActionBlockedByTaskId={firstActionBlockedByTaskId}
                                    onProjectChoiceChange={setProjectChoice}
                                    onExistingProjectChange={setExistingProjectId}
                                    onNewProjectNameChange={setNewProjectName}
                                    onNewProjectOutcomeChange={setNewProjectOutcome}
                                    onNewProjectAreaChange={setNewProjectAreaId}
                                    onFirstActionTextChange={setFirstActionText}
                                    onFirstActionContextChange={setFirstActionContextId}
                                    onFirstActionUrgencyChange={setFirstActionUrgency}
                                    onFirstActionEstimatedTimeChange={setFirstActionEstimatedTime}
                                    onFirstActionScheduleTypeChange={setFirstActionScheduleType}
                                    onFirstActionScheduledDateChange={setFirstActionScheduledDate}
                                    onFirstActionScheduledTimeChange={setFirstActionScheduledTime}
                                    onFirstActionBlockedByTaskChange={setFirstActionBlockedByTaskId}
                                    onAddAction={() => setAdditionalActions([...additionalActions, {
                                        text: "",
                                        contextId: null,
                                        urgency: null,
                                        estimatedTime: null,
                                        scheduleType: "list",
                                        scheduledDate: "",
                                        scheduledTime: "",
                                        blockedByTaskId: null
                                    }])}
                                    onRemoveAction={(index) => setAdditionalActions(additionalActions.filter((_, i) => i !== index))}
                                    onAdditionalActionChange={(index, field, value) => {
                                        const updated = [...additionalActions];
                                        updated[index] = { ...updated[index], [field]: value };
                                        setAdditionalActions(updated);
                                    }}
                                />
                            </div>
                        </MobileCard>
                    )}
            </div>

            {/* Fixed Bottom Actions */}
            <div className="bg-white border-t border-black/10 px-4 py-4 sticky bottom-0">
                {!canSave && validationMessage && (
                    <p className="text-xs sm:text-sm text-red-500 mb-3 text-center">
                        {validationMessage}
                    </p>
                )}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="btn btn-outline flex-1 text-sm sm:text-base py-3"
                    >
                        Skip this one
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveAndContinue}
                        disabled={!canSave}
                        className={`btn btn-primary flex-1 text-sm sm:text-base py-3 ${!canSave ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Save &amp; next
                    </button>
                </div>
            </div>
        </div>
    );
}
