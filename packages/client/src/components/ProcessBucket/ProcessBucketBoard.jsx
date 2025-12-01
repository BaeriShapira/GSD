// packages/client/src/components/ProcessBucketBoard.jsx
import { useState, useEffect } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useDeleteTask } from "../../hooks/useDeleteTask"; // 👈 הוק למחיקה
import { useProjects } from "../../hooks/useProjects"; // 👈 הוק לפרויקטים
import { STEP1, STEP2_NOT_ACTIONABLE, STEP2_ACTIONABLE } from "./ProcessBucketSteps"; // 👈 קבועים
import ProcessBucketHeader from "./ProcessBucketHeader";
import ProcessBucketStep1 from "./ProcessBucketStep1";
import ProcessBucketStep2 from "./ProcessBucketStep2";
import ProcessBucketActions from "./ProcessBucketActions";
import { convertToISOString } from "../../utils/dateUtils";
import ProcessBucketFinished from "./ProcessBucketFinished";
import ProcessBucketReferenceDetails from "./ReferenceDetails";
import ProcessBucketSomedayDetails from "./SomedayDetails";
import WaitingForDetails from "./WaitingForDetails";
import NextActionDetails from "./NextActionDetails";
import ProjectDetails from "./ProjectDetails";



export default function ProcessBucketBoard() {
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

        // אם האינדקס הנוכחי כבר לא קיים במערך החדש – נחזיר לראשון
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
        return <ProcessBucketBoardState isLoading />;
    }

    if (isError) {
        return <ProcessBucketBoardState isError error={error} />;
    }

    // 👇 זה הרגע שבו סיימנו לעבד את כל הטסקים
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

        // לוגיקה ראשונה: NOT_ACTIONABLE + TRASH → מחיקה מה־DB
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

        // לוגיקה שנייה: NOT_ACTIONABLE + REFERENCE → שמירה כחומר עזר
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

        // לוגיקה שלישית: NOT_ACTIONABLE + SOMEDAY → שמירה ב-Someday
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

        // לוגיקה רביעית: ACTIONABLE + WAITING → שמירה ב-Waiting For
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

        // לוגיקה חמישית: ACTIONABLE + NEXT_ACTION → שמירה ב-Next Actions
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

            // DEBUG: Log what we're sending
            console.log("🐛 DEBUG ProcessBucket - blockedByTaskId state:", blockedByTaskId);
            console.log("🐛 DEBUG ProcessBucket - updates object:", updates);

            updateTask(currentItem.id, updates);
            resetChoices();
            return;
        }

        // לוגיקה שישית: ACTIONABLE + PROJECT → יצירת/חיבור לפרויקט
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
            // מקרה 1: חיבור לפרויקט קיים
            if (projectChoice === "existing") {
                // מצא את הפרויקט כדי לקבל את ה-Area שלו
                const selectedProject = projects.find(p => p.id === existingProjectId);

                const updates = {
                    status: "NEXT_ACTION",
                    text: firstActionText,
                    projectId: existingProjectId,
                    areaOfLifeId: selectedProject?.areaOfLifeId || null, // 👈 Area מהפרויקט
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

            // מקרה 2: יצירת פרויקט חדש
            if (projectChoice === "new") {
                // יצירת הפרויקט
                const newProject = await createProjectAsync(
                    newProjectName,
                    newProjectOutcome || null,
                    newProjectAreaId || null
                );

                // עדכון ה-task הנוכחי להיות Next Action תחת הפרויקט החדש (First Action)
                const updates = {
                    status: "NEXT_ACTION",
                    text: firstActionText,
                    projectId: newProject.id,
                    areaOfLifeId: newProjectAreaId, // 👈 Area מהפרויקט
                    contextId: firstActionContextId,
                    urgency: firstActionUrgency,
                    estimatedTime: firstActionEstimatedTime,
                    dueDate: firstActionScheduleType === "calendar" && firstActionScheduledDate
                        ? convertToISOString(firstActionScheduledDate, firstActionScheduledTime)
                        : null,
                    blockedByTaskId: firstActionBlockedByTaskId,
                };
                updateTask(currentItem.id, updates);

                // נשמור את ה-ID של ה-First Action שנוצר
                const firstActionId = currentItem.id;

                // יצירת Next Actions נוספים אם יש
                if (additionalActions.length > 0) {
                    additionalActions.forEach((action) => {
                        if (action.text?.trim()) {
                            createTask({
                                text: action.text.trim(),
                                status: "NEXT_ACTION",
                                projectId: newProject.id,
                                areaOfLifeId: newProjectAreaId, // 👈 Area מהפרויקט
                                contextId: action.contextId,
                                urgency: action.urgency,
                                estimatedTime: action.estimatedTime,
                                dueDate: action.scheduleType === "calendar" && action.scheduledDate
                                    ? convertToISOString(action.scheduledDate, action.scheduledTime)
                                    : null,
                                // אם blockedByTaskId הוא -1, זה אומר שהוא מחכה ל-First Action
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
        <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <ProcessBucketHeader
                currentIndex={currentIndex + 1}
                total={total}
                title={currentItem.text}
                attachments={currentItem.attachments}
            />

            <ProcessBucketStep1
                step1Choice={step1Choice}
                onChange={handleStep1Change}
            />

            <ProcessBucketStep2
                step1Choice={step1Choice}
                step2Choice={step2Choice}
                onChange={setStep2Choice}
            />

            {step1Choice === STEP1.NOT_ACTIONABLE &&
                step2Choice === STEP2_NOT_ACTIONABLE.REFERENCE && (
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
                )}

            {step1Choice === STEP1.NOT_ACTIONABLE &&
                step2Choice === STEP2_NOT_ACTIONABLE.SOMEDAY && (
                    <ProcessBucketSomedayDetails
                        areaOfLifeId={areaOfLifeId}
                        onAreaChange={setAreaOfLifeId}
                    />
                )}

            {step1Choice === STEP1.ACTIONABLE &&
                step2Choice === STEP2_ACTIONABLE.WAITING && (
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
                )}

            {step1Choice === STEP1.ACTIONABLE &&
                step2Choice === STEP2_ACTIONABLE.NEXT_ACTION && (
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
                )}

            {step1Choice === STEP1.ACTIONABLE &&
                step2Choice === STEP2_ACTIONABLE.PROJECT && (
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
                )}

            <ProcessBucketActions
                onSkip={handleSkip}
                onSave={handleSaveAndContinue}
                canSave={canSave}
                validationMessage={validationMessage}
            />
        </div>
    );
}

function ProcessBucketBoardState({ isLoading, isError, error, isEmpty }) {
    let message = null;
    let className = "text-sm text-black/50";

    if (isLoading) {
        message = "Loading items...";
    } else if (isError) {
        message = `Error loading items... ${error?.message}`;
        className = "text-sm text-red-500";
    } else if (isEmpty) {
        message = "No items to process.";
    }

    return (
        <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm max-w-5xl">
            <div className={className}>{message}</div>
        </div>
    );
}
