import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MoodOption } from './MoodOption';

export interface MoodSelectorProps {
  selectedMood: number | null;
  onSelectMood: (value: number) => void;
}

export const MOODS: { value: number; label: string; emoji: string }[] = [
  { value: 5, label: 'Great', emoji: '😊' },
  { value: 4, label: 'Good', emoji: '🙂' },
  { value: 3, label: 'Okay', emoji: '😐' },
  { value: 2, label: 'Not good', emoji: '😞' },
  { value: 1, label: 'Awful', emoji: '😣' },
];

export const MoodSelector = React.memo(({ selectedMood, onSelectMood }: MoodSelectorProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {MOODS.map((mood) => (
          <MoodOption
            key={mood.value}
            emoji={mood.emoji}
            label={mood.label}
            isSelected={selectedMood === mood.value}
            onPress={() => onSelectMood(mood.value)}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
});

export default MoodSelector;
