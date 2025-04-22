import { FcGoogle } from "react-icons/fc";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LoginModalProps {
  loginWithGoogle: () => void;
}

export function LoginModal({ loginWithGoogle }: LoginModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-primary-500" />
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome to DrawTrack</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to access your drawing management dashboard</p>
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={loginWithGoogle}
              variant="outline" 
              className="w-full flex items-center justify-center"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Sign in with Google
            </Button>
            
            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
