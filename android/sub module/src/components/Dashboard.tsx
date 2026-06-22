import React from "react";
import { useAppContext } from "./AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Heart,
  MessageCircle,
  BookOpen,
  Users,
} from "lucide-react";

export function Dashboard() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {state.user?.name}!
        </h1>
        <p className="text-muted-foreground">
          How are you feeling today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all"
          onClick={() =>
            dispatch({ type: "SET_VIEW", payload: "chatbot" })
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <span>AI Therapist</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get personalized support
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all"
          onClick={() =>
            dispatch({ type: "SET_VIEW", payload: "mood" })
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span>Mood Tracker</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Log how you are feeling
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all"
          onClick={() =>
            dispatch({ type: "SET_VIEW", payload: "exercises" })
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              <span>CBT Exercises</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Practice mindfulness
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all"
          onClick={() =>
            dispatch({ type: "SET_VIEW", payload: "community" })
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span>Community</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with others
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">
                Mood Entries: {state.moodEntries.length}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">
                Completed Exercises:{" "}
                {
                  state.exercises.filter((ex) => ex.completed)
                    .length
                }
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">
                Chat Messages: {state.chatHistory.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}