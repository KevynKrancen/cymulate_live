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
import { Link, useParams } from "react-router-dom";
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
  const [taskData, setTaskData] = useState<ScappingUrlInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { taskId } = useParams<{ taskId?: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse: UserInterface = await AuthClient.getInstance().getUser();
        setUser(userResponse);

        if (userResponse?.id && taskId) {
          const taskResponse: ScappingUrlInterface[] = await ApiTasks.getInstance().getTask(taskId);
          console.log('Task response:', taskResponse);
          if (Array.isArray(taskResponse) && taskResponse.length > 0) {
            setTaskData(taskResponse[0]);
          } else {
            console.error('Task response is not as expected:', taskResponse);
            setError('Failed to fetch task data. Please try again later.');
          }
        } else if (!taskId) {
          console.error('Task ID is missing');
          setError('Task ID is missing. Please provide a valid task ID.');
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
  }, [taskId]);

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
            View collected data for task: {taskId}
          </Typography>
          <Button 
            component={Link} 
            to='/tasks'
            className="custom-button primary"
          >
            Back to Tasks
          </Button>
        </Container>
      </Box>
      <Container className="tasks-page-content">
        <Typography variant="h4" component="h2" gutterBottom>
          Collected Task Data
        </Typography>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : taskData ? (
          <>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{taskData._id}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h5" component="h3" gutterBottom>
              Scrapped URLs
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>URL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taskData.scrappedData.map((url, index) => (
                    <TableRow key={index}>
                      <TableCell>{url}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Alert severity="info">No task data found for the given task ID.</Alert>
        )}
      </Container>
    </Box>
  );
}

export default TaskDataPage;