import { loadEnvConfig } from "@next/env";
import { Resend } from "resend";

// Load environment variables
loadEnvConfig(process.cwd());

export const resend = new Resend(process.env.RESEND_API_KEY!);
