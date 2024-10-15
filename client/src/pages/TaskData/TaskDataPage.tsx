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
  Alert,
  Tooltip
} from '@mui/material';
import { Link } from "react-router-dom";
import { ProgressBar } from '../../components/global';
import { AuthClient } from '../../services';
import heroImage from '../../assets/images/landing-pages/image-cache.jpeg';
import './TasksPage.scss';
import { UserInterface } from '../../interfaces/UserInterface';
import { ScappingUrlInterface } from '../../interfaces/ScappingUrlInterface';
import ApiTasks from '../../services/api/ApiTasks/ApiTasks';

function TaskDataPage() {  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [tasks, setTasks] = useState<ScappingUrlInterface[]>([]); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse: UserInterface = await AuthClient.getInstance().getUser();
        setUser(userResponse);

        if (userResponse?.id) {
          const tasksResponse: ScappingUrlInterface[] = await ApiTasks.getInstance().getTask(userResponse.id);

          if (Array.isArray(tasksResponse)) {
            setTasks(tasksResponse);
          } else {
            console.error('Tasks response is not an array:', tasksResponse);
            setError('Failed to fetch tasks. Please try again later.');
          }
        } else {
          console.error('User ID is undefined');
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
            Task Data
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            View all collected data for your tasks.
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
          Collected Task Data
        </Typography>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : tasks.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task ID</TableCell>
                  <TableCell>URL to Scrape</TableCell>
                  <TableCell>Found URLs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task._id}</TableCell>
                    <TableCell>{task.url}</TableCell>
                    <TableCell>
                      {task.foundUrls && task.foundUrls.length > 0 ? (
                        <Tooltip title={task.foundUrls.join(', ')} arrow>
                          <span>{`${task.foundUrls.length} URLs found`}</span>
                        </Tooltip>
                      ) : (
                        'No URLs found'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No task data found. Create a new task to get started!</Alert>
        )}
      </Container>
    </Box>
  );
}

export default TaskDataPage;