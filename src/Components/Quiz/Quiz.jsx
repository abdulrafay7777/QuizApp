import './Quiz.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const storedQuestions = location.state?.questions;  

  const localQuestions = JSON.parse(localStorage.getItem('questions') || '[]');

  const [questions, setQuestions] = useState(storedQuestions || localQuestions);

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('questions', JSON.stringify(questions));
    }
  }, [questions]);

  const userName = location.state?.userName || 'Guest';
  const category = location.state?.category || questions[0]?.category || 'Unknown';

  const [currentQues, setCurrentQues] = useState(() => parseInt(localStorage.getItem('currentQues')) || 0);
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('score')) || 0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[currentQues];
      const shuffled = shuffleOptions([...current.incorrect_answers, current.correct_answer]);
      setOptions(shuffled);
      setSelected(null);
      setAnswered(false);
    }
  }, [questions, currentQues]);

  useEffect(() => {
    localStorage.setItem('score', score);
    localStorage.setItem('currentQues', currentQues);
  }, [score, currentQues]);

  const shuffleOptions = (arr) => arr.sort(() => Math.random() - 0.5);

  const handleOptionClick = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === questions[currentQues].correct_answer) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentQues + 1 === questions.length) {
      localStorage.removeItem('score');
      localStorage.removeItem('currentQues');
      localStorage.removeItem('questions');
      navigate('/result', { state: { score } });
    } else {
      setCurrentQues(prev => prev + 1);
    }
  };

  const handleQuit = () => {
    localStorage.removeItem('score');
    localStorage.removeItem('currentQues');
    localStorage.removeItem('questions');
    setQuestions([]);
    navigate('/');
  };

  const getOptionClass = (opt) => {
    if (!answered) return 'option-btn';
    if (opt === questions[currentQues].correct_answer) return 'option-btn correct';
    if (opt === selected) return 'option-btn incorrect';
    return 'option-btn';
  };

  return (
    <div className='quiz'>
      <div className="subtitle-container">
        <span className="subtitle">Welcome, {userName}!</span>
      </div>
      <div className='bar'>
        <p>Score: {score}</p>
        <p>Category: {category}</p>
      </div>
      {questions.length > 0 ? (
        <div className="question-section">
          <h2>Q{currentQues + 1}: {questions[currentQues].question}</h2>
          <div className="options">
            {options.map((opt, index) => (
              <button
                key={index}
                className={getOptionClass(opt)}
                onClick={() => handleOptionClick(opt)}
                disabled={answered}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="quiz-controls">
            <button onClick={handleQuit} className="quit-btn">Quit</button>
            <button onClick={handleNext} className="next-btn" disabled={!answered}>
              {currentQues + 1 === questions.length ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default Quiz;
