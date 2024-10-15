import React, { useEffect, useState } from 'react';
import { Avatar, Box, Container, Grid, Typography, Snackbar } from '@mui/material';
import { ChatBubbleOutlineOutlined } from '@mui/icons-material';
import { useFormik } from 'formik';
import { ValidationSchema } from './Form/validation/ValidationSchema';
import { TasksFormInterface } from '../../interfaces/TasksFormInterface';
import { AuthClient } from '../../services';
import { UserInterface } from '../../interfaces/UserInterface';
import ApiTasks from '../../services/api/ApiTasks/ApiTasks';
import TasksForm from './Form/TaskForm';
function CreateTaskPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await AuthClient.getInstance().getUser();
        setUser(response);
        console.log('User fetched:', response);
      } catch (error: any) {
        console.error('Error fetching user:', error.response?.data);
        setSnackbar({ open: true, message: 'Error fetching user data' });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchData = async (values: TasksFormInterface) => {
    try {
      console.log('Sending tasks with values:', values);
      await ApiTasks.getInstance().sendTask(values);
      console.log('Tasks sent successfully');
      setSnackbar({ open: true, message: 'Tasks sent successfully' });
    } catch (error: any) {
      console.error('Error sending tasks:', error);
      setSnackbar({ open: true, message: 'Error sending tasks' });
    }
  };
 

  console.log(user?._id);
  const formik = useFormik({
    initialValues: {
      urlToScrape: '',
      userId: `${user?.id}`,
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    validateOnChange: false,
    onSubmit: async (values: TasksFormInterface) => {
      console.log('Form submitted with values:', values);
      setLoading(true);
      await fetchData(values);
      setLoading(false);
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container component="main" className="contact">
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <ChatBubbleOutlineOutlined />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            Send an email
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <TasksForm formik={formik} />
        </Grid>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
}

export default CreateTaskPage;