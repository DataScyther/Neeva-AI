import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Progress } from "./ui/progress";
import { useAppContext } from "./AppContext";
import {
  Heart,
  Brain,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
// Simplified without animations for stability

interface OnboardingData {
  goals: string[];
  experience: string;
  reminderTime: string;
  interests: string[];
  challenges: string[];
}

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Neeva",
    description: "Your personal mental health companion",
    icon: Heart,
  },
  {
    id: 2,
    title: "Set Your Goals",
    description: "What would you like to focus on?",
    icon: Target,
  },
  {
    id: 3,
    title: "Your Experience",
    description: "Help us personalize your journey",
    icon: Brain,
  },
  {
    id: 4,
    title: "Preferences",
    description: "Customize your experience",
    icon: Users,
  },
  {
    id: 5,
    title: "You're All Set!",
    description: "Let's begin your wellness journey",
    icon: CheckCircle,
  },
];

const goalOptions = [
  {
    id: "anxiety",
    label: "Manage Anxiety",
    description: "Learn coping strategies and techniques",
  },
  {
    id: "mood",
    label: "Track Mood",
    description: "Monitor emotional patterns and trends",
  },
  {
    id: "mindfulness",
    label: "Practice Mindfulness",
    description: "Build meditation and awareness habits",
  },
  {
    id: "sleep",
    label: "Improve Sleep",
    description: "Develop better sleep hygiene",
  },
  {
    id: "stress",
    label: "Reduce Stress",
    description: "Learn stress management techniques",
  },
  {
    id: "habits",
    label: "Build Healthy Habits",
    description: "Create positive daily routines",
  },
];

const experienceOptions = [
  {
    id: "beginner",
    label: "New to wellness apps",
    description: "I'm just starting my wellness journey",
  },
  {
    id: "some",
    label: "Some experience",
    description: "I've tried a few wellness apps or techniques",
  },
  {
    id: "experienced",
    label: "Very experienced",
    description:
      "I'm familiar with CBT and mindfulness practices",
  },
];

const interestOptions = [
  { id: "meditation", label: "Guided Meditation" },
  { id: "journaling", label: "Journaling" },
  { id: "breathing", label: "Breathing Exercises" },
  { id: "community", label: "Community Support" },
  { id: "tracking", label: "Progress Tracking" },
  { id: "cbt", label: "CBT Techniques" },
];

export function Onboarding() {
  const { dispatch } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] =
    useState<OnboardingData>({
      goals: [],
      experience: "",
      reminderTime: "09:00",
      interests: [],
      challenges: [],
    });

  const handleGoalToggle = (goalId: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const handleInterestToggle = (interestId: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((i) => i !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleComplete = () => {
    // Store onboarding data in context or local storage
    localStorage.setItem("onboardingCompleted", "true");
    localStorage.setItem(
      "onboardingData",
      JSON.stringify(onboardingData),
    );

    // Navigate to dashboard
    dispatch({ type: "SET_VIEW", payload: "dashboard" });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 2:
        return onboardingData.goals.length > 0;
      case 3:
        return onboardingData.experience !== "";
      case 4:
        return onboardingData.interests.length > 0;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                Welcome to Neeva
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Your personal AI-powered mental health
                companion. We're here to support you on your
                wellness journey with evidence-based tools and
                techniques.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center space-y-2">
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">AI Therapist</h3>
                <p className="text-sm text-muted-foreground">
                  24/7 emotional support
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold">
                  Track Progress
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your wellbeing
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with others
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                What are your wellness goals?
              </h2>
              <p className="text-muted-foreground">
                Choose all that apply. We'll personalize your
                experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalOptions.map((goal) => (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    onboardingData.goals.includes(goal.id)
                      ? "border-2 border-blue-500 bg-blue-50"
                      : "border border-gray-200"
                  }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={onboardingData.goals.includes(
                          goal.id,
                        )}
                        className="mt-1"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {goal.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                What's your experience level?
              </h2>
              <p className="text-muted-foreground">
                This helps us provide the right level of
                guidance.
              </p>
            </div>
            <RadioGroup
              value={onboardingData.experience}
              onValueChange={(value) =>
                setOnboardingData((prev) => ({
                  ...prev,
                  experience: value,
                }))
              }
              className="space-y-4"
            >
              {experienceOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    onboardingData.experience === option.id
                      ? "border-2 border-blue-500 bg-blue-50"
                      : "border border-gray-200"
                  }`}
                  onClick={() =>
                    setOnboardingData((prev) => ({
                      ...prev,
                      experience: option.id,
                    }))
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="mt-1"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {option.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                What interests you most?
              </h2>
              <p className="text-muted-foreground">
                We'll prioritize these features for you.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <Card
                  key={interest.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    onboardingData.interests.includes(
                      interest.id,
                    )
                      ? "border-2 border-blue-500 bg-blue-50"
                      : "border border-gray-200"
                  }`}
                  onClick={() =>
                    handleInterestToggle(interest.id)
                  }
                >
                  <CardContent className="p-3 text-center">
                    <Checkbox
                      checked={onboardingData.interests.includes(
                        interest.id,
                      )}
                      className="mb-2"
                    />
                    <p className="text-sm font-medium">
                      {interest.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-3">
              <Label htmlFor="reminderTime">
                Daily reminder time (optional)
              </Label>
              <Input
                id="reminderTime"
                type="time"
                value={onboardingData.reminderTime}
                onChange={(e) =>
                  setOnboardingData((prev) => ({
                    ...prev,
                    reminderTime: e.target.value,
                  }))
                }
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                We'll send you a gentle reminder to check in
                with your wellbeing.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                You're all set!
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Your personalized wellness journey is ready.
                Remember, small steps lead to big changes.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">
                  Your Personalized Plan
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-blue-800">
                    Selected Goals:
                  </p>
                  <ul className="text-blue-700 mt-1">
                    {onboardingData.goals.map((goalId) => (
                      <li key={goalId}>
                        •{" "}
                        {
                          goalOptions.find(
                            (g) => g.id === goalId,
                          )?.label
                        }
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-blue-800">
                    Interests:
                  </p>
                  <ul className="text-blue-700 mt-1">
                    {onboardingData.interests.map(
                      (interestId) => (
                        <li key={interestId}>
                          •{" "}
                          {
                            interestOptions.find(
                              (i) => i.id === interestId,
                            )?.label
                          }
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {onboardingSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(
                (currentStep / onboardingSteps.length) * 100,
              )}
              % complete
            </span>
          </div>
          <Progress
            value={(currentStep / onboardingSteps.length) * 100}
            className="h-2"
          />
        </div>

        {/* Main Content */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentStep((prev) => Math.max(1, prev - 1))
            }
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          {currentStep < onboardingSteps.length ? (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!canProceed()}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <span>Get Started</span>
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}