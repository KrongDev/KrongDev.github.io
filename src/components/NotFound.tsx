import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, User, Ghost } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/10 p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 아이콘 & 숫자 */}
        <div className="space-y-4">
          {/* 떠다니는 유령 */}
          <div className="animate-float">
            <Ghost className="w-24 h-24 text-primary/70 mx-auto drop-shadow-lg" strokeWidth={1.5} />
          </div>
          
          {/* 404 텍스트 */}
          <div className="text-8xl font-black bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
            404
          </div>
        </div>

        {/* 제목 & 설명 */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">
            앗! 길을 잃으셨네요 👻
          </h1>
          
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 justify-center pt-2">
          <Button
            onClick={() => navigate('/')}
            className="gap-2 group"
          >
            <Home className="w-4 h-4" />
            홈으로
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/portfolio')}
            className="gap-2 group"
          >
            <User className="w-4 h-4" />
            프로필
          </Button>
        </div>

        {/* 하단 링크 */}
        <div className="pt-6">
          <p className="text-sm text-muted-foreground">
            문제가 계속되면{' '}
            <a
              href="https://github.com/KrongDev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              GitHub
            </a>
            {' '}를 통해 알려주세요.
          </p>
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(-5deg);
          }
          50% { 
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes gradient {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

