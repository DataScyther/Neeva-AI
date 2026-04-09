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
    if (!uid || uid.trim().length === 0) {
        console.error('Cannot load user data: Invalid user ID');
        return {};
    }

    try {
        console.log(`Loading data for user: ${uid}`);

        // Run all three collection fetches in parallel for better performance
        const [moodsSnapshot, chatsSnapshot, exercisesSnapshot] = await Promise.all([
            // 1. Load Mood Entries
            (async () => {
                const moodsRef = collection(db, USERS_COLLECTION, uid, 'moods');
                const moodsQuery = query(moodsRef, orderBy('timestamp', 'asc'));
                return await getDocs(moodsQuery);
            })(),

            // 2. Load Chat History
            (async () => {
                const chatsRef = collection(db, USERS_COLLECTION, uid, 'chats');
                const chatsQuery = query(chatsRef, orderBy('timestamp', 'asc'));
                return await getDocs(chatsQuery);
            })(),

            // 3. Load Exercises
            (async () => {
                const exercisesRef = collection(db, USERS_COLLECTION, uid, 'exercises');
                return await getDocs(exercisesRef);
            })()
        ]);

        // Process moods
        const moodEntries = moodsSnapshot.docs.map(doc => ({
            ...doc.data(),
            timestamp: (doc.data().timestamp as Timestamp).toDate(),
        } as MoodEntry));

        // Process chats
        const chatHistory = chatsSnapshot.docs.map(doc => ({
            ...doc.data(),
            timestamp: (doc.data().timestamp as Timestamp).toDate(),
        } as ChatMessage));

        // Process exercises
        const exercisesData = exercisesSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
        }, {} as Record<string, any>);

        return {
            moodEntries,
            chatHistory,
            exercises: undefined,
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

export const saveMoodEntry = async (uid: string, entry: MoodEntry): Promise<boolean> => {
    if (!uid || uid.trim().length === 0) {
        console.error('Cannot save mood entry: Invalid user ID');
        return false;
    }

    try {
        const docRef = doc(db, USERS_COLLECTION, uid, 'moods', entry.id);
        await setDoc(docRef, {
            ...entry,
            timestamp: Timestamp.fromDate(entry.timestamp)
        });
        return true;
    } catch (error) {
        console.error('Error saving mood:', error);
        throw error; // Re-throw to let caller handle
    }
};

export const saveChatMessage = async (uid: string, message: ChatMessage): Promise<boolean> => {
    if (!uid || uid.trim().length === 0) {
        console.error('Cannot save chat message: Invalid user ID');
        return false;
    }

    try {
        const docRef = doc(db, USERS_COLLECTION, uid, 'chats', message.id);
        await setDoc(docRef, {
            ...message,
            timestamp: Timestamp.fromDate(message.timestamp)
        });
        return true;
    } catch (error) {
        console.error('Error saving chat:', error);
        throw error; // Re-throw to let caller handle
    }
};

export const saveExerciseProgress = async (uid: string, exerciseId: string, streak: number): Promise<boolean> => {
    if (!uid || !exerciseId) {
        console.error('Cannot save exercise progress: Invalid parameters');
        return false;
    }

    try {
        const docRef = doc(db, USERS_COLLECTION, uid, 'exercises', exerciseId);
        await setDoc(docRef, {
            id: exerciseId,
            completed: true,
            streak: streak,
            lastCompletedAt: serverTimestamp()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error saving exercise:', error);
        throw error; // Re-throw to let caller handle
    }
};


