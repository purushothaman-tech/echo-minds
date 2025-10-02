import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Phone, FileText, Home, Brain, Activity, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const Results = () => {
  const location = useLocation();
  const { formData, results: passedResults, isGuest, resultId } = location.state || {};
  const [screeningData, setScreeningData] = useState<any>(null);

  useEffect(() => {
    if (resultId) {
      supabase
        .from("screening_results")
        .select("*")
        .eq("id", resultId)
        .single()
        .then(({ data }) => setScreeningData(data));
    }
  }, [resultId]);

  const data = screeningData || { 
    risk_score: passedResults?.riskScore || 0,
    risk_level: passedResults?.riskLevel || "low",
    cognitive_scores: passedResults,
    ai_breakdown: passedResults ? {
      memoryFactor: passedResults.memoryScore,
      cognitiveFactor: passedResults.puzzleScore,
      ageFactor: parseInt(formData?.age || "65")
    } : {},
    recommendations: []
  };

  const riskColors = {
    low: { bg: "bg-success/10", text: "text-success", border: "border-success/20", icon: CheckCircle2 },
    moderate: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", icon: AlertCircle },
    high: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", icon: AlertCircle },
  };

  const currentRisk = riskColors[data.risk_level];
  const RiskIcon = currentRisk.icon;

  return (
    <div className="w-full py-12 sm:py-20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Your Screening Results</h1>
        </div>

        {/* Risk Score Card */}
        <Card className={cn("mb-8 shadow-large border-2", currentRisk.border)}>
          <CardHeader className={cn("pb-4", currentRisk.bg)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RiskIcon className={cn("h-8 w-8", currentRisk.text)} />
                <div>
                  <CardTitle className="text-2xl">Risk Assessment</CardTitle>
                </div>
              </div>
              <div className={cn("text-4xl font-bold", currentRisk.text)}>
                {data.risk_score}%
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <Progress value={data.risk_score} className="h-3" />
          </CardContent>
        </Card>

        {/* Explainable AI Breakdown */}
        <Card className="mb-8 shadow-large">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Analysis Breakdown
            </CardTitle>
            <CardDescription>Transparent view of factors influencing your assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="font-medium">Memory Performance</span>
                </div>
                <span className="text-2xl font-bold">{data.cognitive_scores?.memoryScore || 0}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="font-medium">Cognitive Tasks</span>
                </div>
                <span className="text-2xl font-bold">{data.cognitive_scores?.puzzleScore || 0}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <span className="font-medium">Age Factor</span>
                </div>
                <span className="text-2xl font-bold">{data.ai_breakdown?.ageFactor || 0} yrs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Medical Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  This is a screening tool, <strong>not a diagnostic tool</strong>. Consult a healthcare professional for medical advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Button variant="outline" size="lg" asChild>
            <Link to="/dashboard"><Home className="mr-2 h-5 w-5" />Dashboard</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact"><Phone className="mr-2 h-5 w-5" />Contact</Link>
          </Button>
          <Button size="lg" onClick={() => window.print()}>
            <FileText className="mr-2 h-5 w-5" />Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
