import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Calendar, Heart, Share2, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPostById } from '../data/posts';
import type { Post } from '../types/post';

interface BlogDetailProps {
  postId?: string;
  onBack: () => void;
}

export function BlogDetail({ postId, onBack }: BlogDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    async function fetchPost() {
      if (!postId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getPostById(postId);
        setPost(data);

        if (data) {
          // 로컬 스토리지에서 좋아요 상태 로드
          const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
          setIsLiked(likedPosts[postId] || false);

          // 좋아요 수도 로컬 스토리지에서 로드 (임시)
          const likesData = JSON.parse(localStorage.getItem('postLikes') || '{}');
          setLikes(likesData[postId] || 0);
        }
      } catch (error) {
        console.error('Failed to load post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  const handleLike = () => {
    if (!post) return;

    const newLikedState = !isLiked;
    const newLikes = newLikedState ? likes + 1 : Math.max(0, likes - 1);
    
    setIsLiked(newLikedState);
    setLikes(newLikes);

    // 로컬 스토리지에 저장
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    likedPosts[post.id] = newLikedState;
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

    const likesData = JSON.parse(localStorage.getItem('postLikes') || '{}');
    likesData[post.id] = newLikes;
    localStorage.setItem('postLikes', JSON.stringify(likesData));
  };

  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </Button>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </Button>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-xl mb-2">Post not found</p>
            <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to posts
      </Button>

      <article className="bg-card border border-border rounded-lg p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge variant="secondary">{post.category}</Badge>
            {post.subcategory && <Badge variant="outline">{post.subcategory}</Badge>}
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          <h1 className="mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Content - HTML 렌더링 */}
        <div 
          className="prose prose-neutral dark:prose-invert max-w-none mb-8 prose-headings:scroll-mt-20 prose-pre:bg-muted prose-pre:border prose-pre:border-border"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator className="my-6" />

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant={isLiked ? "default" : "outline"}
            onClick={handleLike}
            className="gap-2"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {likes > 0 ? `${likes} Likes` : 'Like'}
          </Button>
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </article>
    </div>
  );
}
