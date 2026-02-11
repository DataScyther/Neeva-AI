import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    orderBy,
    Timestamp,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { AppState, MoodEntry, ChatMessage, Exercise } from '../components/AppContext';

// Collection references
const USERS_COLLECTION = 'users';

// -- Helpers --

// Convert Firestore Timestamp to Date for state
const convertTimestamps = (data: any) => {
    if (!data) return data;
    const result = { ...data };
    for (const key in result) {
        if (result[key] instanceof Timestamp) {
            result[key] = result[key].toDate();
        } else if (typeof result[key] === 'object' && result[key] !== null) {
            result[key] = convertTimestamps(result[key]);
        }
    }
    return result;
};

// -- Read Operations --

export const loadUserData = async (uid: string): Promise<Partial<AppState>> => {
    try {
        console.log(`Loading data for user: ${uid}`);

        // 1. Load Mood Entries
        const moodsRef = collection(db, USERS_COLLECTION, uid, 'moods');
        const moodsQuery = query(moodsRef, orderBy('timestamp', 'asc')); // Oldest first to match array push
        const moodsSnapshot = await getDocs(moodsQuery);
        const moodEntries = moodsSnapshot.docs.map(doc => ({
            ...doc.data(),
            timestamp: (doc.data().timestamp as Timestamp).toDate(),
        } as MoodEntry));

        // 2. Load Chat History
        const chatsRef = collection(db, USERS_COLLECTION, uid, 'chats');
        const chatsQuery = query(chatsRef, orderBy('timestamp', 'asc'));
        const chatsSnapshot = await getDocs(chatsQuery);
        const chatHistory = chatsSnapshot.docs.map(doc => ({
            ...doc.data(),
            timestamp: (doc.data().timestamp as Timestamp).toDate(),
        } as ChatMessage));

        // 3. Load Exercises (stored as individual docs in a subcollection or validiting user profile?)
        // Plan: Store exercise progress in a subcollection 'exercises' where ID = exercise ID
        const exercisesRef = collection(db, USERS_COLLECTION, uid, 'exercises');
        const exercisesSnapshot = await getDocs(exercisesRef);
        const exercisesData = exercisesSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
        }, {} as Record<string, any>);

        // return partial state to merge
        return {
            moodEntries,
            chatHistory,
            // We will merge exercises logic in the reducer, here we just return the raw data map if needed, 
            // or we can map it to the AppState structure if we want to replace the default list.
            // Better strategy: The AppState has a static list of exercises. We only need to update 'completed' and 'streak'.
            // So we'll return a map of completed exercises to merge in the reducer.
            // actually, let's return the simplified data and handle merging in AppContext reducer.
            exercises: undefined, // Handled separately or let the reducer merge based on IDs
        };
    } catch (error) {
        console.error("Error loading user data:", error);
        return {};
    }
};

export const getCompletedExercises = async (uid: string): Promise<Record<string, { completed: boolean, streak: number }>> => {
    try {
        const exercisesRef = collection(db, USERS_COLLECTION, uid, 'exercises');
        const snapshot = await getDocs(exercisesRef);
        const results: Record<string, { completed: boolean, streak: number }> = {};
        snapshot.forEach(doc => {
            results[doc.id] = {
                completed: doc.data().completed,
                streak: doc.data().streak
            };
        });
        return results;
    } catch (e) {
        console.error("Error fetching exercises:", e);
        return {};
    }
}

// -- Write Operations --

export const saveMoodEntry = async (uid: string, entry: MoodEntry) => {
    try {
        const docRef = doc(db, USERS_COLLECTION, uid, 'moods', entry.id);
        await setDoc(docRef, {
            ...entry,
            timestamp: Timestamp.fromDate(entry.timestamp)
        });
        console.log('Mood saved to Firestore');
    } catch (error) {
        console.error('Error saving mood:', error);
    }
};

export const saveChatMessage = async (uid: string, message: ChatMessage) => {
    try {
        const docRef = doc(db, USERS_COLLECTION, uid, 'chats', message.id);
        await setDoc(docRef, {
            ...message,
            timestamp: Timestamp.fromDate(message.timestamp)
        });
        console.log('Chat message saved to Firestore');
    } catch (error) {
        console.error('Error saving chat:', error);
    }
};

export const saveExerciseProgress = async (uid: string, exerciseId: string, streak: number) => {
    try {
        const docRef = doc(db, USERS_COLLECTION, uid, 'exercises', exerciseId);
        await setDoc(docRef, {
            id: exerciseId,
            completed: true,
            streak: streak,
            lastCompletedAt: serverTimestamp()
        }, { merge: true });
        console.log('Exercise progress saved');
    } catch (error) {
        console.error('Error saving exercise:', error);
    }
};


