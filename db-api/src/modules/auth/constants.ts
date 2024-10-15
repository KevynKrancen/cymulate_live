console.log('Environment variables:', process.env);
console.log('SECRET_KEY:', process.env.SECRET_KEY);

if (!process.env.SECRET_KEY) {
  console.error('SECRET_KEY is not defined in environment variables');
  process.exit(1);
}

export const jwtConstants = {
  secret: process.env.SECRET_KEY,
};
