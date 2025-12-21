
import React from 'react';
import { FileQuestion, Home } from 'lucide-react';
import { Button, EmptyState } from '../components/Common';
import { navigateTo } from '../utils/navigation';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <EmptyState
        icon={FileQuestion}
        title="Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        action={
          <Button 
            icon={<Home size={16} />}
            onClick={() => navigateTo('/app/dashboard')}
          >
            Back to Home
          </Button>
        }
      />
    </div>
  );
}
