/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState, useRef, useCallback } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { marketContext } from "../../contexts/marketContext";

import Item from "./Item";
import { getMarketBooks, getUpcomingEvents } from "../../apis";

/* eslint-disable react/prop-types */
const Event = ({ show }) => {
  const [upcomingMarkets, setUpcomingMarkets] = useState([]);
  const { market, setMarket } = useContext(marketContext);
  const [events, setEvents] = useState();
  const SHOW = show ? show : 4;

  let marketRef = useRef();

  useEffect(() => {
    marketRef.current = market;
  }, [market]);

  const getEvents = useCallback(async () => {
    const resp = await getUpcomingEvents({
      type: "WIN",
    });
    if (resp?.success) {
      const data = resp.data.sort((a, b) => {
        if (
          new Date(a?.markets[0].startTime).getTime() >
          new Date(b?.markets[0].startTime).getTime()
        )
          return 1;
        else return -1;
      });
      setEvents(data);
    }
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const getUpcomingMarkets = async () => {
    if (!events || (events && events.length === 0)) {
      // setUpcomingMarkets (undefined)
      return;
    }
    let tmp = [];
    events.map((item) => {
      item?.markets.map((m, idx) => {
        m["raceNum"] = idx + 1;
        tmp.push(m);
      });
    });
    tmp = tmp
      .sort((a, b) => {
        if (new Date(a.startTime).getTime() < new Date(b.startTime).getTime())
          return -1;
        else return 1;
      })
      .filter((a) => new Date(a.startTime).getTime() > new Date().getTime())
      .slice(0, SHOW);
    let tmpUpcomingData = [];
    for (let m of tmp) {
      const resp = await getMarketBooks({
        marketId: m.marketId,
      });
      let totalMatched = 0;
      let marketPercent = 0;
      let runnerLen = 0;
      if (resp.success) {
        totalMatched = Number(resp.data.totalMatched);
        marketPercent = Number(resp.data.marketPercent).toFixed(2);
        runnerLen = resp.data.runnerLen;
      }
      tmpUpcomingData.push({
        totalMatched: totalMatched,
        marketPercent: marketPercent,
        runnerLen: runnerLen,
        startTime: m.startTime,
        venue: m.venue,
        racenum: m.raceNum.toString(),
        marketId: m.marketId,
        venuename: m.venue + " R" + m.raceNum.toString(),
      });
    }
    if (tmpUpcomingData.length > 0) {
      if (!marketRef.current) {
        setMarket({
          marketId: tmpUpcomingData[0]["marketId"],
          venue: tmpUpcomingData[0]["venue"],
          racenum: tmpUpcomingData[0]["racenum"],
        });
      }
      setUpcomingMarkets(tmpUpcomingData);
    } else {
      setUpcomingMarkets(undefined);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await getUpcomingMarkets();
    }, 30000);
    return () => clearInterval(interval);
  }, [events]);

  useEffect(() => {
    getUpcomingMarkets();
  }, [events]);

  useEffect(() => {
    marketRef.current = market;
  }, [market]);

  if (typeof upcomingMarkets === "object") {
    return (
      <>
        {upcomingMarkets.map((item, idx) => (
          <Item
            key={idx}
            venue={`${item["venuename"]}`}
            pool={item["totalMatched"]}
            percent={item["marketPercent"]}
            runners={item["runnerLen"]}
            startTime={item["startTime"]}
            marketId={item["marketId"]}
          />
        ))}
        {upcomingMarkets.length === 0 &&
          Array.from({ length: SHOW }).map((item, idx) => (
            <div
              key={idx}
              className="p-5 w-full bg-grey-4 rounded-[10px] border border-grey-2 cursor-pointer h-[162px]"
            >
              <Skeleton
                baseColor="#F9FAFB"
                style={{ height: "100%" }}
                highlightColor="#D9D9D9"
              />
            </div>
          ))}
      </>
    );
  } else return null;
};

export default Event;
