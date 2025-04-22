import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Drawing Project Manager</CardTitle>
          <CardDescription>
            Login to manage your drawing projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground pb-4">
            <p>Track client projects, manage deadlines, and generate invoices all in one place</p>
          </div>
          <Button
            variant="default"
            className="w-full"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login with Google"}
          </Button>
          {import.meta.env.DEV && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground mb-2">Developer Options</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogin}
                disabled={isLoading}
              >
                Use Demo Account
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Drawing Project Manager
        </CardFooter>
      </Card>
    </div>
  );
}