"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useThreadEditStore } from "@/lib/store";

interface SyncedInputProps extends React.ComponentProps<typeof Input> {
  storeField: "title" | "tags";
  initialValue: string;
}

export function SyncedInput({
  storeField,
  initialValue,
  ...props
}: SyncedInputProps) {
  const setFields = useThreadEditStore((s) => s.setFields);
  const currentValue = useThreadEditStore((s) => s[storeField]);

  // 1. Sync the initial database value into the store on mount
  useEffect(() => {
    setFields({ [storeField]: initialValue });
  }, [initialValue, storeField, setFields]);

  return (
    <Input
      {...props}
      // 2. Control the input using the Zustand store state
      value={currentValue}
      onChange={(e) => setFields({ [storeField]: e.target.value })}
    />
  );
}
