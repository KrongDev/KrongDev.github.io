import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useEffect, useState } from 'react';
import { loadPosts, searchPosts as searchPostsUtil } from '../data/posts';
import type { Post } from '../types/post';

interface BlogListProps {
  searchQuery?: string;
  selectedCategory?: string | null;
  onPostClick: (id: string) => void;
}

export function BlogList({ searchQuery, selectedCategory, onPostClick }: BlogListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        let result: Post[];

        if (searchQuery) {
          // 검색어가 있으면 검색
          result = await searchPostsUtil(searchQuery);
        } else {
          // 전체 글 로드
          result = await loadPosts();
        }

        // 카테고리 필터링
        if (selectedCategory) {
          result = result.filter(
            post => post.category === selectedCategory || post.subcategory === selectedCategory
          );
        }

        setPosts(result);
      } catch (error) {
        console.error('Failed to load posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <h2>Blog Posts</h2>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-xl mb-2">No posts found</p>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No posts found for "${searchQuery}"`
                : selectedCategory
                ? 'No posts in this category yet.'
                : 'No posts available yet. Create your first post in the _posts folder!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>Blog Posts</h2>
        {(searchQuery || selectedCategory) && (
          <p className="text-muted-foreground">
            Found {posts.length} post(s)
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onPostClick(post.slug)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="mb-2">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </div>
                <Badge variant="secondary">{post.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{post.author}</span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
