import * as yup from 'yup';

export const ValidationSchema = yup.object().shape({
  urlToScrape: yup
    .string()
    .required('Url to scrape is required')
    .url('Must be a valid url'),
});
