/**
 * Discord's loading spinner.
 */

const CAPTURED_SPINNER_HTML = `<span class="spinner__46696 spinner__48b20" role="img" aria-label="Carregando"><span class="inner__46696 wanderingCubes__46696"><span class="item__46696"></span><span class="item__46696"></span></span></span>`;

const CAPTURED_SPINNER_CSS = `.inner__46696, .spinner__46696 { align-items: center; justify-content: center; }
.inner__46696 { contain: paint; display: inline-flex; height: 32px; position: relative; width: 32px; }
.wanderingCubes__46696 .item__46696 { background-color: var(--brand-400); height: 10px; left: 0px; position: absolute; top: 0px; width: 10px; }
.app-focused .wanderingCubes__46696 .item__46696 { animation: 1.8s ease-in-out 0s infinite normal none running spinner-wandering-cubes__46696; }
.app-focused .wanderingCubes__46696 .item__46696:last-child { animation-delay: -0.9s; }
.chasingDots__46696 .item__46696 { background-color: var(--brand-500); border-radius: 100%; display: inline-block; height: 60%; position: absolute; top: 0px; width: 60%; }
.chasingDots__46696 .item__46696:last-child { bottom: 0px; top: auto; }
.app-focused .chasingDots__46696 .item__46696 { animation: 2s ease-in-out 0s infinite normal none running spinner-chasing-dots-bounce__46696; }
.app-focused .chasingDots__46696 .item__46696:last-child { animation-delay: -1s; }
.pulsingEllipsis__46696 .item__46696 { background-color: var(--primary-100); border-radius: 3px; display: inline-block; height: 6px; margin-right: 2px; opacity: 0.3; width: 6px; }
.app-focused .pulsingEllipsis__46696 .item__46696 { animation: 1.4s ease-in-out 0s infinite normal none running spinner-pulsing-ellipsis__46696; }
.app-focused .pulsingEllipsis__46696 .item__46696:nth-of-type(2) { animation-delay: 0.2s; }
.app-focused .pulsingEllipsis__46696 .item__46696:nth-of-type(3) { animation-delay: 0.4s; }
.lowMotion__46696 .item__46696 { background-color: var(--interactive-text-default); border-radius: 3px; display: inline-block; height: 6px; margin-right: 2px; opacity: 0.3; width: 6px; }
.app-focused .lowMotion__46696 .item__46696 { animation: 1.4s ease-in-out 0s infinite normal none running spinner-low-motion__46696; }
.app-focused .lowMotion__46696 .item__46696:nth-of-type(2) { animation-delay: 0.2s; }
.app-focused .lowMotion__46696 .item__46696:nth-of-type(3) { animation-delay: 0.4s; }
.app-focused .stop-animation .pulsingEllipsis__46696 .item__46696 { animation: auto ease 0s 1 normal none running none; }
.app-focused .stopAnimation__46696 .chasingDots__46696, .app-focused .stopAnimation__46696 .circular__46696, .app-focused .stopAnimation__46696 .item__46696, .app-focused .stopAnimation__46696 .path__46696 { animation: auto ease 0s 1 normal none running none; }
@keyframes spinner-wandering-cubes__46696 { 
  25% { transform: translateX(22px) rotate(-90deg) scale(0.5); }
  50% { transform: translateX(22px) translateY(22px) rotate(-180deg); }
  75% { transform: translateX(0px) translateY(22px) rotate(-270deg) scale(0.5); }
  100% { transform: rotate(-1turn); }
}

.wanderingCubes__46696 .item__46696 {
  animation: 1.8s ease-in-out 0s infinite normal none running spinner-wandering-cubes__46696;
}
.wanderingCubes__46696 .item__46696:last-child { animation-delay: -0.9s; }`;
