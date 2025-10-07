import { Eye, MessageCircle } from 'lucide-react';

interface RecentComment {
  id: string;
  content: string;
  timestamp: string;
}

const recentComments: RecentComment[] = [
  {
    id: '1',
    content: 'Great article! Very helpful.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    content: 'Thanks for sharing this!',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    content: 'Very informative post.',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    content: 'I really enjoyed reading this. Looking forward to more content!',
    timestamp: '2 days ago',
  },
  {
    id: '5',
    content: 'Could you explain more about this topic?',
    timestamp: '3 days ago',
  },
];

export function RightSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 sticky top-[97px] self-start">
      <div className="space-y-6">
        {/* Visitor Stats */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4" />
            <h4>Visitor Statistics</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total</span>
              <span>12,453</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Today</span>
              <span>234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Yesterday</span>
              <span>189</span>
            </div>
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4" />
            <h4>Recent Comments</h4>
          </div>
          <div className="space-y-3">
            {recentComments.map((comment) => (
              <div key={comment.id} className="pb-3 border-b border-border last:border-b-0 last:pb-0">
                <p className="text-muted-foreground truncate">
                  {comment.content}
                </p>
                <p className="text-muted-foreground mt-1">
                  {comment.timestamp}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
