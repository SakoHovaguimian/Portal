import type { InputHTMLAttributes, Ref } from 'react'

interface HiddenFileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'onChange' | 'type'> {
  ref?: Ref<HTMLInputElement>
  onFilesSelected: (files: FileList | null) => void
  resetAfterSelect?: boolean
}

export function HiddenFileInput({ onFilesSelected, ref, resetAfterSelect = false, ...inputProps }: HiddenFileInputProps) {

  return (
    <input
      {...inputProps}
      ref={ref}
      type="file"
      className="sr-only"
      onChange={(event) => {

        onFilesSelected(event.currentTarget.files)

        if (resetAfterSelect) {
          event.currentTarget.value = ''
        }

      }}
    />
  )

}
