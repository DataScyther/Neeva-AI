import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Phone,
  MessageCircle,
  Globe,
  Heart,
  Shield,
  Clock,
  MapPin,
  ExternalLink,
  AlertTriangle,
  User,
  Users,
  Headphones,
  Video,
} from "lucide-react";
// Simplified without animations for stability

interface CrisisResource {
  id: string;
  name: string;
  description: string;
  phone?: string;
  text?: string;
  website?: string;
  hours: string;
  type:
    | "suicide"
    | "crisis"
    | "domestic"
    | "substance"
    | "lgbtq"
    | "teen"
    | "veteran";
  features: string[];
  icon: React.ComponentType<any>;
  urgent?: boolean;
}

const crisisResources: CrisisResource[] = [
  {
    id: "suicide-lifeline",
    name: "988 Suicide & Crisis Lifeline",
    description:
      "24/7 free and confidential emotional support for people in distress.",
    phone: "988",
    text: "Text 988",
    website: "https://988lifeline.org",
    hours: "24/7",
    type: "suicide",
    features: [
      "Free",
      "Confidential",
      "Crisis counseling",
      "Suicide prevention",
    ],
    icon: Phone,
    urgent: true,
  },
  {
    id: "crisis-text",
    name: "Crisis Text Line",
    description: "Free crisis support via text message 24/7.",
    text: "Text HOME to 741741",
    website: "https://crisistextline.org",
    hours: "24/7",
    type: "crisis",
    features: [
      "Text-based",
      "Free",
      "Trained counselors",
      "Anonymous",
    ],
    icon: MessageCircle,
    urgent: true,
  },
  {
    id: "domestic-violence",
    name: "National Domestic Violence Hotline",
    description:
      "Support for those experiencing domestic violence.",
    phone: "1-800-799-7233",
    text: "Text START to 88788",
    website: "https://thehotline.org",
    hours: "24/7",
    type: "domestic",
    features: [
      "Safety planning",
      "Local resources",
      "Multiple languages",
    ],
    icon: Shield,
  },
  {
    id: "samhsa",
    name: "SAMHSA National Helpline",
    description:
      "Treatment referral service for mental health and substance use disorders.",
    phone: "1-800-662-4357",
    website: "https://samhsa.gov",
    hours: "24/7",
    type: "substance",
    features: [
      "Treatment referrals",
      "Information service",
      "Free",
    ],
    icon: Headphones,
  },
  {
    id: "trevor",
    name: "The Trevor Project",
    description:
      "24/7 crisis support services for LGBTQ young people.",
    phone: "1-866-488-7386",
    text: "Text START to 678678",
    website: "https://thetrevorproject.org",
    hours: "24/7",
    type: "lgbtq",
    features: [
      "LGBTQ+ focused",
      "Youth oriented",
      "Crisis intervention",
    ],
    icon: Heart,
  },
  {
    id: "teen-line",
    name: "Teen Line",
    description:
      "Teen-to-teen support and crisis intervention.",
    phone: "1-800-852-8336",
    text: "Text TEEN to 839863",
    website: "https://teenlineonline.org",
    hours: "6 PM - 10 PM PST",
    type: "teen",
    features: [
      "Peer support",
      "Teen counselors",
      "Text support",
    ],
    icon: Users,
  },
  {
    id: "veterans",
    name: "Veterans Crisis Line",
    description:
      "Free, confidential support for veterans and their families.",
    phone: "1-800-273-8255",
    text: "Text 838255",
    website: "https://veteranscrisisline.net",
    hours: "24/7",
    type: "veteran",
    features: [
      "Veteran-specific",
      "Family support",
      "Chat available",
    ],
    icon: User,
  },
];

const copingStrategies = [
  {
    title: "Grounding Technique (5-4-3-2-1)",
    description:
      "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
    icon: "👀",
  },
  {
    title: "Deep Breathing",
    description:
      "Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 3-4 times.",
    icon: "🫁",
  },
  {
    title: "Cold Water",
    description:
      "Splash cold water on your face or hold ice cubes to activate your dive response.",
    icon: "❄️",
  },
  {
    title: "Call Someone",
    description:
      "Reach out to a trusted friend, family member, or mental health professional.",
    icon: "📞",
  },
  {
    title: "Safe Space",
    description:
      "Go to a place where you feel safe and comfortable.",
    icon: "🏠",
  },
  {
    title: "Professional Help",
    description:
      "If you're in immediate danger, call 911 or go to the nearest emergency room.",
    icon: "🚨",
  },
];

