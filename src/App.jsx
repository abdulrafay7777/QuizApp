import './App.css';
import Header from './Components/Header';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Components/Home/Home';
import Quiz from './Components/Quiz/Quiz';
import Result from './Components/Result/Result';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [categoryName, setCategoryName] = useState('Unknown');

  const fetchQuestion = async (category, difficulty) => {
    try {
      const { data } = await axios.get(
        `https://opentdb.com/api.php?amount=10${category ? `&category=${category}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}&type=multiple`
      );
      setQuestions(data.results);
      return data.results;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  };

  const routers = createBrowserRouter([
    {
      path: '/',
      element: (
        <div>
          <Header />
          <Home fetchQuestion={fetchQuestion} setUserName={setUserName} setCategoryName={setCategoryName} />
        </div>
      ),
    },
    {
      path: '/quiz',
      element: <Quiz questions={questions} score={score} setScore={setScore} setQuestions={setQuestions} />,
    },
    {
      path: '/result',
      element: <Result score={score} />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={routers} />
    </div>
  );
}

export default App;
