import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  initialJobs,
  jobsSummary,
  initialHackathons,
  hackathonsSummary,
  initialReferrals,
  referralsSummary,
  initialNotifications,
  initialUser,
  talentPoolCandidates,
} from '../data/placeholderData';

const AppContext = createContext(null);

const initialState = {
  user: initialUser,
  jobs: initialJobs,
  jobsSummary,
  hackathons: initialHackathons,
  hackathonsSummary,
  referrals: initialReferrals,
  referralsSummary,
  notifications: initialNotifications,
  talentPool: talentPoolCandidates,
  auth: null, // set after signup
  isAuthenticated: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'ADD_JOB':
      return {
        ...state,
        jobs: {
          ...state.jobs,
          [action.payload.type === 'Internship' ? 'internships' : 'fullTime']: [
            ...(state.jobs[action.payload.type === 'Internship' ? 'internships' : 'fullTime']),
            action.payload,
          ],
        },
      };
    case 'ADD_HACKATHON':
      return {
        ...state,
        hackathons: [...state.hackathons, action.payload],
      };
    case 'REMOVE_JOB': {
      const { jobId, type } = action.payload;
      const key = type === 'Internship' ? 'internships' : 'fullTime';
      return {
        ...state,
        jobs: {
          ...state.jobs,
          [key]: state.jobs[key].filter((j) => j.id !== jobId),
        },
      };
    }
    case 'REMOVE_HACKATHON':
      return {
        ...state,
        hackathons: state.hackathons.filter((h) => h.id !== action.payload),
      };
    case 'ADD_REFERRAL_CAMPAIGN':
      return {
        ...state,
        referrals: [...state.referrals, action.payload],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'LOGOUT':
      // Keep user and auth in memory, only end the session
      return { ...state, isAuthenticated: false };
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'SIGNUP':
      return {
        ...state,
        user: {
          name: action.payload.name,
          email: action.payload.email,
          phone: state.user.phone || '',
        },
        auth: {
          email: action.payload.email,
          password: action.payload.password,
        },
        isAuthenticated: true,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const updateUser = useCallback((payload) => dispatch({ type: 'UPDATE_USER', payload }), []);
  const addJob = useCallback((payload) => dispatch({ type: 'ADD_JOB', payload }), []);
  const addHackathon = useCallback((payload) => dispatch({ type: 'ADD_HACKATHON', payload }), []);
  const markNotificationRead = useCallback(
    (id) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id }),
    []
  );
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
  const login = useCallback(
    ({ email, password }) => {
      if (!state.auth) {
        return { ok: false, reason: 'no_account' };
      }
      if (state.auth.email !== email) {
        return { ok: false, reason: 'wrong_email' };
      }
      if (state.auth.password !== password) {
        return { ok: false, reason: 'wrong_password' };
      }
      dispatch({ type: 'LOGIN' });
      return { ok: true };
    },
    [state.auth]
  );
  const signup = useCallback((payload) => dispatch({ type: 'SIGNUP', payload }), []);
  const removeJob = useCallback((jobId, type) => dispatch({ type: 'REMOVE_JOB', payload: { jobId, type } }), []);
  const removeHackathon = useCallback((id) => dispatch({ type: 'REMOVE_HACKATHON', payload: id }), []);

  const value = {
    ...state,
    updateUser,
    addJob,
    addHackathon,
    removeJob,
    removeHackathon,
    markNotificationRead,
    logout,
    login,
    signup,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
