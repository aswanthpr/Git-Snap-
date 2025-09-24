import React, { createContext, useContext, useReducer,type ReactNode } from 'react';
import type { AppState, AppAction } from '../types/index';

const initialState: AppState = {
  users: {},
  repos: {},
  followers: {},
  selectedUser: null,
  selectedRepo: null,
  currentView: 'home',
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USER':
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.username]: action.payload.user,
        },
        selectedUser: action.payload.username,
        loading: false,
        error: null,
      };
    
    case 'SET_REPOS':
      return {
        ...state,
        repos: {
          ...state.repos,
          [action.payload.username]: action.payload.repos,
        },
      };
    
    case 'SET_FOLLOWERS':
      return {
        ...state,
        followers: {
          ...state.followers,
          [action.payload.username]: action.payload.followers,
        },
      };
    
    case 'SELECT_USER':
      return {
        ...state,
        selectedUser: action.payload,
        currentView: 'home',
      };
    
    case 'SELECT_REPO':
      return {
        ...state,
        selectedRepo: action.payload,
        currentView: 'repo-details',
      };
    
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };
    
    default:
      return state;
  }
}

interface UserContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}