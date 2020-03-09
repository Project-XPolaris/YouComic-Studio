export interface Book {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  cover: string;
  tags: any[];
}

export interface Tag {
  id: number;
  created_at: Date;
  name: string;
  type: string;
}

export interface ListQueryContainer<T> {
  count: number;
  next: string;
  previous: string;
  page: number;
  pageSize: number;
  result: T[];
}

export interface UserAuth {
  id:number
  sign:string
}

export interface User {
  id:number
  nickname:string
  avatar:string
}
