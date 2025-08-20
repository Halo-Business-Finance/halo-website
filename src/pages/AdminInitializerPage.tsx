import React from 'react';
import { AdminInitializer } from '@/components/admin/AdminInitializer';
import DefaultPageHeader from '@/components/DefaultPageHeader';

const AdminInitializerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <DefaultPageHeader
        title="Admin System Setup"
        subtitle="Initialize your first admin user"
      />
      <div className="container mx-auto px-4 py-8">
        <AdminInitializer />
      </div>
    </div>
  );
};

export default AdminInitializerPage;