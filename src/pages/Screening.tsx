import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Mic, Trophy, Star, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ScreeningStep = "info" | "audio" | "cognitive" | "puzzle" | "processing";

const Screening = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ScreeningStep>("info");
  const [isRecording, setIsRecording] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    medicalHistory: "",
    consent: false,
    memoryRecall: [] as string[],
    wordMatching: "",
    puzzleScore: 0,
    sequenceMemory: [] as number[],
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const steps: { id: ScreeningStep; label: string }[] = [
    { id: "info", label: "Information" },
    { id: "audio", label: "Voice" },
    { id: "cognitive", label: "Memory" },
    { id: "puzzle", label: "Puzzle" },
    { id: "processing", label: "Analysis" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const calculateResults = () => {
    const age = parseInt(formData.age);
    const memoryScore = (formData.memoryRecall.length / 6) * 100;
    const puzzleScore = formData.puzzleScore;
    const baseScore = (memoryScore + puzzleScore) / 2;
    
    let riskScore = 100 - baseScore;
    if (age > 65) riskScore += 10;
    if (age > 75) riskScore += 10;
    riskScore = Math.min(100, Math.max(0, riskScore));

    let riskLevel: "low" | "moderate" | "high" = "low";
    if (riskScore > 60) riskLevel = "high";
    else if (riskScore > 30) riskLevel = "moderate";

    return {
      riskScore: Math.round(riskScore),
      riskLevel,
      memoryScore: Math.round(memoryScore),
      puzzleScore,
    };
  };

  const getRecommendations = (level: string): string[] => {
    switch (level) {
      case "high":
        return [
          "Schedule consultation with neurologist",
          "Consider comprehensive cognitive evaluation",
          "Discuss results with primary care physician",
        ];
      case "moderate":
        return [
          "Monitor cognitive function regularly",
          "Consult healthcare provider for assessment",
          "Consider lifestyle modifications",
        ];
      default:
        return [
          "Continue regular cognitive health monitoring",
          "Maintain healthy lifestyle habits",
          "Schedule routine check-ups",
        ];
    }
  };

  const saveResults = async () => {
    const results = calculateResults();
    
    if (!user) {
      navigate("/results", { 
        state: { 
          formData, 
          results,
          isGuest: true 
        } 
      });
      return;
    }

    try {
      const { data: screening, error: screeningError } = await supabase
        .from("screening_results")
        .insert({
          user_id: user.id,
          risk_level: results.riskLevel,
          risk_score: results.riskScore,
          personal_info: {
            name: formData.name,
            age: formData.age,
            gender: formData.gender,
            medicalHistory: formData.medicalHistory,
          },
          audio_analysis: {
            recordingCompleted: true,
            demoMode: true,
          },
          cognitive_scores: {
            memoryRecall: formData.memoryRecall,
            wordMatching: formData.wordMatching,
            memoryScore: results.memoryScore,
            puzzleScore: results.puzzleScore,
          },
          ai_breakdown: {
            memoryFactor: results.memoryScore,
            cognitiveFactor: results.puzzleScore,
            ageFactor: parseInt(formData.age),
          },
          recommendations: getRecommendations(results.riskLevel),
        })
        .select()
        .single();

      if (screeningError) throw screeningError;

      const tasks = [
        {
          screening_id: screening.id,
          task_type: "memory",
          task_name: "Word Recall",
          score: results.memoryScore,
          difficulty_level: "medium",
          details: { wordsRecalled: formData.memoryRecall },
        },
        {
          screening_id: screening.id,
          task_type: "puzzle",
          task_name: "Sequence Puzzle",
          score: results.puzzleScore,
          difficulty_level: "medium",
          details: { sequence: formData.sequenceMemory },
        },
      ];

      const { error: tasksError } = await supabase
        .from("cognitive_tasks")
        .insert(tasks);

      if (tasksError) throw tasksError;

      navigate("/results", { state: { resultId: screening.id } });
    } catch (error: any) {
      toast.error("Failed to save results");
      navigate("/results", { state: { formData, results: calculateResults() } });
    }
  };

  const handleNext = () => {
    if (currentStep === "info") {
      if (!formData.name || !formData.age || !formData.gender || !formData.consent) {
        toast.error("Please complete all required fields");
        return;
      }
      setCurrentStep("audio");
    } else if (currentStep === "audio") {
      setCurrentStep("cognitive");
    } else if (currentStep === "cognitive") {
      const earnedPoints = formData.memoryRecall.length * 10;
      setPoints(points + earnedPoints);
      toast.success(`+${earnedPoints} points! 🎯`);
      setCurrentStep("puzzle");
    } else if (currentStep === "puzzle") {
      const earnedPoints = formData.puzzleScore;
      setPoints(points + earnedPoints);
      toast.success(`+${earnedPoints} points! ⭐`);
      setCurrentStep("processing");
      setTimeout(() => saveResults(), 3000);
    }
  };

  const handleBack = () => {
    if (currentStep === "audio") setCurrentStep("info");
    else if (currentStep === "cognitive") setCurrentStep("audio");
    else if (currentStep === "puzzle") setCurrentStep("cognitive");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("Recording started");
      setTimeout(() => {
        setIsRecording(false);
        toast.success("Recording complete - +20 points! 🎤");
        setPoints(points + 20);
      }, 5000);
    }
  };

  const handleMemoryToggle = (word: string) => {
    setFormData((prev) => ({
      ...prev,
      memoryRecall: prev.memoryRecall.includes(word)
        ? prev.memoryRecall.filter((w) => w !== word)
        : [...prev.memoryRecall, word],
    }));
  };

  const handlePuzzleComplete = (score: number) => {
    setFormData((prev) => ({ ...prev, puzzleScore: score }));
  };

  return (
    <div className="w-full py-12 sm:py-20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Points Badge */}
        <div className="flex justify-end mb-4">
          <Badge className="text-lg py-2 px-4 bg-gradient-to-r from-accent to-primary">
            <Trophy className="mr-2 h-5 w-5" />
            {points} Points
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={`text-sm font-medium ${
                  index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">
              {steps.find((s) => s.id === currentStep)?.label}
            </CardTitle>
            <CardDescription>
              {currentStep === "info" && "Provide your basic information"}
              {currentStep === "audio" && "Record a short speech sample"}
              {currentStep === "cognitive" && "Test your memory recall"}
              {currentStep === "puzzle" && "Solve interactive puzzles"}
              {currentStep === "processing" && "Analyzing your responses..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information Step */}
            {currentStep === "info" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="font-normal">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="history">Medical History (Optional)</Label>
                  <Textarea
                    id="history"
                    placeholder="Any relevant medical conditions..."
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex items-start space-x-2 p-4 bg-muted rounded-lg">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, consent: checked as boolean })
                    }
                  />
                  <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                    I consent to data processing. This is not a medical diagnosis. *
                  </Label>
                </div>
              </div>
            )}

            {/* Audio Recording Step */}
            {currentStep === "audio" && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold">Recording Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Find a quiet location</li>
                    <li>Click the microphone to start</li>
                    <li>Describe your typical daily routine</li>
                    <li>Speak naturally and clearly</li>
                  </ol>
                </div>

                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <button
                    onClick={toggleRecording}
                    className={`h-32 w-32 rounded-full flex items-center justify-center transition-all shadow-large ${
                      isRecording
                        ? "bg-destructive text-destructive-foreground animate-pulse"
                        : "bg-primary text-primary-foreground hover:scale-105"
                    }`}
                  >
                    <Mic className="h-16 w-16" />
                  </button>

                  <p className="text-lg font-medium">
                    {isRecording ? "Recording in progress..." : "Click to start recording"}
                  </p>

                  {isRecording && (
                    <div className="w-full max-w-md">
                      <Progress value={60} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cognitive Tasks Step */}
            {currentStep === "cognitive" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Memory Recall Challenge</h3>
                    <Badge variant="outline">
                      <Target className="mr-1 h-3 w-3" />
                      10 pts per word
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["Apple", "Chair", "Ocean", "Garden", "Book", "Mountain"].map((word) => (
                      <button
                        key={word}
                        onClick={() => handleMemoryToggle(word)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.memoryRecall.includes(word)
                            ? "border-primary bg-primary/10 scale-95"
                            : "border-border hover:border-muted-foreground hover:scale-105"
                        }`}
                      >
                        {word}
                        {formData.memoryRecall.includes(word) && (
                          <Star className="inline ml-2 h-4 w-4 text-primary fill-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Word Association</h3>
                  <Input
                    placeholder="What word comes to mind: Sun?"
                    value={formData.wordMatching}
                    onChange={(e) => setFormData({ ...formData, wordMatching: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Puzzle Step */}
            {currentStep === "puzzle" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Sequence Memory Puzzle</h3>
                    <Badge variant="outline">
                      <Star className="mr-1 h-3 w-3" />
                      Up to 100 pts
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          const newSeq = [...formData.sequenceMemory, num];
                          setFormData({ ...formData, sequenceMemory: newSeq });
                          if (newSeq.length >= 5) {
                            handlePuzzleComplete(80);
                          }
                        }}
                        className="aspect-square p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-2xl font-bold"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Demo: Click any 5 numbers • Score: {formData.puzzleScore}
                  </p>
                </div>
              </div>
            )}

            {/* Processing Step */}
            {currentStep === "processing" && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="h-24 w-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <h3 className="text-xl font-semibold">Analyzing Your Responses</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Processing cognitive patterns and generating insights...
                </p>
                <Progress value={66} className="w-full max-w-md" />
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep !== "processing" && (
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === "info"}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button onClick={handleNext}>
                  {currentStep === "puzzle" ? "Complete" : "Continue"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Screening;
