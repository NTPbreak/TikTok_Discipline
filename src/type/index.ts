
export interface Post {
  id: string;
  media: string[];
  description: string;
  likesCount: number;
  commentsCount: number;
  LikeUser:string[]
}




export interface Comment {
  name: string;
  comment: string;
}


export interface Video {
  id: string;
  videoUrl: string;
  username: string;
  description: string;
  userId: string;
  comments:Comment[],
  numComment: number;
  numLike: number;
  whyLove: string[]
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

export interface Profil {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL?: string;
  followingCount: number;
  followersCount: number;
  likesCount: number;
}

export interface SearchUser extends Profil {
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
