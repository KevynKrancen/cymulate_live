import { Box, Grid, Checkbox, FormControlLabel, TextField, Button } from '@mui/material';

import { Link } from "react-router-dom";

export default function TasksForm({formik}:{formik:any}) {
  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="urlToScrape"
        label="Url To Scrape"
        name="urlToScrape"
        autoComplete="urlToScrape"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.urlToScrape && Boolean(formik.errors.urlToScrape)}
        helperText={formik.touched.urlToScrape && formik.errors.urlToScrape}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2 }}
      >
        Send Scrape
      </Button>
    
    </Box>
  )
}