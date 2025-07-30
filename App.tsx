import React, { useState, useCallback, ReactNode } from 'react';
import { generateRandomQuestion } from './services/geminiService';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-6.857 2.143L12 21l-2.143-6.857L3 12l6.857-2.143L12 3z" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    <p className="text-lg text-slate-600">질문을 생성하는 중...</p>
  </div>
);

const QuestionCard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 w-full max-w-2xl min-h-[250px] flex items-center justify-center transition-all duration-300">
    <div className="text-center">
      {children}
    </div>
  </div>
);

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('버튼을 눌러 오늘의 질문을 확인하세요!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQuestion('');

    try {
      const newQuestion = await generateRandomQuestion();
      // A simple check to remove quotation marks that the model might add
      setQuestion(newQuestion.replace(/^"|"$/g, ''));
    } catch (err) {
      console.error(err);
      setError('질문을 생성하는 데 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 flex flex-col p-4 font-sans text-slate-800">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center flex-grow">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">오늘의 랜덤 질문</h1>
          <p className="mt-2 text-lg text-slate-600">수업의 시작을 즐겁게 열어보세요!</p>
        </header>

        <QuestionCard>
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-2xl font-medium text-red-600">{error}</p>
          ) : (
            <p className="text-2xl md:text-3xl font-semibold text-slate-700 animate-fade-in">{question}</p>
          )}
        </QuestionCard>

        <button
          onClick={handleGenerateQuestion}
          disabled={isLoading}
          className="mt-10 flex items-center justify-center py-3 px-8 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          <SparklesIcon />
          <span>오늘의 질문 생성</span>
        </button>
      </main>
      <footer className="w-full text-center py-2 text-slate-500 text-sm">
        <p>© 2025 노진우</p>
      </footer>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;