import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BlogList } from './components/BlogList';
import { BlogDetail } from './components/BlogDetail';
import { Portfolio } from './components/Portfolio';
import { NotFound } from './components/NotFound';

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
  const [searchParams] = useSearchParams();

  const handleBack = () => {
    // 브라우저 히스토리를 사용하여 뒤로가기 (검색 상태 유지)
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // 히스토리가 없으면 검색 파라미터를 유지하면서 홈으로 이동
      const currentParams = new URLSearchParams(searchParams);
      const queryString = currentParams.toString();
      const backUrl = queryString ? `/?${queryString}` : '/';
      navigate(backUrl);
    }
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

// 포트폴리오 페이지
function PortfolioPage() {
  return (
    <Layout showSidebar={false}>
      <Portfolio />
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:slug" element={<PostDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        {/* 404 - 정의되지 않은 모든 경로 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
