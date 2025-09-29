import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Crown, Sparkles, CreditCard, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '../components/Navigation';

interface PlanDetails {
  id: 'standard' | 'premium';
  name: string;
  monthlyPrice: number;
  dailyPrice: number;
  features: string[];
  popular?: boolean;
}

const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>('premium');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'daily'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [loading, setLoading] = useState(false);

  const plans: PlanDetails[] = [
    {
      id: 'standard',
      name: 'Standard',
      monthlyPrice: 300,
      dailyPrice: 35,
      features: [
        'Basic skin analysis',
        'General product recommendations',
        'Basic skincare tips',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 500,
      dailyPrice: 55,
      features: [
        'Advanced AI skin analysis',
        'Personalized skincare routines',
        'Custom product recommendations',
        'Daily routine tracking',
        'Priority support',
        'Exclusive product discounts',
        'Weekly skin progress reports'
      ],
      popular: true
    }
  ];

  const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan)!;
  const totalPrice = billingPeriod === 'monthly' 
    ? selectedPlanDetails.monthlyPrice 
    : selectedPlanDetails.dailyPrice;

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Subscription successful!',
        description: `Welcome to Glow AI ${selectedPlanDetails.name}!`,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink">
      <Navigation />
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Choose Your Glow Plan</h1>
            <p className="text-muted-foreground">
              Unlock personalized skincare powered by AI
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Select Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedPlan} 
                  onValueChange={(value) => setSelectedPlan(value as 'standard' | 'premium')}
                  className="space-y-4"
                >
                  {plans.map((plan) => (
                    <div key={plan.id} className="relative">
                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlan === plan.id 
                          ? 'border-glow-pink bg-glow-light-pink' 
                          : 'border-border hover:border-glow-pink/50'
                      }`}>
                        {plan.popular && (
                          <Badge className="absolute -top-2 left-4 bg-glow-pink">
                            Most Popular
                          </Badge>
                        )}
                        
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={plan.id} id={plan.id} />
                          <div className="flex-1">
                            <Label htmlFor={plan.id} className="cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg flex items-center gap-2">
                                    {plan.name}
                                    {plan.id === 'premium' && <Crown className="w-5 h-5 text-glow-pink" />}
                                  </h3>
                                  <div className="text-2xl font-bold text-glow-pink mb-2">
                                    KSh {plan.monthlyPrice}
                                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-3">
                                    or KSh {plan.dailyPrice}/day
                                  </div>
                                </div>
                              </div>
                              
                              <ul className="space-y-2">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Billing Period */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Period</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={billingPeriod} 
                  onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'daily')}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer flex-1">
                      <div className="flex justify-between">
                        <span>Monthly billing</span>
                        <span className="font-semibold">KSh {selectedPlanDetails.monthlyPrice}</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="cursor-pointer flex-1">
                      <div className="flex justify-between">
                        <span>Daily billing</span>
                        <span className="font-semibold">KSh {selectedPlanDetails.dailyPrice}</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as 'mpesa' | 'card')}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="cursor-pointer flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      M-Pesa (Recommended)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="cursor-pointer flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-glow-pink" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    Glow AI {selectedPlanDetails.name}
                    {selectedPlan === 'premium' && <Crown className="w-4 h-4 text-glow-pink" />}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {billingPeriod === 'monthly' ? 'Monthly' : 'Daily'} billing
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>KSh {totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>KSh 0</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-glow-pink">KSh {totalPrice}</span>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full bg-glow-pink hover:bg-glow-pink/90"
                    size="lg"
                  >
                    {loading ? 'Processing...' : `Subscribe with ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}`}
                  </Button>

                  <div className="text-xs text-center text-muted-foreground">
                    <p>🔒 Secure payment processing</p>
                    <p className="mt-1">Cancel anytime. No hidden fees.</p>
                  </div>
                </div>

                {selectedPlan === 'premium' && (
                  <div className="bg-glow-light-pink p-3 rounded-lg text-center">
                    <p className="text-sm font-medium text-glow-pink">
                      ✨ 7-day free trial included!
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try premium features risk-free
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;