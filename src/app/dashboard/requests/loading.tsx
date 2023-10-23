import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="grid h-full w-full place-items-center">
      <Loader2 size={48} className="animate-spin md:-ml-80" />
    </div>
  );
};

export default Loading;
