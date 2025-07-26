import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecurityNoticeProps {
  type: "api-key" | "sensitive-data" | "general";
  className?: string;
}

export const SecurityNotice = ({ type, className = "" }: SecurityNoticeProps) => {
  const getNoticeContent = () => {
    switch (type) {
      case "api-key":
        return {
          title: "API Key Security Notice",
          message: "API keys entered here are stored in your browser's local storage. For production applications, implement a backend proxy to keep API keys secure."
        };
      case "sensitive-data":
        return {
          title: "Data Security Notice",
          message: "Your sensitive information is handled securely. We use encryption and secure protocols to protect your data during transmission."
        };
      case "general":
        return {
          title: "Security Information",
          message: "This application uses industry-standard security practices to protect your information."
        };
      default:
        return {
          title: "Security Notice",
          message: "Please ensure you're on a secure connection when entering sensitive information."
        };
    }
  };

  const { title, message } = getNoticeContent();

  return (
    <Alert className={`border-yellow-200 bg-yellow-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>{title}:</strong> {message}
      </AlertDescription>
    </Alert>
  );
};