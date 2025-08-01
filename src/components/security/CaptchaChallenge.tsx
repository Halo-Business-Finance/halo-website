import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Shield } from 'lucide-react';

interface CaptchaChallengeProps {
  onSolve: () => void;
  onCancel?: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface MathChallenge {
  question: string;
  answer: number;
}

export const CaptchaChallenge: React.FC<CaptchaChallengeProps> = ({
  onSolve,
  onCancel,
  difficulty = 'medium'
}) => {
  const [challenge, setChallenge] = useState<MathChallenge>({ question: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    generateChallenge();
  }, [difficulty]);

  const generateChallenge = () => {
    let question: string;
    let answer: number;

    switch (difficulty) {
      case 'easy':
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        question = `${a} + ${b} = ?`;
        answer = a + b;
        break;

      case 'medium':
        const c = Math.floor(Math.random() * 15) + 5;
        const d = Math.floor(Math.random() * 15) + 5;
        const operation = Math.random() > 0.5 ? '+' : '-';
        if (operation === '+') {
          question = `${c} + ${d} = ?`;
          answer = c + d;
        } else {
          question = `${c} - ${d} = ?`;
          answer = c - d;
        }
        break;

      case 'hard':
        const e = Math.floor(Math.random() * 12) + 2;
        const f = Math.floor(Math.random() * 12) + 2;
        question = `${e} × ${f} = ?`;
        answer = e * f;
        break;

      default:
        question = '1 + 1 = ?';
        answer = 2;
    }

    setChallenge({ question, answer });
    setUserAnswer('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    const parsedAnswer = parseInt(userAnswer);
    
    if (isNaN(parsedAnswer)) {
      setError('Please enter a valid number');
      setIsLoading(false);
      return;
    }

    if (parsedAnswer === challenge.answer) {
      // Correct answer
      setIsLoading(false);
      onSolve();
    } else {
      // Incorrect answer
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setError('Too many incorrect attempts. Please try again later.');
        setIsLoading(false);
        if (onCancel) {
          setTimeout(onCancel, 2000);
        }
      } else {
        setError(`Incorrect answer. ${3 - newAttempts} attempts remaining.`);
        generateChallenge(); // Generate new challenge
        setIsLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    generateChallenge();
    setAttempts(0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Security Verification</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Please solve this simple math problem to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant={attempts >= 3 ? "destructive" : "default"}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <div className="bg-accent p-6 rounded-lg border-2 border-dashed">
                <p className="text-2xl font-mono font-bold">{challenge.question}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isLoading || attempts >= 3}
                className="text-center text-lg"
                autoFocus
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading || attempts >= 3}
                size="icon"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!userAnswer || isLoading || attempts >= 3}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>Attempts: {attempts}/3</p>
            <p className="mt-2">
              This verification helps protect against automated abuse.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};