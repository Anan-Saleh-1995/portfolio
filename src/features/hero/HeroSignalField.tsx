import type { CSSProperties } from "react";
import styles from "./HeroSignalField.module.css";

type SignalStyle = CSSProperties & {
  "--signal-delay": string;
  "--signal-drift-x": string;
  "--signal-drift-y": string;
  "--signal-duration": string;
  "--signal-left": string;
  "--signal-opacity": string;
  "--signal-size": string;
  "--signal-top": string;
};

const SIGNALS: readonly SignalStyle[] = [
  {
    "--signal-left": "3%",
    "--signal-top": "12%",
    "--signal-size": "3px",
    "--signal-opacity": "0.72",
    "--signal-delay": "-1.2s",
    "--signal-duration": "9.8s",
    "--signal-drift-x": "10px",
    "--signal-drift-y": "-18px",
  },
  {
    "--signal-left": "13%",
    "--signal-top": "24%",
    "--signal-size": "4px",
    "--signal-opacity": "0.82",
    "--signal-delay": "-6.4s",
    "--signal-duration": "11.2s",
    "--signal-drift-x": "-8px",
    "--signal-drift-y": "-24px",
  },
  {
    "--signal-left": "21%",
    "--signal-top": "7%",
    "--signal-size": "2px",
    "--signal-opacity": "0.62",
    "--signal-delay": "-3.1s",
    "--signal-duration": "8.9s",
    "--signal-drift-x": "7px",
    "--signal-drift-y": "-15px",
  },
  {
    "--signal-left": "31%",
    "--signal-top": "34%",
    "--signal-size": "3px",
    "--signal-opacity": "0.76",
    "--signal-delay": "-8.1s",
    "--signal-duration": "12.6s",
    "--signal-drift-x": "11px",
    "--signal-drift-y": "-20px",
  },
  {
    "--signal-left": "43%",
    "--signal-top": "14%",
    "--signal-size": "2px",
    "--signal-opacity": "0.68",
    "--signal-delay": "-4.7s",
    "--signal-duration": "10.4s",
    "--signal-drift-x": "-9px",
    "--signal-drift-y": "-17px",
  },
  {
    "--signal-left": "53%",
    "--signal-top": "27%",
    "--signal-size": "4px",
    "--signal-opacity": "0.86",
    "--signal-delay": "-2.3s",
    "--signal-duration": "13.1s",
    "--signal-drift-x": "12px",
    "--signal-drift-y": "-27px",
  },
  {
    "--signal-left": "66%",
    "--signal-top": "9%",
    "--signal-size": "3px",
    "--signal-opacity": "0.78",
    "--signal-delay": "-7.5s",
    "--signal-duration": "10.9s",
    "--signal-drift-x": "-10px",
    "--signal-drift-y": "-19px",
  },
  {
    "--signal-left": "76%",
    "--signal-top": "37%",
    "--signal-size": "2px",
    "--signal-opacity": "0.66",
    "--signal-delay": "-5.4s",
    "--signal-duration": "9.5s",
    "--signal-drift-x": "8px",
    "--signal-drift-y": "-16px",
  },
  {
    "--signal-left": "88%",
    "--signal-top": "18%",
    "--signal-size": "4px",
    "--signal-opacity": "0.84",
    "--signal-delay": "-9.1s",
    "--signal-duration": "12.2s",
    "--signal-drift-x": "-12px",
    "--signal-drift-y": "-23px",
  },
  {
    "--signal-left": "96%",
    "--signal-top": "46%",
    "--signal-size": "3px",
    "--signal-opacity": "0.7",
    "--signal-delay": "-3.8s",
    "--signal-duration": "11.7s",
    "--signal-drift-x": "9px",
    "--signal-drift-y": "-21px",
  },
  {
    "--signal-left": "7%",
    "--signal-top": "58%",
    "--signal-size": "2px",
    "--signal-opacity": "0.64",
    "--signal-delay": "-6.9s",
    "--signal-duration": "9.2s",
    "--signal-drift-x": "-7px",
    "--signal-drift-y": "-18px",
  },
  {
    "--signal-left": "18%",
    "--signal-top": "73%",
    "--signal-size": "4px",
    "--signal-opacity": "0.8",
    "--signal-delay": "-2.6s",
    "--signal-duration": "12.8s",
    "--signal-drift-x": "12px",
    "--signal-drift-y": "-26px",
  },
  {
    "--signal-left": "29%",
    "--signal-top": "51%",
    "--signal-size": "3px",
    "--signal-opacity": "0.74",
    "--signal-delay": "-8.7s",
    "--signal-duration": "10.6s",
    "--signal-drift-x": "-11px",
    "--signal-drift-y": "-20px",
  },
  {
    "--signal-left": "39%",
    "--signal-top": "84%",
    "--signal-size": "2px",
    "--signal-opacity": "0.66",
    "--signal-delay": "-4.2s",
    "--signal-duration": "9.7s",
    "--signal-drift-x": "8px",
    "--signal-drift-y": "-15px",
  },
  {
    "--signal-left": "49%",
    "--signal-top": "64%",
    "--signal-size": "4px",
    "--signal-opacity": "0.88",
    "--signal-delay": "-7.2s",
    "--signal-duration": "13.4s",
    "--signal-drift-x": "-9px",
    "--signal-drift-y": "-28px",
  },
  {
    "--signal-left": "61%",
    "--signal-top": "78%",
    "--signal-size": "3px",
    "--signal-opacity": "0.76",
    "--signal-delay": "-1.8s",
    "--signal-duration": "10.1s",
    "--signal-drift-x": "11px",
    "--signal-drift-y": "-19px",
  },
  {
    "--signal-left": "72%",
    "--signal-top": "56%",
    "--signal-size": "2px",
    "--signal-opacity": "0.68",
    "--signal-delay": "-5.9s",
    "--signal-duration": "11.4s",
    "--signal-drift-x": "-8px",
    "--signal-drift-y": "-17px",
  },
  {
    "--signal-left": "82%",
    "--signal-top": "69%",
    "--signal-size": "4px",
    "--signal-opacity": "0.82",
    "--signal-delay": "-9.4s",
    "--signal-duration": "12.5s",
    "--signal-drift-x": "10px",
    "--signal-drift-y": "-24px",
  },
  {
    "--signal-left": "91%",
    "--signal-top": "87%",
    "--signal-size": "2px",
    "--signal-opacity": "0.62",
    "--signal-delay": "-3.4s",
    "--signal-duration": "9.3s",
    "--signal-drift-x": "-7px",
    "--signal-drift-y": "-16px",
  },
  {
    "--signal-left": "99%",
    "--signal-top": "62%",
    "--signal-size": "3px",
    "--signal-opacity": "0.72",
    "--signal-delay": "-6.1s",
    "--signal-duration": "10.8s",
    "--signal-drift-x": "9px",
    "--signal-drift-y": "-22px",
  },
];

export const HeroSignalField = () => (
  <div className={styles.field} aria-hidden="true">
    {SIGNALS.map((signalStyle, index) => (
      <span
        key={`hero-signal-${index + 1}`}
        className={styles.signal}
        style={signalStyle}
      />
    ))}
  </div>
);
