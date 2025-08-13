import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import api from '../../services/Api';
import { clearAuth } from '../../store/slices/authSlice';

export default function Logout() {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const handleLogout = async () => {

            try{
                await api.post('/auth/logout');
            }catch(error){
                console.error("logout error: " + error);
            }
            
            dispatch(clearAuth());
        }

        handleLogout();
    }, []);

    if(token === null){
        return <Navigate to="/login" replace />
    }
    
    return (
        <div>Logging out...</div>
    )
}
