import React, { createContext, useState, useContext, ReactNode } from 'react';


interface SavedLessonsContextType {
  savedLessonIds: Set<number>;
  toggleSaveLesson: (lessonId: number) => void;
  isLessonSaved: (lessonId: number) => boolean;
}


const SavedLessonsContext = createContext<SavedLessonsContextType>({
  savedLessonIds: new Set(),
  toggleSaveLesson: () => {},
  isLessonSaved: () => false,
});


export function SavedLessonsProvider({ children }: { children: ReactNode }) {
  const [savedLessonIds, setSavedLessonIds] = useState(new Set<number>());

  const toggleSaveLesson = (lessonId: number) => {
    setSavedLessonIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(lessonId)) {
        newIds.delete(lessonId);
      } else {
        newIds.add(lessonId);
      }
      return newIds;
    });
  };

  const isLessonSaved = (lessonId: number) => {
    return savedLessonIds.has(lessonId);
  };
  
  const value = {
    savedLessonIds,
    toggleSaveLesson,
    isLessonSaved,
  };

  return (
    <SavedLessonsContext.Provider value={value}>
      {children}
    </SavedLessonsContext.Provider>
  );
}

export const useSavedLessons = () => {
  return useContext(SavedLessonsContext);
};