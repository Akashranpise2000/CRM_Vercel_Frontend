'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Building2, CheckCircle, ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const response = await apiClient.register({ name, email: formData.email, password: formData.password });
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="absolute top-0 left-0 -z-10">
          <div className="w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full blur-3xl" />
        </div>

        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-in zoom-in-95 duration-500">
=======
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="absolute top-0 left-0 -z-10">
          <div className="w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-200/30 dark:from-emerald-900/20 dark:to-green-900/20 rounded-full blur-3xl" />
        </div>

        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/90 backdrop-blur-sm animate-in zoom-in-95 duration-500">
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl mb-6 shadow-lg shadow-emerald-500/25 relative">
                <CheckCircle className="h-10 w-10 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-3 w-3 text-yellow-800" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                User Created Successfully!
              </h2>
<<<<<<< HEAD
              <p className="text-gray-600 mb-4 text-lg">
                Your account has been created. You can now sign in with your credentials.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
=======
              <p className="text-muted-foreground mb-4 text-lg">
                Your account has been created. You can now sign in with your credentials.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Redirecting to login page...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 -z-10">
        <div className="w-96 h-96 bg-gradient-to-bl from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10">
        <div className="w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
=======
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 -z-10">
        <div className="w-96 h-96 bg-gradient-to-bl from-purple-200/30 to-indigo-200/30 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10">
        <div className="w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
      </div>

      <div className="w-full max-w-lg animate-in slide-in-from-bottom-4 duration-700">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl mb-6 shadow-lg shadow-purple-500/25 relative">
            <Building2 className="h-10 w-10 text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
              <Shield className="h-3 w-3 text-emerald-800" />
            </div>
          </div>
<<<<<<< HEAD
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Join CRM Pro
          </h1>
          <p className="text-gray-600 text-lg">Create your account to get started with professional CRM</p>
        </div>

        {/* Signup Form */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-center text-gray-600">
=======
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-3">
            Join CRM Pro
          </h1>
          <p className="text-muted-foreground text-lg">Create your account to get started with professional CRM</p>
        </div>

        {/* Signup Form */}
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-foreground">Create Account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
              Fill in your details to create your CRM Pro account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
<<<<<<< HEAD
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                    First Name
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
=======
                  <Label htmlFor="firstName" className="text-sm font-semibold text-foreground">
                    First Name
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                      <User className="h-5 w-5" />
                    </div>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
<<<<<<< HEAD
                      className="pl-12 h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-50/50 focus:bg-white transition-all duration-200"
=======
                      className="pl-12 h-12 text-base border-input focus:border-purple-500 focus:ring-purple-500/20 bg-background focus:bg-background transition-all duration-200"
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                    />
                  </div>
                </div>

                <div className="space-y-3">
<<<<<<< HEAD
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
=======
                  <Label htmlFor="lastName" className="text-sm font-semibold text-foreground">
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                    Last Name
                  </Label>
                  <div className="relative group">
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
<<<<<<< HEAD
                      className="pl-4 h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-50/50 focus:bg-white transition-all duration-200"
=======
                      className="pl-4 h-12 text-base border-input focus:border-purple-500 focus:ring-purple-500/20 bg-background focus:bg-background transition-all duration-200"
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
<<<<<<< HEAD
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
=======
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
<<<<<<< HEAD
                    className="pl-12 h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-50/50 focus:bg-white transition-all duration-200"
=======
                    className="pl-12 h-12 text-base border-input focus:border-purple-500 focus:ring-purple-500/20 bg-background focus:bg-background transition-all duration-200"
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
<<<<<<< HEAD
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
=======
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
<<<<<<< HEAD
                    className="pl-12 pr-12 h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-50/50 focus:bg-white transition-all duration-200"
=======
                    className="pl-12 pr-12 h-12 text-base border-input focus:border-purple-500 focus:ring-purple-500/20 bg-background focus:bg-background transition-all duration-200"
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
<<<<<<< HEAD
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
=======
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
<<<<<<< HEAD
                <p className="text-xs text-gray-500 flex items-center gap-1">
=======
                <p className="text-xs text-muted-foreground flex items-center gap-1">
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                  <Shield className="h-3 w-3" />
                  Must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-3">
<<<<<<< HEAD
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
=======
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                  Confirm Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
<<<<<<< HEAD
                    className="pl-12 pr-12 h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-50/50 focus:bg-white transition-all duration-200"
=======
                    className="pl-12 pr-12 h-12 text-base border-input focus:border-purple-500 focus:ring-purple-500/20 bg-background focus:bg-background transition-all duration-200"
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
<<<<<<< HEAD
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
=======
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
<<<<<<< HEAD
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
=======
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">Already have an account?</span>
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
<<<<<<< HEAD
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors group"
=======
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-colors group"
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
              >
                Sign in to your account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