export function CrisisSupport() {
  const [selectedType, setSelectedType] =
    useState<string>("all");

  const filteredResources =
    selectedType === "all"
      ? crisisResources
      : crisisResources.filter(
          (resource) => resource.type === selectedType,
        );

  const urgentResources = crisisResources.filter(
    (resource) => resource.urgent,
  );

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWebsite = (website: string) => {
    window.open(website, "_blank");
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Shield className="w-8 h-8 text-red-500" />
          <span>Crisis Support</span>
        </h1>
        <p className="text-muted-foreground">
          Immediate help and resources for mental health crises
        </p>
      </div>

      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>
            If you're in immediate danger, call 911 or go to
            your nearest emergency room.
          </strong>
          <br />
          If you're having thoughts of suicide, call or text 988
          for the Suicide & Crisis Lifeline.
        </AlertDescription>
      </Alert>

      {/* Quick Access - Urgent Resources */}
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <Phone className="w-5 h-5" />
            <span>Immediate Help</span>
          </CardTitle>
          <CardDescription className="text-red-600">
            Available 24/7 for immediate crisis support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentResources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card
                  key={resource.id}
                  className="border-red-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-500 p-2 rounded-full">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-red-800">
                          {resource.name}
                        </h3>
                        <p className="text-sm text-red-700">
                          {resource.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {resource.phone && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleCall(resource.phone!)
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Call {resource.phone}
                            </Button>
                          )}
                          {resource.text && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-100"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {resource.text}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">
            All Resources
          </TabsTrigger>
          <TabsTrigger value="coping">
            Coping Strategies
          </TabsTrigger>
          <TabsTrigger value="safety">
            Safety Planning
          </TabsTrigger>
        </TabsList>

        {/* All Resources */}
        <TabsContent value="resources" className="space-y-6">
          {/* Filter Options */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={
                selectedType === "all" ? "default" : "outline"
              }
              onClick={() => setSelectedType("all")}
              size="sm"
            >
              All Resources
            </Button>
            {Array.from(
              new Set(crisisResources.map((r) => r.type)),
            ).map((type) => (
              <Button
                key={type}
                variant={
                  selectedType === type ? "default" : "outline"
                }
                onClick={() => setSelectedType(type)}
                size="sm"
                className="capitalize"
              >
                {type === "lgbtq"
                  ? "LGBTQ+"
                  : type.replace("-", " ")}
              </Button>
            ))}
          </div>

          {/* Resource Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <div key={resource.id}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="bg-blue-500 p-2 rounded-full">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {resource.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {resource.description}
                          </p>
                        </div>
                        {resource.urgent && (
                          <Badge
                            variant="destructive"
                            className="text-xs"
                          >
                            Urgent
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{resource.hours}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.features.map(
                          (feature, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ),
                        )}
                      </div>

                      <div className="mt-auto space-y-2">
                        {resource.phone && (
                          <Button
                            className="w-full"
                            onClick={() =>
                              handleCall(resource.phone!)
                            }
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call {resource.phone}
                          </Button>
                        )}
                        <div className="flex gap-2">
                          {resource.text && (
                            <Button
                              variant="outline"
                              className="flex-1"
                              size="sm"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Text
                            </Button>
                          )}
                          {resource.website && (
                            <Button
                              variant="outline"
                              className="flex-1"
                              size="sm"
                              onClick={() =>
                                handleWebsite(resource.website!)
                              }
                            >
                              <Globe className="w-3 h-3 mr-1" />
                              Website
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Coping Strategies */}
        <TabsContent value="coping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Immediate Coping Strategies</CardTitle>
              <CardDescription>
                Quick techniques to help you through a crisis
                moment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {copingStrategies.map((strategy, index) => (
                  <Card
                    key={index}
                    className="border-l-4 border-l-blue-500"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">
                          {strategy.icon}
                        </span>
                        <div>
                          <h3 className="font-semibold text-blue-800">
                            {strategy.title}
                          </h3>
                          <p className="text-sm text-blue-700 mt-1">
                            {strategy.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              <strong>Remember:</strong> These strategies are
              helpful tools, but if you're in immediate danger
              or having thoughts of self-harm, please reach out
              for professional help immediately.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Safety Planning */}
        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Safety Plan</CardTitle>
              <CardDescription>
                A personalized plan to help you through
                difficult times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-l-green-500 pl-4">
                  <h3 className="font-semibold text-green-800">
                    Step 1: Warning Signs
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Identify thoughts, feelings, or behaviors
                    that indicate you're entering a crisis.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Examples: Feeling hopeless, isolating from
                    others, substance use, sleep changes
                  </p>
                </div>

                <div className="border-l-4 border-l-blue-500 pl-4">
                  <h3 className="font-semibold text-blue-800">
                    Step 2: Coping Strategies
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    List things you can do on your own to feel
                    better and stay safe.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Examples: Deep breathing, listening to
                    music, taking a walk, calling a friend
                  </p>
                </div>

                <div className="border-l-4 border-l-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-800">
                    Step 3: Support People
                  </h3>
                  <p className="text-sm text-purple-700 mt-1">
                    List trusted friends, family members, or
                    mentors you can contact.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Include names and phone numbers of people
                    who make you feel supported
                  </p>
                </div>

                <div className="border-l-4 border-l-orange-500 pl-4">
                  <h3 className="font-semibold text-orange-800">
                    Step 4: Professional Contacts
                  </h3>
                  <p className="text-sm text-orange-700 mt-1">
                    List mental health professionals and crisis
                    resources.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Include therapist, doctor, crisis hotlines,
                    and emergency services
                  </p>
                </div>

                <div className="border-l-4 border-l-red-500 pl-4">
                  <h3 className="font-semibold text-red-800">
                    Step 5: Make Environment Safe
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    Remove or secure anything that could be used
                    for self-harm.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ask someone you trust to help with this step
                  </p>
                </div>

                <div className="border-l-4 border-l-gray-500 pl-4">
                  <h3 className="font-semibold text-gray-800">
                    Step 6: Reasons for Living
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Remind yourself of what's important to you
                    and worth living for.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Examples: Family, pets, goals, experiences
                    you want to have
                  </p>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Share your safety
                  plan with someone you trust. Keep copies in
                  multiple places, including your phone, wallet,
                  and home.
                </AlertDescription>
              </Alert>

              <Button className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Download Safety Plan Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}