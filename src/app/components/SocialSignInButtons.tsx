"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Google } from "@/app/components/Google";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/client";

type SocialSignInButtonsProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const capitalizeProvider = (provider: string): string => {
  switch (provider) {
    case "github":
      return "GitHub";
    case "google":
      return "Google";
    default:
      return provider;
  }
};

const SocialSignInButtons = (props: SocialSignInButtonsProps) => {
  const { toast } = useToast();

  const handleSocialSignIn = async (provider: "github" | "google") => {
    props.setIsLoading(true);
    try {
      const { error } = await authClient.signIn.social({ provider });

      if (error) {
        toast({
          title: "Sign in failed",
          description: `There was an error signing up. Please try again.`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sign in successful",
        description: `You've successfully signed in with ${capitalizeProvider(
          provider
        )}.`,
      });
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: `There was an error signing in with ${capitalizeProvider(
          provider
        )}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      props.setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSocialSignIn("github")}
        disabled={props.isLoading}
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSocialSignIn("google")}
        disabled={props.isLoading}
      >
        <Google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
};

export { SocialSignInButtons };
