interface AccountRoleIconProps {
  role: "student" | "provider" | "admin";
  className?: string;
}

export default function AccountRoleIcon({
  role,
  className = "size-5",
}: AccountRoleIconProps) {
  if (role === "provider") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <path
          d="M3.5 20.5h17M5 20V8l7-4 7 4v12M9 20v-5h6v5M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (role === "admin") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <path
          d="M12 3.5 19 6v5.3c0 4.2-2.8 7.3-7 9.2-4.2-1.9-7-5-7-9.2V6l7-2.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="m9 12 2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="m3.5 10 8.5-6.5 8.5 6.5M5.5 9v11h13V9M9.5 20v-6h5v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11.5h.01M16 11.5h.01"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
