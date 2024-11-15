import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type LinearLoginCodeEmailProps = {
  validationCode?: string;
  magicLink?: string;
  type: "sign-in" | "email-verification";
};

export const LinearLoginCodeEmail = (props: LinearLoginCodeEmailProps) => (
  <Html>
    <Head />
    <Preview>{props.type === "sign-in" ? "Sign in to Linear" : "Verify your email for Linear"}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://app.linear.app/static/linear-logo.png`}
          width="42"
          height="42"
          alt="Linear"
          style={logo}
        />
        <Heading style={heading}>
          {props.type === "sign-in" ? "Sign in to Linear" : "Verify your email for Linear"}
        </Heading>
        <Text style={paragraph}>
          You can {props.type === "sign-in" ? "sign in" : "verify your email"} by clicking the button below:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={props.magicLink}>
            {props.type === "sign-in" ? "Sign in to Linear" : "Verify Email"}
          </Button>
        </Section>
        <Text style={paragraph}>
          Or, if you prefer, you can enter this code on our website:
        </Text>
        <code style={code}>{props.validationCode}</code>
        <Text style={paragraph}>
          This code and magic link will expire in 5 minutes.
        </Text>
        <Hr style={hr} />
        <Link href="https://linear.app" style={reportLink}>
          Linear
        </Link>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const logo = {
  margin: "0 auto",
  width: "42px",
  height: "42px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#5e6ad2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};