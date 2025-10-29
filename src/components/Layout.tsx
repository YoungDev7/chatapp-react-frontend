import { Box } from '@mui/material';
import React from 'react';
import Sidebar from './Sidebar';

type Props = {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', p: 2, gap: 2, boxSizing: 'border-box' }}>
      <Box sx={{ width: '30vw', flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <Box sx={{ width: '70vw', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Box>
  );
}
