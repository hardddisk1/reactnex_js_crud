// components/AspectRatioBox.tsx
import { Box } from '@mui/material';

interface AspectRatioBoxProps {
  ratio?: string;
  children: React.ReactNode;
}

const AspectRatioBox = ({ ratio = '4/3', children }: AspectRatioBoxProps) => {
  const [w, h] = ratio.split('/').map(Number);
  const paddingTop = `${(h / w) * 100}%`;

  return (
    <Box sx={{ position: 'relative', width: '100%', paddingTop }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AspectRatioBox;
