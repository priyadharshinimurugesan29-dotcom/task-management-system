"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  priority: string;
  status: string;
};

type ViewMode = "board" | "list";

const columns = ["To Do", "Doing", "Completed", "On Hold"];

const initialTasks: Task[] = [];
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showFields, setShowFields] = useState(false);

  const [visibleFields, setVisibleFields] = useState({
    task: true,
    priority: true,
    status: true,
    action: true,
  });

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To Do");

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks from backend
  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(`${API_URL}/tasks`);

        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    }

    loadTasks();
  }, []);

  // Add task
  async function addTask() {
    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          priority,
          status: "To Do",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();

      setTasks((currentTasks) => [...currentTasks, newTask]);

      closeModal();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  // Update task
  async function updateTask() {
    if (!editingTask || !title.trim()) return;

    try {
      const response = await fetch(
        `${API_URL}/tasks/${editingTask.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            priority,
            status,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );

      closeModal();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  // Open edit modal
  function openEditModal(task: Task) {
    setEditingTask(task);
    setTitle(task.title);
    setPriority(task.priority);
    setStatus(task.status);
    setShowModal(true);
  }

  // Close modal
  function closeModal() {
    setShowModal(false);
    setEditingTask(null);
    setTitle("");
    setPriority("Medium");
    setStatus("To Do");
  }

  // Delete task
  async function deleteTask(id: number) {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  // Search + filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    const matchesStatus =
      statusFilter === "All" ||
      task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#f8f8f6]">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-[#e5e5df] bg-white p-5 md:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
              A
            </div>

            <span className="font-semibold text-[#222]">
              Workspace
            </span>
          </div>

          <nav className="space-y-1">
            <button className="w-full rounded-lg bg-[#f1f1ed] px-3 py-2 text-left text-sm font-medium text-[#222]">
              Tasks
            </button>

            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#777] hover:bg-[#f5f5f2]">
              Projects
            </button>
          </nav>
        </aside>

        {/* Main */}
        <section className="flex-1">

          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#e5e5df] bg-white px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold text-[#222]">
                Tasks
              </h1>

              <p className="mt-1 text-sm text-[#888]">
                Manage your workspace tasks
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setTitle("");
                setPriority("Medium");
                setStatus("To Do");
                setShowModal(true);
              }}
              className="rounded-lg bg-[#222] px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
            >
              + Add Task
            </button>
          </header>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e5df] bg-white px-6 py-3">

            <div className="flex gap-2">

              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search tasks..."
                className="h-9 w-48 rounded-lg border border-[#deded8] bg-white px-3 text-sm outline-none focus:border-[#888]"
              />

              {/* Fields */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFields(!showFields)}
                  className="rounded-lg border border-[#deded8] px-3 py-2 text-sm hover:bg-[#f5f5f2]"
                >
                  Fields
                </button>

                {showFields && (
                  <div className="absolute left-0 top-11 z-30 w-48 rounded-lg border border-[#deded8] bg-white p-3 shadow-lg">

                    <p className="mb-2 text-xs font-medium text-[#777]">
                      Show fields
                    </p>

                    {[
                      ["task", "Task"],
                      ["priority", "Priority"],
                      ["status", "Status"],
                      ["action", "Action"],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-[#f5f5f2]"
                      >
                        <input
                          type="checkbox"
                          checked={
                            visibleFields[
                              key as keyof typeof visibleFields
                            ]
                          }
                          onChange={() =>
                            setVisibleFields((current) => ({
                              ...current,
                              [key]:
                                !current[
                                  key as keyof typeof current
                                ],
                            }))
                          }
                        />

                        {label}
                      </label>
                    ))}

                  </div>
                )}
              </div>

              {/* Filter */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-lg border border-[#deded8] px-3 py-2 text-sm hover:bg-[#f5f5f2]"
              >
                Filter
              </button>

            </div>

            {/* Board / List */}
            <div className="flex gap-1 rounded-lg bg-[#f1f1ed] p-1">

              <button
                type="button"
                onClick={() => setViewMode("board")}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  viewMode === "board"
                    ? "bg-white shadow-sm"
                    : "text-[#777]"
                }`}
              >
                Board
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "text-[#777]"
                }`}
              >
                List
              </button>

            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-b border-[#e5e5df] bg-white px-6 py-4">
              <div className="flex flex-wrap items-center gap-4">

                {/* Priority */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#777]">
                    Priority
                  </label>

                  <select
                    value={priorityFilter}
                    onChange={(event) =>
                      setPriorityFilter(event.target.value)
                    }
                    className="h-9 rounded-lg border border-[#deded8] bg-white px-3 text-sm outline-none focus:border-[#888]"
                  >
                    <option value="All">All Priorities</option>
                    <option value="No Priority">No Priority</option>
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#777]">
                    Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="h-9 rounded-lg border border-[#deded8] bg-white px-3 text-sm outline-none focus:border-[#888]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="To Do">To Do</option>
                    <option value="Doing">Doing</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                {/* Clear */}
                <button
                  type="button"
                  onClick={() => {
                    setPriorityFilter("All");
                    setStatusFilter("All");
                  }}
                  className="mt-5 rounded-lg border border-[#deded8] px-3 py-2 text-sm text-[#555] hover:bg-[#f5f5f2]"
                >
                  Clear
                </button>

              </div>
            </div>
          )}

          {/* Board / List */}
          {viewMode === "board" ? (
            <div className="overflow-x-auto p-6">
              <div className="grid min-w-[900px] grid-cols-4 gap-4">

                {columns.map((column) => (
                  <TaskColumn
                    key={column}
                    title={column}
                    tasks={filteredTasks.filter(
                      (task) => task.status === column,
                    )}
                    onAdd={() => {
                      setEditingTask(null);
                      setTitle("");
                      setPriority("Medium");
                      setStatus("To Do");
                      setShowModal(true);
                    }}
                    onEdit={openEditModal}
                    onDelete={deleteTask}
                  />
                ))}

              </div>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onEdit={openEditModal}
              onDelete={deleteTask}
              visibleFields={visibleFields}
            />
          )}

        </section>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-lg font-semibold text-[#222]">
                {editingTask ? "Edit Task" : "Create Task"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="text-xl text-[#888] hover:text-[#222]"
              >
                ×
              </button>

            </div>

            {/* Title */}
            <div className="mb-4">

              <label className="mb-2 block text-sm font-medium text-[#333]">
                Task title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter task title"
                className="h-11 w-full rounded-lg border border-[#deded8] px-3 text-sm outline-none focus:border-[#888]"
                autoFocus
              />

            </div>

            {/* Priority */}
            <div className="mb-4">

              <label className="mb-2 block text-sm font-medium text-[#333]">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
                className="h-11 w-full rounded-lg border border-[#deded8] bg-white px-3 text-sm outline-none focus:border-[#888]"
              >
                <option value="No Priority">
                  No Priority
                </option>

                <option value="Urgent">
                  Urgent
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

            </div>

            {/* Status */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-medium text-[#333]">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="h-11 w-full rounded-lg border border-[#deded8] bg-white px-3 text-sm outline-none focus:border-[#888]"
              >
                <option value="To Do">
                  To Do
                </option>

                <option value="Doing">
                  Doing
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="On Hold">
                  On Hold
                </option>
              </select>

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-[#deded8] px-4 py-2 text-sm font-medium text-[#555] hover:bg-[#f5f5f2]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={editingTask ? updateTask : addTask}
                disabled={!title.trim()}
                className="rounded-lg bg-[#222] px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {editingTask ? "Save Changes" : "Create Task"}
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}

/* =========================================================
   TASK COLUMN
========================================================= */

function TaskColumn({
  title,
  tasks,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string;
  tasks: Task[];
  onAdd: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="rounded-xl bg-[#eeeeea] p-3">

      <div className="mb-3 flex items-center justify-between">

        <h2 className="text-sm font-semibold text-[#333]">
          {title}
        </h2>

        <button
          type="button"
          onClick={onAdd}
          className="text-lg text-[#777] hover:text-[#222]"
        >
          +
        </button>

      </div>

      <div className="space-y-3">

        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-[#e1e1db] bg-white p-4 shadow-sm"
          >

            <div className="flex items-start justify-between gap-3">

              <h3 className="text-sm font-medium text-[#222]">
                {task.title}
              </h3>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  className="text-xs text-[#888] hover:text-[#222]"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  className="text-xs text-[#aaa] hover:text-red-500"
                  title="Delete task"
                >
                  ×
                </button>

              </div>

            </div>

            <p className="mt-2 text-xs text-[#888]">
              {task.priority} priority
            </p>

            <div className="mt-4 flex items-center justify-between">

              <span className="text-xs text-[#888]">
                Today
              </span>

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#222] text-xs text-white">
                G
              </div>

            </div>

          </div>
        ))}

      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 w-full rounded-lg border border-dashed border-[#cfcfc8] py-2 text-sm text-[#777] hover:bg-white"
      >
        + Add task
      </button>

    </div>
  );
}

/* =========================================================
   TASK LIST
========================================================= */

function TaskList({
  tasks,
  onEdit,
  onDelete,
  visibleFields,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  visibleFields: {
    task: boolean;
    priority: boolean;
    status: boolean;
    action: boolean;
  };
}) {
  return (
    <div className="p-6">

      <div className="overflow-hidden rounded-xl border border-[#e1e1db] bg-white">

        {/* Table Header */}
        <div className="grid grid-cols-4 border-b border-[#e5e5df] bg-[#f8f8f6] px-5 py-3 text-xs font-medium text-[#777]">

          {visibleFields.task && (
            <span>Task</span>
          )}

          {visibleFields.priority && (
            <span>Priority</span>
          )}

          {visibleFields.status && (
            <span>Status</span>
          )}

          {visibleFields.action && (
            <span>Action</span>
          )}

        </div>

        {/* Task Rows */}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-4 items-center border-b border-[#eeeeea] px-5 py-4 text-sm last:border-b-0"
          >

            {visibleFields.task && (
              <span className="font-medium text-[#222]">
                {task.title}
              </span>
            )}

            {visibleFields.priority && (
              <span className="text-[#777]">
                {task.priority}
              </span>
            )}

            {visibleFields.status && (
              <span>
                <span className="rounded-full bg-[#f1f1ed] px-2.5 py-1 text-xs text-[#555]">
                  {task.status}
                </span>
              </span>
            )}

            {visibleFields.action && (
              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  className="text-xs text-[#777] hover:text-[#222]"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  className="text-xs text-[#999] hover:text-red-500"
                >
                  Delete
                </button>

              </div>
            )}

          </div>
        ))}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[#888]">
            No tasks yet.
          </div>
        )}

      </div>

    </div>
  );
}