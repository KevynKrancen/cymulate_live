import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Alert
} from '@mui/material';
import { Link } from "react-router-dom";
import { ProgressBar } from '../../components/global';
import { AuthClient } from '../../services';
import heroImage from '../../assets/images/landing-pages/image-cache.jpeg';
import './TasksPage.scss';
import { UserInterface } from '../../interfaces/UserInterface';
import { TaskInterface } from '../../interfaces/Tasksinterfaces';
import ApiTasks from '../../services/api/ApiTasks/ApiTasks';
import { getRowStyle } from './helper';

function TasksPage() {  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [tasks, setTasks] = useState<TaskInterface[]>([]); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse: UserInterface = await AuthClient.getInstance().getUser();
        console.log('User response:', userResponse);
        setUser(userResponse);

        if (userResponse?.id) {
          console.log('Fetching tasks for:', userResponse.id);
          const tasksResponse: TaskInterface[] = await ApiTasks.getInstance().getAllTasks(userResponse.id);
          console.log('Tasks response:', tasksResponse);

          if (Array.isArray(tasksResponse)) {
            setTasks(tasksResponse);
          } else {
            console.error('Tasks response is not an array:', tasksResponse);
            setError('Failed to fetch tasks. Please try again later.');
          }
        } else {
          console.error('User firstName is undefined');
          setError('Unable to fetch user information. Please try logging in again.');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error.response?.data || error.message);
        setError('An error occurred while fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ProgressBar />;
  }
  
  return (
    <Box className="tasks-page-wrapper" style={{ backgroundImage: `url(${heroImage})` }}>
      <Box className="tasks-page-header">
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Task Management
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Manage your tasks efficiently with our easy-to-use platform.
          </Typography>
          <Button 
            component={Link} 
            to='/home'
            className="custom-button primary"
          >
            Back to home
          </Button>
        </Container>
      </Box>
      <Container className="tasks-page-content">
        <Typography variant="h4" component="h2" gutterBottom>
          Recent Tasks
        </Typography>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : tasks.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>URL to Scrape</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.token}>
                    <TableCell>{task.urlToScrape}</TableCell>
                    <TableCell>{new Date(task.createdDate).toLocaleString()}</TableCell>
                    <TableCell style={getRowStyle(task.status)}>{task.status}</TableCell>
                    <TableCell><Button component={Link} to={`/tasks/${task._id}`}>View</Button></TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No tasks found. Create a new task to get started!</Alert>
        )}
      </Container>
    </Box>
  );
}

export default TasksPage;