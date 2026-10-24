import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";

const List = ({ userId }) => {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editedText, setEditedText] = useState("");
  const [editedId, setEditedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, is_completed")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (!isMounted) return;

      if (error) {
        toast.error(`Could not load tasks: ${error.message}`);
      } else {
        setTasks(data);
      }
      setIsLoading(false);
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const addTask = async (event) => {
    event.preventDefault();
    const title = input.trim();

    if (!title) {
      toast.warning("Enter something");
      return;
    }
    if (tasks.some((task) => task.title === title)) {
      toast.warning("Already added");
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({ title, user_id: userId })
      .select("id, title, is_completed")
      .single();

    if (error) {
      toast.error(`Could not add task: ${error.message}`);
      return;
    }

    setTasks((currentTasks) => [...currentTasks, data]);
    setInput("");
    toast.success("Task added!");
  };

  const updateTask = async () => {
    const title = editedText.trim();
    if (!title) {
      toast.warning("Task cannot be empty");
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({ title })
      .eq("id", editedId)
      .eq("user_id", userId)
      .select("id, title, is_completed")
      .single();

    if (error) {
      toast.error(`Could not update task: ${error.message}`);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === editedId ? data : task)),
    );
    setEditedText("");
    setEditedId(null);
    toast.success("Task updated");
  };

  const toggleTask = async (task) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ is_completed: !task.is_completed })
      .eq("id", task.id)
      .eq("user_id", userId)
      .select("id, title, is_completed")
      .single();

    if (error) {
      toast.error(`Could not update task: ${error.message}`);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id ? data : currentTask,
      ),
    );
  };

  const deleteTask = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) {
      toast.error(`Could not delete task: ${error.message}`);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
    toast.success("Task deleted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-100 text-slate-800">
      <header className="px-4 py-8 text-center text-4xl font-bold tracking-tight text-red-700 sm:text-5xl">
        To-Do App
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-12">
        <div className="flex justify-center">
          <form
            className="flex w-full max-w-3xl flex-col items-stretch gap-3 rounded-2xl border border-red-100 bg-white p-4 text-center shadow-lg shadow-red-900/10 sm:flex-row sm:items-center sm:p-5"
            onSubmit={addTask}
          >
            <label htmlFor="taskE">Enter Task</label>
            <input
              type="text"
              id="taskE"
              className="w-full min-w-0 rounded-xl border border-red-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 sm:flex-1"
              onChange={(event) => setInput(event.target.value)}
              value={input}
            />
            <button
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="flex w-full flex-col items-center">
          {isLoading ? (
            <p className="text-slate-600">Loading your tasks...</p>
          ) : (
            <ul className="flex w-full max-w-3xl flex-col gap-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex w-full flex-col gap-4 rounded-2xl border border-red-100 bg-white p-4 shadow-md shadow-red-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  {task.id === editedId ? (
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <input
                        type="text"
                        className="min-w-0 flex-1 rounded-xl border border-red-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        value={editedText}
                        onChange={(event) => setEditedText(event.target.value)}
                      />
                      <button
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                        onClick={updateTask}
                        type="button"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <input
                          type="checkbox"
                          className="peer size-4 shrink-0 accent-red-600"
                          checked={task.is_completed}
                          onChange={() => toggleTask(task)}
                          aria-label={`Mark "${task.title}" as ${
                            task.is_completed ? "incomplete" : "complete"
                          }`}
                        />
                        <span
                          className={`break-words text-lg font-medium ${
                            task.is_completed
                              ? "text-slate-400 line-through"
                              : "text-slate-700"
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <button
                        className="rounded-lg border border-red-200 bg-white px-4 py-2 font-medium text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => {
                          setEditedId(task.id);
                          setEditedText(task.title);
                        }}
                        aria-label={`Edit "${task.title}"`}
                        type="button"
                      >
                        <Pencil />
                      </button>
                      <button
                        className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete "${task.title}"`}
                        type="button"
                      >
                        <Trash2 />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default List;
