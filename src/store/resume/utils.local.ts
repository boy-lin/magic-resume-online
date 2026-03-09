import { ResumeData } from "@/types/resume";

const DB_NAME = "magic-resume-local-db";
const DB_VERSION = 1;
const STORE_NAME = "resumes";

type LocalResumeRecord = {
  id: string;
  resume: ResumeData;
  createdAt: string;
  updatedAt: string;
};

let dbPromise: Promise<IDBDatabase> | null = null;

function canUseIndexedDB() {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function openDB() {
  if (!canUseIndexedDB()) {
    throw new Error("IndexedDB is not available");
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
          store.createIndex("createdAt", "createdAt", { unique: false });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
}

function normalizeResume(resume: ResumeData): ResumeData {
  const now = new Date().toISOString();
  return {
    ...resume,
    createdAt: resume.createdAt || now,
    updatedAt: resume.updatedAt || now,
  };
}

export async function localUpsertResume(resume: ResumeData) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const normalized = normalizeResume(resume);
  const record: LocalResumeRecord = {
    id: normalized.id,
    resume: normalized,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
  };
  store.put(record);
  await transactionDone(tx);
  return normalized;
}

export async function localGetResumeById(id: string) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const data = await requestToPromise<LocalResumeRecord | undefined>(
    store.get(id)
  );
  await transactionDone(tx);
  return data?.resume || null;
}

export async function localDeleteResumeById(id: string) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.delete(id);
  await transactionDone(tx);
}

export async function localGetAllResumes() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const list = await requestToPromise<LocalResumeRecord[]>(store.getAll());
  await transactionDone(tx);

  return list
    .map((item) => item.resume)
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
    );
}

export async function localGetResumeList(params: {
  current: number;
  pageSize: number;
}) {
  const { current, pageSize } = params;
  const all = await localGetAllResumes();
  const start = (current - 1) * pageSize;
  const paged = all.slice(start, start + pageSize);

  return {
    data: paged.map((item) => ({
      id: item.id,
      title: item.title,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
      template_id: item.templateId,
      is_public: item.isPublic || false,
    })),
    count: all.length,
  };
}
