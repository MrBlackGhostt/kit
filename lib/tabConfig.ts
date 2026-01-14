import { CodeSnippet } from "./CodeSnippet";

export const walletTabs = [
  {
    key: "setup",
    label: "Setup",
    code: CodeSnippet.setup,
    language: "typescript",
  },
  {
    key: "connect",
    label: "Connect",
    code: CodeSnippet.connect,
    language: "typescript",
  },
  {
    key: "send",
    label: "Send Transaction",
    code: CodeSnippet.send,
    language: "typescript",
  },
  {
    key: "balance",
    label: "Fetch Balance",
    code: CodeSnippet.balance,
    language: "typescript",
  },
];
