/**
 * Neeva AI — HomeScreen (Phase 3.2 Part 3)
 *
 * Implements the foundation, mood check-in experience, and coaching recommendations.
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, Platform, View, Pressable, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuth } from '@/shared/hooks/useAuth';
import { useMoodEntries, useSaveMood } from '@/shared/hooks/useMood';
import { useExercises } from '@/shared/hooks/useJourney';
import type { MoodEntry } from '@/shared/types';
import { SkeletonCard } from '@/shared/components/SkeletonLoader';
import { GlassCard } from '@/shared/components/GlassCard';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { GradientButton } from '@/shared/components/GradientButton';
import { typography, spacing } from '@/core/theme';

import {
  AuroraBackground,
  HomeHeader,
  DailyQuote,
  MoodSnapshotCard,
  MoodSelector,
  ReflectionInput,
  CheckInButton,
  CheckInSuccessCard,
  MiniMoodHistory,
  AIRecommendationCard,
  WellnessInsightCard,
  DailyEncouragementCard,
  ContinueJourneyCard,
  EmptyJourneyState,
} from '../components';

interface Recommendation {
  title: string;
  badgeText: string;
  explanation: string;
  durationMinutes: number;
  difficulty: string;
  moodBenefit: string;
  ctaText: string;
  type: 'morning' | 'afternoon' | 'evening' | 'mood' | 'journey' | 'fallback';
}

// Helper to map rating back to emoji
const getEmojiForRating = (rating: number): string => {
  if (rating >= 9) return '🤩';
  if (rating >= 8) return '😊';
  if (rating >= 6) return '😌';
  if (rating >= 4) return '😐';
  if (rating >= 3) return '😰';
  if (rating >= 2) return '😔';
  return '🤯';
};

// Helper to map rating back to label name
const getLabelForRating = (rating: number): string => {
  if (rating >= 9) return 'Very Happy';
  if (rating >= 8) return 'Happy';
  if (rating >= 6) return 'Calm';
  if (rating >= 4) return 'Neutral';
  if (rating >= 3) return 'Stressed';
  if (rating >= 2) return 'Sad';
  return 'Overwhelmed';
};

// Helper to fetch custom AI summary texts
const getAISummaryForRating = (rating: number, label: string): string => {
  switch (label) {
    case 'Very Happy':
      return "You're feeling wonderful! Let's channel this creative energy into a gratitude moment or a journaling exercise today.";
    case 'Happy':
      return "A bright outlook today. Keep this positive momentum going by doing something kind for yourself.";
    case 'Calm':
      return "You checked in as Calm. I've prepared a breathing space exercise to help keep you relaxed today.";
    case 'Neutral':
      return "You are feeling balanced and steady today. A great time to check in on your habits or take a light stretch.";
    case 'Stressed':
      return "Feeling stressed is natural. Let's take a 5-minute breathing break to calm your nervous system.";
    case 'Sad':
      return "It's okay to feel down. Give yourself permission to rest. A gentle meditation might help comfort your mind.";
    case 'Overwhelmed':
      return "When everything piles up, take a slow breath. We can focus on just one small step together.";
  }
};

// Helper to get conversational prompt based on selected mood
const getConversationalPrompt = (mood: number | null): string => {
  switch (mood) {
    case 10: // Very Happy
      return "🤩 So glad you're having an amazing day! What's bringing you so much joy?";
    case 8:  // Happy
      return "😊 Wonderful! What's putting a smile on your face today?";
    case 7:  // Calm
      return "😌 Peaceful moments are precious. What's helping you feel centered?";
    case 5:  // Neutral
      return "😐 A steady, balanced day. What's on your mind today?";
    case 3:  // Stressed
      return "😰 I hear you. What's contributing to your stress today?";
    case 2:  // Sad
      return "😔 It's okay to not be okay. What's making you feel down today?";
    case 1:  // Overwhelmed
      return "🤯 Take a deep breath. What's making things feel heavy today?";
    default:
      return "How are you feeling today?";
  }
};

export function HomeScreen() {
  const { user } = useAuth();
  const uid = user?.uid || null;

  const scrollViewRef = useRef<ScrollView>(null);
  const todaysFocusY = useRef(0);

  const handleTodaysFocusLayout = useCallback((e: any) => {
    todaysFocusY.current = e.nativeEvent.layout.y;
  }, []);

  const insets = useSafeAreaInsets();
  const [aboveContentHeight, setAboveContentHeight] = useState(0);

  const handleAboveContentLayout = useCallback((e: any) => {
    setAboveContentHeight(e.nativeEvent.layout.height);
  }, []);

  const spacerHeight = useMemo(() => {
    const { height: screenHeight } = Dimensions.get('window');
    // Fold calculation:
    // Tab bar top is at screenHeight - 88.
    // We want Weekly History title to be 14dp above tab bar top.
    // Card padding is 20dp, container top margin is 8dp.
    // So top of MiniMoodHistory container should be at screenHeight - 130.
    // Relative to safe area, this is screenHeight - 130 - insets.top.
    const targetY = screenHeight - 130 - insets.top;
    return targetY - aboveContentHeight;
  }, [aboveContentHeight, insets.top]);

  // Query & mutation hooks
  const { data: moodEntries = [] } = useMoodEntries(uid);
  const saveMoodMutation = useSaveMood();

  // Local UI States for Check-in
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<Date | null>(null);

  // Local UI States for Recommendations
  const [recIndex, setRecIndex] = useState(0);
  const [recLoading, setRecLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [recDismissed, setRecDismissed] = useState(false);
  const [recCompleted, setRecCompleted] = useState(false);
  const [isOffline, setIsOffline] = useState(false); // Can be used for offline cache state simulation

  // Simulate initial analysis loading sweep
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Compute latest mood entry for today
  const todayMoodEntry = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todayEntries = moodEntries.filter(
      (entry) => new Date(entry.timestamp).toDateString() === todayStr
    );
    return todayEntries.length > 0 ? todayEntries[todayEntries.length - 1] : null;
  }, [moodEntries]);

  // Set default selection based on current today's check-in
  useEffect(() => {
    if (todayMoodEntry && selectedMood === null) {
      setSelectedMood(todayMoodEntry.mood);
    }
  }, [todayMoodEntry, selectedMood]);

  // Determine time of day
  const hour = new Date().getHours();
  const timeOfDay: 'morning' | 'afternoon' | 'evening' = useMemo(() => {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    return 'evening';
  }, [hour]);

  // Build recommendation choices dynamically based on mood, journey, and time
  const recommendations = useMemo(() => {
    const list: Recommendation[] = [];

    // 1. Mood-Based or Time-Based Recommendation
    if (todayMoodEntry) {
      const moodLabel = getLabelForRating(todayMoodEntry.mood);
      if (moodLabel === 'Sad' || moodLabel === 'Stressed' || moodLabel === 'Overwhelmed') {
        list.push({
          title: 'Mindful Breathing',
          badgeText: 'Mood Rescue',
          explanation: `You're feeling slightly ${moodLabel.toLowerCase()} today. Let's spend five minutes calming your mind with a guided breathing exercise.`,
          durationMinutes: 5,
          difficulty: 'Beginner',
          moodBenefit: 'Calm',
          ctaText: 'Start Breathing',
          type: 'mood',
        });
      } else {
        list.push({
          title: 'Gratitude Reflection',
          badgeText: 'Mood Harmony',
          explanation: `You're feeling ${moodLabel.toLowerCase()}! Let's lock in this positive energy by spending ten minutes writing down things you are grateful for.`,
          durationMinutes: 10,
          difficulty: 'Beginner',
          moodBenefit: 'Joy',
          ctaText: 'Begin Journaling',
          type: 'mood',
        });
      }
    } else {
      // Time of day based recommendation
      if (timeOfDay === 'morning') {
        list.push({
          title: 'Morning Clarity',
          badgeText: 'Morning Focus',
          explanation: "Start your day with a clear and grounded mind. Let's practice a five-minute mindful breathing session.",
          durationMinutes: 5,
          difficulty: 'Beginner',
          moodBenefit: 'Focus',
          ctaText: 'Start Breathing',
          type: 'morning',
        });
      } else if (timeOfDay === 'afternoon') {
        list.push({
          title: 'Midday Reset',
          badgeText: 'Afternoon Calm',
          explanation: "Take a pause from your busy day. A quick five-minute breathing exercise will help relieve tension and reset your energy.",
          durationMinutes: 5,
          difficulty: 'Beginner',
          moodBenefit: 'Calm',
          ctaText: 'Start Breathing',
          type: 'afternoon',
        });
      } else {
        list.push({
          title: 'Evening Wind Down',
          badgeText: 'Evening Relax',
          explanation: "Prepare your mind for deep, restful sleep. Let's practice an eight-minute 4-7-8 breathing sequence to release today's thoughts.",
          durationMinutes: 8,
          difficulty: 'Beginner',
          moodBenefit: 'Relax',
          ctaText: 'Start Breathing',
          type: 'evening',
        });
      }
    }

    // 2. Journey Continuation
    list.push({
      title: 'Managing Stress Journey',
      badgeText: 'Journey Step',
      explanation: "You're doing great on your Stress Management journey. Let's complete your Day 4 relaxation session to maintain your momentum.",
      durationMinutes: 12,
      difficulty: 'Intermediate',
      moodBenefit: 'Resilience',
      ctaText: 'Continue Journey',
      type: 'journey',
    });

    // 3. Fallback Recommendation
    list.push({
      title: 'Daily Meditation',
      badgeText: 'Mindfulness',
      explanation: "Nurture your self-awareness with a guided mindful meditation. A simple pause can change the direction of your day.",
      durationMinutes: 10,
      difficulty: 'Beginner',
      moodBenefit: 'Clarity',
      ctaText: 'Begin Session',
      type: 'fallback',
    });

    return list;
  }, [todayMoodEntry, timeOfDay]);

  // Active suggestion
  const activeRec = useMemo(() => {
    if (recommendations.length === 0) return null;
    return recommendations[recIndex % recommendations.length];
  }, [recommendations, recIndex]);

  const handleMenuPress = useCallback(() => {
    console.log('[HomeScreen] Open side drawer menu');
  }, []);

  const handleNotificationPress = useCallback(() => {
    console.log('[HomeScreen] Navigate to notification center');
  }, []);

  const handleCardPress = useCallback(() => {
    console.log('[HomeScreen] Mood snapshot card tapped');
  }, []);

  const handleCheckInSubmit = useCallback(async () => {
    if (selectedMood === null || !uid) return;

    const entry: MoodEntry = {
      id: `mood-${Date.now()}`,
      mood: selectedMood,
      note: reflectionText.trim(),
      timestamp: new Date(),
    };

    try {
      await saveMoodMutation.mutateAsync({ uid, entry });
      setReflectionText('');
      setIsSuccess(true);

      // Trigger a brief loading sweep on recommendations to analyze new mood state
      setRecLoading(true);
      setRecIndex(0);
      setShowExplanation(false);

      // Smoothly focus on Today's Focus recommendations as they load the new mood state
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: todaysFocusY.current - 16,
          animated: true,
        });
      }, 100);

      setTimeout(() => {
        setRecLoading(false);
      }, 1000);
    } catch (error) {
      console.error('[HomeScreen] Check-in save error:', error);
    }
  }, [selectedMood, reflectionText, uid, saveMoodMutation]);

  // Rec actions callbacks
  const handleShowAnother = useCallback(() => {
    setRecLoading(true);
    setTimeout(() => {
      setRecIndex((prev) => (prev + 1) % recommendations.length);
      setShowExplanation(false);
      setRecLoading(false);
    }, 600);
  }, [recommendations.length]);

  const handleBeginSession = useCallback(() => {
    setRecCompleted(true);
    // Auto reset completed state after 4 seconds
    setTimeout(() => {
      setRecCompleted(false);
    }, 4000);
  }, []);

  // Generate Insight Text based on mood logs
  const wellnessInsight = useMemo(() => {
    if (todayMoodEntry) {
      const moodLabel = getLabelForRating(todayMoodEntry.mood);
      if (moodLabel === 'Stressed' || moodLabel === 'Overwhelmed') {
        return 'Your mood typically improves 15% after meditation or breathing sessions.';
      }
    }
    const streak = 3;
    return `You've checked in ${streak} mornings in a row. Keep the positive momentum going!`;
  }, [todayMoodEntry]);

  // Generate Encouragement Text
  const dailyEncouragement = useMemo(() => {
    const quotes = [
      'Pause, take a breath, and let go of what you cannot control.',
      'Give yourself permission to pause, reflect, and just be.',
      'Every small reflection helps you understand yourself better.',
      'Your wellness is a journey, not a destination. Take it one breath at a time.',
    ];
    const index = new Date().getDate() % quotes.length;
    return quotes[index];
  }, []);

  // Exercises query
  const { data: exercises = [], isLoading: exercisesLoading } = useExercises(uid);

  // Local UI States for Journey
  const [journeyStatus, setJourneyStatus] = useState<'new' | 'active' | 'completed' | 'paused' | 'offline'>('active');
  const [simulatedDay, setSimulatedDay] = useState(4);

  // Calculate progress
  const completedExercises = useMemo(() => exercises.filter((ex) => ex.completed), [exercises]);
  const completedCount = completedExercises.length;
  const totalCount = exercises.length || 10;

  const percentComplete = useMemo(() => {
    if (completedCount > 0) {
      return Math.round((completedCount / totalCount) * 100);
    }
    // Fallback simulated progress for rich UI presentation (Day 4 of 10)
    return Math.round((simulatedDay / 10) * 100);
  }, [completedCount, totalCount, simulatedDay]);

  const handleContinueJourney = useCallback(() => {
    if (simulatedDay < 10) {
      setSimulatedDay((prev) => prev + 1);
    } else {
      setJourneyStatus('completed');
    }
  }, [simulatedDay]);

  const handleRestartJourney = useCallback(() => {
    setSimulatedDay(1);
    setJourneyStatus('active');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />

      {/* Subtle floating radial gradient backing */}
      <AuroraBackground intensity={1.0} />

      {/* Main hero vertical layout scrolling container */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View onLayout={handleAboveContentLayout}>
          {/* Top bar & greeting headers */}
          <HomeHeader
            onMenuPress={handleMenuPress}
            onNotificationPress={handleNotificationPress}
          />

          {/* Typographic Daily Quote */}
          <DailyQuote />

          {/* Premium Mood Snapshot Card */}
          {todayMoodEntry ? (
            <MoodSnapshotCard
              moodEmoji={getEmojiForRating(todayMoodEntry.mood)}
              moodLabel={getLabelForRating(todayMoodEntry.mood)}
              checkInTime={new Date(todayMoodEntry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              aiSummary={getAISummaryForRating(
                todayMoodEntry.mood,
                getLabelForRating(todayMoodEntry.mood)
              )}
              completionProgress={100}
              onPress={handleCardPress}
            />
          ) : (
            <MoodSnapshotCard
              moodEmoji="❓"
              moodLabel="Not Checked In"
              checkInTime="--"
              aiSummary="You haven't checked in today yet. Let us know how you are feeling below to build your streak!"
              completionProgress={0}
              onPress={handleCardPress}
            />
          )}

          {/* Mood Check-in Area */}
          <SectionHeader
            title="How are you feeling today?"
            subtitle={selectedMood === null ? "Tap an emotion below to check in" : "Reflecting on your mood"}
          />

          {isSuccess ? (
            <CheckInSuccessCard onDismiss={() => setIsSuccess(false)} />
          ) : (
            <View>
              {/* Horizontal Emotion Selector */}
              <MoodSelector
                selectedMood={selectedMood}
                onSelectMood={setSelectedMood}
              />

              {selectedMood !== null && (
                <Animated.View
                  entering={FadeInDown.duration(450).springify()}
                  style={styles.conversationalContainer}
                >
                  {/* Conversational prompt from Neeva AI */}
                  <Animated.View
                    key={`prompt-${selectedMood}`}
                    entering={FadeInDown.duration(350).springify()}
                    style={styles.chatBubble}
                  >
                    <Text style={styles.chatBubbleText}>
                      {getConversationalPrompt(selectedMood)}
                    </Text>
                  </Animated.View>

                  {/* Optional Reflection Note Input */}
                  <ReflectionInput
                    value={reflectionText}
                    onChangeText={setReflectionText}
                    placeholder="Type your response here... (Optional)"
                  />

                  {/* Primary CTA Submit Button */}
                  <CheckInButton
                    onPress={handleCheckInSubmit}
                    disabled={selectedMood === null || !uid}
                    loading={saveMoodMutation.isPending}
                  />
                </Animated.View>
              )}
            </View>
          )}
        </View>

        {/* Dynamic Spacer */}
        {selectedMood !== null && aboveContentHeight > 0 && spacerHeight > 0 && (
          <View style={{ height: spacerHeight }} />
        )}

        {/* Weekly Mood History Timeline */}
        <MiniMoodHistory
          moodEntries={moodEntries}
          selectedDate={selectedHistoryDate}
          onSelectDate={setSelectedHistoryDate}
        />

        {/* AI Recommendation Section */}
        <View onLayout={handleTodaysFocusLayout}>
          <SectionHeader title="Today's Focus" />
        </View>

        {recDismissed ? (
          <View style={styles.restoreContainer}>
            <Text style={styles.restoreText}>Recommendation dismissed.</Text>
            <GradientButton
              title="Show Suggestion"
              onPress={() => setRecDismissed(false)}
              size="sm"
              style={styles.restoreBtn}
            />
          </View>
        ) : recCompleted ? (
          <Animated.View entering={FadeInDown.duration(500)} style={styles.completedContainer}>
            <GlassCard intensity="dark" className="border-emerald-500/20">
              <Text style={styles.completedTitle}>✨ Session Commenced</Text>
              <Text style={styles.completedText}>
                Great job taking action for your wellbeing! Let's carry this mindful focus throughout your day.
              </Text>
              <GradientButton
                title="Recommend another"
                onPress={() => setRecCompleted(false)}
                size="sm"
                style={styles.resetBtn}
              />
            </GlassCard>
          </Animated.View>
        ) : recLoading ? (
          <View style={styles.loaderContainer}>
            <Text style={styles.thinkingText}>Neeva is preparing today's focus...</Text>
            <SkeletonCard lines={3} />
          </View>
        ) : (
          activeRec && (
            <View>
              <AIRecommendationCard
                title={activeRec.title}
                badgeText={isOffline ? 'Offline Cache' : activeRec.badgeText}
                explanation={activeRec.explanation}
                durationMinutes={activeRec.durationMinutes}
                difficulty={activeRec.difficulty}
                moodBenefit={activeRec.moodBenefit}
                ctaText={activeRec.ctaText}
                onStart={handleBeginSession}
                onNotNow={() => setRecDismissed(true)}
                onShowAnother={handleShowAnother}
                onAskWhy={() => setShowExplanation((prev) => !prev)}
                loading={saveMoodMutation.isPending}
              />

              {/* AI Explanation Speech Bubble */}
              {showExplanation && (
                <Animated.View
                  entering={FadeInDown.duration(400)}
                  style={styles.explanationBubbleContainer}
                >
                  <View style={styles.bubbleArrow} />
                  <View style={styles.explanationBubble}>
                    <Text style={styles.explanationBubbleTitle}>Why this is recommended:</Text>
                    <Text style={styles.explanationBubbleText}>
                      {todayMoodEntry
                        ? `Since you checked in today as ${getLabelForRating(
                          todayMoodEntry.mood
                        )}, this guided ${activeRec.ctaText
                          .replace('Start ', '')
                          .replace('Begin ', '')
                          .toLowerCase()} session is specifically chosen to restore balance and regulate your nervous system.`
                        : `To begin your ${timeOfDay} grounded, Neeva selected this ${activeRec.ctaText
                          .replace('Start ', '')
                          .replace('Begin ', '')
                          .toLowerCase()} session to establish early self-awareness and focus.`}
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          )
        )}

        {/* Continue Journey Section */}
        <SectionHeader title="Continue Your Journey" />

        {journeyStatus === 'new' ? (
          <EmptyJourneyState onExplore={() => setJourneyStatus('active')} />
        ) : journeyStatus === 'completed' ? (
          <Animated.View entering={FadeInDown.duration(500)} style={styles.completedContainer}>
            <GlassCard intensity="dark" className="border-emerald-500/20">
              <Text style={styles.completedTitle}>🎉 Journey Completed!</Text>
              <Text style={styles.completedText}>
                Amazing job! You have successfully completed the Managing Stress journey. Choose another structured path to keep growing.
              </Text>
              <GradientButton
                title="Restart Journey"
                onPress={handleRestartJourney}
                size="sm"
                style={styles.resetBtn}
              />
            </GlassCard>
          </Animated.View>
        ) : (
          <ContinueJourneyCard
            title="Managing Stress"
            currentStep={simulatedDay}
            totalSteps={10}
            percent={percentComplete}
            durationMinutesRemaining={8}
            streakDays={6}
            difficulty="Intermediate"
            lastCompletedText="Yesterday"
            milestoneText="Unlock Reflection Journal"
            onContinue={handleContinueJourney}
            onRestart={handleRestartJourney}
            onChooseAnother={() => setJourneyStatus('new')}
            onViewDetails={() => console.log('View journey details pressed')}
            disabled={exercisesLoading}
          />
        )}

        {/* Wellness Insight */}
        <WellnessInsightCard insightText={wellnessInsight} />

        {/* Daily Encouragement */}
        <DailyEncouragementCard encouragementText={dailyEncouragement} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0B12', // baseline theme color
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 110, // Keep bottom padding high to avoid overlapping the floating tab bar
  },
  loaderContainer: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  thinkingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: typography.fontFamily.sans,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  restoreContainer: {
    marginHorizontal: spacing.xl,
    marginVertical: spacing.sm,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restoreText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: typography.fontFamily.sans,
  },
  restoreBtn: {
    width: 130,
  },
  completedContainer: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  completedTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34D399', // Emerald-400
    fontFamily: typography.fontFamily.display,
    marginBottom: 6,
  },
  completedText: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: typography.fontFamily.sans,
    marginBottom: 12,
  },
  resetBtn: {
    alignSelf: 'flex-start',
    width: 150,
  },
  explanationBubbleContainer: {
    paddingHorizontal: spacing.xl,
    marginTop: -4,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  bubbleArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  explanationBubble: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  explanationBubbleTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.sans,
    marginBottom: 4,
  },
  explanationBubbleText: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: typography.fontFamily.sans,
  },
  conversationalContainer: {
    width: '100%',
  },
  chatBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)', // Soft purple glass tint
    borderColor: 'rgba(139, 92, 246, 0.18)',     // Softer purple border
    borderWidth: 1,
    borderRadius: 16,
    borderTopLeftRadius: 4,                      // Conversational message bubble look
    padding: 14,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 4,
  },
  chatBubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E5E7EB', // grey-200
    fontFamily: typography.fontFamily.sans,
    fontWeight: '500',
  },
});

export default HomeScreen;
