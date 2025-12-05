import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const quickOptions = [
    { label: 'Get a Quote', icon: '💰' },
    { label: 'Loan Requirements', icon: '📋' },
    { label: 'Speak to an Advisor', icon: '👤' },
    { label: 'Application Status', icon: '📊' },
  ];

  const handleQuickOption = (option: string) => {
    if (option === 'Speak to an Advisor') {
      setShowContactForm(true);
    } else {
      // Open consultation popup or redirect
      window.location.href = 'https://app.halolending.com';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you! A loan advisor will contact you shortly.');
    setShowContactForm(false);
    setIsOpen(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-destructive text-destructive-foreground rotate-90' 
            : 'bg-primary text-primary-foreground'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat notification badge */}
      {!isOpen && (
        <span className="fixed bottom-16 right-6 z-50 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] shadow-2xl border-border animate-scale-in">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Need Help?
            </CardTitle>
            <p className="text-sm text-primary-foreground/80">
              Our loan advisors are here to assist you
            </p>
          </CardHeader>

          <CardContent className="p-4">
            {!showContactForm ? (
              <div className="space-y-4">
                {/* Quick Response Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  <span>Average response time: <strong className="text-foreground">Under 2 minutes</strong></span>
                </div>

                {/* Quick Options */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">How can we help?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickOption(option.label)}
                        className="flex items-center gap-2 p-3 bg-muted/50 hover:bg-muted rounded-lg text-sm text-left transition-colors duration-200 hover:shadow-sm"
                      >
                        <span>{option.icon}</span>
                        <span className="text-foreground">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Options */}
                <div className="pt-4 border-t border-border space-y-2">
                  <p className="text-xs text-muted-foreground">Or contact us directly:</p>
                  <div className="flex gap-2">
                    <a 
                      href="tel:+18005551234"
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500/20 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">Call</span>
                    </a>
                    <a 
                      href="mailto:info@halobusinessfinance.com"
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium">Email</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="bg-muted/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowContactForm(false)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default LiveChatWidget;
