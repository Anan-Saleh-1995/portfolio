import { Toaster } from "sonner";

export const AppToaster = () => (
  <Toaster
    position="bottom-right"
    richColors={false}
    expand={false}
    visibleToasts={3}
    toastOptions={{
      classNames: {
        toast: "samuraiToast",
        title: "samuraiToastTitle",
        description: "samuraiToastDescription",
        success: "samuraiToastSuccess",
        error: "samuraiToastError",
        warning: "samuraiToastWarning",
      },
    }}
  />
);
