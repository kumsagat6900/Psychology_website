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

// Вопросы Олвеуса
const olweusQuestions = [
  'Как часто тебя обзывают или дразнят в школе?',
  'Как часто тебя исключают из групп или игр?',
  'Как часто ты подвергаешься физическим нападкам?',
  'Как часто другие ученики пугают или шантажируют тебя?',
  'Как часто распространяются слухи о тебе?',
  'Как часто ты чувствуешь себя запуганным?',
  'Как часто ты сам обзываешь или дразнишь других?',
  'Как часто ты физически нападаешь на других?',
  'Как часто ты исключаешь других из игр или групп?',
  'Как часто ты пугаешь или угрожаешь кому-то?',
  'Как часто ты распространяешь слухи о других?',
  'Как часто ты видишь, как кого-то травят?',
  'Как часто ты принимаешь участие в травле?',
];

// Описание значений для ответов
const answerDescriptions = [
  'Никогда',
  'Редко',
  'Иногда',
  'Часто',
  'Очень часто'
];

function OlweusTestPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(olweusQuestions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const { token } = useAuth();
  const router = useRouter();
  
  // Questions per section (for pagination)
  const questionsPerSection = 5;
  const totalSections = Math.ceil(olweusQuestions.length / questionsPerSection);
  
  useEffect(() => {
    // Calculate progress percentage
    const answeredCount = answers.filter(a => a !== null).length;
    const progressPercent = (answeredCount / olweusQuestions.length) * 100;
    setProgress(progressPercent);
  }, [answers]);

  const handleAnswer = (index: number, value: number) => {
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
          type: 'OLWEUS',
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
  const endIndex = Math.min(startIndex + questionsPerSection, olweusQuestions.length);
  const currentQuestions = olweusQuestions.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section with info about the test */}
      <section className="relative py-10 mb-6">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Тест Олвеуса</h1>
            <p className="text-gray-300">Тест Олвеуса поможет выявить случаи буллинга и оценить социально-психологический климат в школе.</p>
          </motion.div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{Math.round(progress)}% завершено</span>
              <span>{answers.filter(a => a !== null).length} из {olweusQuestions.length}</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-500"
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
                className={`w-3 h-3 rounded-full ${currentSection === i ? 'bg-blue-600' : 'bg-gray-700'}`}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentSection(i)}
              />
            ))}
          </div>
        </div>
        
        {/* Legend for ratings */}
        <div className="mb-8 bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm mb-2">Шкала оценки:</p>
          <div className="flex flex-wrap justify-between gap-2">
            {answerDescriptions.map((desc, i) => (
              <div key={i} className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-sm mr-2">{i}</span>
                <span className="text-sm">{desc}</span>
              </div>
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
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-600/20 text-blue-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {questionIndex + 1}
                    </div>
                    <p className="text-lg">{question}</p>
                  </div>
                  
                  <div className="mt-6">
                    <div className="grid grid-cols-5 gap-2">
                      {[0, 1, 2, 3, 4].map((val) => (
                        <motion.button
                          key={val}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAnswer(questionIndex, val)}
                          className={`relative p-3 rounded-lg border-2 transition-all ${
                            answers[questionIndex] === val 
                              ? 'bg-blue-900/30 border-blue-700 text-white' 
                              : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-bold mb-1">{val}</span>
                            <span className="text-xs text-center">{answerDescriptions[val]}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
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
              className="bg-blue-600 hover:bg-blue-700 px-6 py-5"
            >
              Далее
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting} 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-5"
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
            <p className="text-sm text-gray-400">Все ответы строго конфиденциальны. Результаты помогут создать более безопасную школьную среду.</p>
          </div>
          {currentSection === totalSections - 1 && (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? 'Отправка...' : 'Завершить'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(OlweusTestPage);