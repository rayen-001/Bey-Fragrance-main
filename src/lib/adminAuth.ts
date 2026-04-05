import { supabase } from './api';

const ADMIN_SESSION_KEY = 'hama_fragrance_admin_session';

export interface AdminSession {
  email: string;
  loginTime: string;
}

// Check if admin is logged in via Supabase session + role
export const isAdminLoggedIn = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) return false;

    const role = session.user?.user_metadata?.role;
    return role === 'admin';
  } catch (error) {
    console.error('Error checking admin session:', error);
    return false;
  }
};

// Synchronous fallback for quick checks (uses localStorage marker)
export const isAdminLoggedInSync = (): boolean => {
  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;

    const adminSession: AdminSession = JSON.parse(session);
    const loginTime = new Date(adminSession.loginTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      logoutAdmin();
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Get current admin session
export const getAdminSession = (): AdminSession | null => {
  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error loading admin session:', error);
    return null;
  }
};

// Admin login — now delegates to Supabase via api.ts
// The actual login is handled in AdminLogin.tsx via authApi.signIn
// This function is kept for backward compatibility but is no longer the primary entry point
export const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { authApi } = await import('./api');
    const result = await authApi.signIn(email, password);

    if (!result.success) {
      return { success: false, error: result.error || 'Login failed' };
    }

    const role = result.user?.user_metadata?.role;
    if (role !== 'admin') {
      await authApi.signOut();
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    const session: AdminSession = {
      email,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

// Admin logout
export const logoutAdmin = (): void => {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    supabase.auth.signOut();
  } catch (error) {
    console.error('Error removing admin session:', error);
  }
};
