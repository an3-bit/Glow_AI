import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Star, ArrowRight, FileText, Camera, BarChart3, ShoppingBag, CreditCard, User, Sparkles } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Landing = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: 'Amina K.',
      text: 'My skin has never looked better! The AI recommendations were spot on.',
      rating: 5,
      image: '/placeholder.svg'
    },
    {
      name: 'Grace M.',
      text: 'Finally found products that work for my sensitive skin.',
      rating: 5,
      image: '/placeholder.svg'
    },
    {
      name: 'Sarah L.',
      text: 'The personalized routine transformed my skincare game completely.',
      rating: 5,
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink">
      <div className="sticky top-0 z-40">
        <Navigation />
      </div>
      <div className="flex-1 flex flex-col">
        {/* Welcome Section for Authenticated Users */}
        {user && (
          <section className="px-4 py-6 bg-gradient-to-r from-glow-pink/10 to-glow-purple/10 border-b border-glow-pink/20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user.user_metadata?.name || 'User'}! 👋
              </h2>
              <p className="text-muted-foreground">
                Ready to continue your personalized skincare journey?
              </p>
            </div>
          </section>
        )}
        {/* Hero Section */}
        <section className="px-4 py-16 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-glow-pink/5 via-transparent to-glow-purple/5 rounded-3xl -mx-4"></div>

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Hero Video */}
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300">
              <video
                className="w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
                poster="/placeholder.svg"
              >
                <source src="/hero-transformation.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="lg"
                  className="bg-white/90 text-black hover:bg-white shadow-lg transform hover:scale-110 transition-all duration-200"
                  onClick={() => {
                    const video = document.querySelector('video') as HTMLVideoElement;
                    if (video) {
                      video.muted = !video.muted;
                    }
                  }}
                >
                  <Play className="w-6 h-6 mr-2" />
                  Play with Sound
                </Button>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {user ? 'Continue Your' : 'Your Personalized'}{' '}
              <span className="bg-gradient-to-r from-glow-pink to-glow-purple bg-clip-text text-transparent">
                Skincare Journey
              </span>{' '}
              {user ? 'Today' : 'Starts Here'}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {user
                ? 'Pick up where you left off or explore new features to enhance your skincare routine.'
                : 'Answer 4 quick questions or scan your face to get tailored product recommendations powered by AI.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-glow-pink hover:bg-glow-pink/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                onClick={() => navigate('/questionnaire')}
              >
                {user ? 'Continue Questionnaire' : 'Take Questionnaire'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-glow-purple text-glow-purple hover:bg-glow-purple hover:text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                onClick={() => navigate('/face-scan')}
              >
                <Camera className="w-5 h-5 mr-2" />
                Scan Your Face
              </Button>
              {user && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-glow-pink text-glow-pink hover:bg-glow-pink hover:text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  onClick={() => navigate('/products')}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Browse Products
                </Button>
              )}
            </div>

            {/* Value Props */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: '🤖', title: 'AI-Driven', desc: 'Powered by advanced skincare AI' },
                { icon: '🎯', title: 'Tailored', desc: 'Personalized for your unique skin' },
                { icon: '💰', title: 'Affordable', desc: 'Quality skincare within reach' },
                { icon: '✨', title: 'Real Results', desc: 'Proven transformations' }
              ].map((prop, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-0">
                    <div className="text-4xl mb-3">{prop.icon}</div>
                    <h3 className="font-semibold mb-2">{prop.title}</h3>
                    <p className="text-sm text-muted-foreground">{prop.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Onboarding Progress for Authenticated Users */}
        {user && (
          <section className="px-4 py-16 bg-white/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Your Skincare Journey</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: 1, title: 'Take Questionnaire', desc: 'Answer 4 quick questions', completed: false, route: '/questionnaire' },
                  { step: 2, title: 'Face Scan', desc: 'Upload or scan your face', completed: false, route: '/face-scan' },
                  { step: 3, title: 'View Results', desc: 'Get personalized recommendations', completed: false, route: '/results' }
                ].map((item, index) => (
                  <Card key={index} className={`p-6 text-center hover:shadow-lg transition-all cursor-pointer ${item.completed ? 'bg-green-50 border-green-200' : 'hover:bg-glow-pink/5'}`} onClick={() => navigate(item.route)}>
                    <CardContent className="pt-0">
                      <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold ${item.completed ? 'bg-green-500 text-white' : 'bg-glow-pink text-white'}`}>
                        {item.completed ? <CheckCircle className="w-6 h-6" /> : item.step}
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                      <Button variant={item.completed ? 'secondary' : 'default'} size="sm" className={item.completed ? '' : 'bg-glow-pink hover:bg-glow-pink/90'}>
                        {item.completed ? 'Completed' : 'Start'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="px-4 py-16 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="pt-0">
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-glow-pink rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <span className="font-medium">{testimonial.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Access */}
        {user && (() => {
          const subscriptionLevel = (user as any).subscription_level || 'none';
          const accessLinks = {
            premium: [
              { to: '/questionnaire', label: 'Take Questionnaire', icon: FileText },
              { to: '/face-scan', label: 'Face Scan', icon: Camera },
              { to: '/results', label: 'View Results', icon: BarChart3 },
              { to: '/products', label: 'Browse Products', icon: ShoppingBag },
              { to: '/subscription', label: 'Manage Subscription', icon: CreditCard },
              { to: '/profile', label: 'Profile', icon: User }
            ],
            basic: [
              { to: '/questionnaire', label: 'Take Questionnaire', icon: FileText },
              { to: '/face-scan', label: 'Face Scan', icon: Camera },
              { to: '/products', label: 'Browse Products', icon: ShoppingBag }
            ],
            none: []
          };

          const links = accessLinks[subscriptionLevel as keyof typeof accessLinks] || [];

          return links.length > 0 ? (
            <section className="px-4 py-16">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8">Quick Access</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {links.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-20 text-lg border-glow-purple hover:bg-glow-purple hover:text-white flex flex-col gap-2"
                        onClick={() => navigate(link.to)}
                      >
                        <IconComponent className="w-6 h-6" />
                        {link.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null;
        })()}

        {/* Recommended Products for Authenticated Users */}
        {user && (
          <section className="px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Recommended for You</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'Hydrating Cleanser', price: 'KSh 1,200', desc: 'Gentle daily cleanser for all skin types' },
                  { name: 'Vitamin C Serum', price: 'KSh 2,500', desc: 'Brightening serum with hyaluronic acid' },
                  { name: 'Moisturizing Cream', price: 'KSh 1,800', desc: 'Lightweight hydration for day and night' }
                ].map((product, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-0">
                      <div className="w-full h-32 bg-gradient-to-br from-glow-pink/20 to-glow-purple/20 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-4xl">🧴</span>
                      </div>
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.desc}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-glow-pink">{product.price}</span>
                        <Button size="sm" className="bg-glow-pink hover:bg-glow-pink/90">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => navigate('/products')} className="border-glow-purple text-glow-purple hover:bg-glow-purple hover:text-white">
                  View All Products
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Subscription Teaser */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="p-8 bg-gradient-to-r from-glow-pink to-glow-purple text-white">
              <CardContent className="pt-0">
                <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Glow?</h2>
                <p className="text-xl mb-6">Free trial available • Upgrade to Premium for only KSh 55/day</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Personalized AI Analysis
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Custom Product Recommendations
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Daily Skincare Routines
                  </Badge>
                </div>
                <div className="mt-8">
                  <Button 
                    size="lg" 
                    className="bg-white text-glow-pink hover:bg-gray-100"
                    onClick={() => navigate('/subscription')}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
      {/* Floating CTA */}
      {showFloatingCTA && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            className="bg-glow-pink hover:bg-glow-pink/90 shadow-lg"
            onClick={() => navigate('/subscription')}
          >
            Upgrade to Premium
          </Button>
        </div>
      )}
    </div>
  );
};

export default Landing;