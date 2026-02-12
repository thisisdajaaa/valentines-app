import { useState, useCallback } from 'react';
import { questions } from './data/questions';
import { FinalMessage } from './components/FinalMessage';
import { FloatingHearts } from './components/FloatingHearts';
import './App.css';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);

  const q = questions[currentQuestion];
  const isLastQuestion = q?.isLastQuestion;
  const isCorrect = selectedAnswer !== null && (isLastQuestion || selectedAnswer === q?.correct);

  const selectOption = useCallback((index) => {
    const question = questions[currentQuestion];
    if (question.isLastQuestion) {
      setSelectedAnswer(index);
      setShowHearts(true);
      setWrongIndex(null);
      return;
    }
    if (index === question.correct) {
      setSelectedAnswer(index);
      setShowHearts(true);
      setWrongIndex(null);
    } else {
      setWrongIndex(index);
      setTimeout(() => setWrongIndex(null), 500);
    }
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (selectedAnswer === null) return;
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setShowHearts(false);
    } else {
      setShowFinal(true);
      setShowCelebration(true);
    }
  }, [currentQuestion, selectedAnswer]);

  if (showFinal) {
    return (
      <>
        <div className="container">
          <FinalMessage />
        </div>
        {showCelebration && (
          <FloatingHearts
            count={30}
            duration={6000}
            variant="celebration"
            onDone={() => setShowCelebration(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="container">
        <div className="quiz-header">
          <h1>💝 Quick Quiz! 💝</h1>
          <p>Let's see how well you know me...</p>
        </div>

        <div className="progress">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`progress-dot ${i <= currentQuestion ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="question-container">
          <div className="question">{q.question}</div>
          <div className="options">
            {q.options.map((option, index) => {
              const selected = selectedAnswer === index;
              const wrong = wrongIndex === index;
              return (
                <div
                  key={index}
                  className={`option ${selected ? 'selected' : ''} ${wrong ? 'wrong' : ''}`}
                  onClick={() => {
                    if (selectedAnswer !== null && isCorrect) return;
                    selectOption(index);
                  }}
                >
                  {option}
                </div>
              );
            })}
          </div>
        </div>

        <button
          className={`next-btn ${isCorrect ? 'active' : ''}`}
          onClick={handleNext}
        >
          Next Question →
        </button>
      </div>

      {showHearts && (
        <FloatingHearts
          count={5}
          duration={2500}
          variant="burst"
          onDone={() => setShowHearts(false)}
        />
      )}
    </>
  );
}

export default App;
