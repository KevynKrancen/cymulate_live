import { Box, Button, Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ProgressBar } from '../../components/global';
import { AuthClient } from '../../services';
import heroImage from '../../assets/images/landing-pages/image-cache.jpeg';
import './HomePage.scss';
import { UserInterface } from '../../interfaces/UserInterface';

function Homepage() {  
  const [loading, setLoading] = useState(true);
  const [user, setData] = useState<UserInterface | any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response:Promise<UserInterface> | any = await AuthClient.getInstance().getUser();
        setData(response);
      } catch (error:any) {
        console.log(error.response.data);
      }
      return true;
    }

    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  if (loading) {
    return (<ProgressBar/>);
  }
  
  return (
    <Container component="main" maxWidth={false} disableGutters className="homepage homepage-main-wrapper">
      <Container component="section" maxWidth={false} disableGutters className="hero-component-wrapper">
    <Container component="main" className="profile">
      <h1>Hello {user?.firstName ? user.firstName : 'Please sign in'}</h1>
    </Container>
     <Box
          className="hero-component-img"
          component="img"
          alt="Task management illustration"
          src={heroImage}
        />
        <Container disableGutters className="hero-component-content">
          <Typography variant="h2" component="h1" gutterBottom>
            Task Management
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Manage your tasks efficiently with our easy-to-use platform.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
           <Button 
              component={Link} 
              to='/new-task'
              className="custom-button primary"
            >
              Create new task
            </Button>
            <Button 
              component={Link} 
              to='/tasks'
              className="custom-button secondary"
            >
              Recent tasks
            </Button>
          </Box>
        </Container>
      </Container>
    </Container>
  );
}

export default Homepage;
