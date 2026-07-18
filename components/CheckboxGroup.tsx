'use client';

export default function CheckboxGroup({
  name,
  options,
  selected,
  onToggle,
}: {
  name: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="checkbox-row">
      {options.map((opt) => (
        <label key={opt.value} htmlFor={`${name}-${opt.value}`}>
          <input
            id={`${name}-${opt.value}`}
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => onToggle(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
