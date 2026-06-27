import { cn } from "@/lib/utils";

type NavIconProps = {
  className?: string;
};

const iconBase = "h-[18px] w-[18px] shrink-0";

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** املاک */
export function PropertyNavIcon({ className }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn(iconBase, "-translate-y-[2px]", className)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 7L22 12V22H8.5V7Z"
        {...stroke}
        strokeWidth={2}
      />
      <path d="M8.5 7L2 12V22H8.5" {...stroke} strokeWidth={2} />
      <path d="M17.5 22V16L13 14.5V22" {...stroke} strokeWidth={2} />
      <path d="M22 22H8.5" {...stroke} strokeWidth={2} />
    </svg>
  );
}

/** مشاورین */
export function ConsultantNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn(iconBase, className)} aria-hidden>
      <path
        d="M3 4.62782L12.0043 2L21 4.62782V10.0169C21 15.6811 17.3751 20.2097 12.0013 22.0002C6.62605 20.2097 3 15.68 3 10.0143V4.62782Z"
        {...stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z"
        {...stroke}
        strokeWidth={2}
      />
      <path d="M16 15.5C16 13.2908 14.2092 11.5 12 11.5C9.79085 11.5 8 13.2908 8 15.5" {...stroke} strokeWidth={2} />
    </svg>
  );
}

/** خدمات مهندسی */
export function EngineeringNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn(iconBase, className)} aria-hidden>
      <path d="M6 22L11.3438 7.75" {...stroke} strokeWidth={2} />
      <path d="M18 22L12.6562 7.75" {...stroke} strokeWidth={2} />
      <path
        d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z"
        {...stroke}
        strokeWidth={2}
      />
      <path
        d="M18.785 16.5C16.8309 17.7653 14.5012 18.5 11.9999 18.5C9.49864 18.5 7.16894 17.7653 5.21484 16.5"
        {...stroke}
        strokeWidth={2}
      />
      <path d="M12 4V2" {...stroke} strokeWidth={2} />
    </svg>
  );
}

/** مقالات — کتاب باز */
export function ArticleNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(iconBase, className)} aria-hidden>
      <path
        {...stroke}
        d="M12 7.2c-1.6-1.1-3.4-1.4-5.2-1.1-1.8.3-3 1.2-3 2.5V17.8c0-1 1-1.8 2.8-2 1.8-.2 3.5.1 5.4 1.1"
      />
      <path
        {...stroke}
        d="M12 7.2c1.6-1.1 3.4-1.4 5.2-1.1 1.8.3 3 1.2 3 2.5V17.8c0-1-1-1.8-2.8-2-1.8-.2-3.5.1-5.4 1.1"
      />
      <path {...stroke} d="M12 7.2v11.6" />
    </svg>
  );
}

/** تماس با ما */
export function ContactNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn(iconBase, className)} aria-hidden>
      <path
        d="M20.8901 10.3033C21.0165 9.4554 20.9751 8.58735 20.7658 7.7527C20.4893 6.6501 19.9199 5.6059 19.0577 4.74365C18.1954 3.88141 17.1512 3.31205 16.0487 3.03558C15.214 2.82629 14.3459 2.78484 13.498 2.91123"
        {...stroke}
        strokeWidth={2}
      />
      <path
        d="M17.0943 9.90173C17.2297 8.99343 16.9478 8.03493 16.2486 7.33573C15.5494 6.63653 14.5909 6.35458 13.6826 6.48998"
        {...stroke}
        strokeWidth={2}
      />
      <path
        d="M7.18735 4.39722C7.55065 4.39722 7.88535 4.59423 8.06165 4.91185L9.2849 7.11525C9.44505 7.40375 9.45255 7.7527 9.305 8.04785L8.1266 10.4047C8.1266 10.4047 8.4681 12.1604 9.8973 13.5896C11.3265 15.0188 13.0764 15.3544 13.0764 15.3544L15.4328 14.1762C15.7282 14.0285 16.0774 14.0362 16.366 14.1966L18.5756 15.4251C18.8929 15.6015 19.0897 15.9361 19.0897 16.2991V18.8359C19.0897 20.1277 17.8898 21.0608 16.6657 20.6477C14.1518 19.7995 10.2494 18.1844 7.776 15.7109C5.30255 13.2375 3.68745 9.33515 2.83918 6.8212C2.42617 5.59715 3.35922 4.39722 4.65104 4.39722H7.18735Z"
        {...stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** درباره ما — i داخل دایره */
export function AboutNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(iconBase, className)} aria-hidden>
      <circle {...stroke} cx="12" cy="12" r="8.5" />
      <path {...stroke} d="M12 10.8V16.2" />
      <circle cx="12" cy="8.1" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** ورود / ثبت نام */
export function LoginNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(iconBase, className)} aria-hidden>
      <circle {...stroke} cx="12" cy="12" r="8.5" />
      <circle {...stroke} cx="12" cy="9.8" r="2.2" />
      <path {...stroke} d="M8 16.8c1-2 2.6-3.1 4-3.1s3 .9 4 3.1" />
    </svg>
  );
}
