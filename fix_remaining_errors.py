import re

# Read the file
with open('src/components/CBTExercises.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix line 862 - prompts access
content = re.sub(
    r'getExerciseById\(activeExercise\)\s*\?\.exercise\.prompts\?\.length',
    "(getExerciseById(activeExercise)?.exercise.type === 'journal' ? (getExerciseById(activeExercise)?.exercise as JournalingExercise).prompts.length : 0)",
    content
)

# Fix line 869-870 - prompts access with currentStep
content = re.sub(
    r'{\s*getExerciseById\(activeExercise\)\s*\?\.exercise\.prompts\?\[currentStep\]\s*}',
    "{getExerciseById(activeExercise)?.exercise.type === 'journal' ? (getExerciseById(activeExercise)?.exercise as JournalingExercise).prompts[currentStep] : ''}",
    content
)

# Fix line 936-937 - gameType access
content = re.sub(
    r'getExerciseById\(activeExercise\)\?\.exercise\s*\.gameType === "color_focus"',
    "getExerciseById(activeExercise)?.exercise.type === 'adhd_game' && (getExerciseById(activeExercise)?.exercise as ADHDGameExercise).gameType === 'color_focus'",
    content
)

content = re.sub(
    r'getExerciseById\(activeExercise\)\?\.exercise\s*\.gameType === "memory_sequence"',
    "getExerciseById(activeExercise)?.exercise.type === 'adhd_game' && (getExerciseById(activeExercise)?.exercise as ADHDGameExercise).gameType === 'memory_sequence'",
    content
)

# Fix instructions access (multiple places)
# Pattern for instructions access in conditions
content = re.sub(
    r'getExerciseById\(activeExercise\)\?\.exercise\s*\.instructions',
    "((getExerciseById(activeExercise)?.exercise.type === 'guided' || getExerciseById(activeExercise)?.exercise.type === 'adhd_game' || getExerciseById(activeExercise)?.exercise.type === 'breathing') ? (getExerciseById(activeExercise)?.exercise as any).instructions : [])",
    content
)

# Write the fixed content back
with open('src/components/CBTExercises.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed remaining TypeScript errors in CBTExercises.tsx")
