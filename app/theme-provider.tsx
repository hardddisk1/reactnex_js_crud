'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with null to delay rendering until client preference is known
  const [mode, setMode] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(dark ? 'dark' : 'light');
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode ?? 'light', // fallback in case mode is null briefly
        },
      }),
    [mode]
  );

  // Prevent rendering until mode is detected to avoid hydration mismatch
  if (mode === null) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
