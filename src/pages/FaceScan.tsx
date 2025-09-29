import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera, Upload, Sparkles, RefreshCw } from 'lucide-react';
import Navigation from '../components/Navigation';

interface FaceScanResult {
  skin_tone: 'Light' | 'Medium' | 'Dark';
  skin_type: 'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Sensitive';
  confidence: number;
}

const FaceScan = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<FaceScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCamera, setIsCamera] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setScanResult(null);
      setShowOverride(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please try uploading a photo instead.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'face-scan.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          setPreviewUrl(URL.createObjectURL(file));
          
          // Stop camera
          const stream = video.srcObject as MediaStream;
          stream?.getTracks().forEach(track => track.stop());
          setIsCamera(false);
          setScanResult(null);
          setShowOverride(false);
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const performScan = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    
    try {
      // Mock AI face scan for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: FaceScanResult = {
        skin_tone: 'Medium',
        skin_type: 'Combination',
        confidence: 0.87
      };
      
      setScanResult(mockResult);
      setShowOverride(true);
    } catch (error) {
      console.error('Face scan error:', error);
      alert('Face scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = (field: keyof Omit<FaceScanResult, 'confidence'>, value: string) => {
    if (scanResult) {
      setScanResult({
        ...scanResult,
        [field]: value
      });
    }
  };

  const proceedToResults = () => {
    if (scanResult) {
      const answers = {
        skin_type: scanResult.skin_type,
        main_concerns: [], // Face scan doesn't detect concerns
        age_group: '', // Face scan doesn't detect age
        skincare_goal: '',
        detected_skin_tone: scanResult.skin_tone,
        confidence: scanResult.confidence
      };

      navigate('/questionnaire', { state: { answers, type: 'face-scan' } });
    }
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
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Face Scan Analysis</h1>
            <p className="text-muted-foreground">
              Upload a photo or use your camera for AI skin analysis
            </p>
          </div>
        </div>

        {/* Camera/Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Capture Your Photo</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedImage && !isCamera && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={startCamera}
                    className="flex-1 bg-glow-pink hover:bg-glow-pink/90"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Use Camera
                  </Button>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 border-glow-purple hover:bg-glow-purple hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>For best results:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Use good lighting</li>
                    <li>Face the camera directly</li>
                    <li>Remove makeup if possible</li>
                    <li>Keep hair away from face</li>
                  </ul>
                </div>
              </div>
            )}

            {isCamera && (
              <div className="text-center space-y-4">
                <video 
                  ref={videoRef} 
                  className="w-full max-w-md mx-auto rounded-lg"
                  autoPlay
                  playsInline
                  muted
                />
                <Button onClick={capturePhoto} className="bg-glow-pink hover:bg-glow-pink/90">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
              </div>
            )}

            {previewUrl && (
              <div className="text-center space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Selected" 
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={performScan}
                    disabled={loading}
                    className="bg-glow-purple hover:bg-glow-purple/90"
                  >
                    {loading ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze Face
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl(null);
                      setScanResult(null);
                      setShowOverride(false);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>

        {/* Scan Results */}
        {scanResult && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-glow-pink" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Confidence Score:</span>
                  <Badge className={`${scanResult.confidence > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {Math.round(scanResult.confidence * 100)}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Detected Skin Tone</label>
                    {showOverride ? (
                      <select 
                        value={scanResult.skin_tone}
                        onChange={(e) => handleOverride('skin_tone', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Light">Light</option>
                        <option value="Medium">Medium</option>
                        <option value="Dark">Dark</option>
                      </select>
                    ) : (
                      <Badge variant="secondary">{scanResult.skin_tone}</Badge>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Detected Skin Type</label>
                    {showOverride ? (
                      <select 
                        value={scanResult.skin_type}
                        onChange={(e) => handleOverride('skin_type', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Oily">Oily</option>
                        <option value="Dry">Dry</option>
                        <option value="Combination">Combination</option>
                        <option value="Normal">Normal</option>
                        <option value="Sensitive">Sensitive</option>
                      </select>
                    ) : (
                      <Badge variant="secondary">{scanResult.skin_type}</Badge>
                    )}
                  </div>
                </div>

                {!showOverride && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowOverride(true)}
                  >
                    That's not right - Let me correct it
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proceed Button */}
        {scanResult && (
          <div className="text-center">
            <Button 
              onClick={proceedToResults}
              className="bg-glow-pink hover:bg-glow-pink/90"
              size="lg"
            >
              Get My Skincare Recommendations
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default FaceScan;