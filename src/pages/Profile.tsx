import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, User, Smartphone, CreditCard, Crown, Shield, Calendar, LogOut, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  name: string;
  phone_number: string;
  created_at: string;
}

interface Subscription {
  id: string;
  plan: 'standard' | 'premium';
  price: number;
  period: 'daily' | 'monthly';
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPin, setEditingPin] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError);
        } else if (profileData) {
          setProfile(profileData);
        } else {
          // Create profile if doesn't exist
          const userData = user.user_metadata || {};
          const newProfile: UserProfile = {
            name: userData.name || 'User',
            phone_number: userData.phone_number || '',
            created_at: user.created_at || new Date().toISOString()
          };
          setProfile(newProfile);
        }

        // Fetch user subscription
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (subError && subError.code !== 'PGRST116') {
          console.error('Subscription error:', subError);
        } else if (subData) {
          setSubscription(subData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phoneNumber = formData.get('phoneNumber') as string;

    try {
      // Mock profile update for now
      console.log('Profile update mock:', { name, phoneNumber });

      setProfile(prev => prev ? { ...prev, name, phone_number: phoneNumber } : null);
      setEditingProfile(false);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePinChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const newPin = formData.get('newPin') as string;

    if (newPin.length !== 4) {
      toast({
        title: 'Invalid PIN',
        description: 'PIN must be exactly 4 digits.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPin
      });

      if (error) throw error;

      setEditingPin(false);
      toast({
        title: 'PIN updated',
        description: 'Your PIN has been successfully changed.',
      });
    } catch (error) {
      console.error('Error updating PIN:', error);
      toast({
        title: 'PIN update failed',
        description: 'Failed to update PIN. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Loading profile...</h2>
        </Card>
      </div>
    );
  }

  const getSubscriptionStatus = () => {
    if (!subscription) return { color: 'bg-gray-500', text: 'No Plan' };
    
    switch (subscription.status) {
      case 'active':
        return { color: 'bg-green-500', text: 'Active' };
      case 'cancelled':
        return { color: 'bg-yellow-500', text: 'Cancelled' };
      case 'expired':
        return { color: 'bg-red-500', text: 'Expired' };
      default:
        return { color: 'bg-gray-500', text: 'Unknown' };
    }
  };

  const statusInfo = getSubscriptionStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink p-4">
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
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account and subscription
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your personal information
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={profile?.name}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          defaultValue={profile?.phone_number}
                          required
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-glow-pink hover:bg-glow-pink/90">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p className="text-lg">{profile?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-lg flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      {profile?.phone_number}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                  <p className="text-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">PIN</h3>
                    <p className="text-sm text-muted-foreground">
                      Change your 4-digit PIN for account access
                    </p>
                  </div>
                  <Dialog open={editingPin} onOpenChange={setEditingPin}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Change PIN
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change PIN</DialogTitle>
                        <DialogDescription>
                          Enter a new 4-digit PIN
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePinChange} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPin">New PIN</Label>
                          <Input
                            id="newPin"
                            name="newPin"
                            type="password"
                            maxLength={4}
                            pattern="[0-9]{4}"
                            placeholder="1234"
                            required
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button type="button" variant="outline" onClick={() => setEditingPin(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-glow-pink hover:bg-glow-pink/90">
                            Update PIN
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No payment history available</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your recent transactions will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-glow-pink" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription ? (
                  <>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold capitalize mb-2">
                        {subscription.plan}
                      </h3>
                      <Badge className={statusInfo.color}>
                        {statusInfo.text}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Price</span>
                        <span>KSh {subscription.price}/{subscription.period}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Next billing</span>
                        <span>{new Date(subscription.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        variant="outline"
                        onClick={() => navigate('/subscription')}
                      >
                        {subscription.plan === 'standard' ? 'Upgrade to Premium' : 'Manage Subscription'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">No active subscription</p>
                    <Button 
                      className="w-full bg-glow-pink hover:bg-glow-pink/90"
                      onClick={() => navigate('/subscription')}
                    >
                      Subscribe Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/questionnaire')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Retake Assessment
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/products')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
                
                <Separator />
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;