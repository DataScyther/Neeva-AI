import { useEffect, useRef } from 'react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import {
  onSnapshot,
  type Query as FirestoreQuery,
  type DocumentReference,
  type DocumentData,
  type QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function convertTimestamps<T extends Record<string, any>>(data: T): T {
  const result = { ...data } as any;
  for (const key in result) {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    } else if (typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
      result[key] = convertTimestamps(result[key]);
    }
  }
  return result as T;
}

export function docSnapshotToData<T extends { id: string }>(
  doc: QueryDocumentSnapshot<DocumentData> | { id: string; data: () => DocumentData },
): T {
  const raw = doc.data() as Record<string, any>;
  return { id: doc.id, ...convertTimestamps(raw) } as T;
}

export function useRealtimeCollection<T extends { id: string }>(
  firestoreQuery: FirestoreQuery<DocumentData> | null,
  queryKey: QueryKey,
  enabled: boolean = true,
): void {
  const queryClient = useQueryClient();
  const keyRef = useRef(queryKey);

  useEffect(() => {
    keyRef.current = queryKey;
  }, [queryKey]);

  useEffect(() => {
    if (!db || !firestoreQuery || !enabled) return;

    const unsubscribe = onSnapshot(
      firestoreQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) =>
          docSnapshotToData<T>(doc),
        );
        queryClient.setQueryData(keyRef.current, data);
      },
      (error) => {
        console.error(`[useRealtimeCollection] Error for ${String(keyRef.current)}:`, error);
      },
    );

    return () => unsubscribe();
  }, [firestoreQuery, enabled]);
}

export function useRealtimeDocument<T extends Record<string, any>>(
  docRef: DocumentReference<DocumentData> | null,
  queryKey: QueryKey,
  enabled: boolean = true,
): void {
  const queryClient = useQueryClient();
  const keyRef = useRef(queryKey);

  useEffect(() => {
    keyRef.current = queryKey;
  }, [queryKey]);

  useEffect(() => {
    if (!db || !docRef || !enabled) return;

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          queryClient.setQueryData(keyRef.current, null);
          return;
        }
        const raw = snapshot.data() as Record<string, any>;
        const data = { id: snapshot.id, ...convertTimestamps(raw) } as unknown as T;
        queryClient.setQueryData(keyRef.current, data);
      },
      (error) => {
        console.error(`[useRealtimeDocument] Error for ${String(keyRef.current)}:`, error);
      },
    );

    return () => unsubscribe();
  }, [docRef, enabled]);
}
