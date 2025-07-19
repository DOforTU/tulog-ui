import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

// 블로그 포스트 타입 정의
interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        username: string;
        nickname: string;
        profilePicture?: string;
    };
    tags?: string[];
}

interface BlogPostCardProps {
    post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
    const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: ko,
    });

    return (
        <article className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
            <div className="space-y-4">
                {/* 제목과 내용 미리보기 */}
                <div>
                    <Link href={`/posts/${post.id}`} className="block group">
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-[#499200] transition-colors mb-2">
                            {post.title}
                        </h2>
                        <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                    </Link>
                </div>

                {/* 태그 */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-[#499200] bg-opacity-20 text-[#ffffff] text-xs rounded-md font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* 작성자 정보와 날짜 */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        {post.author.profilePicture ? (
                            <Image
                                src={post.author.profilePicture}
                                alt={post.author.username}
                                width={24}
                                height={24}
                                className="w-6 h-6 rounded-full"
                            />
                        ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <User size={14} className="text-gray-600" />
                            </div>
                        )}
                        <span>{post.author.nickname || post.author.username}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
