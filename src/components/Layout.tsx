// eslint-disable-next-line no-unused-vars
import { Box, Grid } from '@mui/material';
import Sidebar from './Sidebar';

type Props = {
  children: React.ReactNode;
}

// eslint-disable-next-line react/prop-types
export default function Layout({ children }: Props) {
  return (
    <Box sx={{ flexGrow: 1, height: '100vh' }}>
      <Grid container spacing={0} sx={{ height: '100%' }}>
        <Grid size={3}>
            <Sidebar />
        </Grid>
        <Grid size={9}>
          <Box sx={{ height: '100%', p: 2 }}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
