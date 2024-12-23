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

    const level = Math.floor(subject.experience / 100);
    const progress = subject.experience % 100;
    const experienceToNextLevel = 100 - progress;

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