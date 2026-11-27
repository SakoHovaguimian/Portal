import { useLayoutEffect, useRef, useState } from 'react';

export function useAuthFormErrors<FieldName extends string>() {

  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string[]>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const invalidInput = useRef<HTMLInputElement | undefined>(undefined);

  useLayoutEffect(() => {

    const input = invalidInput.current;
    invalidInput.current = undefined;
    input?.focus();

  }, [errors]);

  useLayoutEffect(() => {

    if (formError && document.activeElement === document.body) {
      formRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus();
    }

  }, [formError]);

  function showFieldErrors(next: typeof errors) {

    const invalidNames = Object.keys(next);
    invalidInput.current = Array.from(formRef.current?.elements ?? []).find(
      (control): control is HTMLInputElement =>
        control instanceof HTMLInputElement && invalidNames.includes(control.name),
    );
    setErrors(next);

  }

  function clearFieldError(field: FieldName) {

    setErrors((current) => {

      if (!current[field]) { return current; }
      const next = { ...current };
      delete next[field];
      return next;

    });

  }

  function clearFieldErrors() {
    setErrors({});
  }

  return { formRef, errors, formError, setFormError, showFieldErrors, clearFieldError, clearFieldErrors };

}
