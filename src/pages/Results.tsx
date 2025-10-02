import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Phone, FileText, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const Results = () => {
  const location = useLocation();
  const formData = location.state?.formData;

  // Demo: Calculate a simulated risk score
  const calculateRiskScore = () => {
    // In reality, this would come from AI processing
    const age = parseInt(formData?.age || "65");
    const baseRisk = age > 70 ? 45 : age > 60 ? 25 : 15;
    return Math.min(baseRisk + Math.floor(Math.random() * 20), 100);
  };

  const riskScore = calculateRiskScore();
  const riskLevel =
    riskScore < 30 ? "low" : riskScore < 60 ? "moderate" : "high";

  const riskColors = {
    low: {
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/20",
      icon: CheckCircle2,
    },
    moderate: {
      bg: "bg-warning/10",
      text: "text-warning",
      border: "border-warning/20",
      icon: AlertCircle,
    },
    high: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      border: "border-destructive/20",
      icon: AlertCircle,
    },
  };

  const currentRisk = riskColors[riskLevel];
  const RiskIcon = currentRisk.icon;

  const recommendations = {
    low: [
      "Continue maintaining a healthy lifestyle with regular physical and mental exercise",
      "Schedule routine check-ups with your healthcare provider",
      "Consider annual cognitive health screenings",
      "Stay socially active and engaged",
    ],
    moderate: [
      "Schedule an appointment with your primary care physician for further evaluation",
      "Consider consulting a neurologist for comprehensive assessment",
      "Engage in cognitive training activities and brain health exercises",
      "Monitor any changes in memory or cognitive function",
      "Maintain a healthy diet, exercise routine, and social connections",
    ],
    high: [
      "Consult with a healthcare professional as soon as possible",
      "Request a referral to a neurologist or memory clinic for comprehensive evaluation",
      "Bring these results to your medical appointment",
      "Consider having a family member or caregiver accompany you to appointments",
      "Begin documenting any cognitive or behavioral changes you've noticed",
    ],
  };

  return (
    <div className="w-full py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Results Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Screening Results
          </h1>
          <p className="text-muted-foreground">
            {formData?.name && `Results for ${formData.name}`}
          </p>
        </div>

        {/* Risk Score Card */}
        <Card
          className={cn(
            "mb-8 shadow-large border-2",
            currentRisk.border
          )}
        >
          <CardHeader className={cn("pb-4", currentRisk.bg)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RiskIcon className={cn("h-8 w-8", currentRisk.text)} />
                <div>
                  <CardTitle className="text-2xl">Risk Assessment</CardTitle>
                  <CardDescription>
                    Based on your screening responses
                  </CardDescription>
                </div>
              </div>
              <div className={cn("text-4xl font-bold", currentRisk.text)}>
                {riskScore}%
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Risk Level</span>
                <span className={cn("font-semibold uppercase", currentRisk.text)}>
                  {riskLevel}
                </span>
              </div>
              <Progress
                value={riskScore}
                className={cn("h-3", currentRisk.text)}
              />
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">What This Means:</h3>
              <p className="text-muted-foreground leading-relaxed">
                {riskLevel === "low" &&
                  "Your screening results suggest a low risk for cognitive impairment. This is encouraging, but remember that regular monitoring of cognitive health is important as we age."}
                {riskLevel === "moderate" &&
                  "Your screening results suggest moderate risk factors that warrant further professional evaluation. This doesn't mean you have dementia, but it indicates you should consult with a healthcare provider for a comprehensive assessment."}
                {riskLevel === "high" &&
                  "Your screening results indicate several factors that suggest you should seek professional medical evaluation promptly. Early intervention can significantly improve outcomes and quality of life."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8 shadow-medium">
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
            <CardDescription>
              Actions you should consider based on your results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations[riskLevel].map((recommendation, index) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-2 border-primary/20 shadow-medium">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Important Medical Disclaimer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This screening tool is designed to help identify individuals who may benefit from professional evaluation. <strong className="text-foreground">It is not a diagnostic tool</strong> and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link to="/contact">
              <Phone className="mr-2 h-5 w-5" />
              Contact Us
            </Link>
          </Button>
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => window.print()}
          >
            <FileText className="mr-2 h-5 w-5" />
            Print Results
          </Button>
        </div>

        {/* Demo Notice */}
        <Card className="mt-8 bg-accent/10">
          <CardContent className="p-6">
            <p className="text-sm text-center text-muted-foreground">
              <strong>Demo Mode:</strong> These results are generated for demonstration purposes. In a live environment, results would be based on actual AI analysis of your responses, speech patterns, and cognitive performance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
