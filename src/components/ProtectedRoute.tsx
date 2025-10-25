import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

type Props = {
    children: React.ReactNode;
}

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }: Props) {
        const { token, isValidating } = useAppSelector(state => state.auth);

    if (isValidating) {
        return <div>Loading...</div>;
    }

    if(token === null){
        return <Navigate to="/login" replace />
    }

    return children;
}
