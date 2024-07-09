import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function CircularDeterminate({ exercises }) {
  return (
    <Stack spacing={4} direction="row" justifyContent="center" alignItems="center">
      {exercises.map((exercise, index) => (
        <div key={exercise.id} style={{ textAlign: 'center' }}>
          <CircularProgress size={80} variant="determinate" value={exercise.progress} />
          <Typography variant="subtitle1">EXERCISE {index + 1}</Typography>
          <Typography variant="body2">{exercise.title}</Typography>
        </div>
      ))}
    </Stack>
  );
}
