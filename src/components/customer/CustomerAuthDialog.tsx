import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User } from 'lucide-react';

interface CustomerAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'signup';
}

export const CustomerAuthDialog: React.FC<CustomerAuthDialogProps> = ({
  open,
  onOpenChange,
  defaultTab = 'login'
}) => {
  const { login, signup } = useCustomerAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    privacy_accepted: false,
    marketing_consent: false,
    address: {
      label: 'Home',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'ID'
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
      onOpenChange(false);
      setLoginData({ email: '', password: '' });
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!signupData.privacy_accepted) {
      setError('You must accept the privacy policy to create an account');
      setIsLoading(false);
      return;
    }

    const result = await signup({
      email: signupData.email,
      password: signupData.password,
      full_name: signupData.full_name,
      phone: signupData.phone,
      privacy_accepted: signupData.privacy_accepted,
      marketing_consent: signupData.marketing_consent,
      address: signupData.address
    });
    
    if (result.success) {
      toast({ 
        title: 'Account created!', 
        description: 'Welcome to our platform. You have been logged in automatically.' 
      });
      onOpenChange(false);
      resetSignupForm();
    } else {
      setError(result.error || 'Signup failed');
    }
    
    setIsLoading(false);
  };

  const resetSignupForm = () => {
    setSignupData({
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      phone: '',
      privacy_accepted: false,
      marketing_consent: false,
      address: {
        label: 'Home',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'ID'
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Account
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Login to your account to continue shopping</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join us to enjoy personalized shopping experience</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        value={signupData.full_name}
                        onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Default Delivery Address</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Street Address"
                        value={signupData.address.address_line1}
                        onChange={(e) => setSignupData({
                          ...signupData,
                          address: { ...signupData.address, address_line1: e.target.value }
                        })}
                        required
                      />
                      <Input
                        placeholder="Apartment, suite, etc. (optional)"
                        value={signupData.address.address_line2}
                        onChange={(e) => setSignupData({
                          ...signupData,
                          address: { ...signupData.address, address_line2: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="City"
                        value={signupData.address.city}
                        onChange={(e) => setSignupData({
                          ...signupData,
                          address: { ...signupData.address, city: e.target.value }
                        })}
                        required
                      />
                      <Input
                        placeholder="Postal Code"
                        value={signupData.address.postal_code}
                        onChange={(e) => setSignupData({
                          ...signupData,
                          address: { ...signupData.address, postal_code: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy-policy"
                        checked={signupData.privacy_accepted}
                        onCheckedChange={(checked) => 
                          setSignupData({ ...signupData, privacy_accepted: !!checked })
                        }
                        required
                      />
                      <Label htmlFor="privacy-policy" className="text-sm">
                        I accept that my personal details will be saved and used for order management 
                        and customer service purposes. *
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="marketing-consent"
                        checked={signupData.marketing_consent}
                        onCheckedChange={(checked) => 
                          setSignupData({ ...signupData, marketing_consent: !!checked })
                        }
                      />
                      <Label htmlFor="marketing-consent" className="text-sm">
                        I would like to receive promotional emails and offers (optional)
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};