export interface FloatingAssistantActionProps {
  id: string;
  title: string;
  description: string;
  disabled: boolean;
  onOpen?: () => void;
}
