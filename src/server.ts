import app from './app.ts';

const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
