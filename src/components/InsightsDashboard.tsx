import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { useAppContext } from "./AppContext";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Brain,
  Heart,
  Clock,
  Award,
  Zap,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
// Simplified without animations for stability

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export function InsightsDashboard() {
  const { state } = useAppContext();

  const insights = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000,
    );
    const sevenDaysAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    );

    // Filter mood entries for different time periods
    const allMoodEntries = state.moodEntries;
    const recentEntries = allMoodEntries.filter(
      (entry) => new Date(entry.timestamp) >= sevenDaysAgo,
    );
    const monthlyEntries = allMoodEntries.filter(
      (entry) => new Date(entry.timestamp) >= thirtyDaysAgo,
    );

    // Calculate averages
    const overallAverage =
      allMoodEntries.length > 0
        ? allMoodEntries.reduce(
            (sum, entry) => sum + entry.mood,
            0,
          ) / allMoodEntries.length
        : 0;

    const recentAverage =
      recentEntries.length > 0
        ? recentEntries.reduce(
            (sum, entry) => sum + entry.mood,
            0,
          ) / recentEntries.length
        : 0;

    const previousWeekEntries = allMoodEntries.filter(
      (entry) => {
        const entryDate = new Date(entry.timestamp);
        const fourteenDaysAgo = new Date(
          now.getTime() - 14 * 24 * 60 * 60 * 1000,
        );
        return (
          entryDate >= fourteenDaysAgo &&
          entryDate < sevenDaysAgo
        );
      },
    );

    const previousWeekAverage =
      previousWeekEntries.length > 0
        ? previousWeekEntries.reduce(
            (sum, entry) => sum + entry.mood,
            0,
          ) / previousWeekEntries.length
        : 0;

    // Mood distribution
    const moodDistribution = [
      {
        mood: "Very Sad",
        value: 1,
        count: allMoodEntries.filter((e) => e.mood === 1)
          .length,
        color: "#EF4444",
      },
      {
        mood: "Sad",
        value: 2,
        count: allMoodEntries.filter((e) => e.mood === 2)
          .length,
        color: "#F97316",
      },
      {
        mood: "Neutral",
        value: 3,
        count: allMoodEntries.filter((e) => e.mood === 3)
          .length,
        color: "#EAB308",
      },
      {
        mood: "Good",
        value: 4,
        count: allMoodEntries.filter((e) => e.mood === 4)
          .length,
        color: "#22C55E",
      },
      {
        mood: "Excellent",
        value: 5,
        count: allMoodEntries.filter((e) => e.mood === 5)
          .length,
        color: "#10B981",
      },
    ].filter((item) => item.count > 0);

    // Weekly trend data
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        now.getTime() - i * 24 * 60 * 60 * 1000,
      );
      const dayEntries = allMoodEntries.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === date.toDateString();
      });

      const dayAverage =
        dayEntries.length > 0
          ? dayEntries.reduce(
              (sum, entry) => sum + entry.mood,
              0,
            ) / dayEntries.length
          : null;

      weeklyTrend.push({
        day: date.toLocaleDateString("en", {
          weekday: "short",
        }),
        date: date.toLocaleDateString(),
        mood: dayAverage,
        entries: dayEntries.length,
      });
    }

    // Exercise insights
    const completedExercises = state.exercises.filter(
      (ex) => ex.completed,
    );
    const exercisesByType = state.exercises.reduce(
      (acc, ex) => {
        if (ex.completed) {
          acc[ex.type] = (acc[ex.type] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const exerciseData = Object.entries(exercisesByType).map(
      ([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count,
        color:
          COLORS[
            Object.keys(exercisesByType).indexOf(type) %
              COLORS.length
          ],
      }),
    );

    // Streak calculation
    const totalStreak = state.exercises.reduce(
      (sum, ex) => sum + ex.streak,
      0,
    );

    // Time patterns
    const timePatterns = allMoodEntries.reduce(
      (acc, entry) => {
        const hour = new Date(entry.timestamp).getHours();
        const timeOfDay =
          hour < 6
            ? "Night"
            : hour < 12
              ? "Morning"
              : hour < 18
                ? "Afternoon"
                : "Evening";

        if (!acc[timeOfDay]) {
          acc[timeOfDay] = { total: 0, count: 0 };
        }
        acc[timeOfDay].total += entry.mood;
        acc[timeOfDay].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    const timeData = Object.entries(timePatterns).map(
      ([time, data]) => ({
        time,
        average: data.total / data.count,
        entries: data.count,
      }),
    );

    return {
      overallAverage,
      recentAverage,
      previousWeekAverage,
      moodDistribution,
      weeklyTrend,
      completedExercises,
      exerciseData,
      totalStreak,
      timeData,
      totalEntries: allMoodEntries.length,
      recentEntries: recentEntries.length,
    };
  }, [state.moodEntries, state.exercises]);

  const getTrendIndicator = () => {
    if (insights.previousWeekAverage === 0)
      return {
        icon: Activity,
        color: "text-gray-500",
        text: "No previous data",
      };

    const change =
      insights.recentAverage - insights.previousWeekAverage;
    if (change > 0.2)
      return {
        icon: TrendingUp,
        color: "text-green-600",
        text: `+${change.toFixed(1)} vs last week`,
      };
    if (change < -0.2)
      return {
        icon: TrendingDown,
        color: "text-red-600",
        text: `${change.toFixed(1)} vs last week`,
      };
    return {
      icon: Activity,
      color: "text-gray-500",
      text: "Stable vs last week",
    };
  };

  const trend = getTrendIndicator();
  const TrendIcon = trend.icon;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <BarChart3 className="w-8 h-8 text-blue-500" />
          <span>Wellness Insights</span>
        </h1>
        <p className="text-muted-foreground">
          Discover patterns and track your mental health journey
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  7-Day Average
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {insights.recentAverage > 0
                    ? insights.recentAverage.toFixed(1)
                    : "--"}
                </p>
                <div
                  className={`flex items-center space-x-1 text-xs ${trend.color}`}
                >
                  <TrendIcon className="w-3 h-3" />
                  <span>{trend.text}</span>
                </div>
              </div>
              <Heart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Exercises Done
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {insights.completedExercises.length}
                </p>
                <p className="text-xs text-green-600">
                  {insights.totalStreak} total streak
                </p>
              </div>
              <Brain className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Entries
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {insights.totalEntries}
                </p>
                <p className="text-xs text-purple-600">
                  {insights.recentEntries} this week
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Overall Average
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {insights.overallAverage > 0
                    ? insights.overallAverage.toFixed(1)
                    : "--"}
                </p>
                <p className="text-xs text-orange-600">
                  All time
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="mood"
            className="flex items-center space-x-2"
          >
            <Heart className="w-4 h-4" />
            <span>Mood Trends</span>
          </TabsTrigger>
          <TabsTrigger
            value="exercises"
            className="flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>Exercises</span>
          </TabsTrigger>
          <TabsTrigger
            value="patterns"
            className="flex items-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>Patterns</span>
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="flex items-center space-x-2"
          >
            <Award className="w-4 h-4" />
            <span>Achievements</span>
          </TabsTrigger>
        </TabsList>

        {/* Mood Trends */}
        <TabsContent value="mood" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Mood Trend</CardTitle>
                <CardDescription>
                  Your mood patterns over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={insights.weeklyTrend.filter(
                        (d) => d.mood !== null,
                      )}
                    >
                      <defs>
                        <linearGradient
                          id="moodGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                      />
                      <XAxis dataKey="day" stroke="#64748b" />
                      <YAxis
                        domain={[1, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        stroke="#64748b"
                      />
                      <Area
                        type="monotone"
                        dataKey="mood"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fill="url(#moodGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
                <CardDescription>
                  How often you feel each mood level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <RechartsPieChart>
                      <Pie
                        data={insights.moodDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="count"
                        label={({ mood, count }) =>
                          `${mood}: ${count}`
                        }
                      >
                        {insights.moodDistribution.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          ),
                        )}
                      </Pie>
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mood Insights</CardTitle>
              <CardDescription>
                Personalized observations about your mood
                patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.overallAverage >= 4 && (
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="bg-green-500 p-1 rounded-full">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">
                      Excellent Wellbeing
                    </p>
                    <p className="text-sm text-green-700">
                      Your average mood is{" "}
                      {insights.overallAverage.toFixed(1)}/5.
                      You're maintaining great mental health!
                    </p>
                  </div>
                </div>
              )}

              {insights.recentAverage >
                insights.overallAverage + 0.3 && (
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="bg-blue-500 p-1 rounded-full">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">
                      Positive Trend
                    </p>
                    <p className="text-sm text-blue-700">
                      Your recent mood (
                      {insights.recentAverage.toFixed(1)}) is
                      higher than your overall average. Keep up
                      the good work!
                    </p>
                  </div>
                </div>
              )}

              {insights.recentEntries === 0 && (
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="bg-amber-500 p-1 rounded-full">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">
                      Check In Reminder
                    </p>
                    <p className="text-sm text-amber-700">
                      You haven't logged your mood this week.
                      Regular tracking helps identify patterns.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercise Insights */}
        <TabsContent value="exercises" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Exercise Completion by Type
                </CardTitle>
                <CardDescription>
                  Which exercises you practice most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart data={insights.exerciseData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                      />
                      <XAxis dataKey="type" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Bar
                        dataKey="count"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>
                  Your exercise completion status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.exerciseData.map(
                  (exercise, index) => (
                    <div
                      key={exercise.type}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {exercise.type}
                        </span>
                        <Badge variant="secondary">
                          {exercise.count} completed
                        </Badge>
                      </div>
                      <Progress
                        value={Math.min(
                          (exercise.count / 10) * 100,
                          100,
                        )}
                        className="h-2"
                      />
                    </div>
                  ),
                )}
                {insights.exerciseData.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>
                      Complete some exercises to see your
                      progress here!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Time Patterns */}
        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time of Day Patterns</CardTitle>
              <CardDescription>
                When you typically feel different moods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    data={insights.timeData}
                    innerRadius="30%"
                    outerRadius="80%"
                  >
                    <RadialBar
                      dataKey="average"
                      cornerRadius={10}
                      fill="#3B82F6"
                    />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.totalEntries >= 7 && (
              <div>
                <Card className="border-2 border-gold bg-gradient-to-br from-yellow-50 to-amber-100">
                  <CardContent className="p-4 text-center">
                    <div className="bg-yellow-500 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-yellow-800">
                      Week Warrior
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Tracked mood for 7+ days
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {insights.totalStreak >= 5 && (
              <div>
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-100">
                  <CardContent className="p-4 text-center">
                    <div className="bg-blue-500 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-blue-800">
                      Exercise Explorer
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Completed 5+ exercises
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {insights.overallAverage >= 4 && (
              <div>
                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100">
                  <CardContent className="p-4 text-center">
                    <div className="bg-green-500 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-green-800">
                      Wellness Master
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      Average mood 4.0+
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
