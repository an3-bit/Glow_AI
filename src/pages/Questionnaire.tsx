import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navigation from '../components/Navigation';

interface QuestionnaireData {
  skin_type: string;
  main_concerns: string[];
  age_group: string;
  skincare_goal: string;
}

const Questionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireData>({
    skin_type: '',
    main_concerns: [],
    age_group: '',
    skincare_goal: '',
  });

  const questions = [
    {
      question: "What's your skin type?",
      field: 'skin_type' as keyof QuestionnaireData,
      options: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'],
      type: 'single'
    },
    {
      question: "What are your main skin concerns?",
      field: 'main_concerns' as keyof QuestionnaireData,
      options: ['Acne', 'Wrinkles', 'Dark spots', 'Dullness', 'Sensitivity'],
      type: 'multiple'
    },
    {
      question: "What's your age group?",
      field: 'age_group' as keyof QuestionnaireData,
      options: ['18-25', '26-35', '36-45', '45+'],
      type: 'single'
    },
    {
      question: "What's your primary skincare goal?",
      field: 'skincare_goal' as keyof QuestionnaireData,
      options: ['Glowing skin', 'Anti-aging', 'Acne-free', 'Hydration', 'Even tone'],
      type: 'single'
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    const field = currentQuestion.field;
    
    if (currentQuestion.type === 'multiple') {
      const currentConcerns = answers.main_concerns || [];
      const newConcerns = currentConcerns.includes(option)
        ? currentConcerns.filter(c => c !== option)
        : [...currentConcerns, option];
      
      setAnswers(prev => ({
        ...prev,
        main_concerns: newConcerns
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [field]: option
      }));
    }
  };

  const canProceed = () => {
    const field = currentQuestion.field;
    if (field === 'main_concerns') {
      return answers[field].length > 0;
    }
    return answers[field] !== '';
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit questionnaire
      navigate('/results', { state: { answers, type: 'questionnaire' } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const isSelected = (option: string) => {
    const field = currentQuestion.field;
    if (field === 'main_concerns') {
      return answers[field].includes(option);
    }
    return answers[field] === option;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink">
      <Navigation />
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Skincare Questionnaire</h1>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {questions.length}
            </p>
          </div>
          
          <Progress value={progress} className="mb-4" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.type === 'multiple' && (
              <p className="text-sm text-center text-muted-foreground">
                Select all that apply
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option}
                  variant={isSelected(option) ? "default" : "outline"}
                  className={`justify-start h-auto py-4 px-6 ${
                    isSelected(option) 
                      ? 'bg-glow-pink hover:bg-glow-pink/90' 
                      : 'hover:border-glow-pink'
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <span className="text-left">{option}</span>
                  {isSelected(option) && currentQuestion.type === 'multiple' && (
                    <Badge variant="secondary" className="ml-auto">
                      Selected
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? 'Home' : 'Previous'}
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-glow-pink hover:bg-glow-pink/90"
          >
            {currentStep === questions.length - 1 ? 'Get Results' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Selected Answers Summary */}
        {currentQuestion.type === 'multiple' && answers.main_concerns.length > 0 && (
          <Card className="mt-6">
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-2">Selected concerns:</h3>
              <div className="flex flex-wrap gap-2">
                {answers.main_concerns.map((concern) => (
                  <Badge key={concern} variant="secondary">
                    {concern}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;