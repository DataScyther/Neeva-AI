import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Heart, Plus, Smile } from 'lucide-react';

interface MoodOption {
  value: number;
  emoji: string;
  label: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: 'from-red-400 to-red-600' },
  { value: 2, emoji: '😕', label: 'Sad', color: 'from-orange-400 to-orange-600' },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'from-yellow-400 to-yellow-600' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'from-lime-400 to-lime-600' },
  { value: 5, emoji: '😊', label: 'Excellent', color: 'from-green-400 to-green-600' }
];

export function MoodTracker() {
  const { state, dispatch } = useAppContext();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodSubmit = async () => {
    if (selectedMood === null) return;
    
    setIsSubmitting(true);
    
    const newEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note: note.trim(),
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_MOOD_ENTRY', payload: newEntry });
    
    setTimeout(() => {
      setSelectedMood(null);
      setNote('');
      setIsSubmitting(false);
    }, 500);
  };

  const todayEntries = state.moodEntries.filter(entry => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  const averageMood = state.moodEntries.length > 0 
    ? state.moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / state.moodEntries.length
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Heart className="w-8 h-8 text-pink-500" />
          <span>Mood Tracker</span>
        </h1>
        <p className="text-muted-foreground">Track your emotional wellbeing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smile className="w-5 h-5" />
                <span>How are you feeling right now?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className={`h-20 w-full flex flex-col space-y-1 ${
                      selectedMood === mood.value 
                        ? `bg-gradient-to-r ${mood.color} text-white border-0` 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs font-medium">{mood.label}</span>
                  </Button>
                ))}
              </div>

              {selectedMood && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {moodOptions.find(m => m.value === selectedMood)?.label} ({selectedMood}/5)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Add a note (optional)</label>
                <Textarea
                  placeholder="What's contributing to how you feel?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleMoodSubmit}
                disabled={selectedMood === null || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <span>Recording...</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Record Mood</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Entries logged</span>
                <Badge variant="secondary">{todayEntries.length}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Average mood</span>
                <span className="text-sm font-medium">
                  {averageMood > 0 ? averageMood.toFixed(1) : '--'}/5
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Total entries</span>
                <Badge variant="secondary">{state.moodEntries.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {state.moodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.moodEntries
                .slice(-5)
                .reverse()
                .map((entry) => {
                  const moodOption = moodOptions.find(m => m.value === entry.mood);
                  return (
                    <div key={entry.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl">{moodOption?.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{moodOption?.label}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {state.moodEntries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Start tracking your mood</h3>
            <p className="text-muted-foreground mb-4">
              Regular mood tracking helps you understand patterns in your emotional wellbeing.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}