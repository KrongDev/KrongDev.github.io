import { HashRouter, Routes, Route, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BlogList } from './components/BlogList';
import { BlogDetail } from './components/BlogDetail';

// 홈 페이지 (목록)
function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category');

  const handleSearch = (query: string) => {
    if (query) {
      searchParams.set('search', query);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      searchParams.set('category', categoryId);
    } else {
      searchParams.delete('category');
    }
    // 카테고리 변경 시 검색어 제거
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const handlePostClick = (slug: string) => {
    navigate(`/post/${slug}`);
  };

  return (
    <Layout 
      onSearch={handleSearch}
      onCategoryClick={handleCategoryClick}
      selectedCategory={selectedCategory}
    >
      <BlogList
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onPostClick={handlePostClick}
      />
    </Layout>
  );
}

// 포스트 상세 페이지
function PostDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout>
      <BlogDetail
        postId={slug}
        onBack={handleBack}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:slug" element={<PostDetailPage />} />
      </Routes>
    </HashRouter>
  );
}
