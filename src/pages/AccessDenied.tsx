
import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button, EmptyState } from '../components/Common';
import { navigateTo } from '../utils/navigation';

export default function AccessDenied() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <EmptyState
        icon={ShieldAlert}
        title="Access Denied"
        description="You do not have permission to view this page with your current role."
        action={
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              icon={<ArrowLeft size={16} />}
              onClick={() => navigateTo('/app/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        }
      />
    </div>
  );
}
