import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Phone, 
  Mail,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface GuideStep {
  title: string;
  description: string;
  tips?: string[];
}

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  steps: GuideStep[];
}

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I submit a new grievance?',
      answer: 'To submit a grievance: 1) Log in to your account, 2) Click "Submit Grievance" from the navigation menu, 3) Fill out the complaint form with details, 4) Attach supporting documents if any, 5) Submit the form. You will receive a tracking ID for future reference.',
      category: 'submission',
      helpful: 45
    },
    {
      id: '2',
      question: 'How can I track my grievance status?',
      answer: 'You can track your grievance in multiple ways: 1) Use the "Track Grievance" page with your tracking ID, 2) Check "My Grievances" section after logging in, 3) You will also receive email/SMS notifications on status updates.',
      category: 'tracking',
      helpful: 38
    },
    {
      id: '3',
      question: 'What information do I need to submit a complaint?',
      answer: 'Required information includes: Personal details (name, phone, email), complaint description, category selection, location details, and any supporting documents or photos. The more details you provide, the better we can assist you.',
      category: 'submission',
      helpful: 32
    },
    {
      id: '4',
      question: 'How long does it take to resolve a grievance?',
      answer: 'Resolution time varies by category: Infrastructure issues (7-15 days), Sanitation (3-7 days), Water/Electricity (1-5 days), Traffic issues (5-10 days). Complex issues may take longer and will be communicated accordingly.',
      category: 'timeline',
      helpful: 29
    },
    {
      id: '5',
      question: 'Can I submit a grievance without creating an account?',
      answer: 'No, you need to create an account to submit grievances. This helps us track your complaints, send updates, and maintain a record for follow-up actions. Registration is free and takes only 2 minutes.',
      category: 'account',
      helpful: 25
    },
    {
      id: '6',
      question: 'What should I do if I am not satisfied with the resolution?',
      answer: 'If unsatisfied: 1) Add comments/feedback on your grievance, 2) Request escalation to higher authority, 3) Contact the department supervisor directly, 4) File an appeal through the appeals process, 5) Contact the ombudsman office if needed.',
      category: 'resolution',
      helpful: 22
    }
  ];

  const guides: Guide[] = [
    {
      id: 'submit-guide',
      title: 'How to Submit Your First Grievance',
      description: 'Step-by-step guide to submit your complaint effectively',
      category: 'submission',
      estimatedTime: '5 minutes',
      difficulty: 'Easy',
      steps: [
        {
          title: 'Create Account & Login',
          description: 'Register with valid email and phone number, then log in to your account.',
          tips: ['Use a valid email for notifications', 'Keep your phone number updated']
        },
        {
          title: 'Navigate to Submit Grievance',
          description: 'Click on "Submit Grievance" in the main navigation menu.',
        },
        {
          title: 'Fill Complaint Details',
          description: 'Provide clear title, detailed description, select appropriate category and department.',
          tips: ['Be specific about the issue', 'Include date when problem started', 'Mention previous attempts to resolve']
        },
        {
          title: 'Add Location Information',
          description: 'Provide exact address, use GPS if available, mention landmarks.',
          tips: ['Include nearby cross streets', 'Add area/society name if applicable']
        },
        {
          title: 'Upload Supporting Documents',
          description: 'Attach photos, videos, or documents that support your complaint.',
          tips: ['Photos should be clear and relevant', 'Max file size is 10MB per file']
        },
        {
          title: 'Review and Submit',
          description: 'Double-check all information and submit your grievance.',
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', count: faqs.length },
    { id: 'submission', name: 'Submitting Grievances', count: faqs.filter(f => f.category === 'submission').length },
    { id: 'tracking', name: 'Tracking & Status', count: faqs.filter(f => f.category === 'tracking').length },
    { id: 'account', name: 'Account & Login', count: faqs.filter(f => f.category === 'account').length },
    { id: 'timeline', name: 'Timeline & Resolution', count: faqs.filter(f => f.category === 'timeline').length },
    { id: 'resolution', name: 'Resolution Process', count: faqs.filter(f => f.category === 'resolution').length }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to common questions, step-by-step guides, and get support for using the civic portal.
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help topics, FAQs, or guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-card transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Submit Grievance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Learn how to submit your first complaint with our step-by-step guide.
            </CardDescription>
            <Button variant="outline" className="w-full mt-3">
              View Guide
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-full">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <CardTitle className="text-lg">Track Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Monitor your grievance progress and understand the resolution timeline.
            </CardDescription>
            <Button variant="outline" className="w-full mt-3">
              Track Now
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-full">
                <MessageSquare className="h-5 w-5 text-warning" />
              </div>
              <CardTitle className="text-lg">Contact Support</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Need personal assistance? Get in touch with our support team.
            </CardDescription>
            <Button variant="outline" className="w-full mt-3">
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="text-sm"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Step-by-Step Guides */}
      {guides.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step-by-Step Guides</h2>
          <div className="space-y-4">
            {guides.map((guide) => (
              <Card key={guide.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription className="mt-1">{guide.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(guide.difficulty)}>
                        {guide.difficulty}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{step.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                          {step.tips && (
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Tips:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {step.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex}>• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {filteredFAQs.map((faq) => (
            <Card key={faq.id}>
              <Collapsible open={openFAQ === faq.id} onOpenChange={(open) => setOpenFAQ(open ? faq.id : null)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-left">{faq.question}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {faq.helpful} helpful
                        </Badge>
                        {openFAQ === faq.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">Was this helpful?</p>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Yes
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        No
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Still Need Help?
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Our support team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Email Support</p>
                <p className="text-xs text-muted-foreground">support@civicportal.gov.in</p>
                <p className="text-xs text-muted-foreground">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Phone Support</p>
                <p className="text-xs text-muted-foreground">1800-XXX-XXXX</p>
                <p className="text-xs text-muted-foreground">Mon-Fri 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpCenter;