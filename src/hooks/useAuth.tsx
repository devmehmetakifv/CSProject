import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.ts';

type UserType = 'jobseeker' | 'employer' | 'admin';

interface User extends FirebaseUser {
  userType?: UserType;
}

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  loading: boolean;
  register: (email: string, password: string, userType: UserType) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  devModeLogin: (userType: UserType) => void;
}

const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        const userWithType = firebaseUser as User;
        userWithType.userType = userData?.userType as UserType;
        setUser(userWithType);
        setUserType(userData?.userType as UserType);
      } else {
        setUser(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, userType: UserType) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', user.uid), {
      email,
      userType,
      createdAt: new Date().toISOString()
    });
    const userWithType = user as User;
    userWithType.userType = userType;
    setUser(userWithType);
    setUserType(userType);
  };

  const login = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    const userWithType = user as User;
    userWithType.userType = userData?.userType as UserType;
    setUser(userWithType);
    setUserType(userData?.userType as UserType);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserType(null);
  };

  const devModeLogin = (userType: UserType) => {
    console.log('Geliştirme modu:', isDevelopment, 'DEV:', import.meta.env.DEV);
    
    if (!isDevelopment) {
      console.warn('Geliştirici modu girişi sadece geliştirme ortamında kullanılabilir');
      return;
    }

    const fakeUser = {
      uid: 'dev-user-id',
      email: `dev-${userType}@example.com`,
      displayName: `${userType.charAt(0).toUpperCase() + userType.slice(1)} Developer`,
      userType,
      emailVerified: true,
    } as User;

    setUser(fakeUser);
    setUserType(userType);
  };

  const value = {
    user,
    userType,
    loading,
    register,
    login,
    logout,
    devModeLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 