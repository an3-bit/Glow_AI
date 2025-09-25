import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Star, ExternalLink, Filter, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  brand: string;
  rating: number;
  reviews_count: number;
  description: string;
  links: { store: string; url: string }[];
  skin_types?: string[];
  goals?: string[];
}

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skinTypeFilter, setSkinTypeFilter] = useState('all');
  const [goalFilter, setGoalFilter] = useState('all');
  const [minRatingFilter, setMinRatingFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use mock data for now
        throw new Error('Using mock data');
      } catch (error) {
        console.error('Error fetching products:', error);
        // Use mock data as fallback
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Gentle Foaming Cleanser',
            brand: 'Cetaphil',
            rating: 4.5,
            reviews_count: 234,
            description: 'A gentle cleanser suitable for all skin types. Removes impurities without stripping natural oils.',
            links: [
              { store: 'Jumia', url: 'https://jumia.co.ke' },
              { store: 'Amazon', url: 'https://amazon.com' }
            ],
            skin_types: ['All', 'Sensitive', 'Dry'],
            goals: ['Hydration', 'Basic Care']
          },
          {
            id: '2',
            name: 'Vitamin C Brightening Serum',
            brand: 'The Ordinary',
            rating: 4.7,
            reviews_count: 456,
            description: 'Potent vitamin C serum that brightens skin and reduces dark spots. Best used in morning routine.',
            links: [
              { store: 'Beauty Store', url: 'https://example.com' },
              { store: 'Jumia', url: 'https://jumia.co.ke' }
            ],
            skin_types: ['Normal', 'Combination', 'Oily'],
            goals: ['Glowing skin', 'Even tone', 'Anti-aging']
          },
          {
            id: '3',
            name: 'Hyaluronic Acid Moisturizer',
            brand: 'Neutrogena',
            rating: 4.3,
            reviews_count: 189,
            description: 'Lightweight moisturizer with hyaluronic acid for deep hydration without feeling heavy.',
            links: [
              { store: 'Pharmacy', url: 'https://example.com' }
            ],
            skin_types: ['Dry', 'Normal', 'Sensitive'],
            goals: ['Hydration', 'Anti-aging']
          }
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Skin type filter
    if (skinTypeFilter !== 'all') {
      filtered = filtered.filter(product =>
        product.skin_types?.includes(skinTypeFilter) || 
        product.skin_types?.includes('All')
      );
    }

    // Goal filter
    if (goalFilter !== 'all') {
      filtered = filtered.filter(product =>
        product.goals?.includes(goalFilter)
      );
    }

    // Rating filter
    if (minRatingFilter !== 'all') {
      const minRating = parseFloat(minRatingFilter);
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, skinTypeFilter, goalFilter, minRatingFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Loading products...</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-glow-light-pink via-background to-glow-light-pink p-4">
      <div className="max-w-6xl mx-auto">
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
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Skincare Products</h1>
            <p className="text-muted-foreground">
              Discover the best products for your skin type and goals
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Skin Type</Label>
                <Select value={skinTypeFilter} onValueChange={setSkinTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All skin types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All skin types</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Oily">Oily</SelectItem>
                    <SelectItem value="Dry">Dry</SelectItem>
                    <SelectItem value="Combination">Combination</SelectItem>
                    <SelectItem value="Sensitive">Sensitive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Goal</Label>
                <Select value={goalFilter} onValueChange={setGoalFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All goals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All goals</SelectItem>
                    <SelectItem value="Glowing skin">Glowing skin</SelectItem>
                    <SelectItem value="Anti-aging">Anti-aging</SelectItem>
                    <SelectItem value="Acne-free">Acne-free</SelectItem>
                    <SelectItem value="Hydration">Hydration</SelectItem>
                    <SelectItem value="Even tone">Even tone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Min Rating</Label>
                <Select value={minRatingFilter} onValueChange={setMinRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any rating</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground">
                    {product.reviews_count} reviews
                  </span>
                  {product.skin_types && (
                    <Badge variant="secondary" className="text-xs">
                      {product.skin_types[0]}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{product.name}</DialogTitle>
                        <DialogDescription>{product.brand}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{product.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviews_count} reviews)
                          </span>
                        </div>
                        
                        <p className="text-sm">{product.description}</p>
                        
                        {product.skin_types && (
                          <div>
                            <h4 className="font-medium mb-2">Suitable for:</h4>
                            <div className="flex flex-wrap gap-1">
                              {product.skin_types.map((type) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium mb-2">Where to buy:</h4>
                          <div className="space-y-2">
                            {product.links.map((link, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="w-full justify-between"
                                onClick={() => window.open(link.url, '_blank')}
                              >
                                {link.store}
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {product.links.length > 0 && (
                    <Button 
                      className="w-full bg-glow-pink hover:bg-glow-pink/90"
                      onClick={() => window.open(product.links[0].url, '_blank')}
                    >
                      Buy Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more products
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSkinTypeFilter('all');
                setGoalFilter('all');
                setMinRatingFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Continue to Subscription */}
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/subscription')}
            className="bg-glow-pink hover:bg-glow-pink/90"
            size="lg"
          >
            Continue to Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Products;
