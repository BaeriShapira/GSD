import { useState } from "react";
import AreaOfLifeSelector from "../UI/AreaOfLifeSelector";
import NextActionForm from "./NextActionForm";
import { useProjects } from "../../hooks/useProjects";
import { Plus, X } from "lucide-react";

export default function ProjectDetails({
    projectChoice,
    existingProjectId,
    newProjectName,
    newProjectOutcome,
    newProjectAreaId,
    firstActionText,
    additionalActions,
    firstActionContextId,
    firstActionUrgency,
    firstActionEstimatedTime,
    firstActionScheduleType,
    firstActionScheduledDate,
    firstActionScheduledTime,
    firstActionBlockedByTaskId,
    onProjectChoiceChange,
    onExistingProjectChange,
    onNewProjectNameChange,
    onNewProjectOutcomeChange,
    onNewProjectAreaChange,
    onFirstActionTextChange,
    onFirstActionContextChange,
    onFirstActionUrgencyChange,
    onFirstActionEstimatedTimeChange,
    onFirstActionScheduleTypeChange,
    onFirstActionScheduledDateChange,
    onFirstActionScheduledTimeChange,
    onFirstActionBlockedByTaskChange,
    onAddAction,
    onRemoveAction,
    onAdditionalActionChange,
}) {
    const { projects, isLoading: projectsLoading } = useProjects();

    return (
        <div className="mt-4 space-y-4 max-w-3xl">
            {/* Choose: Existing or New Project */}
            <div>
                <label className="block text-xs font-medium text-black/60 mb-2">
                    Project Type *
                </label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="projectChoice"
                            value="existing"
                            checked={projectChoice === "existing"}
                            onChange={(e) => onProjectChoiceChange(e.target.value)}
                            className="cursor-pointer"
                        />
                        <span className="text-sm text-black/80">
                            Add to existing project
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="projectChoice"
                            value="new"
                            checked={projectChoice === "new"}
                            onChange={(e) => onProjectChoiceChange(e.target.value)}
                            className="cursor-pointer"
                        />
                        <span className="text-sm text-black/80">
                            Create new project
                        </span>
                    </label>
                </div>
            </div>

            {/* Existing Project Selection */}
            {projectChoice === "existing" && (
                <div className="pl-6 border-l-2 border-black/10 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-black/60 mb-1">
                            Select Project *
                        </label>
                        <select
                            value={existingProjectId || ""}
                            onChange={(e) => onExistingProjectChange(e.target.value ? Number(e.target.value) : null)}
                            className="input cursor-pointer"
                            disabled={projectsLoading}
                        >
                            <option value="">Choose a project...</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                    {project.areaOfLife ? ` (${project.areaOfLife.name})` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* First Action for existing project using NextActionForm */}
                    {existingProjectId && (
                        <NextActionForm
                            actionText={firstActionText}
                            contextId={firstActionContextId}
                            urgency={firstActionUrgency}
                            estimatedTime={firstActionEstimatedTime}
                            scheduleType={firstActionScheduleType}
                            scheduledDate={firstActionScheduledDate}
                            scheduledTime={firstActionScheduledTime}
                            blockedByTaskId={firstActionBlockedByTaskId}
                            projectId={existingProjectId}
                            showBlockedBy={true}
                            onActionTextChange={onFirstActionTextChange}
                            onContextChange={onFirstActionContextChange}
                            onUrgencyChange={onFirstActionUrgencyChange}
                            onEstimatedTimeChange={onFirstActionEstimatedTimeChange}
                            onScheduleTypeChange={onFirstActionScheduleTypeChange}
                            onScheduledDateChange={onFirstActionScheduledDateChange}
                            onScheduledTimeChange={onFirstActionScheduledTimeChange}
                            onBlockedByTaskChange={onFirstActionBlockedByTaskChange}
                            textLabel="Next Action"
                            textPlaceholder="What's the next action for this project?"
                            scheduleTypeRadioName="firstActionScheduleTypeExisting"
                        />
                    )}
                </div>
            )}

            {/* New Project Creation */}
            {projectChoice === "new" && (
                <div className="pl-6 border-l-2 border-black/10 space-y-4">
                    {/* Project Name */}
                    <div>
                        <label className="block text-xs font-medium text-black/60 mb-1">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => onNewProjectNameChange(e.target.value)}
                            placeholder="What's the project name?"
                            className="input"
                        />
                    </div>

                    {/* Area of Life */}
                    <AreaOfLifeSelector
                        value={newProjectAreaId}
                        onChange={onNewProjectAreaChange}
                        label="Area of Life (optional)"
                    />

                    {/* Project Outcome */}
                    <div>
                        <label className="block text-xs font-medium text-black/60 mb-1">
                            Ideal Outcome (optional)
                        </label>
                        <textarea
                            value={newProjectOutcome}
                            onChange={(e) => onNewProjectOutcomeChange(e.target.value)}
                            placeholder="What does success look like for this project?"
                            className="input min-h-[80px]"
                            rows={3}
                        />
                        <p className="text-xs text-black/40 mt-1">
                            Describe the desired end result of this project
                        </p>
                    </div>

                    {/* First Action using NextActionForm */}
                    <NextActionForm
                        actionText={firstActionText}
                        contextId={firstActionContextId}
                        urgency={firstActionUrgency}
                        estimatedTime={firstActionEstimatedTime}
                        scheduleType={firstActionScheduleType}
                        scheduledDate={firstActionScheduledDate}
                        scheduledTime={firstActionScheduledTime}
                        blockedByTaskId={firstActionBlockedByTaskId}
                        projectId={-2}
                        showBlockedBy={true}
                        onActionTextChange={onFirstActionTextChange}
                        onContextChange={onFirstActionContextChange}
                        onUrgencyChange={onFirstActionUrgencyChange}
                        onEstimatedTimeChange={onFirstActionEstimatedTimeChange}
                        onScheduleTypeChange={onFirstActionScheduleTypeChange}
                        onScheduledDateChange={onFirstActionScheduledDateChange}
                        onScheduledTimeChange={onFirstActionScheduledTimeChange}
                        onBlockedByTaskChange={onFirstActionBlockedByTaskChange}
                        textLabel="First Next Action"
                        textPlaceholder="What's the first step to get started?"
                        scheduleTypeRadioName="firstActionScheduleTypeNew"
                    />

                    {/* Additional Actions */}
                    {additionalActions.length > 0 && (
                        <div className="space-y-4">
                            <label className="block text-xs font-medium text-black/60">
                                Additional Actions
                            </label>
                            {additionalActions.map((action, index) => (
                                <div key={index} className="border border-black/10 rounded-lg p-4 space-y-4 relative">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-medium text-black/60">
                                            Action {index + 2}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveAction(index)}
                                            className="cursor-pointer p-1.5 text-black hover:bg-red-50 rounded-lg transition-colors"
                                            aria-label="Remove action"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <NextActionForm
                                        actionText={action.text}
                                        contextId={action.contextId}
                                        urgency={action.urgency}
                                        estimatedTime={action.estimatedTime}
                                        scheduleType={action.scheduleType}
                                        scheduledDate={action.scheduledDate}
                                        scheduledTime={action.scheduledTime}
                                        blockedByTaskId={action.blockedByTaskId}
                                        projectId={-1}
                                        showBlockedBy={true}
                                        onActionTextChange={(value) => onAdditionalActionChange(index, "text", value)}
                                        onContextChange={(value) => onAdditionalActionChange(index, "contextId", value)}
                                        onUrgencyChange={(value) => onAdditionalActionChange(index, "urgency", value)}
                                        onEstimatedTimeChange={(value) => onAdditionalActionChange(index, "estimatedTime", value)}
                                        onScheduleTypeChange={(value) => onAdditionalActionChange(index, "scheduleType", value)}
                                        onScheduledDateChange={(value) => onAdditionalActionChange(index, "scheduledDate", value)}
                                        onScheduledTimeChange={(value) => onAdditionalActionChange(index, "scheduledTime", value)}
                                        onBlockedByTaskChange={(value) => onAdditionalActionChange(index, "blockedByTaskId", value)}
                                        textLabel={`Action ${index + 2}`}
                                        textPlaceholder={`Define action ${index + 2}...`}
                                        scheduleTypeRadioName={`additionalActionScheduleType${index}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Another Action Button */}
                    <button
                        type="button"
                        onClick={onAddAction}
                        className="cursor-pointer flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors"
                    >
                        <Plus size={16} />
                        Add another action
                    </button>
                </div>
            )}
        </div>
    );
}
