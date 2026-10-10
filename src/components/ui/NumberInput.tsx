'use client';

import { useState, type InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/Input';
import { parseNumero } from '@/lib/utils/format';

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number;
  onValueChange: (n: number) => void;
}

function sinCerosIzquierda(texto: string): string {
  return texto.replace(/^0+(?=\d)/, '');
}

export function NumberInput({ value, onValueChange, ...props }: Props) {
  const [texto, setTexto] = useState(() => String(value));

  const mostrado = parseNumero(texto) === value ? texto : String(value);

  return (
    <Input
      {...props}
      type="number"
      inputMode="decimal"
      value={mostrado}
      onChange={(e) => {
        const limpio = sinCerosIzquierda(e.target.value);
        setTexto(limpio);
        onValueChange(parseNumero(limpio));
      }}
    />
  );
}
