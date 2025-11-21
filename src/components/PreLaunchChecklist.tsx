import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Rocket } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'critical' | 'important' | 'recommended';
  task: string;
  completed: boolean;
}

const initialChecklist: ChecklistItem[] = [
  // Critical
  { id: '1', category: 'critical', task: 'Replace Google Analytics ID in GoogleAnalytics.tsx', completed: false },
  { id: '2', category: 'critical', task: 'Test all forms (consultation, loan applications)', completed: false },
  { id: '3', category: 'critical', task: 'Verify email delivery works', completed: false },
  { id: '4', category: 'critical', task: 'Test loan calculators with various inputs', completed: false },
  { id: '5', category: 'critical', task: 'Check all navigation links work', completed: false },
  
  // Important
  { id: '6', category: 'important', task: 'Test mobile responsiveness on real devices', completed: false },
  { id: '7', category: 'important', task: 'Verify SSL certificate is active', completed: false },
  { id: '8', category: 'important', task: 'Test cookie consent and analytics tracking', completed: false },
  { id: '9', category: 'important', task: 'Check accessibility (keyboard navigation, screen readers)', completed: false },
  { id: '10', category: 'important', task: 'Verify all images have alt text', completed: false },
  
  // Recommended
  { id: '11', category: 'recommended', task: 'Submit sitemap to Google Search Console', completed: false },
  { id: '12', category: 'recommended', task: 'Set up Google My Business listing', completed: false },
  { id: '13', category: 'recommended', task: 'Configure custom domain (if applicable)', completed: false },
  { id: '14', category: 'recommended', task: 'Set up monitoring/analytics dashboards', completed: false },
  { id: '15', category: 'recommended', task: 'Create backup of database', completed: false },
];

export const PreLaunchChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>(initialChecklist);
  const [isVisible, setIsVisible] = useState(import.meta.env.DEV);

  if (!isVisible) return null;

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const criticalItems = items.filter(i => i.category === 'critical');
  const importantItems = items.filter(i => i.category === 'important');
  const recommendedItems = items.filter(i => i.category === 'recommended');

  const criticalComplete = criticalItems.every(i => i.completed);
  const importantComplete = importantItems.every(i => i.completed);
  const recommendedComplete = recommendedItems.every(i => i.completed);

  const allComplete = criticalComplete && importantComplete && recommendedComplete;

  const categoryProgress = (items: ChecklistItem[]) => {
    const completed = items.filter(i => i.completed).length;
    return `${completed}/${items.length}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="p-6 shadow-lg border-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Pre-Launch Checklist</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            Hide
          </Button>
        </div>

        <div className="space-y-4">
          {/* Critical */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Critical</Badge>
                <span className="text-sm text-muted-foreground">
                  {categoryProgress(criticalItems)}
                </span>
              </div>
              {criticalComplete && <CheckCircle2 className="h-4 w-4 text-success" />}
            </div>
            <div className="space-y-2">
              {criticalItems.map(item => (
                <div key={item.id} className="flex items-start gap-2">
                  <Checkbox 
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-1"
                  />
                  <label 
                    className={`text-sm cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {item.task}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Important */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">Important</Badge>
                <span className="text-sm text-muted-foreground">
                  {categoryProgress(importantItems)}
                </span>
              </div>
              {importantComplete && <CheckCircle2 className="h-4 w-4 text-success" />}
            </div>
            <div className="space-y-2">
              {importantItems.map(item => (
                <div key={item.id} className="flex items-start gap-2">
                  <Checkbox 
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-1"
                  />
                  <label 
                    className={`text-sm cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {item.task}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Recommended</Badge>
                <span className="text-sm text-muted-foreground">
                  {categoryProgress(recommendedItems)}
                </span>
              </div>
              {recommendedComplete && <CheckCircle2 className="h-4 w-4 text-success" />}
            </div>
            <div className="space-y-2">
              {recommendedItems.map(item => (
                <div key={item.id} className="flex items-start gap-2">
                  <Checkbox 
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-1"
                  />
                  <label 
                    className={`text-sm cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {item.task}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {allComplete ? (
          <div className="mt-4 p-3 bg-success/10 border border-success rounded-md flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <p className="text-sm font-medium text-success-foreground">
              Ready to launch! 🚀
            </p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-warning/10 border border-warning rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <p className="text-sm text-warning-foreground">
              Complete all critical items before going live
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
