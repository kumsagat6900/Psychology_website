'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function StudentsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/users/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке студентов:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Список студентов</h1>

      {loading ? (
        <div className="text-gray-400">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card
              key={student.id}
              className="bg-gray-900 p-5 border border-gray-800 cursor-pointer hover:border-red-600 transition"
              onClick={() => router.push(`/psychologist/student/${student.id}`)}
            >
              <div className="flex items-center gap-3 mb-3">
                <User className="text-red-500" size={24} />
                <div>
                  <p className="text-lg font-semibold">{student.name}</p>
                  <p className="text-sm text-gray-400">{student.email}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Зарегистрирован: {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
