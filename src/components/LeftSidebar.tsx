import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChevronRight, ChevronDown, Folder, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories } from '../data/posts';
import type { Category } from '../types/post';

interface GitHubProfile {
  name: string;
  bio: string;
  avatar_url: string;
  login: string;
  html_url: string;
  followers: number;
}

interface LeftSidebarProps {
  onCategoryClick?: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

export function LeftSidebar({ onCategoryClick, selectedCategory }: LeftSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // GitHub 프로필 가져오기
        const profileResponse = await fetch('https://api.github.com/users/KrongDev');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        }

        // 카테고리 가져오기
        const cats = await getCategories();
        setCategories(cats);
        
        // 기본으로 첫 번째 카테고리 확장
        if (cats.length > 0 && cats[0].subcategories) {
          setExpandedCategories([cats[0].id]);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick?.(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <aside className="w-64 flex-shrink-0 sticky top-[97px] self-start">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center p-6 pb-6 border-b border-border">
          <a 
            href={profile?.html_url || 'https://github.com/KrongDev'}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Avatar className="w-24 h-24 mb-4 ring-2 ring-transparent group-hover:ring-primary transition-all">
              <AvatarImage 
                src={profile?.avatar_url || 'https://github.com/KrongDev.png'} 
                alt={profile?.name || 'Geon Lee'}
              />
              <AvatarFallback>GL</AvatarFallback>
            </Avatar>
          </a>
          <a 
            href={profile?.html_url || 'https://github.com/KrongDev'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 hover:text-primary transition-colors"
          >
            <h3>{profile?.name || 'Geon Lee'}</h3>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          {profile?.followers !== undefined && (
            <p className="text-muted-foreground text-xs mt-1">
              {profile.followers} followers
            </p>
          )}
          <p className="text-muted-foreground mt-2 text-sm">
            {profile?.bio || '보다 넓은 시야를 가지고 싶은 개발자입니다.'}
          </p>
        </div>

        {/* Categories */}
        <div className="p-6 max-h-[calc(100vh-97px-280px)] overflow-y-auto">
          <h4 className="mb-3">Categories</h4>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No categories yet. Add posts to create categories!
            </p>
          ) : (
            <nav className="space-y-1">
              {categories.map((category) => (
                <div key={category.id}>
                  <div
                    className={`flex items-center justify-between rounded-md ${
                      selectedCategory === category.id ? 'bg-accent' : ''
                    }`}
                  >
                    {/* 텍스트 영역: 카테고리 필터링 */}
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className="flex-1 flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors rounded-l-md"
                    >
                      <Folder className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                    
                    {/* 오른쪽 영역: 카운트와 토글 버튼 */}
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span className="text-muted-foreground text-xs">
                        {category.count}
                      </span>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(category.id);
                          }}
                          className="p-0.5 hover:bg-muted rounded transition-colors"
                          aria-label={expandedCategories.includes(category.id) ? "하위 카테고리 닫기" : "하위 카테고리 열기"}
                        >
                          {expandedCategories.includes(category.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* 하위 카테고리 */}
                  {category.subcategories && 
                   category.subcategories.length > 0 && 
                   expandedCategories.includes(category.id) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleCategoryClick(sub.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm ${
                            selectedCategory === sub.id ? 'bg-accent' : ''
                          }`}
                        >
                          <span>{sub.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {sub.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>
    </aside>
  );
}
