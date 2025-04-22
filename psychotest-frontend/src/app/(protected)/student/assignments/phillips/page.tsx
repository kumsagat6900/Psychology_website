'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { withAuth } from '@/lib/withAuth';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { phillipsQuestions } from '@/data/phillips';
import { CheckCircle, AlertCircle } from 'lucide-react';

function PhillipsTestPage() {
  const [answers, setAnswers] = useState<(string | null)[]>(Array(phillipsQuestions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const { token } = useAuth();
  const router = useRouter();
  
  // Questions per section (for pagination)
  const questionsPerSection = 10;
  const totalSections = Math.ceil(phillipsQuestions.length / questionsPerSection);
  
  useEffect(() => {
    // Calculate progress percentage
    const answeredCount = answers.filter(a => a !== null).length;
    const progressPercent = (answeredCount / phillipsQuestions.length) * 100;
    setProgress(progressPercent);
  }, [answers]);

  const handleAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      const missingCount = answers.filter((a) => a === null).length;
      toast.error(`Пожалуйста, ответьте на все вопросы. Пропущено: ${missingCount}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        'http://localhost:3000/tests/submit',
        {
          type: 'PHILLIPS',
          answers,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Тест успешно отправлен!');
      router.push(`/student/test/${res.data.id}`);
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      toast.error('Произошла ошибка при отправке теста');
    } finally {
      setSubmitting(false);
    }
  };

  const goToNextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  // Get current questions for this section
  const startIndex = currentSection * questionsPerSection;
  const endIndex = Math.min(startIndex + questionsPerSection, phillipsQuestions.length);
  const currentQuestions = phillipsQuestions.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section with info about the test */}
      <section className="relative py-10 mb-6">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Тест Филлипса</h1>
            <p className="text-gray-300">Тест школьной тревожности Филлипса позволяет определить уровень и характер тревожности у детей младшего и среднего школьного возраста.</p>
          </motion.div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{Math.round(progress)}% завершено</span>
              <span>{answers.filter(a => a !== null).length} из {phillipsQuestions.length}</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-600 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        {/* Section indicator */}
        <div className="mb-6 flex justify-center">
          <div className="flex space-x-2">
            {Array(totalSections).fill(0).map((_, i) => (
              <motion.button
                key={i}
                className={`w-3 h-3 rounded-full ${currentSection === i ? 'bg-red-600' : 'bg-gray-700'}`}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentSection(i)}
              />
            ))}
          </div>
        </div>
        
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {currentQuestions.map((question, idx) => {
            const questionIndex = startIndex + idx;
            return (
              <motion.div 
                key={questionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="bg-red-600/20 text-red-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                      {questionIndex + 1}
                    </div>
                    <p className="text-lg">{question}</p>
                  </div>
                  
                  <div className="mt-6 flex justify-center gap-6">
                    <Button
                      variant="outline"
                      className={`px-8 py-6 text-lg flex items-center gap-2 border-2 ${
                        answers[questionIndex] === 'да' 
                          ? 'bg-green-800/20 border-green-700 text-white' 
                          : 'bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800'
                      }`}
                      onClick={() => handleAnswer(questionIndex, 'да')}
                    >
                      {answers[questionIndex] === 'да' && <CheckCircle size={18} />}
                      Да
                    </Button>
                    <Button
                      variant="outline"
                      className={`px-8 py-6 text-lg flex items-center gap-2 border-2 ${
                        answers[questionIndex] === 'нет' 
                          ? 'bg-red-800/20 border-red-700 text-white' 
                          : 'bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800'
                      }`}
                      onClick={() => handleAnswer(questionIndex, 'нет')}
                    >
                      {answers[questionIndex] === 'нет' && <AlertCircle size={18} />}
                      Нет
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navigation buttons */}
        <div className="mt-10 flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPrevSection}
            disabled={currentSection === 0}
            className="px-6 py-5"
          >
            Назад
          </Button>
          
          {currentSection < totalSections - 1 ? (
            <Button 
              onClick={goToNextSection}
              className="bg-red-600 hover:bg-red-700 px-6 py-5"
            >
              Далее
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting} 
              className="bg-red-600 hover:bg-red-700 px-6 py-5"
            >
              {submitting ? 'Отправка...' : 'Завершить тест'}
            </Button>
          )}
        </div>
      </main>

      {/* Info box at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="max-w-3xl mx-auto bg-gray-900/90 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Отвечайте максимально честно. Для точных результатов необходимо ответить на все вопросы.</p>
          </div>
          {currentSection === totalSections - 1 && (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? 'Отправка...' : 'Завершить'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(PhillipsTestPage);