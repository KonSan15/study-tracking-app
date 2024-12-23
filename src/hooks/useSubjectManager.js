// hooks/useSubjectManager.js
import { useState, useEffect } from 'react';
import { db } from '../services/db';

export const useSubjectManager = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const loadedSubjects = await db.getSubjects();
      setSubjects(loadedSubjects);
      setError(null);
    } catch (err) {
      setError('Failed to load subjects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async (name) => {
    try {
      const subject = {
        name,
        experience: 0,
        createdAt: Date.now()
      };

      await db.updateSubject(subject);
      setSubjects(prev => [...prev, subject]);
      return subject;
    } catch (err) {
      setError('Failed to add subject');
      console.error(err);
      throw err;
    }
  };

  const addExperience = async (subjectName, amount) => {
    try {
      const subject = subjects.find(s => s.name === subjectName);
      if (!subject) throw new Error('Subject not found');

      const updatedSubject = {
        ...subject,
        experience: subject.experience + amount
      };

      await db.updateSubject(updatedSubject);
      setSubjects(prev => 
        prev.map(s => s.name === subjectName ? updatedSubject : s)
      );
      return updatedSubject;
    } catch (err) {
      setError('Failed to add experience');
      console.error(err);
      throw err;
    }
  };

  const getSubjectStats = (subjectName) => {
    const subject = subjects.find(s => s.name === subjectName);
    if (!subject) return null;


    const level = (() => {
        if (subject.experience <= 100) {
            return 1;
        } else if (subject.experience <= 300) {
            return 2;
        } else {
            return 3;
        }
    })();
    
    const progress = (() => {
        if (level === 1) {
            return subject.experience; // Progress within level 1
        } else if (level === 2) {
            return subject.experience - 100; // Progress within level 2
        } else {
            return subject.experience - 300; // Progress within level 3
        }
    })();
    
    const experienceToNextLevel = (() => {
        if (level === 1) {
            return 100 - progress; // Remaining experience for level 2
        } else if (level === 2) {
            return 200 - progress; // Remaining experience for level 3
        } else {
            return 0; // Max level reached
        }
    })();
    

    return {
      level,
      progress,
      experienceToNextLevel,
      totalExperience: subject.experience
    };
  };

  return {
    subjects,
    loading,
    error,
    addSubject,
    addExperience,
    getSubjectStats,
    refreshSubjects: loadSubjects
  };
};