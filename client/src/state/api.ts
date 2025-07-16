import { createApi, fetchBaseQuery, RootState } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser, signUp } from "aws-amplify/auth";
import { url } from "inspector";
import { method, update } from "lodash";
import { LogIn } from "lucide-react";

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  teamId?: number;
  Role?:String;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

export interface Login{
  message: string ; 
  email: string;
  token: string;
  userId: number;
}

export interface newUser{
  username:string; 
  email:string; 
  profilePictureUrl:string; 
  password:string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers , {getState} ) => {
      const accessToken = getState() as {auth:{token:string}};
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken.auth.token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({

    // getAuthUser: build.query({
    //   queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
    //     try {
    //       const user = await getCurrentUser();
    //       const session = await fetchAuthSession();
    //       if (!session) throw new Error("No session found");
    //       const { userSub } = session;
    //       const { accessToken } = session.tokens ?? {};

    //       const userDetailsResponse = await fetchWithBQ(`users/${userSub}`);
    //       const userDetails = userDetailsResponse.data as User;

    //       return { data: { user, userSub, userDetails } };
    //     } catch (error: any) {
    //       return { error: error.message || "Could not fetch user data" };
    //     }
    //   },
    // }),


    loginUser: build.mutation<Login, {email:string; password:string}>({
    query: (credentials) => ({
        url: "auth/login",
        method:"POST",
        body: credentials
      })
    }),  
  
    signUpUser: build.mutation<{message:string; userId:number},
    newUser>({
     query:(newUser) => ({
           url:"auth/signup",
           method: "POST",
           body: newUser
       }),
    }),
 
    getAuthUser:build.query<User,string>({
      query: (email)=> `users/${email}`,
    }),

    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getAllTasks :build.query<Task[] , void>({
      query:()=>({
      url:"tasks/all",
      method:"GET",
      }),
    }),

    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),

    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),

    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    updateUser:build.mutation<{message:string , user:User}, {Role:string , email:string , teamId:string , username:string}>({
      query:({Role , email , teamId , username})=>({
        url:"users",
        body:{Role , email , teamId , username},
        method:"POST"
      })
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),

    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),

    getOtp:build.mutation<{message:string}, {email:string; password:string}>({
      query:({email , password})=>({
        url:"auth/login/forgot",
        method:"POST",
        body:{email , password},
        headers:{
          "content-Type":"application/json",
        },
      }),
    }),

    checkOtp:build.mutation<{message:string} ,{userotp:string}>({
      query:({userotp})=>({
        url:"auth/login/otp",
        method:"POST",
        body:{userotp},
        headers:{
          "content-Type":"application/json",
        }
      }),
      }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetAuthUserQuery,
  useLoginUserMutation,
  useSignUpUserMutation,
  useCheckOtpMutation,
  useGetOtpMutation,
  useGetAllTasksQuery,
  useUpdateUserMutation
} = api;