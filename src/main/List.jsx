import React, { useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Search } from "lucide-react";
const List = () => {
  const [input, setInput] = useState("");
  const [task, setTask] = useState([]);
  const [editedtext, seteditedText] = useState("");
  const [editedId, seteditedId] = useState(null);
  const [isCompleted, setisCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-100 text-slate-800">
      <header className="px-4 py-8 text-center text-4xl font-bold tracking-tight text-red-700 sm:text-5xl">
        To-Do App
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-12">
        <div className="flex justify-center">
          <form
            className="flex w-full max-w-3xl flex-col items-stretch gap-3 rounded-2xl border border-red-100 bg-white p-4 text-center shadow-lg shadow-red-900/10 sm:flex-row sm:items-center sm:p-5"
            onSubmit={(e) => {
              e.preventDefault();
              let newTask = input.trim();
              if (newTask === "") {
                toast.warning("Enter something")
              } else if (task.includes(newTask)) {
                toast.warning("Already  added");
              } else {
                let newlist = [...task, newTask];
                setTask(newlist);
                setInput("");
                toast.success("Task added!")
              }
            }}
          >
            <label htmlFor="taskE">Enter Task</label>
            <input
              type="text"
              id="taskE"
              className="w-full min-w-0 rounded-xl border border-red-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 sm:flex-1"
              onChange={(e) => {
                setInput(e.target.value);
              }}
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
          <ul className="flex w-full max-w-3xl flex-col gap-3">
            {task.map((item, i) => (
              <li
                key={i}
                className="flex w-full flex-col gap-4 rounded-2xl border border-red-100 bg-white p-4 shadow-md shadow-red-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                {i === editedId ? (
                  <>
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <input
                        type="text"
                        className="min-w-0 flex-1 rounded-xl border border-red-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        value={editedtext}
                        onChange={(e) => {
                          seteditedText(e.target.value);
                        }}
                      />
                      <button
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                        onClick={() => {
                          let updatedTask = [...task];
                          updatedTask[editedId] = editedtext;
                          setTask(updatedTask);
                          seteditedText("");
                          seteditedId(null);
                          toast.success("Task Updated")
                        }}
                        type="button"
                      >
                        Update
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <input type="checkbox" className="peer size-4 shrink-0 accent-red-600" />
                      <span  className="break-words text-lg font-medium text-slate-700 peer-checked:text-slate-400 peer-checked:line-through">{item}</span>
                      
                    </div>

                    <button
                      className="rounded-lg border border-red-200 bg-white px-4 py-2 font-medium text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={(e) => {
                        seteditedId(i);
                        seteditedText(item);
                      }}
                    >
                      <Pencil/>
                    </button>
                    <button
                      className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                      onClick={() => {
                        let updated = task.filter((x, idx) => idx != i);
                        setTask(updated);
                        toast.success("Task deleted")
                      }}
                    >
                      <Trash2/>
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default List;
