import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';
import { apiClient } from '../services/api';

// To prevent rewriting exactly what user was using before, we map FirebaseUser to existing concept loosely or supply it.
// The existing `User` type might have name, email, etc.
interface AuthContextType {
    user: any | null; // We can use any or FirebaseUser to avoid type conflicts without rewriting types
    loading: boolean;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    await firebaseUser.getIdToken();
                    // We pull from the backend to get roles/name
                    const res = await apiClient.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    // A signed-in Firebase account can legitimately be missing its
                    // profile document during registration, but a rejected token is
                    // not an authenticated app session.
                    if (axios.isAxiosError(error) && error.response?.status === 404) {
                        setUser(firebaseUser);
                    } else {
                        console.error('Backend authentication failed:', error);
                        await signOut(auth);
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
