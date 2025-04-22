'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { token } = useAuth();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (token) {
        setChecked(true); // всё ок
      } else {
        const timer = setTimeout(() => {
          router.push('/login');
        }, 500); // ждём полсекунды, если токена нет
        return () => clearTimeout(timer);
      }
    }, [token]);

    if (!checked) return null;

    return <Component {...props} />;
  };
}
