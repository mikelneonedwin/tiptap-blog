"use client";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { TEXT_COLOR_PRESETS } from "../../constants";

type ColorPickerProps = {
  onChange: (value: string) => void;
  value: string | null;
};

const ColorPicker = ({ value, onChange: setColor }: ColorPickerProps) => {
  const color = useMemo(() => {
    return value || "#FFFFFF";
  }, [value]);

  return (
    <div className="space-y-4">
      <HexColorPicker color={color} onChange={setColor} className="!w-full" />
      <div className="flex items-center justify-between">
        {TEXT_COLOR_PRESETS.map((preset) => (
          <Tooltip key={preset.label}>
            <TooltipTrigger asChild>
              <button
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: preset.hex }}
                onClick={() => setColor(preset.hex)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{preset.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <Input
        maxLength={7}
        onChange={(e) => {
          setColor(e.currentTarget.value);
        }}
        value={color}
      />
    </div>
  );
};

export { ColorPicker };
