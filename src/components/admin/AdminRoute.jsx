import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { dbService } from '../../lib/supabase';

export default function AdminRoute({ children }) {
  const [session, setSession] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    async function check() {
      const sess = await dbService.getAdminSession();
      setSession(sess);
    }
    check();
  }, [location.pathname]);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-gold-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

