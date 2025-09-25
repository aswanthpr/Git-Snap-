import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { Search } from 'lucide-react';
import { validateUsername } from '../utils/validations';
import { fetchGithubUser } from '../services/apis';
// import toast from 'react-hot-toast';
import type { IfetchUserResponse } from '../types';


export default function UserInput() {
  const [username, setUsername] = useState('');
  const [inputError, setInputError] = useState('');
  const { dispatch } = useUserContext();

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateUsername(username); 
    if (error) {
      setInputError(error);
      return;
    }
    setInputError(''); 
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
        const result = await fetchGithubUser(username) as IfetchUserResponse;
        if(result) {

          const {repo,user} = result;
           
            // Fetch user data
         
            dispatch({ type: 'SET_USER', payload: { username, user } });
      
            // Fetch repositories
            
            dispatch({ type: 'SET_REPOS', payload: { username, repos:repo } });
            // toast.success(result?.message||"something went wrong")
        }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  };

  return (
    <div className="user-input">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (inputError) {
                validateUsername(e.target.value);
              }
            }}
            placeholder="Enter GitHub username..."
            className={`search-input ${inputError ? 'error' : ''}`}
          />
          <button type="submit" className="search-button">
            <Search size={20} />
            Search
          </button>
        </div>
        {inputError && <div className="input-error">{inputError}</div>}
      </form>
    </div>
  );
}