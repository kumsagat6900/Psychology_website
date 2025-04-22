'use client';

import { useState } from 'react';
import { withAuth } from '@/lib/withAuth';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { phillipsQuestions } from '@/data/phillips';

function AssignmentPage() {
  const [answers, setAnswers] = useState<(string | null)[]>(Array(phillipsQuestions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  const handleAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert(`Вы не ответили на все вопросы (${answers.filter(a => a === null).length} пропущено).`);
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
      toast.success('Тест отправлен!');
      const testId = res.data.id;
      router.push(`/student/test/${testId}`);
    } catch (err) {
      console.error('Ошибка отправки теста:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Тест Филлипса</h1>
        <div className="space-y-4">
          {phillipsQuestions.map((q, i) => (
            <div key={i} className="bg-zinc-800 p-4 rounded">
              <p className="mb-2">{q}</p>
              <div className="flex gap-4">
                <Button
                  variant={answers[i] === 'да' ? 'secondary' : 'outline'}
                  onClick={() => handleAnswer(i, 'да')}
                >
                  Да
                </Button>
                <Button
                  variant={answers[i] === 'нет' ? 'secondary' : 'outline'}
                  onClick={() => handleAnswer(i, 'нет')}
                >
                  Нет
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={handleSubmit} disabled={submitting} className="w-full">
            {submitting ? 'Отправка...' : 'Отправить ответы'}
          </Button>
        </div>
      </main>
    </div>
  );
}

export default withAuth(AssignmentPage);