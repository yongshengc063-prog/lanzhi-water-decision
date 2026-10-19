/**
 * 首页 Hero 水域场景
 * 纯 SVG + CSS 动画绘制，避免依赖外部图床；通过分层渐变、
 * 远山、河湾、反光与漂浮微粒营造接近 3D 渲染的通透水面。
 */
export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 980 640"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hz-sky" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#DDF3FA" />
          <stop offset="42%" stopColor="#BFEAF5" />
          <stop offset="72%" stopColor="#8FD3E8" />
          <stop offset="100%" stopColor="#5DBBD8" />
        </linearGradient>
        <radialGradient id="hz-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
          <stop offset="34%" stopColor="#FFF7D6" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#FFE9A8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FFE9A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hz-mtn-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FD0DF" />
          <stop offset="100%" stopColor="#BCE7EF" />
        </linearGradient>
        <linearGradient id="hz-mtn-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5FAFC2" />
          <stop offset="100%" stopColor="#8BD1DA" />
        </linearGradient>
        <linearGradient id="hz-bank-left" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#77C79A" />
          <stop offset="48%" stopColor="#3FA876" />
          <stop offset="100%" stopColor="#1E7F55" />
        </linearGradient>
        <linearGradient id="hz-bank-right" x1="0.4" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#69BE91" />
          <stop offset="55%" stopColor="#2F9769" />
          <stop offset="100%" stopColor="#186B49" />
        </linearGradient>
        <linearGradient id="hz-river" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#E8FBFF" stopOpacity="0.95" />
          <stop offset="22%" stopColor="#A8E9F5" />
          <stop offset="55%" stopColor="#4CC4DD" />
          <stop offset="100%" stopColor="#0E86AE" />
        </linearGradient>
        <linearGradient id="hz-river-deep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7FE3F0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#086A91" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="hz-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hz-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9BE3B9" />
          <stop offset="100%" stopColor="#2C9566" />
        </linearGradient>
        <filter id="hz-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="hz-soft-small" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <clipPath id="hz-river-clip">
          <path d="M556 258 C600 306 548 356 498 398 C432 452 380 520 352 640 L836 640 C748 528 700 462 678 400 C654 334 648 294 640 258 Z" />
        </clipPath>
      </defs>

      {/* 天空 */}
      <rect width="980" height="640" fill="url(#hz-sky)" />

      {/* 太阳光晕 */}
      <circle cx="726" cy="132" r="200" fill="url(#hz-sun)" />
      <circle cx="726" cy="132" r="46" fill="#FFFFFF" opacity="0.92" filter="url(#hz-soft-small)" />

      {/* 云层 */}
      <g opacity="0.5" filter="url(#hz-soft)">
        <ellipse cx="214" cy="112" rx="118" ry="22" fill="#FFFFFF" />
        <ellipse cx="292" cy="98" rx="72" ry="15" fill="#FFFFFF" />
        <ellipse cx="804" cy="196" rx="128" ry="18" fill="#FFFFFF" opacity="0.75" />
      </g>

      {/* 远山 */}
      <path
        d="M0 322 L92 244 L152 286 L232 196 L320 288 L404 226 L486 306 L560 258 L622 300 L700 232 L800 296 L892 236 L980 300 L980 640 L0 640 Z"
        fill="url(#hz-mtn-far)"
        opacity="0.55"
      />
      <path
        d="M0 356 L120 286 L206 338 L302 262 L392 340 L470 296 L556 356 L648 300 L748 358 L842 304 L916 350 L980 316 L980 640 L0 640 Z"
        fill="url(#hz-mtn-mid)"
        opacity="0.5"
      />

      {/* 左岸绿地 */}
      <path
        d="M0 344 C96 330 178 356 242 404 C302 450 336 520 352 640 L0 640 Z"
        fill="url(#hz-bank-left)"
      />
      <path
        d="M0 344 C96 330 178 356 242 404 C210 380 150 356 84 360 C56 362 26 368 0 376 Z"
        fill="#A7E4C0"
        opacity="0.55"
      />

      {/* 右岸绿地 */}
      <path
        d="M980 330 C888 318 812 352 748 408 C696 454 664 540 648 640 L980 640 Z"
        fill="url(#hz-bank-right)"
      />
      <path
        d="M980 330 C900 322 842 342 796 382 C852 356 916 352 980 362 Z"
        fill="#B7EBCB"
        opacity="0.5"
      />

      {/* 河道主体 */}
      <path
        d="M556 258 C600 306 548 356 498 398 C432 452 380 520 352 640 L836 640 C748 528 700 462 678 400 C654 334 648 294 640 258 Z"
        fill="url(#hz-river)"
      />
      <path
        d="M596 286 C614 336 552 390 512 436 C470 484 432 554 418 640 L520 640 C546 544 594 486 630 438 C666 390 654 332 640 276 Z"
        fill="url(#hz-river-deep)"
        opacity="0.42"
      />

      {/* 水面反光与波纹 */}
      <g clipPath="url(#hz-river-clip)">
        <path
          d="M610 280 C656 330 604 382 556 424 C498 476 448 544 428 640"
          stroke="url(#hz-shine)"
          strokeWidth="7"
          fill="none"
          opacity="0.62"
          filter="url(#hz-soft-small)"
        />
        <g stroke="#FFFFFF" strokeLinecap="round" fill="none" opacity="0.55">
          <path d="M548 336 C585 356 606 372 628 398" strokeWidth="2.2" />
          <path d="M512 394 C548 414 574 436 594 466" strokeWidth="2.6" opacity="0.8" />
          <path d="M470 462 C508 486 538 514 558 548" strokeWidth="3" opacity="0.7" />
          <path d="M424 540 C466 568 500 600 520 640" strokeWidth="3.4" opacity="0.55" />
          <path d="M640 314 C668 344 690 372 708 406" strokeWidth="2" opacity="0.5" />
          <path d="M606 372 C638 402 664 436 682 474" strokeWidth="2.4" opacity="0.45" />
        </g>
        <g stroke="#DFFAFF" strokeLinecap="round" fill="none" opacity="0.35">
          <path d="M516 356 C552 372 580 392 600 418" strokeWidth="1.4" />
          <path d="M482 420 C520 442 548 468 568 500" strokeWidth="1.6" />
          <path d="M446 496 C484 522 512 552 530 588" strokeWidth="1.8" />
          <path d="M660 356 C684 384 704 414 720 448" strokeWidth="1.4" />
        </g>
      </g>

      {/* 河岸边缘高光 */}
      <path
        d="M556 258 C600 306 548 356 498 398 C432 452 380 520 352 640"
        stroke="#E8FFF6"
        strokeWidth="2.4"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M640 258 C648 294 654 334 678 400 C700 462 748 528 836 640"
        stroke="#E8FFF6"
        strokeWidth="2.4"
        fill="none"
        opacity="0.5"
      />

      {/* 左侧芦苇与植物 */}
      <g opacity="0.9">
        <path d="M58 640 C64 560 58 512 44 470" stroke="#2B8A5D" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M96 640 C98 552 108 504 122 462" stroke="#24764F" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M140 640 C136 576 144 530 160 496" stroke="#32986A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M186 640 C184 586 192 552 206 522" stroke="#24764F" strokeWidth="3.6" fill="none" strokeLinecap="round" />
        <ellipse cx="43" cy="466" rx="7" ry="22" fill="#C99A5B" transform="rotate(-8 43 466)" />
        <ellipse cx="123" cy="458" rx="6.5" ry="20" fill="#D7AE6C" transform="rotate(7 123 458)" />
        <ellipse cx="161" cy="492" rx="6" ry="18" fill="#C99A5B" transform="rotate(-4 161 492)" />
        <path d="M206 522 C226 500 244 488 264 480 C246 508 228 524 206 536 Z" fill="url(#hz-leaf)" />
        <path d="M160 560 C186 542 208 534 230 532 C208 560 186 574 160 580 Z" fill="url(#hz-leaf)" opacity="0.9" />
      </g>

      {/* 右侧近岸植物 */}
      <g opacity="0.85">
        <path d="M900 640 C892 570 896 528 908 492" stroke="#1E7F55" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M938 640 C932 578 936 540 948 508" stroke="#2B8A5D" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M908 492 C930 470 952 462 972 460 C954 488 932 502 906 512 Z" fill="url(#hz-leaf)" />
        <ellipse cx="906" cy="488" rx="6" ry="19" fill="#D7AE6C" transform="rotate(6 906 488)" />
      </g>

      {/* 漂浮微粒 */}
      <g fill="#FFFFFF">
        <circle cx="300" cy="210" r="2.4" opacity="0.7" />
        <circle cx="388" cy="168" r="1.8" opacity="0.55" />
        <circle cx="844" cy="150" r="2.2" opacity="0.6" />
        <circle cx="906" cy="244" r="1.6" opacity="0.45" />
        <circle cx="254" cy="300" r="2" opacity="0.5" />
      </g>

      {/* 左下柔光，衔接文字区 */}
      <rect width="300" height="640" fill="#F4F9FC" opacity="0.06" />
    </svg>
  )
}
