import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, Users, Award, Shield, TrendingUp } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To make cognitive health screening accessible, affordable, and accurate for everyone through the power of artificial intelligence.",
    },
    {
      icon: Brain,
      title: "AI Technology",
      description:
        "Our advanced machine learning models are trained on extensive datasets validated by neurologists and cognitive health experts.",
    },
    {
      icon: Shield,
      title: "Privacy & Ethics",
      description:
        "We prioritize data security and ethical AI practices, ensuring your information remains confidential and is used responsibly.",
    },
    {
      icon: Users,
      title: "Accessibility",
      description:
        "Breaking down barriers to cognitive health assessment with multilingual support and affordable screening options.",
    },
  ];

  const stats = [
    { value: "95%", label: "Clinical Accuracy" },
    { value: "10+", label: "Languages Supported" },
    { value: "50K+", label: "Screenings Completed" },
    { value: "24/7", label: "Available Access" },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="gradient-hero py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold">
              About Our Platform
            </h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              We're revolutionizing cognitive health screening through advanced AI technology, making early detection of dementia accessible to communities worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Guided by principles of innovation, accessibility, and ethical responsibility
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
              The Science Behind Our Technology
            </h2>

            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-primary" />
                    Speech Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our AI analyzes multiple aspects of speech including pace, hesitations, word-finding difficulties, and linguistic complexity. Research shows that speech patterns can reveal early cognitive changes often before traditional testing methods.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Cognitive Task Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Interactive cognitive exercises assess memory, attention, language, and executive function. These validated tasks are based on established neuropsychological assessments adapted for digital administration.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" />
                    Machine Learning Models
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our models are trained on diverse datasets and continuously refined through collaboration with medical professionals. The system identifies patterns associated with cognitive impairment while accounting for individual variations in baseline cognitive function.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Validation */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-large border-primary/20">
              <CardContent className="p-8 sm:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <Shield className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-3xl font-bold mb-4">
                      Clinical Validation & Partnerships
                    </h2>
                    <div className="space-y-4 text-foreground/80 leading-relaxed">
                      <p>
                        Our technology has been developed in collaboration with leading neurologists, geriatricians, and cognitive neuroscientists. The screening protocol incorporates established assessment methodologies adapted for digital delivery.
                      </p>
                      <p>
                        We maintain ongoing partnerships with research institutions and healthcare organizations to continuously validate and improve our algorithms. All updates undergo rigorous testing before deployment to ensure accuracy and reliability.
                      </p>
                      <p>
                        <strong className="text-foreground">Important Note:</strong> This tool is designed to assist in identifying individuals who may benefit from professional evaluation. It does not replace comprehensive clinical assessment by qualified healthcare providers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 sm:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              For Clinicians & Researchers
            </h2>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              We welcome collaboration with healthcare professionals, researchers, and institutions interested in cognitive health assessment and early detection of dementia.
            </p>
            <p className="text-muted-foreground">
              Interested in partnership opportunities, research collaboration, or institutional implementation? Contact us to discuss how we can work together to improve cognitive health outcomes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
