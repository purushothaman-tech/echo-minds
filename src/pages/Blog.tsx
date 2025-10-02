import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Heart, Users } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Early Signs of Dementia",
    excerpt: "Learn about the subtle indicators that may signal cognitive decline and when to seek assessment.",
    category: "Education",
    icon: Brain,
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "How AI is Revolutionizing Dementia Screening",
    excerpt: "Explore the technology behind voice analysis and cognitive task evaluation for early detection.",
    category: "Technology",
    icon: BookOpen,
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Supporting a Loved One with Dementia",
    excerpt: "Practical caregiving tips and emotional support strategies for families and caregivers.",
    category: "Caregiving",
    icon: Heart,
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "The Importance of Regular Cognitive Assessment",
    excerpt: "Why tracking cognitive health over time leads to better outcomes and early intervention.",
    category: "Health",
    icon: Users,
    readTime: "4 min read",
  },
];

const faqs = [
  {
    question: "Is this tool a medical diagnosis?",
    answer: "No, this is a screening tool designed to identify potential risk factors. It is not a substitute for professional medical diagnosis. Always consult a healthcare provider for proper evaluation.",
  },
  {
    question: "How accurate is the AI screening?",
    answer: "Our AI model analyzes speech patterns, cognitive responses, and behavioral markers based on validated research. However, accuracy can vary by individual, and results should be interpreted alongside professional medical assessment.",
  },
  {
    question: "How often should I take the screening?",
    answer: "We recommend taking the screening every 3-6 months to track cognitive health over time. More frequent assessments may be useful if you notice changes or have risk factors.",
  },
  {
    question: "Is my data private and secure?",
    answer: "Yes, all data is encrypted and stored securely. We follow strict privacy protocols and never share personal information without explicit consent. You can delete your data at any time.",
  },
  {
    question: "Can caregivers help with the screening?",
    answer: "Yes! Caregivers can assist with the screening process using caregiver mode. This is helpful for individuals who may have difficulty completing assessments independently.",
  },
  {
    question: "What languages are supported?",
    answer: "Currently, we support English with plans to expand to multiple languages including Spanish, Mandarin, Hindi, and more. Multilingual support ensures accessibility across diverse communities.",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Resources & Support</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Educational content, caregiver support, and answers to common questions
          </p>
        </div>

        {/* Blog Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="shadow-large hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <post.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{post.readTime}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="shadow-large bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Still Have Questions?</CardTitle>
              <CardDescription>
                Our team is here to help. Reach out for personalized support and guidance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/contact"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;
