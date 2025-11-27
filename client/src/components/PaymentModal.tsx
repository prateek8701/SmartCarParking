import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ParkingSlot } from "@/lib/types";
import { Download, Loader2 } from "lucide-react";

interface PaymentModalProps {
  slot: ParkingSlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRICE_PER_HOUR = 50; // ₹50 per hour

export function PaymentModal({ slot, open, onOpenChange }: PaymentModalProps) {
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const { toast } = useToast();

  const amount = hours * PRICE_PER_HOUR;

  const handlePayment = async () => {
    if (!slot) return;
    setLoading(true);

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: slot.id,
          slotLabel: slot.label,
          slotType: slot.type,
          hours,
          amount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReceipt(data);
        toast({
          title: "Payment Successful",
          description: `Payment of ₹${amount} completed for spot ${slot.label}`,
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Payment failed" });
    }
    setLoading(false);
  };

  const downloadReceipt = () => {
    if (!receipt) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Parking Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .receipt { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 15px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
          .details { margin: 15px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .row.total { border-top: 2px solid #333; border-bottom: 2px solid #333; font-weight: bold; font-size: 16px; padding: 12px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">SmartParkIoT</div>
            <div>Parking Receipt</div>
          </div>
          <div class="details">
            <div class="row">
              <span>Receipt ID:</span>
              <span>${receipt.id}</span>
            </div>
            <div class="row">
              <span>Parking Spot:</span>
              <span>${receipt.slotLabel} (${receipt.slotType})</span>
            </div>
            <div class="row">
              <span>Date:</span>
              <span>${new Date(receipt.createdAt).toLocaleString()}</span>
            </div>
            <div class="row">
              <span>Duration:</span>
              <span>${receipt.hours} hour(s)</span>
            </div>
            <div class="row">
              <span>Rate:</span>
              <span>₹${50}/hour</span>
            </div>
            <div class="row total">
              <span>Total Amount:</span>
              <span>₹${receipt.amount}</span>
            </div>
            <div class="row">
              <span>Status:</span>
              <span style="color: green; font-weight: bold;">PAID</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for using SmartParkIoT</p>
            <p>This is an auto-generated receipt</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([receiptHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${receipt.id}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {receipt ? (
          <>
            <DialogHeader>
              <DialogTitle>Payment Successful</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">✓</div>
                    <p className="text-sm text-muted-foreground">Receipt ID: {receipt.id}</p>
                  </div>

                  <div className="space-y-3 text-sm border-y py-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spot:</span>
                      <span className="font-medium">{receipt.slotLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{receipt.hours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-medium">₹50/h</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t pt-3">
                      <span>Total:</span>
                      <span className="text-green-600">₹{receipt.amount}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground text-center mt-3">
                    {new Date(receipt.createdAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={downloadReceipt} className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>

              <Button
                onClick={() => {
                  setReceipt(null);
                  onOpenChange(false);
                }}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Reserve Parking Spot</DialogTitle>
              {slot && (
                <DialogDescription>
                  Spot {slot.label} ({slot.type})
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Hours to Reserve</label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={hours}
                  onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))}
                  data-testid="input-hours"
                />
              </div>

              <Card className="bg-accent/50">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-primary">₹{amount}</p>
                    <p className="text-xs text-muted-foreground mt-2">{hours} hour(s) × ₹50/hour</p>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full"
                data-testid="button-pay"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay Now"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
