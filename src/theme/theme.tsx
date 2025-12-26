import { createTheme } from '@mui/material/styles';

// Extend the Palette and PaletteOptions interfaces
declare module '@mui/material/styles' {
    interface Palette {
        custom: {
            mainDark: string;
            secondaryDark: string;
        };
    }
    interface PaletteOptions {
        custom?: {
            mainDark?: string;
            secondaryDark?: string;
        };
    }
}

const mainDark = '#181818';
const secondaryDark = '#1f1f1f';

const theme = createTheme({
    palette: {
        custom: {
            mainDark: mainDark,
            secondaryDark: secondaryDark,
        },
        background: {
            default: mainDark
        }
    },
});

export default theme;