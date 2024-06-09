import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

const EmojiPicker = ({onChange}: EmojiPickerProps) => {
    const resolvedTheme = useTheme()

    return (
    <Popover>
        <PopoverTrigger>
            <Smile />
        </PopoverTrigger>
        <PopoverContent className="w-max">
            <Picker theme={resolvedTheme} data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)} />
        </PopoverContent>
    </Popover>
    );
}

export default EmojiPicker;
