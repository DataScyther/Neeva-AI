import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MoodOption } from './MoodOption';

export interface MoodSelectorProps {
  selectedMood: number | null;
  onSelectMood: (value: number) => void;
}

export interface MoodData {
  value: number;
  label: string;
  emoji: string;
  color: string;
}

export const MOODS: MoodData[] = [
  { value: 10, label: 'Very Happy', emoji: '🤩', color: '#F59E0B' }, // Yellow-500
  { value: 8, label: 'Happy', emoji: '😊', color: '#10B981' },      // Emerald-500
  { value: 7, label: 'Calm', emoji: '😌', color: '#06B6D4' },       // Cyan-500
  { value: 5, label: 'Neutral', emoji: '😐', color: '#8B5CF6' },    // Purple-500
  { value: 3, label: 'Stressed', emoji: '😰', color: '#F43F5E' },   // Rose-500
  { value: 2, label: 'Sad', emoji: '😔', color: '#3B82F6' },        // Blue-500
  { value: 1, label: 'Overwhelmed', emoji: '🤯', color: '#EF4444' }, // Red-500
];

export const MoodSelector = React.memo(({ selectedMood, onSelectMood }: MoodSelectorProps) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {MOODS.map((mood, index) => (
          <MoodOption
            key={mood.value}
            emoji={mood.emoji}
            label={mood.label}
            isSelected={selectedMood === mood.value}
            onPress={() => onSelectMood(mood.value)}
            color={mood.color}
            index={index}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 18,
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default MoodSelector;
