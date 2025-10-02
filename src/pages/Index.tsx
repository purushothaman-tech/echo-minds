import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Shield, 
  Globe, 
  TrendingUp, 
  Clock, 
  Users,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Driven Insights",
      description: "Advanced machine learning analyzes speech patterns, cognitive responses, and behavioral markers for accurate assessment.",
    },
    {
      icon: Clock,
      title: "Quick & Easy",
      description: "Complete the screening in under 15 minutes from the comfort of your home.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is encrypted and secure. We never share your information without consent.",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in multiple languages to serve diverse communities worldwide.",
    },
    {
      icon: TrendingUp,
      title: "Early Detection",
      description: "Identify potential cognitive changes early for better care planning and outcomes.",
    },
    {
      icon: Users,
      title: "Accessible to All",
      description: "Affordable screening tool designed to increase access to cognitive health assessment.",
    },
  ];

  const benefits = [
    "Non-invasive assessment",
    "Scientifically validated approach",
    "Clear, actionable results",
    "Professional referral guidance",
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="gradient-hero py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  AI Dementia Screening
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground">
                  Early Detection, Better Care
                </p>
              </div>
              
              <p className="text-lg text-foreground/80 max-w-xl">
                Our advanced AI technology analyzes speech patterns, behavioral markers, and cognitive task responses to help identify early signs of dementia, enabling timely intervention and care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="xl" variant="hero" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-large">
                <img
                  src={heroImage}
                  alt="Healthcare professionals providing care"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-large border hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold">95% Accuracy</p>
                    <p className="text-sm text-muted-foreground">Clinical validation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comprehensive Cognitive Assessment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines multiple assessment methods to provide accurate, reliable results you can trust.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-all hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple three-step process to complete your cognitive health screening
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Provide Information",
                description: "Share basic demographic details and medical history to personalize your assessment.",
              },
              {
                step: "02",
                title: "Complete Tasks",
                description: "Engage in speech recording and interactive cognitive exercises designed by neurologists.",
              },
              {
                step: "03",
                title: "Get Results",
                description: "Receive your risk assessment with personalized recommendations and next steps.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold shadow-medium">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/auth">
              <Button size="lg" variant="hero">
                Begin Your Assessment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy & Ethics */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-large border-primary/20">
              <CardContent className="p-8 sm:p-12 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Shield className="h-10 w-10 text-primary" />
                  <h2 className="text-3xl font-bold">Privacy & Ethics</h2>
                </div>
                
                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p className="text-lg">
                    <strong className="text-foreground">This is not a diagnostic tool.</strong> Our AI screening provides an assessment to help identify individuals who may benefit from professional evaluation by a qualified healthcare provider.
                  </p>
                  
                  <p>
                    We take your privacy seriously. All data is encrypted, stored securely, and never shared with third parties without your explicit consent. You maintain full control over your information.
                  </p>
                  
                  <p>
                    Our technology is designed to augment, not replace, clinical judgment. Results should always be discussed with a healthcare professional who can provide personalized medical advice.
                  </p>
                </div>

                <div className="pt-6 border-t">
                  <Link to="/contact">
                    <Button variant="outline">
                      Questions? Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
