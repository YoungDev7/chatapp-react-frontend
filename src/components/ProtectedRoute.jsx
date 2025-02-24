import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
    const { token } = useAuth();

    if(token === undefined){
        //TODO: Add a loading spinner
        return null;
    }

    if(token === null){
        return <Navigate to="/login" replace />
    }

    return children;
}
