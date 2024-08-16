/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useCallback, useContext } from "react";
import { format } from "date-fns";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import clsx from "clsx";

import Datepicker from "../Datepicker";
import auFlag from "../../assets/flags/AU.svg";
import nzFlag from "../../assets/flags/NZ.svg";
import sgFlag from "../../assets/flags/SG.svg";
// import gbFlag from '../../assets/flags/GB.svg'

import { getEvents } from "../../apis";
import { eventsContext } from "../../contexts/eventsContext";
import { marketContext } from "../../contexts/marketContext";

import ClockElement from "./ClockElement";

const COUNTRY_FLAG = {
  AU: auFlag,
  NZ: nzFlag,
  SG: sgFlag,
};

const CONDITION_COLOR = {
  FIRM: "bg-purple-1",
  GOOD: "bg-green-3",
  SOFT: "bg-blue-1",
  HEAVY: "bg-red-4",
  SYNTHETIC: "bg-yellow-2",
  DEAD: "bg-gray-300",
};

const TracksForPlace = ({ setDate }) => {
  const [pWidth, setPWidth] = useState(0);
  const ref = useRef(null);
  const isClient = typeof window === "object";
  const { events, setEvents } = useContext(eventsContext);
  const { setMarket } = useContext(marketContext);

  const [startDate, setStartDate] = useState(new Date());
  const [maxEvents, setMaxEvents] = useState(0);
  const [loading, setLoading] = useState(false);

  const initialize = useCallback(async () => {
    setLoading(false);
    // eslint-disable-next-line no-undef
    const resp = await getEvents({
      date: format(startDate, "yyyy-MM-d"),
      type: "WIN",
    });
    setLoading(true);
    if (resp?.success) {
      let data = resp.data.sort((a, b) => {
        if (
          new Date(a?.markets[0].startTime).getTime() >
          new Date(b?.markets[0].startTime).getTime()
        )
          return 1;
        else return -1;
      });
      data = data.map((d) => {
        let tmpD = { ...d };
        const tmpMarkets = d.markets.map((market) => {
          let winners = [];
          let tmpMarket = { ...market };
          market.runners.map((runner) => {
            if (runner["status"] === "WINNER")
              winners.push(market["runnersId"][runner["selectionId"]]);
          });
          tmpMarket["winners"] = winners;
          return tmpMarket;
        });
        tmpD["markets"] = tmpMarkets;
        return tmpD;
      });
      setEvents(data);
      data.map((item) => {
        item?.markets.sort((a, b) => {
          if (new Date(a.startTime).getTime() < new Date(b.startTime).getTime())
            return -1;
          else return 1;
        });
      });
      const maxValue = Math.max(
        ...resp.data.map((item) => item?.markets.length)
      );
      setMaxEvents(maxValue);
    }
    setDate(startDate);
  }, [startDate]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    setPWidth(ref?.current?.offsetWidth);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return false;
    }
    function handleResize() {
      setPWidth(ref?.current?.offsetWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient, pWidth]);

  return (
    <div
      className="w-full grid grid-flow-row gap-[1px] bg-grey-4 rounded-[10px] border border-grey-2"
      ref={ref}
    >
      <div className="grid grid-cols-2 w-full p-8 bg-grey-4 rounded-tl-[10px]">
        {/* <div className=""> */}
        <Datepicker
          date={startDate}
          onChangeDate={(d) => {
            setStartDate(d);
          }}
        />
        {/* </div> */}
      </div>
      {events.length > 0 && loading && (
        <div
          className="w-full overflow-x-scroll"
          style={{ maxWidth: `${pWidth}px` }}
        >
          <div className="flex flex-row border-d border-grey-2 h-12">
            <div className="track-header" style={{ width: `${pWidth / 6}px` }}>
              Track
            </div>
            {Array.from({ length: maxEvents }).map((_, idx) => (
              <div
                className="track-header-item"
                style={{ width: `${pWidth / 12}px` }}
                key={idx}
              >{`R${idx + 1}`}</div>
            ))}
            {maxEvents <= 10 &&
              Array.from({ length: 10 - maxEvents }).map((idx) => (
                <div
                  key={idx}
                  className="track-header-item"
                  style={{ width: `${pWidth / 12}px` }}
                />
              ))}
          </div>
          {events.map((event, idx) =>
            <div
              key={`eventa${idx}`}
              className="flex flex-row border-d border-t border-grey-2"
            >
              <div
                className="track-body-header justify-between"
                style={{ width: `${pWidth / 6}px` }}
              >
                <div className="flex flex-row">
                  <img
                    src={COUNTRY_FLAG[event.countryCode.toUpperCase()]}
                    className="w-4 h-4 mr-[9px]"
                  />
                  {event.venue}
                </div>
                <div
                  className={clsx(
                    `flex flex-row items-center justify-center ${CONDITION_COLOR[event["condition"]]
                    } text-white rounded-md text-xs px-[13px] py-0.5 w-[55px] h-[24px]`
                  )}
                >
                  {event["condition"] === "SYNTHETIC"
                    ? "SYNTH"
                    : event["condition"]}
                </div>
              </div>
              {event?.markets.map((market, idx) => (
                <div
                  className={clsx(
                    `track-body-item hover:bg-grey-2 cursor-pointer`
                  )}
                  key={`eventb${idx}`}
                  style={{ width: `${pWidth / 12}px` }}
                  onClick={() => {
                    if (market.status == "Abandoned") {
                      alert("this market is Abandoned");
                    } else {
                      // if (new Date(market.startTime).getTime() >= new Date().getTime())
                      setMarket({
                        marketId: market.marketId,
                        venue: `${market.venue}`,
                        racenum: idx + 1,
                      });
                    }
                  }}
                >
                  {new Date(market.startTime).getTime() <
                    new Date().getTime() ? (
                    <span className="text-shadow-sm text-grey-1">
                      {market["winners"].length > 0
                        ? market["winners"].join(",")
                        : "$0"}
                    </span>
                  ) : (
                    // (<span className='text-shadow-sm shadow-green-600 text-green-1'>Closed</span>)
                    <ClockElement market={market} idx={idx} />
                  )}
                </div>
              ))}
              {maxEvents > 10 &&
                Array.from({ length: maxEvents - event?.markets.length }).map(
                  (idx) => (
                    <div
                      key={`eventc${idx}`}
                      className="track-body-item"
                      style={{ width: `${pWidth / 12}px` }}
                    />
                  )
                )}
              {maxEvents <= 10 &&
                Array.from({ length: 10 - event?.markets.length }).map(
                  (idx) => {
                    if (idx) {
                      return (
                        <div
                        key={`eventd${idx}`}
                        className="track-body-item"
                        style={{ width: `${pWidth / 12}px` }}
                      />
                      )
                    }
                  }
                )}
            </div>
          )}
        </div>
      )}
      {events.length == 0 && loading && (
        <div className="text-center text-2xl text-grey-2 py-5 h-[300px]">
          No displayed data.
        </div>
      )}
      {!loading && (
        <div className="text-center text-2xl p-5 h-[300px]">
          <Skeleton
            baseColor="#F9FAFB"
            style={{ height: "100%" }}
            highlightColor="#D9D9D9"
          />
        </div>
      )}
    </div>
  );
};

export default TracksForPlace;
