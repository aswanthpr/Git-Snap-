import { ArrowLeft } from "lucide-react";
import { memo } from "react";
import { useUserContext } from "../context/UserContext";


export const BackButton = memo(()=> {
  const { dispatch } = useUserContext();

  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', payload: 'home' });
  };

  return (
    <button onClick={handleBack} className="back-button">
      <ArrowLeft size={16} />
      Back to Repository List
    </button>
  );
})