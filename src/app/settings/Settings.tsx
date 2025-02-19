import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

type SliderProps = React.ComponentProps<typeof Slider>

export default function ImageSettings({ className, ...props }: SliderProps) {
  return (
    <div className="bg-red-500 max-w-3/6">
        <p>hola</p>
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          className={cn("w-[60%]", className)}
          {...props}
        />
    </div>
  )
}