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

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design homepage",
    priority: "High",
    status: "To Do",
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [searchQuery, setSearchQuery] = useState("");

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  // Load tasks from backend
  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("http://localhost:3001/tasks");

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

  // Add task - frontend for now
  function addTask() {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      priority,
      status: "To Do",
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);

    setTitle("");
    setPriority("Medium");
    setShowModal(false);
  }

  // Delete task - frontend for now
  function deleteTask(id: number) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  }

  // Search
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-[#222] px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
            >
              + Add Task
            </button>
          </header>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e5df] bg-white px-6 py-3">

            <div className="flex gap-2">

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search tasks..."
                  className="h-9 w-48 rounded-lg border border-[#deded8] bg-white px-3 text-sm outline-none focus:border-[#888]"
                />
              </div>

              {/* Fields */}
              <button
                type="button"
                className="rounded-lg border border-[#deded8] px-3 py-2 text-sm hover:bg-[#f5f5f2]"
              >
                Fields
              </button>

              {/* Filter */}
              <button
                type="button"
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

          {/* Board or List */}
          {viewMode === "board" ? (
            <div className="overflow-x-auto p-6">
              <div className="grid min-w-[900px] grid-cols-4 gap-4">

                {columns.map((column) => (
                  <TaskColumn
                    key={column}
                    title={column}
                    tasks={filteredTasks.filter(
                      (task) => task.status === column
                    )}
                    onAdd={() => setShowModal(true)}
                    onDelete={deleteTask}
                  />
                ))}

              </div>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onDelete={deleteTask}
            />
          )}

        </section>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#222]">
                Create Task
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-xl text-[#888] hover:text-[#222]"
              >
                ×
              </button>
            </div>

            {/* Task Title */}
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
            <div className="mb-6">
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

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-[#deded8] px-4 py-2 text-sm font-medium text-[#555] hover:bg-[#f5f5f2]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={addTask}
                disabled={!title.trim()}
                className="rounded-lg bg-[#222] px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create Task
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
  onDelete,
}: {
  title: string;
  tasks: Task[];
  onAdd: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="rounded-xl bg-[#eeeeea] p-3">

      {/* Column Header */}
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

      {/* Tasks */}
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

              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="text-xs text-[#aaa] hover:text-red-500"
                title="Delete task"
              >
                ×
              </button>

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

      {/* Add Task */}
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
  onDelete,
}: {
  tasks: Task[];
  onDelete: (id: number) => void;
}) {
  return (
    <div className="p-6">

      <div className="overflow-hidden rounded-xl border border-[#e1e1db] bg-white">

        {/* Table Header */}
        <div className="grid grid-cols-4 border-b border-[#e5e5df] bg-[#f8f8f6] px-5 py-3 text-xs font-medium text-[#777]">

          <span>Task</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Action</span>

        </div>

        {/* Task Rows */}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-4 items-center border-b border-[#eeeeea] px-5 py-4 text-sm last:border-b-0"
          >

            <span className="font-medium text-[#222]">
              {task.title}
            </span>

            <span className="text-[#777]">
              {task.priority}
            </span>

            <span>
              <span className="rounded-full bg-[#f1f1ed] px-2.5 py-1 text-xs text-[#555]">
                {task.status}
              </span>
            </span>

            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="w-fit text-xs text-[#999] hover:text-red-500"
            >
              Delete
            </button>

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