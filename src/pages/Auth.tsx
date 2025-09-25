import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { user, signUp, signIn, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/landing" replace />;
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const pin = formData.get('pin') as string;

    if (pin.length !== 4) {
      toast({
        title: 'Invalid PIN',
        description: 'PIN must be exactly 4 digits',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(name, phoneNumber, pin);
    
    if (error) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome to Glow AI!',
        description: 'Your account has been created successfully.',
      });
      navigate('/face-scan');
    }

    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const phoneNumber = formData.get('phoneNumber') as string;
    const pin = formData.get('pin') as string;

    const { error } = await signIn(phoneNumber, pin);

    if (error) {
      toast({
        title: 'Sign in failed',
        description: 'Invalid phone number or PIN',
        variant: 'destructive',
      });
    } else {
      navigate('/landing');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-glow-pink to-glow-purple bg-clip-text text-transparent">
            Glow AI
          </CardTitle>
          <CardDescription>
            Your personalized skincare journey starts here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-phone">Phone Number</Label>
                  <Input
                    id="signin-phone"
                    name="phoneNumber"
                    type="tel"
                    placeholder="0700000000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-pin">PIN (4 digits)</Label>
                  <Input
                    id="signin-pin"
                    name="pin"
                    type="password"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    placeholder="1234"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-glow-pink hover:bg-glow-pink/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    name="phoneNumber"
                    type="tel"
                    placeholder="0700000000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-pin">PIN (4 digits)</Label>
                  <Input
                    id="signup-pin"
                    name="pin"
                    type="password"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    placeholder="1234"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-glow-purple hover:bg-glow-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;