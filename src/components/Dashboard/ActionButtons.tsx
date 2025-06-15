
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Camera, Scan } from 'lucide-react';
import { BarcodeScanner } from '@/components/BarcodeScanner/BarcodeScanner';
import { PhotoFoodRecognition } from '@/components/PhotoFoodRecognition/PhotoFoodRecognition';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

export const ActionButtons = () => {
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showPhotoRecognition, setShowPhotoRecognition] = useState(false);
  const { permission, requestPermission } = useNotifications();
  const { toast } = useToast();

  const handleBarcodeScanned = (barcode: string) => {
    toast({
      title: "Barcode Scanned",
      description: `Barcode: ${barcode}`,
    });
    setShowBarcodeScanner(false);
  };

  const handleFoodRecognized = (predictions: Array<{ className: string; confidence: number }>) => {
    toast({
      title: "Food Recognized",
      description: `Found: ${predictions[0]?.className}`,
    });
    setShowPhotoRecognition(false);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {!permission.granted && permission.default && (
        <Button variant="outline" onClick={requestPermission} className="hover-lift">
          Enable Smart Notifications
        </Button>
      )}
      
      <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hover-lift">
            <Scan className="mr-2 h-4 w-4" />
            Scan Barcode
          </Button>
        </DialogTrigger>
        <DialogContent>
          <BarcodeScanner 
            onScan={handleBarcodeScanned}
            onClose={() => setShowBarcodeScanner(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showPhotoRecognition} onOpenChange={setShowPhotoRecognition}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hover-lift">
            <Camera className="mr-2 h-4 w-4" />
            Photo Recognition
          </Button>
        </DialogTrigger>
        <DialogContent>
          <PhotoFoodRecognition 
            onFoodRecognized={handleFoodRecognized}
            onClose={() => setShowPhotoRecognition(false)}
          />
        </DialogContent>
      </Dialog>

      <Button asChild className="hover-lift ripple">
        <Link to="/log-food">
          <Plus className="mr-2 h-4 w-4" />
          Log Food
        </Link>
      </Button>
    </div>
  );
};
