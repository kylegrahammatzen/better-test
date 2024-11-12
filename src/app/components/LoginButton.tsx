"use client";

import { authClient } from "@/lib/auth-client";
import React from "react";

type LoginButtonProps = {
  variant?: "default" | "steam";
  onClick?: () => void;
};

const LoginButton = (props: LoginButtonProps) => {
  const variant = props.variant || "default";
  const baseClasses =
    "flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    steam: "bg-[#171a21] text-white hover:bg-[#2a475e] focus:ring-[#66c0f4]",
  };

  const variantOnClick = {
    default: () => {
      console.log("Default login clicked");
    },
    steam: async () => {
      const result = await authClient.signIn.oauth2({
        providerId: "steam",
      });

      console.log(result);
    },
  };

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    } else {
      variantOnClick[variant]();
    }
  };

  const SteamIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10c-4.6 0-8.45-3.08-9.64-7.27l3.83 1.58a2.843 2.843 0 0 0 2.78 2.27c1.56 0 2.83-1.27 2.83-2.83v-.13l3.4-2.43h.08c2.08 0 3.77-1.69 3.77-3.77s-1.69-3.77-3.77-3.77s-3.78 1.69-3.78 3.77v.05l-2.37 3.46l-.16-.01c-.59 0-1.14.18-1.59.49L2 11.2C2.43 6.05 6.73 2 12 2M8.28 17.17c.8.33 1.72-.04 2.05-.84c.33-.8-.05-1.71-.83-2.04l-1.28-.53c.49-.18 1.04-.19 1.56.03c.53.21.94.62 1.15 1.15c.22.52.22 1.1 0 1.62c-.43 1.08-1.7 1.6-2.78 1.15c-.5-.21-.88-.59-1.09-1.04zm9.52-7.75c0 1.39-1.13 2.52-2.52 2.52a2.52 2.52 0 0 1-2.51-2.52a2.5 2.5 0 0 1 2.51-2.51a2.52 2.52 0 0 1 2.52 2.51m-4.4 0c0 1.04.84 1.89 1.89 1.89c1.04 0 1.88-.85 1.88-1.89s-.84-1.89-1.88-1.89c-1.05 0-1.89.85-1.89 1.89"
      />
    </svg>
  );

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={handleClick}
      type="button"
    >
      {variant === "steam" && (
        <>
          <SteamIcon className="h-5 w-5 mr-2" />
          Login with Steam
        </>
      )}
      {variant === "default" && "Login"}
    </button>
  );
};

export { LoginButton };
