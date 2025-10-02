import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Mic, Play } from "lucide-react";

type ScreeningStep = "info" | "audio" | "cognitive" | "processing";

const Screening = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ScreeningStep>("info");
  const [isRecording, setIsRecording] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    medicalHistory: "",
    consent: false,
    memoryRecall: [] as string[],
    wordMatching: "",
  });

  const steps: { id: ScreeningStep; label: string }[] = [
    { id: "info", label: "Personal Information" },
    { id: "audio", label: "Voice Recording" },
    { id: "cognitive", label: "Cognitive Tasks" },
    { id: "processing", label: "Processing" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

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
      setCurrentStep("processing");
      // Simulate processing
      setTimeout(() => {
        navigate("/results", { state: { formData } });
      }, 3000);
    }
  };

  const handleBack = () => {
    if (currentStep === "audio") setCurrentStep("info");
    else if (currentStep === "cognitive") setCurrentStep("audio");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("Recording started");
      setTimeout(() => {
        setIsRecording(false);
        toast.success("Recording complete");
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

  return (
    <div className="w-full py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
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
              {currentStep === "info" && "Please provide your basic information"}
              {currentStep === "audio" && "Record a short speech sample for voice analysis"}
              {currentStep === "cognitive" && "Complete these simple cognitive exercises"}
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
                    placeholder="Any relevant medical conditions or concerns..."
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
                    I consent to the processing of my data for this screening assessment. I understand this is not a medical diagnosis and should consult a healthcare professional for medical advice. *
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
                    <li>Find a quiet location with minimal background noise</li>
                    <li>Click the microphone button to start recording</li>
                    <li>Describe your typical daily routine for about 30 seconds</li>
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
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        Recording will stop automatically after 30 seconds
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Demo Mode:</strong> In this demonstration, the recording feature is simulated. In a live environment, your voice would be analyzed for speech patterns, pace, and linguistic characteristics.
                  </p>
                </div>
              </div>
            )}

            {/* Cognitive Tasks Step */}
            {currentStep === "cognitive" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Memory Recall Task</h3>
                  <p className="text-sm text-muted-foreground">
                    You were shown these words earlier (simulated). Select the ones you remember:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["Apple", "Chair", "Ocean", "Garden", "Book", "Mountain"].map((word) => (
                      <button
                        key={word}
                        onClick={() => handleMemoryToggle(word)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.memoryRecall.includes(word)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Word Association</h3>
                  <p className="text-sm text-muted-foreground">
                    What word comes to mind when you think of: <strong className="text-foreground">Sun</strong>
                  </p>
                  <Input
                    placeholder="Type your answer..."
                    value={formData.wordMatching}
                    onChange={(e) => setFormData({ ...formData, wordMatching: e.target.value })}
                  />
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Demo Mode:</strong> These are simplified cognitive tasks. Actual screening includes additional validated neuropsychological assessments.
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
                  Our AI is processing your speech patterns, cognitive responses, and behavioral markers...
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
                  {currentStep === "cognitive" ? "Complete Screening" : "Continue"}
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
