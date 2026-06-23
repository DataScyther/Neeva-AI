import React from "react";
import { useAppContext } from "./AppContext";

export function Dashboard() {
  const { state, dispatch } = useAppContext();

  const todayMoodEntries = state.moodEntries.filter((entry) => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  const completedExercises = state.exercises.filter((ex) => ex.completed);
  const totalStreak = state.exercises.reduce((sum, ex) => sum + ex.streak, 0);

  const averageMood =
    todayMoodEntries.length > 0
      ? todayMoodEntries.reduce((sum, entry) => sum + entry.mood, 0) /
        todayMoodEntries.length
      : 0;

  const getMoodEmoji = (mood: number) => {
    if (mood >= 4.5) return "😊";
    if (mood >= 3.5) return "🙂";
    if (mood >= 2.5) return "😐";
    if (mood >= 1.5) return "😕";
    if (mood > 0) return "😢";
    return "😶"; // No mood logged
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      {/* Background Decorative Blobs */}
      <div className="abstract-blobs pointer-events-none">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <svg
          className="absolute top-[15%] left-0 w-full h-64 text-blue-100/40 fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
        >
          <path d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,133.3C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {/* Header Section */}
        <header className="text-center mb-12">
          <p className="text-slate-500 text-xl font-medium mb-1">
            {getTimeOfDayGreeting()}
          </p>
          <h2 className="text-4xl font-bold text-slate-800 mb-2">
            Welcome back, {state.user?.name || "Guest User"}!
          </h2>
          <p className="text-slate-500">
            Ready to continue your wellness journey? Let's see how you're doing
            today ✨
          </p>
        </header>

        {/* Top Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Mood Card */}
          <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-purple-200/50 bg-purple-50/30">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">
                Today's Mood
              </p>
              <span className="text-3xl">{getMoodEmoji(averageMood)}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
          </div>
          {/* Exercises Card */}
          <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-emerald-200/50 bg-emerald-50/30">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">
                Exercises Done
              </p>
              <h3 className="text-2xl font-bold text-slate-800">
                {completedExercises.length}/{state.exercises.length || 8}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
          </div>
          {/* Streak Card */}
          <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-blue-200/50 bg-blue-50/30">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">
                Current Streak
              </p>
              <h3 className="text-2xl font-bold text-slate-800">
                {totalStreak} days
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
              </svg>
            </div>
          </div>
          {/* Active Days Card */}
          <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-orange-200/50 bg-orange-50/30">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">
                Days Active
              </p>
              <h3 className="text-2xl font-bold text-slate-800">7 days</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
            <span className="text-xl">⚡</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Chat Card */}
            <div
              className="glass-card glass-card-hover p-8 rounded-[3rem] border-indigo-100/50 cursor-pointer"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "chatbot" })}
            >
              <div className="w-12 h-12 flex items-center justify-center text-indigo-500 shadow-sm mb-6 bg-indigo-100 rounded-full">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Chat with Neeva
              </h3>
              <p className="text-slate-500 mb-8">Chat with Neeva</p>
              <button className="inline-flex items-center text-indigo-600 font-semibold group">
                Let's get started
                <svg
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
            {/* Mood Card */}
            <div
              className="glass-card glass-card-hover p-8 rounded-[3rem] border-pink-100/50 cursor-pointer"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "mood" })}
            >
              <div className="w-12 h-12 flex items-center justify-center text-pink-500 shadow-sm mb-6 bg-pink-50 rounded-full">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Track Your Mood
              </h3>
              <p className="text-slate-500 mb-8">Track your mood</p>
              <button className="inline-flex items-center text-pink-600 font-semibold group">
                Let's get started
                <svg
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
            {/* CBT Card */}
            <div
              className="glass-card glass-card-hover p-8 rounded-[3rem] border-emerald-100/50 cursor-pointer"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "exercises" })}
            >
              <div className="w-12 h-12 flex items-center justify-center text-emerald-500 shadow-sm mb-6 bg-emerald-100 rounded-full">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                  <path d="M8 7h6"></path>
                  <path d="M8 11h8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                CBT Exercises
              </h3>
              <p className="text-slate-500 mb-8">Learn and book</p>
              <button className="inline-flex items-center text-emerald-600 font-semibold group">
                Let's get started
                <svg
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
            {/* Support Card */}
            <div
              className="glass-card glass-card-hover p-8 rounded-[3rem] border-orange-100/50 cursor-pointer"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "community" })}
            >
              <div className="w-12 h-12 flex items-center justify-center text-orange-500 shadow-sm mb-6 bg-orange-100 rounded-full">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Support Groups
              </h3>
              <p className="text-slate-500 mb-8">Support groups</p>
              <button className="inline-flex items-center text-orange-600 font-semibold group">
                Let's get started
                <svg
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Lower Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Section */}
          <section className="glass-card p-8 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">
                Today's Progress
              </h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                  <svg
                    fill="none"
                    height="20"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 3v18h18"></path>
                    <path d="M18 17V9"></path>
                    <path d="M13 17V5"></path>
                    <path d="M8 17v-3"></path>
                  </svg>
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                  <svg
                    fill="none"
                    height="20"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="3"></rect>
                    <circle cx="12" cy="10" r="3"></circle>
                    <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-48 flex items-center justify-center">
              {/* Custom SVG Donut Chart for Progress */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-slate-100"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                  ></circle>
                  <circle
                    className="text-blue-500"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="70"
                    stroke="currentColor"
                    strokeDasharray="440"
                    strokeDashoffset={440 - (440 * (completedExercises.length / (state.exercises.length || 8) * 100)) / 100}
                    strokeWidth="12"
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800">
                    {Math.round((completedExercises.length / (state.exercises.length || 8)) * 100)}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Goal
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Section */}
          <section className="glass-card p-8 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">
                Recent Activity
              </h2>
              <button className="text-slate-400 hover:text-slate-600">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div>
            <div className="space-y-6 overflow-y-auto max-h-[220px] pr-2">
              {completedExercises.slice(-1).map((ex) => (
                <div key={ex.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <svg
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      Completed "{ex.title}"
                    </p>
                    <p className="text-sm text-slate-500">Recently</p>
                  </div>
                </div>
              ))}

              {state.moodEntries
                .slice(-2)
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 opacity-80"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 flex-shrink-0">
                      <svg
                        fill="none"
                        height="20"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        Mood logged: {entry.mood}/5
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              {state.moodEntries.length === 0 &&
                completedExercises.length === 0 && (
                  <div className="text-center py-4 text-slate-500">
                    No recent activity. Try completing an exercise!
                  </div>
                )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

