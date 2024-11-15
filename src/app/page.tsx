import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Shield, UserPlus } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "./components/FeatureCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
        Better-Auth Demo
      </h1>
      <p className="text-xl mb-8 text-center max-w-2xl text-gray-600">
        Authentication inspired by Linear, featuring <code>Linear</code> plugin
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl w-full">
        <FeatureCard
          icon={<Mail className="w-6 h-6 text-blue-500" />}
          title="Email Linking"
          description="Securely link your account using your email address"
        />
        <FeatureCard
          icon={<Shield className="w-6 h-6 text-teal-500" />}
          title="Email OTP"
          description="Use one-time passwords sent to your email for enhanced security"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="group">
          <Link href="protected">
            Try the Demo
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="group">
          <Link href="/signup">
            Sign Up
            <UserPlus className="ml-2 h-4 w-4 transition-opacity opacity-70 group-hover:opacity-100" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
