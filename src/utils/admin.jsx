import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app, db, firebaseReady } from './firebase';

const auth = app ? getAuth(app) : null;
import { COLLECTIONS } from './constants';


const AdminCtx = createContext(null);

export function AdminProvider({ children }) {
  const [state, setState] = useState({ user: null, isAdmin: false, loading: true });
  useEffect(() => {
    if (!firebaseReady) { setState({ user: null, isAdmin: false, loading: false }); return; }
    return onAuthStateChanged(auth, async (user) => {
      if (!user) return setState({ user: null, isAdmin: false, loading: false });
      let isAdmin = false;
      try { isAdmin = (await getDoc(doc(db, COLLECTIONS.admins, user.uid))).exists(); } catch {}
      setState({ user, isAdmin, loading: false });
    });
  }, []);
  const value = {
    ...state,
    login: (email, pw) => signInWithEmailAndPassword(auth, email, pw),
    logout: () => signOut(auth),
    reset: (email) => sendPasswordResetEmail(auth, email),
  };
  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}
export const useAdmin = () => useContext(AdminCtx);
