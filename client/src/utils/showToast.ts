import { toast } from "sonner";

const showToast = (type: "success" | "error", message: string) => {
  toast[type](message, {
    className: "shadow-none border-none",
  });
};

export default showToast;
