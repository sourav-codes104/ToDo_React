import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "./supabaseClient";
import List from "./main/List";

const App = () => {
  const [session, setSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [authMode, setAuthMode] = useState("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setIsCheckingSession(false);
      }
    });

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (error) {
          toast.error(`Could not check sign-in status: ${error.message}`);
        } else {
          setSession(data.session);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(`Could not check sign-in status: ${error.message}`);
        }
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    };

    loadSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthMessage("");
    setIsSubmitting(true);

    try {
      const result =
        authMode === "sign_up"
          ? await supabase.auth.signUp({
              email: email.trim(),
              password,
            })
          : await supabase.auth.signInWithPassword({
              email: email.trim(),
              password,
            });

      if (result.error) {
        toast.error(result.error.message);
      } else if (authMode === "sign_up" && !result.data.session) {
        setAuthMessage(
          "Check your email for a confirmation link, then sign in.",
        );
      } else {
        toast.success(
          authMode === "sign_up" ? "Account created" : "Signed in",
        );
      }
    } catch (error) {
      toast.error(`Authentication failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Could not sign out: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-100">
      <ToastContainer position="top-right" />
      {isCheckingSession ? (
        <p className="p-8 text-center text-slate-600">Checking sign-in...</p>
      ) : session ? (
        <>
          <div className="mx-auto flex w-full max-w-5xl items-center justify-end gap-4 px-4 pt-5">
            <span className="text-sm text-slate-600">{session.user.email}</span>
            <button
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
              type="button"
            >
              Sign out
            </button>
          </div>
          <List userId={session.user.id} />
        </>
      ) : (
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
          <section className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-lg shadow-red-900/10 sm:p-8">
            <h1 className="text-center text-3xl font-bold text-red-700">
              {authMode === "sign_in" ? "Sign in" : "Create an account"}
            </h1>
            <p className="mt-2 text-center text-sm text-slate-600">
              Your tasks are private to your account.
            </p>
            <form className="mt-6 flex flex-col gap-4" onSubmit={handleAuthSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  required
                  className="rounded-xl border border-red-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  autoComplete={
                    authMode === "sign_in" ? "current-password" : "new-password"
                  }
                  required
                  className="rounded-xl border border-red-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {authMessage && (
                <p className="text-sm text-green-700">{authMessage}</p>
              )}
              <button
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Please wait..."
                  : authMode === "sign_in"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-600">
              {authMode === "sign_in"
                ? "New here?"
                : "Already have an account?"}{" "}
              <button
                className="font-semibold text-red-700 hover:underline"
                onClick={() => {
                  setAuthMessage("");
                  setAuthMode((mode) =>
                    mode === "sign_in" ? "sign_up" : "sign_in",
                  );
                }}
                type="button"
              >
                {authMode === "sign_in" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </section>
        </main>
      )}
    </div>
  );
};

export default App;
