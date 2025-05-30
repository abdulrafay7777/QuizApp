import React, { useState } from 'react';
import './Home.css';
import quiz_pic from '../../assets/questions.svg';
import { useNavigate } from 'react-router-dom';

const Home = ({ fetchQuestion, setUserName, setCategoryName }) => {
  const Categories = [
    { category: "General Knowledge", value: 9 },
    { category: "Books", value: 10 },
    { category: "Films", value: 11 },
    { category: "Music", value: 12 },
    { category: "Musicals and Theaters", value: 13 },
    { category: "Television", value: 14 },
    { category: "Video Games", value: 15 },
    { category: "Board Games", value: 16 },
    { category: "Science and Nature", value: 17 },
    { category: "Computer", value: 18 },
    { category: "Mathematics", value: 19 },
    { category: "Mythology", value: 20 },
    { category: "Sports", value: 21 },
    { category: "Geography", value: 22 },
    { category: "History", value: 23 },
    { category: "Politics", value: 24 },
    { category: "Celebrities", value: 26 },
    { category: "Animals", value: 27 },
    { category: "Vehicles", value: 28 },
    { category: "Comics", value: 29 },
    { category: "Gadgets", value: 30 },
    { category: "Japanese Anime", value: 31 },
    { category: "Cartoon and Animations", value: 32 },
  ];

  const [Difficulty, setDifficulty] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!category || !name || !Difficulty) {
      setError(true);
      return;
    }
    setLoading(true);
    const selectedCategory = Categories.find((c) => c.value === Number(category));
    const categoryName = selectedCategory ? selectedCategory.category : "Unknown";
    try {
      const questions = await fetchQuestion(category, Difficulty);
      setUserName(name);
      setCategoryName(categoryName);
      navigate('/quiz', {
        state: { userName: name, category: categoryName, questions, score: 0 },
      });
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="settings-panel">
        <div className='left-banner'>
          <h3>Quiz Settings</h3>
          <input
            className='name-input'
            type="text"
            placeholder='Enter your name'
            value={name}
            onChange={(e) => { setName(e.target.value); setError(false); }}
          />
          <div className="select-wrapper">
            <select
              className='dropdown'
              value={category}
              onChange={(e) => { setCategory(e.target.value); setError(false); }}
            >
              <option value="">-- Choose a Category --</option>
              {Categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.category}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              className='dropdown'
              value={Difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setError(false); }}
            >
              <option value="">-- Choose Difficulty --</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <div className='right-banner'>
          <img src={quiz_pic} className='quiz-image' alt="Quiz Illustration" />
        </div>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading questions, please wait...</p>
        </div>
      ) : (
        <button className="btn" onClick={handleClick}>Start Quiz</button>
      )}
      {error && <p className='error-msg'>All fields are required!</p>}
    </>
  );
};

export default Home;
