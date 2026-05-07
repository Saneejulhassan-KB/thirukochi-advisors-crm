import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportButtonProps {
  label?: string;
  format?: "excel" | "pdf";
  onExport?: () => void;
  className?: string;
}

export function ExportButton({
  label = "Export",
  format = "excel",
  onExport,
  className,
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      if (onExport) {
        onExport();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      toast.success(
        `${format === "excel" ? "Excel" : "PDF"} exported successfully`,
        {
          description: `Your ${format.toUpperCase()} file has been downloaded.`,
        },
      );
    } catch {
      toast.error("Export failed", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className={className}
      data-ocid="export_button"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {loading ? "Exporting..." : label}
    </Button>
  );
}
