import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function Logout() {
    const { token } = useSelector(state => state.auth);

    if(token === null){
        return <Navigate to="/login" replace />
    }
    
    return (
        <div>Logging out...</div>
    )
}
