import { Label } from '@share-clipboard/ui/components/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@share-clipboard/ui/components/select'

interface PreferenceSelectProps {
  id: string
  icon: React.ReactNode
  label: string
  value: string
  options: { value: string; label: string }[]
  onValueChange: (value: string) => void
}

export function PreferenceSelect({
  id,
  icon,
  label,
  value,
  options,
  onValueChange
}: PreferenceSelectProps): React.JSX.Element {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
