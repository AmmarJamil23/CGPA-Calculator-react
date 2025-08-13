import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, RotateCcw, Moon, Sun, BookOpen } from 'lucide-react';
import './CGPACalculator.css';

const CGPACalculator = () => {
  // Updated grade mapping with GPA values (memoized)
  const gradeMapping = useMemo(() => ({
    'A': 4.0,
    'A-': 3.67,
    'B+': 3.33,
    'B': 3.0,
    'B-': 2.67,
    'C+': 2.33,
    'C': 2.0,
    'C-': 1.67,
    'D+': 1.33,
    'D': 1.0,
    'F': 0.0
  }), []);

  // State management
  const [subjects, setSubjects] = useState([
    { id: 1, name: '', creditHours: '', grade: '' }
  ]);
  const [cgpa, setCgpa] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedSubjects = localStorage.getItem('cgpa-subjects');
    const savedDarkMode = localStorage.getItem('cgpa-darkmode');

    if (savedSubjects) {
      try {
        setSubjects(JSON.parse(savedSubjects));
      } catch (error) {
        console.error('Error loading saved subjects:', error);
      }
    }

    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save subjects
  useEffect(() => {
    localStorage.setItem('cgpa-subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Save dark mode
  useEffect(() => {
    localStorage.setItem('cgpa-darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Calculate CGPA
  useEffect(() => {
    let totalCreditHours = 0;
    let totalGradePoints = 0;

    subjects.forEach(subject => {
      const creditHours = parseFloat(subject.creditHours);
      const gradeValue = gradeMapping[subject.grade];

      if (creditHours > 0 && gradeValue !== undefined) {
        totalCreditHours += creditHours;
        totalGradePoints += creditHours * gradeValue;
      }
    });

    setCgpa(totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0);
  }, [subjects, gradeMapping]);

  // Add subject
  const addSubject = () => {
    const newId = Math.max(...subjects.map(s => s.id), 0) + 1;
    setSubjects([...subjects, { id: newId, name: '', creditHours: '', grade: '' }]);
  };

  // Remove subject
  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    }
  };

  // Update subject
  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(subject =>
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  // Reset
  const resetCalculator = () => {
    setSubjects([{ id: 1, name: '', creditHours: '', grade: '' }]);
    setCgpa(0);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="main-wrapper">
        {/* Header */}
        <div className="header">
          <div className="title-section">
            <BookOpen className="header-icon" />
            <h1 className="main-title">CGPA Calculator</h1>
          </div>
          <p className="subtitle">Calculate your Cumulative Grade Point Average with ease</p>
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {darkMode ? <Sun className="toggle-icon" /> : <Moon className="toggle-icon" />}
          </button>
        </div>

        <div className="content-grid">
          {/* Calculator */}
          <div className="calculator-section">
            <div className="calculator-card">
              <div className="subject-headers">
                <div className="header-subject-name">Subject Name</div>
                <div className="header-credit-hours">Credit Hours</div>
                <div className="header-grade">Grade</div>
                <div className="header-action">Action</div>
              </div>

              <div className="subjects-container">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="subject-row">
                    <input
                      type="text"
                      placeholder={`Subject ${index + 1}`}
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Credits"
                      min="0"
                      step="0.5"
                      value={subject.creditHours}
                      onChange={(e) => updateSubject(subject.id, 'creditHours', e.target.value)}
                      className="input-field"
                    />
                    <select
                      value={subject.grade}
                      onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                      className="input-field select-field"
                    >
                      <option value="">Select Grade</option>
                      {Object.keys(gradeMapping).map(grade => (
                        <option key={grade} value={grade}>
                          {grade} ({gradeMapping[grade].toFixed(2)})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeSubject(subject.id)}
                      disabled={subjects.length === 1}
                      className={`remove-btn ${subjects.length === 1 ? 'disabled' : ''}`}
                    >
                      <Trash2 className="btn-icon" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="action-buttons">
                <button onClick={addSubject} className="add-btn">
                  <Plus className="btn-icon" /> Add Subject
                </button>
                <button onClick={resetCalculator} className="reset-btn">
                  <RotateCcw className="btn-icon" /> Reset
                </button>
              </div>

              <div className="cgpa-result">
                <h2>Your CGPA</h2>
                <div className="cgpa-value">{cgpa.toFixed(2)}</div>
                <p>out of 4.00</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar-section">
            <div className="sidebar-card">
              <h3>GPA Scale</h3>
              <div className="grade-scale">
                {Object.entries(gradeMapping).map(([grade, gpa]) => (
                  <div key={grade} className="grade-item">
                    <span>{grade}</span>
                    <span>{gpa.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="performance-guide">
                <h4>Performance Guide</h4>
                <div>Excellent: 3.67 - 4.0</div>
                <div>Good: 3.0 - 3.66</div>
                <div>Average: 2.0 - 2.99</div>
                <div>Below: &lt; 2.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;
