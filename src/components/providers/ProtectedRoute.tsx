import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

type Props = {
    children: React.ReactNode;
}

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }: Props) {
    const { token, isValidating } = useAppSelector(state => state.auth);

    if (isValidating) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (token === null) {
        return <Navigate to="/login" replace />
    }

    return children;
}
