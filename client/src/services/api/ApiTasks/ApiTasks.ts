import HttpClient from "../../../lib/HttpClient/HttpClient";
import { AxiosRequestConfig } from "axios";
import { TasksFormInterface } from "../../../interfaces/TasksFormInterface";
import { TaskInterface } from "../../../interfaces/Tasksinterfaces";
import { ScappingUrlInterface } from "../../../interfaces/ScappingUrlInterface";

/**
 * The abstract class to extend from for each of the various service classes that require Api Email.
 */
export default class ApiTasks extends HttpClient {

  public static instance?: ApiTasks;

  constructor(baseUrl = process.env.REACT_APP_BASE_URL) {
    super(baseUrl);
  }
  public static getInstance(baseUrl = process.env.REACT_APP_BASE_URL): ApiTasks {
    if (!this.instance) {
      this.instance = new ApiTasks(baseUrl);
    }

    return this.instance;
  }

  public async sendTask(form: TasksFormInterface): Promise<TasksFormInterface | any> {
    const options: AxiosRequestConfig = {
      data: {
        urlToScrape: form.urlToScrape,
        userId: form.userId,
      }
    };
  
    try {
      const response = await this.post('tasks/create-task', options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getAllTasks(id: string): Promise<TaskInterface[]> {
    try {
      console.log('Fetching tasks for user:', id);
      const response = await this.get(`tasks/all-user-tasks/${encodeURIComponent(id)}`);
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }


  public async getTask(id: string): Promise<ScappingUrlInterface[]> {
    try {
      const response = await this.get(`tasks/collect-data/${encodeURIComponent(id)}`);

      if (!Array.isArray(response.data)) {
        return [response.data];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
}
