import React, { useState } from 'react';
import { Container, Typography, Box, Avatar } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useFormik } from 'formik';
import { ValidationSchema } from './Form/validation/ValidationSchema';
import { RegisterFormInterface } from '../../interfaces/RegisterFormInterface';
import { ProgressBar } from '../../components/global';
import { RegisterForm } from './Form/RegisterForm';
import { AuthClient } from '../../services';
import UserRegistered from '../../components/Auth/UserRegistered/UserRegistered';

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [isRegistered, setRegistrationStatus] = useState(false);

  const fetchData = async (values: RegisterFormInterface) => {
    try {
      const response = await AuthClient.getInstance().registerUser(values);
      console.log('Registration response:', response);

      if (response && (response._id || response.success)) {
        return true;
      } else {
        throw new Error('Registration failed: Unexpected response format');
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.response?.status === 400) {
        const errorData = error.response?.data?.error;
        if (errorData?.email?.notUnique) {
          formik.setFieldError('email', 'Sorry, this email is already in use');
        } else {
          formik.setFieldError('firstName', 'Please review the first name');
          formik.setFieldError('lastName', 'Please review the last name');
          formik.setFieldError('email', 'Please review the email');
          formik.setFieldError('password', 'Please review the password');
        }
      } else {
        alert('Sorry, an unexpected error occurred. Please try again later.');
      }
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: ValidationSchema,
    validateOnChange: false,
    onSubmit: async (values: RegisterFormInterface) => {
      setLoading(true);
      try {
        const success = await fetchData(values);
        if (success) {
          setRegistrationStatus(true);
        }
      } catch (error) {
        console.error('Error during form submission:', error);
        alert('An error occurred during registration. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading) {
    return <ProgressBar />;
  }

  if (isRegistered) {
    return <UserRegistered />;
  }

  return (
    <Container className="register-form" component="section" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <RegisterForm formik={formik} />
      </Box>
    </Container>
  );
}

export default RegisterPage;