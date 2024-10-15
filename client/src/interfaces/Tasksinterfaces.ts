export interface TaskInterface {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  createdDate: Date;
  token: string;
  urlToScrape: string;
  from: string;
  status: string;
  }