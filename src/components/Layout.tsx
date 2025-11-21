import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';
import Sidebar from './Sidebar';

type Props = {
  children: React.ReactNode;
}

type LayoutContextType = {
  toggleDrawer: () => void;
  isMobile: boolean;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within Layout');
  }
  return context;
};

export default function Layout({ children }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', p: { xs: 0, md: 2 }, gap: { xs: 0, md: 2 }, boxSizing: 'border-box' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box sx={{ width: '30vw', flexShrink: 0 }}>
          <Sidebar isMobile={false} />
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              width: '80vw',
              maxWidth: '320px',
            }
          }}
        >
          <Sidebar isMobile={true} />
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ 
        width: { xs: '100vw', md: '70vw' }, 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        p: { xs: 1, md: 0 }
      }}>
        <LayoutContext.Provider value={{ toggleDrawer, isMobile }}>
          {children}
        </LayoutContext.Provider>
      </Box>
    </Box>
  );
}
