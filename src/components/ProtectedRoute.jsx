import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
    const { token, isValidating } = useSelector(state => state.auth);

    if (isValidating) {
        return <div>Loading...</div>;
    }

    if(token === null){
        return <Navigate to="/login" replace />
    }

    return children;
}
