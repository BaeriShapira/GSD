# TaskTable Usage Examples

## Basic Usage

```jsx
import TaskTable from "../UI/TaskTable";

// Define columns configuration
const columns = [
    {
        key: "task",
        label: "Task",
        width: "w-1/4",
        type: "task",
        sortable: true
    },
    {
        key: "project",
        label: "Project",
        width: "w-1/6",
        type: "project",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: projects,
        filterConfig: {
            labelKey: "name",
            valueKey: "id",
            placeholder: "All projects",
            title: "Filter by project"
        }
    },
    {
        key: "urgency",
        label: "Urgency",
        width: "w-[8%]",
        type: "urgency",
        sortable: true,
        filterable: true,
        filterType: "urgency"
    }
];

// Define row actions
const rowActions = {
    onComplete: (taskId) => handleComplete(taskId),
    onEdit: (task) => handleEdit(task),
    onDelete: (taskId) => handleDelete(taskId)
};

// Render table
<TaskTable
    tasks={tasks}
    columns={columns}
    sortConfig={{ sortBy, sortOrder }}
    onSort={handleSort}
    filters={filters}
    onFilterChange={handleFilterChange}
    rowActions={rowActions}
    onDragEnd={handleDragEnd}
    enableDragDrop={true}
    celebratingTaskId={celebratingTaskId}
    emptyMessage="No tasks found"
/>
```

## Next Actions Example

```jsx
const columns = [
    { key: "task", label: "Task", width: "w-1/4", type: "task", sortable: true },
    {
        key: "project",
        label: "Project",
        width: "w-[10%]",
        type: "project",
        filterable: true,
        filterType: "select",
        filterOptions: projects
    },
    {
        key: "urgency",
        label: "Urgency",
        width: "w-[8%]",
        type: "urgency",
        sortable: true,
        filterable: true,
        filterType: "urgency"
    },
    {
        key: "context",
        label: "Context",
        width: "w-[10%]",
        type: "context",
        filterable: true,
        filterType: "select",
        filterOptions: contexts
    },
    {
        key: "estimatedTime",
        label: "Est. Time",
        width: "w-[10%]",
        type: "estimatedTime",
        sortable: true
    },
    {
        key: "dueDate",
        label: "Due",
        width: "w-[12%]",
        type: "date",
        sortable: true
    }
];

const rowActions = {
    onComplete: handleComplete,
    onEdit: handleEdit,
    onDelete: handleDelete
};
```

## Waiting For Example

```jsx
const columns = [
    { key: "task", label: "Task", width: "w-1/3", type: "task" },
    {
        key: "waitingFor",
        label: "Waiting For",
        width: "w-1/6",
        type: "waitingFor",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: waitingForOptions
    },
    {
        key: "project",
        label: "Project",
        width: "w-1/6",
        type: "project",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: projects
    },
    {
        key: "expectedDate",
        label: "Expected",
        width: "w-[15%]",
        type: "date",
        sortable: true
    }
];

const rowActions = {
    onNudge: handleNudge,
    onReceived: handleReceived,
    onEdit: handleEdit,
    onDelete: handleDelete
};
```

## Custom Cell Rendering

```jsx
const columns = [
    {
        key: "customField",
        label: "Custom",
        width: "w-1/6",
        render: (task, column) => {
            // Custom rendering logic
            return (
                <div className="flex items-center gap-2">
                    <span>{task.customField}</span>
                    <button onClick={() => alert(task.id)}>Click</button>
                </div>
            );
        }
    }
];
```

## Column Types

- **task**: Task text with formatting
- **project**: Project name with area color indicator
- **urgency**: Star rating (1-5)
- **context**: Context name with icon
- **estimatedTime**: Time in minutes with clock icon
- **date**: Formatted date with calendar icon
- **waitingFor**: Person/entity name
- **area**: Area of life with color indicator
- **text**: Simple text display
- **custom**: Use `render` function for custom content

## Row Actions

Available actions:
- `onComplete`: Mark task as complete (shows checkmark icon)
- `onNudge`: Send nudge (shows "Nudge" button)
- `onReceived`: Mark as received (shows "Received" button)
- `onEdit`: Edit task (shows edit icon)
- `onDelete`: Delete task (shows trash icon)

## Features

- ✅ Dynamic columns configuration
- ✅ Sorting by column
- ✅ Column filtering (select, urgency)
- ✅ Drag & drop reordering
- ✅ Custom cell rendering
- ✅ Empty state handling
- ✅ Celebration animation
- ✅ Responsive design
