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

/** املاک — خانه ساده با دودکش */
export function PropertyNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(iconBase, className)} aria-hidden>
      <path {...stroke} d="M4.5 11.5 12 5.5l7.5 6" />
      <path {...stroke} d="M6.5 11.5V19h11V11.5" />
      <path {...stroke} d="M15.8 8.2V5.8h1.7v3.8" />
    </svg>
  );
}

/** مشاورین — سپر با سر و شانه */
export function ConsultantNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(iconBase, className)} aria-hidden>
      <path
        {...stroke}
        d="M12 21.5c4.8-2.2 7.5-5.8 7.5-10.2V7.2L12 4.8 4.5 7.2v4.1c0 4.4 2.7 8 7.5 10.2z"
      />
      <circle {...stroke} cx="12" cy="10.2" r="1.8" />
      <path {...stroke} d="M9.1 13.8c.7-1.1 1.7-1.7 2.9-1.7s2.2.6 2.9 1.7" />
    </svg>
  );
}

/** خدمات مهندسی — پرگار نقشه‌کشی */
export function EngineeringNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(iconBase, className)} aria-hidden>
      <circle {...stroke} cx="12" cy="6.5" r="1.4" />
      <path {...stroke} d="M12 8v2.2" />
      <path {...stroke} d="M12 10.2 7.2 20.5" />
      <path {...stroke} d="M12 10.2 16.8 20.5" />
      <path {...stroke} d="M9.2 15.8h5.6" />
      <circle {...stroke} cx="7.2" cy="20.5" r="0.9" />
      <path {...stroke} d="M15.9 19.6 16.8 20.5 15.9 21.4" />
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

/** تماس با ما — گوشی */
export function ContactNavIcon({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(iconBase, className)} aria-hidden>
      <path
        {...stroke}
        d="M6.8 4.5h2.2c.6 0 1.1.4 1.2 1l.4 2.2a1.2 1.2 0 0 1-.3 1l-1.1 1.1a12.5 12.5 0 0 0 5.2 5.2l1.1-1.1a1.2 1.2 0 0 1 1-.3l2.2.4c.6.1 1 .6 1 1.2v2.2a1.2 1.2 0 0 1-1.1 1.2 18.5 18.5 0 0 1-8.1-1.9 18.2 18.2 0 0 1-5.8-5.8A18.5 18.5 0 0 1 5.6 5.6 1.2 1.2 0 0 1 6.8 4.5z"
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
