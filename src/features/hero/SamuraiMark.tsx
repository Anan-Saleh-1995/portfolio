export const SamuraiMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 360 640"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="moon-glow" cx="50%" cy="44%" r="44%">
        <stop
          offset="0%"
          stopColor="color-mix(in srgb, var(--token) 96%, white 4%)"
        />
        <stop
          offset="78%"
          stopColor="color-mix(in srgb, var(--token) 88%, black 12%)"
        />
        <stop
          offset="100%"
          stopColor="color-mix(in srgb, var(--token) 68%, black 32%)"
        />
      </radialGradient>
      <radialGradient id="moon-haze" cx="50%" cy="50%" r="50%">
        <stop
          offset="0%"
          stopColor="color-mix(in srgb, var(--token) 22%, transparent 78%)"
        />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <linearGradient id="sky-fade" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="0%"
          stopColor="color-mix(in srgb, var(--text) 12%, transparent 88%)"
        />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
      <linearGradient id="ronin-fill" x1="0" y1="0" x2="1" y2="1">
        <stop
          offset="0%"
          stopColor="color-mix(in srgb, var(--text) 28%, black 72%)"
        />
        <stop
          offset="55%"
          stopColor="color-mix(in srgb, var(--text) 16%, black 84%)"
        />
        <stop
          offset="100%"
          stopColor="color-mix(in srgb, var(--text) 8%, black 92%)"
        />
      </linearGradient>
      <linearGradient id="cloth-edge" x1="0" y1="0" x2="1" y2="1">
        <stop
          offset="0%"
          stopColor="color-mix(in srgb, var(--token) 26%, transparent 74%)"
        />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
      <filter id="moon-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
    </defs>

    <circle cx="184" cy="162" r="114" fill="url(#moon-glow)" opacity="0.92" />
    <circle
      cx="184"
      cy="162"
      r="142"
      fill="url(#moon-haze)"
      opacity="0.72"
      filter="url(#moon-blur)"
    />

    <g opacity="0.7">
      <path
        d="M20 238C52 224 72 226 102 244"
        stroke="color-mix(in srgb, var(--text) 30%, black 70%)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M38 232C52 206 64 188 82 170"
        stroke="color-mix(in srgb, var(--text) 26%, black 74%)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M278 224C304 212 324 214 344 228"
        stroke="color-mix(in srgb, var(--text) 30%, black 70%)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M296 216C308 192 320 172 340 152"
        stroke="color-mix(in srgb, var(--text) 24%, black 76%)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>

    <g opacity="0.92">
      <circle
        cx="54"
        cy="188"
        r="8"
        fill="color-mix(in srgb, var(--token) 58%, white 42%)"
      />
      <circle
        cx="72"
        cy="208"
        r="6.5"
        fill="color-mix(in srgb, var(--token) 54%, white 46%)"
      />
      <circle
        cx="90"
        cy="182"
        r="7"
        fill="color-mix(in srgb, var(--token) 52%, white 48%)"
      />
      <circle
        cx="310"
        cy="182"
        r="8"
        fill="color-mix(in srgb, var(--token) 58%, white 42%)"
      />
      <circle
        cx="330"
        cy="204"
        r="6.5"
        fill="color-mix(in srgb, var(--token) 54%, white 46%)"
      />
      <circle
        cx="294"
        cy="208"
        r="7"
        fill="color-mix(in srgb, var(--token) 52%, white 48%)"
      />
    </g>

    <g transform="translate(0 6)">
      <path
        d="M180 108C154 122 138 142 134 170C154 160 168 156 180 156C192 156 206 160 226 170C222 142 206 122 180 108Z"
        fill="url(#ronin-fill)"
        opacity="0.94"
      />
      <path
        d="M178 122C146 134 122 154 96 186C126 176 154 172 180 172C206 172 234 176 264 186C238 154 214 134 182 122H178Z"
        fill="url(#ronin-fill)"
      />
      <path
        d="M176 126L166 92L176 114L188 92L184 128"
        fill="color-mix(in srgb, var(--text) 26%, black 74%)"
        opacity="0.86"
      />
      <path
        d="M154 188C140 190 126 196 112 206C88 224 72 254 66 302C62 334 66 370 80 404C92 432 110 456 138 476C153 486 166 492 180 494C194 492 207 486 222 476C250 456 268 432 280 404C294 370 298 334 294 302C288 254 272 224 248 206C234 196 220 190 206 188L180 196L154 188Z"
        fill="url(#ronin-fill)"
      />
      <path
        d="M146 216C130 232 120 256 118 288C116 324 126 360 144 392C154 410 166 424 180 434C194 424 206 410 216 392C234 360 244 324 242 288C240 256 230 232 214 216L198 204H162L146 216Z"
        fill="color-mix(in srgb, var(--text) 14%, black 86%)"
        opacity="0.86"
      />
      <path
        d="M180 204V490"
        stroke="color-mix(in srgb, var(--text) 14%, black 86%)"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M182 182C174 190 170 201 170 214C170 225 174 234 180 240C186 234 190 225 190 214C190 201 186 190 182 182Z"
        fill="#0e090b"
      />
      <path
        d="M171 207C175 204 185 204 189 207"
        stroke="color-mix(in srgb, var(--token) 82%, white 18%)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M210 198C222 164 234 126 240 84C242 66 242 48 238 32"
        stroke="color-mix(in srgb, var(--text) 22%, black 78%)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <ellipse
        cx="207"
        cy="202"
        rx="10"
        ry="4"
        fill="color-mix(in srgb, var(--text) 28%, black 72%)"
        opacity="0.46"
        transform="rotate(-78 207 202)"
      />
      <path
        d="M122 292C104 346 108 402 132 448"
        stroke="url(#cloth-edge)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M238 292C256 346 252 402 228 448"
        stroke="url(#cloth-edge)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M154 432C130 454 110 474 98 500C120 496 142 484 162 464"
        fill="url(#ronin-fill)"
        opacity="0.94"
      />
      <path
        d="M206 432C230 454 250 474 262 500C240 496 218 484 198 464"
        fill="url(#ronin-fill)"
        opacity="0.94"
      />
      <path
        d="M134 406C112 430 92 452 76 486C100 482 126 462 150 438"
        fill="url(#ronin-fill)"
        opacity="0.88"
      />
      <path
        d="M226 406C248 430 268 452 284 486C260 482 234 462 210 438"
        fill="url(#ronin-fill)"
        opacity="0.88"
      />
      <path
        d="M174 470C166 514 166 558 174 620"
        stroke="color-mix(in srgb, var(--text) 10%, black 90%)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.42"
      />
      <path
        d="M186 470C194 514 194 558 186 620"
        stroke="color-mix(in srgb, var(--text) 10%, black 90%)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.38"
      />
    </g>

    <g opacity="0.92">
      <circle
        cx="94"
        cy="108"
        r="4.5"
        fill="color-mix(in srgb, var(--token) 60%, white 40%)"
      />
      <circle
        cx="124"
        cy="82"
        r="3.5"
        fill="color-mix(in srgb, var(--token) 58%, white 42%)"
      />
      <circle
        cx="284"
        cy="108"
        r="4.5"
        fill="color-mix(in srgb, var(--token) 60%, white 40%)"
      />
      <circle
        cx="256"
        cy="86"
        r="3.5"
        fill="color-mix(in srgb, var(--token) 58%, white 42%)"
      />
      <circle
        cx="118"
        cy="316"
        r="4.5"
        fill="color-mix(in srgb, var(--token) 56%, white 44%)"
      />
      <circle
        cx="250"
        cy="336"
        r="3.5"
        fill="color-mix(in srgb, var(--token) 58%, white 42%)"
      />
      <circle
        cx="96"
        cy="538"
        r="5"
        fill="color-mix(in srgb, var(--token) 54%, white 46%)"
      />
      <circle
        cx="272"
        cy="560"
        r="4"
        fill="color-mix(in srgb, var(--token) 56%, white 44%)"
      />
      <circle
        cx="172"
        cy="548"
        r="5.5"
        fill="color-mix(in srgb, var(--token) 52%, white 48%)"
      />
    </g>
  </svg>
);
