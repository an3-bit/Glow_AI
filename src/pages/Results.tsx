import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, RefreshCw, Star, ExternalLink, Lock, Sparkles, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '../components/Navigation';

interface Product {
  id: string;
  name: string;
  brand: string;
  rating: number;
  reviews_count: number;
  description: string;
  image: string;
  ingredients: string[];
  links: { store: string; url: string }[];
}

interface RecommendationResult {
  personalized: boolean;
  routine?: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  products: Product[];
  summary: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [showPremiumPreview, setShowPremiumPreview] = useState(false);

  const { answers, type } = location.state || {};

  useEffect(() => {
    if (!answers) {
      navigate('/');
      return;
    }

    const fetchResults = async () => {
      try {
        setUserSubscription(null);

        const mockResults: RecommendationResult = userSubscription
          ? {
              personalized: true,
              routine: {
                morning: ['Gentle Cleanser', 'Vitamin C Serum', 'Moisturizer', 'SPF 30'],
                afternoon: ['Hydrating Mist'],
                evening: ['Deep Cleanser', 'Retinol Treatment', 'Night Moisturizer']
              },
              products: [
                {
                  id: 'p1',
                  name: 'Gentle Foaming Cleanser',
                  brand: 'Cetaphil',
                  rating: 4.5,
                  reviews_count: 234,
                  description: 'Perfect for sensitive skin with gentle ingredients.',
                  image: 'https://images.pexels.com/photos/3738341/pexels-photo-3738341.jpeg',
                  ingredients: ['Water', 'Glycerin', 'Niacinamide', 'Panthenol'],
                  links: [
                    { store: 'Jumia', url: 'https://jumia.co.ke' },
                    { store: 'Amazon', url: 'https://amazon.com' }
                  ]
                },
                {
                  id: 'p2',
                  name: 'Vitamin C Brightening Serum',
                  brand: 'The Ordinary',
                  rating: 4.7,
                  reviews_count: 456,
                  description: 'Brightens skin and reduces dark spots.',
                  image: 'https://images.pexels.com/photos/8355180/pexels-photo-8355180.jpeg',
                  ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Glycerin'],
                  links: [{ store: 'Beauty Store', url: 'https://example.com' }]
                }
              ],
              summary:
                'Based on your personalized analysis, we recommend focusing on hydration and gentle anti-aging ingredients.'
            }
          : {
              personalized: false,
              products: [
                {
                  id: 'p1',
                  name: 'Basic Cleanser',
                  brand: 'Generic',
                  rating: 4.0,
                  reviews_count: 100,
                  description: 'A basic cleanser for all skin types.',
                  image: 'https://images.pexels.com/photos/3738341/pexels-photo-3738341.jpeg',
                  ingredients: ['Water', 'Glycerin'],
                  links: [{ store: 'Jumia', url: 'https://jumia.co.ke' }]
                },
                {
                  id: 'p2',
                  name: 'Basic Moisturizer',
                  brand: 'Generic',
                  rating: 4.2,
                  reviews_count: 150,
                  description: 'Hydrating moisturizer for daily use.',
                  image: 'https://images.pexels.com/photos/8355180/pexels-photo-8355180.jpeg',
                  ingredients: ['Glycerin', 'Shea Butter', 'Aloe Vera'],
                  links: [{ store: 'Amazon', url: 'https://amazon.com' }]
                }
              ],
              summary:
                'Here are some general skincare recommendations. Upgrade to Premium for personalized analysis!'
            };

        setResults(mockResults);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [answers, type, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink flex items-center justify-center">
        <Card className="p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-glow-pink animate-pulse" />
          <h2 className="text-xl font-semibold mb-2">Analyzing your skin...</h2>
          <p className="text-muted-foreground">This will just take a moment</p>
        </Card>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink">
      <Navigation />
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Your Skincare Results</h1>
              <p className="text-muted-foreground mb-4">{results.summary}</p>

              {results.personalized ? (
                <Badge className="bg-glow-pink">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Personalized Analysis
                </Badge>
              ) : (
                <Badge variant="outline">
                  <Lock className="w-4 h-4 mr-1" />
                  General Recommendations
                </Badge>
              )}
            </div>
          </div>

          {/* Premium Upgrade CTA for Free Users */}
          {!results.personalized && (
            <Card className="mb-8 bg-gradient-to-r from-glow-pink to-glow-purple text-white">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Unlock Your Full Potential</h2>
                <p className="mb-4">
                  Get personalized routines, better products, and detailed analysis
                </p>
                <Button
                  className="bg-white text-glow-pink hover:bg-gray-100"
                  onClick={() => setShowPremiumPreview(true)}
                >
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Routine Section (Premium Only) */}
          {results.routine && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-glow-pink" />
                  Your Personalized Routine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(results.routine).map(([time, products]) => (
                    <div key={time} className="space-y-3">
                      <h3 className="font-semibold capitalize text-lg">{time}</h3>
                      <ul className="space-y-2">
                        {products.map((product, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-glow-pink rounded-full" />
                            <span className="text-sm">{product}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recommended Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {results.products.map((product) => (
                  <Card key={product.id} className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews_count})
                        </span>
                      </div>
                    </div>

                    <p className="text-sm mb-2">{product.description}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Ingredients: {product.ingredients.join(', ')}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {product.links.map((link, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          {link.store}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/questionnaire')}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Assessment
            </Button>

            <Button
              onClick={() => navigate('/products')}
              className="bg-glow-purple hover:bg-glow-purple/90"
            >
              Continue to Products
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Preview Modal */}
      {showPremiumPreview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full relative p-6">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPremiumPreview(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Exclusive Premium Product Picks
            </h2>
            <div className="space-y-4">
              {results.products.slice(0, 2).map((product) => (
                <Card key={product.id} className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Ingredients: {product.ingredients.join(', ')}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews_count})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.links.map((link, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        {link.store}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
