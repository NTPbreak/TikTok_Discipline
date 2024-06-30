export interface Post {
  id: string;
  creator: string;
  media: string[];
  description: string;
  likesCount: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  creator: string;
  comment: string;
}

export interface Todo
{
  title:string,
  description:string,
  completed:boolean,
  limiteDate?:Date,
  priority:number,
  createAt:Date,
  updateAt?:Date,
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL?: string;
  followingCount: number;
  followersCount: number;
  likesCount: number;
  todo:todo[]
}

export interface SearchUser extends User {
  id: string;
}

export interface Chat {
  id: string;
  members: string[];
  lastMessage: string;
  lastUpdate?: {
    seconds?: number;
    nanoseconds?: number;
  };
  messages: Message[];
}

export interface Message {
  id: string;
  creator: string;
  message: string;
}
