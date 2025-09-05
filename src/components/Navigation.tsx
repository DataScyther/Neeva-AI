import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useAppContext } from './AppContext';
import { 
  Home,
  MessageCircle,
  Heart,
  BookOpen,
  Users,
  Settings,
  LogOut,
  BarChart3,
  Headphones,
  Shield,
  Bell,
  ChevronDown,
  Sparkles
} from 'lucide-react';
// Simplified without animations for stability

export function Navigation() {
  const { state, dispatch } = useAppContext();

  const mainNavigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      view: 'dashboard' as const,
      color: 'text-blue-500'
    },
    {
      id: 'chatbot',
      label: 'AI Therapist',
      icon: MessageCircle,
      view: 'chatbot' as const,
      color: 'text-purple-500',
      badge: state.chatHistory.length > 0 ? null : 'New'
    },
    {
      id: 'mood',
      label: 'Mood Tracker',
      icon: Heart,
      view: 'mood' as const,
      color: 'text-pink-500',
      badge: state.moodEntries.filter(entry => {
        const today = new Date();
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === today.toDateString();
      }).length || null
    },
    {
      id: 'exercises',
      label: 'CBT Exercises',
      icon: BookOpen,
      view: 'exercises' as const,
      color: 'text-green-500',
      badge: state.exercises.filter(ex => ex.completed).length || null
    }
  ];

  const toolsNavigationItems = [
    {
      id: 'meditation',
      label: 'Guided Meditation',
      icon: Headphones,
      view: 'meditation' as const,
      color: 'text-indigo-500'
    },
    {
      id: 'insights',
      label: 'Insights & Analytics',
      icon: BarChart3,
      view: 'insights' as const,
      color: 'text-cyan-500'
    },
    {
      id: 'community',
      label: 'Support Groups',
      icon: Users,
      view: 'community' as const,
      color: 'text-orange-500'
    }
  ];

  const supportNavigationItems = [
    {
      id: 'crisis',
      label: 'Crisis Support',
      icon: Shield,
      view: 'crisis' as const,
      color: 'text-red-500',
      urgent: true
    }
  ];

  const handleLogout = () => {
    // Clear onboarding data
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('onboardingData');
    dispatch({ type: 'SET_USER', payload: null });
  };

  const renderNavigationGroup = (items: any[], title?: string) => (
    <div className="space-y-1">
      {title && (
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
        </div>
      )}
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = state.currentView === item.view;
        
        return (
          <div key={item.id}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-11 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                  : item.urgent
                  ? 'hover:bg-red-50 hover:text-red-700'
                  : 'hover:bg-accent'
              }`}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view })}
            >
              <IconComponent className={`w-5 h-5 mr-3 ${
                isActive 
                  ? 'text-white' 
                  : item.urgent 
                  ? 'text-red-500' 
                  : item.color
              }`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
              {item.urgent && !isActive && (
                <div className="w-2 h-2 bg-red-500 rounded-full ml-auto" />
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-background lg:border-r lg:border-border lg:shadow-sm">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Neeva
                </h1>
                <p className="text-xs text-muted-foreground">Mental Health Companion</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                {state.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{state.user?.name}</p>
                <p className="text-sm text-muted-foreground truncate">{state.user?.email}</p>
              </div>
              <Button size="sm" variant="ghost" className="shrink-0">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {/* Main Navigation */}
            {renderNavigationGroup(mainNavigationItems, 'Main')}
            
            <Separator />
            
            {/* Tools */}
            {renderNavigationGroup(toolsNavigationItems, 'Tools')}
            
            <Separator />
            
            {/* Support */}
            {renderNavigationGroup(supportNavigationItems, 'Support')}
          </nav>

          {/* Settings & Logout */}
          <div className="px-3 py-4 border-t border-border space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-11"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'settings' })}
            >
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              <span>Settings</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start h-11 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-background border-t border-border shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {[...mainNavigationItems.slice(0, 4), { id: 'crisis', label: 'Crisis', icon: Shield, view: 'crisis' as const, color: 'text-red-500', urgent: true }].map((item) => {
            const IconComponent = item.icon;
            const isActive = state.currentView === item.view;
            
            return (
              <button
                key={item.id}
                className={`flex flex-col items-center justify-center space-y-1 relative ${
                  isActive ? 'text-blue-600' : item.urgent ? 'text-red-500' : 'text-muted-foreground'
                }`}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view })}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
                {item.badge && (
                  <div className="absolute -top-1 right-3">
                    <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                      {typeof item.badge === 'number' ? item.badge : '!'}
                    </div>
                  </div>
                )}
                {item.urgent && !isActive && (
                  <div className="absolute top-1 right-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Button for other features */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          size="sm"
          className="bg-background/80 backdrop-blur-sm border border-border shadow-lg"
          onClick={() => {
            // Could implement a mobile drawer menu here
          }}
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
}