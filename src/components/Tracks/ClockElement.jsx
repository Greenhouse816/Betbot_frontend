/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import clsx from "clsx";

import { useContext, useState, useEffect, useRef } from "react";
import { clockContext } from "../../contexts/clockContext";

const ClockElement = ({ market }) => {
  const { clock } = useContext(clockContext);
  const [[h, m], setTime] = useState(["0", "0"]);
  const clockFlg = useRef(false);

  let tmpH, tmpM;
  useEffect(() => {
    const delta = (new Date(market.startTime) - clock) / 1000;
    if (delta < 3600) clockFlg.current = true;
    else clockFlg.current = false;
    if (clockFlg.current) {
      tmpH = parseInt(delta / 3600);
      tmpM = parseInt((delta - tmpH * 3600) / 60);
      setTime([tmpH.toString(), tmpM.toString()]);
    } else {
      let date = new Date(market.startTime);

      // Extract hours and minutes, then format them
      tmpH = String(date.getHours()).padStart(2, "0");
      tmpM = String(date.getMinutes()).padStart(2, "0");
      setTime([tmpH, tmpM]);
    }
  }, [market.startTime, clock]);

  return (
    <span
      className={clsx(
        `cursor-pointer ${
          clockFlg.current === true ? "text-green-2" : "text-black-2"
        }`
      )}
    >
      {clockFlg.current === true
        ? Number(h) > 0
          ? `${h}h ${m}m`
          : `${m}m`
        : `${h}:${m}`}
    </span>
  );
};

export default ClockElement;
