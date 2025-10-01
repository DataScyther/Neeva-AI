import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { useAppContext } from "./AppContext";
import {
  Users,
  MessageCircle,
  Heart,
  Send,
  Plus,
  Star,
  Clock,
  Shield,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
// Simplified without animations for stability

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: number;
  category: string;
  isAnonymous: boolean;
  isPinned?: boolean;
}

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category:
    | "anxiety"
    | "depression"
    | "general"
    | "mindfulness"
    | "addiction";
  isActive: boolean;
}

const supportGroups: SupportGroup[] = [
  {
    id: "1",
    name: "Anxiety Support Circle",
    description:
      "A safe space to share experiences and coping strategies for anxiety.",
    members: 1247,
    category: "anxiety",
    isActive: true,
  },
  {
    id: "2",
    name: "Depression Recovery",
    description:
      "Supporting each other through depression recovery journey.",
    members: 892,
    category: "depression",
    isActive: true,
  },
  {
    id: "3",
    name: "Mindfulness & Meditation",
    description:
      "Share mindfulness practices and meditation experiences.",
    members: 2156,
    category: "mindfulness",
    isActive: true,
  },
  {
    id: "4",
    name: "General Wellness",
    description:
      "Open discussions about mental health and wellbeing.",
    members: 3421,
    category: "general",
    isActive: true,
  },
];

const samplePosts: CommunityPost[] = [
  {
    id: "1",
    author: "Sarah M.",
    content:
      "Had a really tough day with anxiety today, but I tried the 4-7-8 breathing technique someone shared here last week. It actually helped! Thank you to this community for always being supportive. 💙",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 24,
    replies: 8,
    category: "anxiety",
    isAnonymous: false,
    isPinned: false,
  },
  {
    id: "2",
    author: "Anonymous",
    content:
      "I've been struggling with sleep lately. Does anyone have recommendations for bedtime routines that have worked for them? I've tried melatonin but looking for more natural approaches.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 15,
    replies: 12,
    category: "general",
    isAnonymous: true,
    isPinned: false,
  },
  {
    id: "3",
    author: "Mike R.",
    content:
      "Just wanted to share a small victory - I completed my first week of daily meditation! Started with just 5 minutes and already feeling more centered. If you're thinking about starting, just begin with whatever feels manageable.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 42,
    replies: 15,
    category: "mindfulness",
    isAnonymous: false,
    isPinned: true,
  },
];

export function CommunityGroups() {
  const { state } = useAppContext();
  const [selectedGroup, setSelectedGroup] =
    useState<string>("1");
  const [newPost, setNewPost] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posts, setPosts] =
    useState<CommunityPost[]>(samplePosts);

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: isAnonymous
        ? "Anonymous"
        : state.user?.name || "User",
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      category:
        supportGroups.find((g) => g.id === selectedGroup)
          ?.category || "general",
      isAnonymous,
    };

    setPosts((prev) => [post, ...prev]);
    setNewPost("");
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post,
      ),
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      anxiety: "bg-blue-100 text-blue-800",
      depression: "bg-purple-100 text-purple-800",
      mindfulness: "bg-green-100 text-green-800",
      general: "bg-gray-100 text-gray-800",
      addiction: "bg-orange-100 text-orange-800",
    };
    return (
      colors[category as keyof typeof colors] || colors.general
    );
  };

  const filteredPosts = posts.filter((post) => {
    const group = supportGroups.find(
      (g) => g.id === selectedGroup,
    );
    return group ? post.category === group.category : true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Users className="w-8 h-8 text-blue-500" />
          <span>Community Support</span>
        </h1>
        <p className="text-muted-foreground">
          Connect with others on similar journeys in a safe,
          supportive environment
        </p>
      </div>

      {/* Community Guidelines Banner */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 p-2 rounded-full">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                Community Guidelines
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Be respectful, supportive, and kind. Share
                experiences, not advice. Remember that
                everyone's journey is unique.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Support Groups Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Support Groups
              </CardTitle>
              <CardDescription>
                Join conversations that matter to you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {supportGroups.map((group) => (
                <Button
                  key={group.id}
                  variant={
                    selectedGroup === group.id
                      ? "default"
                      : "ghost"
                  }
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">
                        {group.name}
                      </span>
                      {group.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-left">
                      {group.members.toLocaleString()} members
                    </p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Active members
                  </span>
                </div>
                <span className="font-semibold">7,716</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Posts today</span>
                </div>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Support given</span>
                </div>
                <span className="font-semibold">1,542</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Current Group Info */}
          {selectedGroup && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>
                        {
                          supportGroups.find(
                            (g) => g.id === selectedGroup,
                          )?.name
                        }
                      </span>
                      <Badge
                        className={getCategoryColor(
                          supportGroups.find(
                            (g) => g.id === selectedGroup,
                          )?.category || "general",
                        )}
                      >
                        {
                          supportGroups.find(
                            (g) => g.id === selectedGroup,
                          )?.category
                        }
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {
                        supportGroups.find(
                          (g) => g.id === selectedGroup,
                        )?.description
                      }
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {supportGroups
                        .find((g) => g.id === selectedGroup)
                        ?.members.toLocaleString()}{" "}
                      members
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-600">
                        Active now
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* New Post */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Share with the community</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your thoughts, experiences, or ask for support..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={4}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) =>
                      setIsAnonymous(e.target.checked)
                    }
                    className="rounded"
                  />
                  <label
                    htmlFor="anonymous"
                    className="text-sm text-muted-foreground"
                  >
                    Post anonymously
                  </label>
                </div>
                <Button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Recent Posts
              </h2>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Sorted by recent
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <div key={post.id}>
                  <Card
                    className={`hover:shadow-md transition-shadow ${post.isPinned ? "border-2 border-yellow-200 bg-yellow-50/50" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback
                            className={
                              post.isAnonymous
                                ? "bg-gray-400"
                                : "bg-blue-500"
                            }
                          >
                            {post.isAnonymous
                              ? "?"
                              : getInitials(post.author)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {post.author}
                              </span>
                              <Badge
                                variant="secondary"
                                className={getCategoryColor(
                                  post.category,
                                )}
                              >
                                {post.category}
                              </Badge>
                              {post.isPinned && (
                                <Badge
                                  variant="outline"
                                  className="flex items-center space-x-1"
                                >
                                  <Star className="w-3 h-3" />
                                  <span>Pinned</span>
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                {getTimeAgo(post.timestamp)}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700">
                            {post.content}
                          </p>

                          <div className="flex items-center space-x-4 pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleLikePost(post.id)
                              }
                              className="flex items-center space-x-1 text-muted-foreground hover:text-pink-500"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.replies}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    No posts yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share in this group! Your
                    voice matters.
                  </p>
                  <Button
                    onClick={() =>
                      document
                        .querySelector("textarea")
                        ?.focus()
                    }
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Start the conversation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
