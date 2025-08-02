export interface Author {
    name: string;
    avatar: string;
    bio: string;
}

export interface Post {
    id: number;
    title: string;
    subtitle: string;
    excerpt: string;
    author: Author;
    publishedAt: string;
    readTime: number;
    tags: Tag[];
    featured: boolean;
    claps: number;
    image: string;
}

export interface Tag {
    id: number;
    name: string;
}
