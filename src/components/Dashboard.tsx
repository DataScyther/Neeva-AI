import React from "react";
import { useAppContext } from "./AppContext";
import { 
  Heart, 
  Target, 
  Flame, 
  Star, 
  MessageCircle, 
  BookOpen, 
  Users, 
  ChevronRight,
  MoreHorizontal,
  LineChart
} from "lucide-react";

export function Dashboard() {
  const { state, dispatch } = useAppContext();

  const todayMoodEntries = (state.moodEntries || []).filter((entry) => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  const completedExercises = (state.exercises || []).filter((ex) => ex.completed);
  const totalStreak = (state.exercises || []).reduce((sum, ex) => sum + ex.streak, 0);

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
    return "🥺"; // Default emoji
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // StatCard matching reference image: Title on top-left, Emoji/Value bottom-left, Icon top-right (no, wait! the icon is on the right side!)
  // Looking at the screenshot: Title top-left. Value bottom-left. Icon in a circle on the right side, vertically centered.
  interface StatCardProps {
    title: string;
    value?: string;
    emoji?: string;
    icon: React.ComponentType<any>;
    iconColor: string;
    bgCircleColor: string;
    cardBg?: string;
  }

  const StatCard = ({ title, value, emoji, icon: Icon, iconColor, bgCircleColor, cardBg = "bg-white/60" }: StatCardProps) => (
    <div className={`h-[110px] rounded-[24px] ${cardBg} backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-white/60 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between`}>
      <div className="flex flex-col justify-between h-full">
        <span className="text-[#334155] text-[13px] font-medium tracking-tight">{title}</span>
        <div className="mt-auto">
          {emoji ? (
            <span className="text-[32px] leading-none filter drop-shadow-sm">{emoji}</span>
          ) : (
            <span className="text-[32px] font-bold text-[#0F172A] leading-none tracking-tight">{value}</span>
          )}
        </div>
      </div>
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bgCircleColor }}>
        <Icon className="w-6 h-6" style={{ color: iconColor }} />
      </div>
    </div>
  );

  interface ActionCardProps {
    title: string;
    subtitle: string;
    icon: React.ComponentType<any>;
    iconColor: string;
    blobColor: string;
    onClick: () => void;
  }

  const ActionCard = ({ title, subtitle, icon: Icon, iconColor, blobColor, onClick }: ActionCardProps) => (
    <div 
      className="h-[220px] rounded-[28px] bg-white/70 backdrop-blur-xl p-6 relative overflow-hidden cursor-pointer shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-white/60 hover:-translate-y-1 transition-all duration-300 group"
      onClick={onClick}
    >
      {/* Corner Blob Gradient */}
      <div 
        className="absolute -top-10 -right-10 w-[160px] h-[160px] rounded-full opacity-[0.15] blur-xl pointer-events-none transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundColor: blobColor }}
      />
      
      <div className="flex flex-col justify-between h-full relative z-10">
        <div>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 mb-5">
            <Icon className="w-5 h-5" style={{ color: iconColor }} />
          </div>
          <h3 className="text-[17px] font-bold text-[#0F172A] tracking-tight">{title}</h3>
          <p className="text-[14px] text-[#64748B] mt-0.5 font-medium">{subtitle}</p>
        </div>

        <div>
          <div className="w-full border-t border-slate-200/60 my-3" />
          <div className="flex items-center justify-between text-[#0F172A] font-semibold text-[13px]">
            <span>Let's get started</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-slate-400 group-hover:text-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto relative w-full h-full pb-10">
      <main className="w-full max-w-[1000px] mx-auto px-6 py-10 relative z-10 flex flex-col justify-start">
        
        {/* Hero Section */}
        <header className="text-center mb-10 select-none">
          <p className="text-[20px] font-medium text-[#475569] tracking-tight mb-2">
            {getTimeOfDayGreeting()}
          </p>
          <h1 className="text-[40px] font-bold text-[#0F172A] leading-tight tracking-tight mb-3">
            Welcome back, {state.user?.name || "Guest User"}!
          </h1>
          <p className="text-[15px] text-[#475569] max-w-[600px] mx-auto font-medium">
            Ready to continue your wellness journey? Let's see how you're doing today ✨
          </p>
        </header>

        {/* Statistics Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Today's Mood"
            emoji={getMoodEmoji(averageMood)}
            icon={Heart}
            iconColor="#7C3AED"
            bgCircleColor="#F3E8FF"
            cardBg="bg-white/80"
          />
          <StatCard
            title="Exercises Done"
            value={`${completedExercises.length}/8`}
            icon={Target}
            iconColor="#10B981"
            bgCircleColor="#D1FAE5"
            cardBg="bg-white/70"
          />
          <StatCard
            title="Current Streak"
            value={`${totalStreak} days`}
            icon={Flame}
            iconColor="#3B82F6"
            bgCircleColor="#DBEAFE"
            cardBg="bg-white/70"
          />
          <StatCard
            title="Days Active"
            value="7 days"
            icon={Star}
            iconColor="#F59E0B"
            bgCircleColor="#FEF3C7"
            cardBg="bg-white/70"
          />
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-5 tracking-tight flex items-center gap-1.5">
            Quick Actions ⚡
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ActionCard
              title="Chat with Neeva"
              subtitle="Chat with Neeva"
              icon={MessageCircle}
              blobColor="#818CF8" // Purple/Indigo
              iconColor="#6366F1"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "chatbot" })}
            />
            <ActionCard
              title="Track Your Mood"
              subtitle="Track your mood"
              icon={Heart}
              blobColor="#F472B6" // Pink
              iconColor="#EC4899"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "mood" })}
            />
            <ActionCard
              title="CBT Exercises"
              subtitle="Learn and book"
              icon={BookOpen}
              blobColor="#34D399" // Green
              iconColor="#10B981"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "exercises" })}
            />
            <ActionCard
              title="Support Groups"
              subtitle="Support groups"
              icon={Users}
              blobColor="#FBBF24" // Orange/Amber
              iconColor="#F59E0B"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "community" })}
            />
          </div>
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Today's Progress */}
          <div className="h-[260px] rounded-[28px] bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-white/60 flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[17px] font-bold text-[#0F172A] tracking-tight">Today's Progress</h3>
              <div className="flex gap-2">
                <LineChart className="w-5 h-5 text-slate-400" />
                <Users className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              {/* Donut Chart Mockup */}
              <div className="relative w-[140px] h-[140px]">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0F172A" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="251.2" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#0F172A]">0%</span>
                  <span className="text-[10px] font-bold tracking-wider text-slate-500">GOAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="h-[260px] rounded-[28px] bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-white/60 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[17px] font-bold text-[#0F172A] tracking-tight">Recent Activity</h3>
              <MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer" />
            </div>
            <div className="flex-1 flex items-center justify-center text-[14px] text-slate-500 font-medium">
              No recent activity. Try completing an exercise!
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
