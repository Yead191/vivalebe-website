export interface ApiBlogAuthor {
  _id: string;
  name: string;
  email?: string;
  profile?: string;
  country?: string;
  nationality?: string;
  state?: string;
}

export interface ApiBlog {
  _id: string;
  userId: ApiBlogAuthor;
  title: string;
  description: string;
  imageUrl?: string | null;
  tags: string[];
  totalLikes: number;
  totalComments: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBlogCommentAuthor {
  _id: string;
  name: string;
  profile?: string;
  id?: string;
}

export interface ApiBlogComment {
  _id: string;
  comment: string;
  blogId: string;
  userId: ApiBlogCommentAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CursorPagination {
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string | null;
  prevCursor: string | null;
}
