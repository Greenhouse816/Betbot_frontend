import { useCallback, useEffect, useState } from "react";

import clsx from "clsx";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import DropDown from "../../components/DropDown";
import TrackDropDown from "../../components/DropDown/TrackDropDown";
import HorseSVG from "../../assets/horse.svg";
import SilkSVG from "../../assets/silk.svg";

import { getRaces } from "../../apis";
import { formattedNum, getDateObj } from "../../utils";
import { START_FILTER_CNT, TRACKS, CLASS_POINT } from "../../constants";

const KEY_NAME = {
  jockey: "jockey_name",
  trainer: "trainer_name",
  horse: "horse_name",
  condition: "track_condition",
  track: "track_name",
  distance: "distance",
};

const Profile = ({ kind, id }) => {
  const [races, setRaces] = useState([]);
  const [homeRace, setHomeRace] = useState();
  const [sum, setSum] = useState();

  const initialValue = {
    jockey: "ALL JOCKEYS",
    trainer: "ALL TRAINERS",
    horse: "ALL HORSES",
    track: ["Australia", "ALL"],
    condition: "ALL CONDITIONS",
    distance: "ALL DISTANCES",
    start: kind === "horse" ? "Last 50" : "Last 500",
    start: kind === "horse" ? "Last 50" : "Last 500",
  };

  const [filterObj, setFilter] = useState(initialValue);
  const [data, setData] = useState([]);

  let jockeys = new Set([initialValue["jockey"]]),
    horses = new Set([initialValue["horse"]]),
    trainers = new Set([initialValue["trainer"]]),
    // tracks = new Set([initialValue["track"]]),
    conditions = new Set([
      initialValue["condition"],
      "Firm",
      "Synthetic",
      "Good",
      "Heavy",
      "Soft",
    ]),
    distances = new Set([
      initialValue["distance"],
      "1000 - 1200",
      "1300 - 1600",
      "1800 - 2200",
      "2400+",
    ]),
    starts = new Set([
      "Last 100",
      "Last 200",
      "Last 500",
      "Last 1000",
      "Last 2000",
      "Last 5000",
      "This Season",
      "Last Season",
    ]);
  if (kind === "horse")
    starts = new Set([
      "Last 10",
      "Last 20",
      "Last 50",
      "Last 100",
      "This Season",
      "Last Season",
    ]);

  races.map((item) => {
    if (item["jockey_name"].length > 0) jockeys.add(item["jockey_name"]);
    if (item["horse_name"].length > 0) horses.add(item["horse_name"]);
    if (item["trainer_name"].length > 0) trainers.add(item["trainer_name"]);
    // if (item["track_name"].length > 0) tracks.add(item["track_name"]);
    if (item["track_condition"].length > 0)
      conditions.add(item["track_condition"]);
  });

  const initialize = useCallback(async () => {
    const tmp = await getRaces(kind, id);
    setRaces(tmp);
    if (tmp.length > 0) setHomeRace(tmp[0]);
  }, [id, kind]);

  useEffect(() => {
    let tmpSum = { Synthetic: 0, Firm: 0, Good: 0, Soft: 0, Heavy: 0 };

    for (let item of data) {
      if ("sumLast600" in tmpSum) {
        if (parseFloat(item["last_600"]) >= 0)
          tmpSum["sumLast600"] += item["last_600"];
      } else {
        if (parseFloat(item["last_600"]) >= 0)
          tmpSum["sumLast600"] = item["last_600"];
      }

      if ("sumSpeed" in tmpSum) {
        if (parseFloat(item["speed"]) >= 0) tmpSum["sumSpeed"] += item["speed"];
      } else {
        if (parseFloat(item["speed"]) >= 0) tmpSum["sumSpeed"] = item["speed"];
      }

      if ("sumFinishPercent" in tmpSum) {
        if (parseFloat(item["finish_percentage"]) >= 0)
          tmpSum["sumFinishPercent"] += item["finish_percentage"];
      } else {
        if (parseFloat(item["finish_percentage"]) >= 0)
          tmpSum["sumFinishPercent"] = item["finish_percentage"];
      }

      if ("sumWinPercent" in tmpSum) {
        if (parseFloat(item["win_percentage"]) >= 0)
          tmpSum["sumWinPercent"] += item["win_percentage"];
      } else {
        if (parseFloat(item["win_percentage"]) >= 0)
          tmpSum["sumWinPercent"] = item["win_percentage"];
      }

      if ("sumPlacePercent" in tmpSum) {
        if (parseFloat(item["place_percentage"]) >= 0)
          tmpSum["sumPlacePercent"] += item["place_percentage"];
      } else {
        if (parseFloat(item["place_percentage"]) >= 0)
          tmpSum["sumPlacePercent"] = item["place_percentage"];
      }

      if ("sumPrize" in tmpSum) {
        if (parseFloat(item["horse_prizemoney"]) >= 0)
          tmpSum["sumPrize"] += item["horse_prizemoney"];
      } else {
        if (parseFloat(item["horse_prizemoney"]) >= 0)
          tmpSum["sumPrize"] = item["horse_prizemoney"];
      }

      if ("sumSettling" in tmpSum) {
        if (parseFloat(item["settling"]) >= 0)
          tmpSum["sumSettling"] += item["settling"];
      } else {
        if (parseFloat(item["settling"]) >= 0)
          tmpSum["sumSettling"] = item["settling"];
      }

      if (item["track_condition"] === "Good") tmpSum["Good"] += 1;

      if (item["track_condition"] === "Synthetic") tmpSum["Synthetic"] += 1;

      if (item["track_condition"] === "Firm") tmpSum["Firm"] += 1;

      if (item["track_condition"] === "Soft") tmpSum["Soft"] += 1;

      if (item["track_condition"] === "Heavy") tmpSum["Heavy"] += 1;
    }
    console.log("=>>>=tmpSum===", tmpSum["Good"]);
    console.log("=>>>=Daata.length===", data.length);
    setSum(tmpSum);
  }, [data]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const setValue = (val) => {
    let [kind, value] = val;
    let tmp = { ...filterObj };
    tmp[kind] = value;
    setFilter(tmp);
  };

  useEffect(() => {
    let realFilter = {};
    for (let key of Object.keys(filterObj)) {
      if (key === "track") continue;
      if (filterObj[key].startsWith("ALL ") === false) {
        realFilter[key] = filterObj[key];
      }
    }
    let tmpData = races.filter((race) => {
      for (let key of Object.keys(realFilter)) {
        if (key === "start" || key === "track") continue;
        if (key !== "distance" && realFilter[key] !== race[KEY_NAME[key]])
          return false;
        if (key === "distance") {
          if (realFilter[key] === "1000 - 1200")
            if (race[KEY_NAME[key]] < 1000 || race[KEY_NAME[key]] > 1200)
              return false;
          if (realFilter[key] === "1300 - 1600")
            if (race[KEY_NAME[key]] < 1300 || race[KEY_NAME[key]] > 1600)
              return false;
          if (realFilter[key] === "1800 - 2200")
            if (race[KEY_NAME[key]] < 1800 || race[KEY_NAME[key]] > 2200)
              return false;
          if (realFilter[key] === "2400+")
            if (race[KEY_NAME[key]] < 2400) return false;
        }
      }
      return true;
    });
    if (filterObj["track"]) {
      const [trackKey, trackValue] = filterObj["track"];
      let tracks = { ...TRACKS };
      if (trackKey !== "Australia") {
        let tmpTrackAll = [
          ...tracks[trackKey]["METRO"],
          ...tracks[trackKey]["PROVINCIAL"],
          ...tracks[trackKey]["COUNTRY"],
        ];
        tracks[trackKey]["ALL"] = tmpTrackAll;
        tmpData = tmpData.filter((race) => {
          return tracks[trackKey][trackValue].includes(
            race["track_name"].toUpperCase()
          );
        });
      }
    }
    if (
      realFilter["start"] !== "This Season" &&
      realFilter["start"] !== "Last Season"
    )
      tmpData = tmpData.slice(
        0,
        Math.min(tmpData.length, START_FILTER_CNT[realFilter["start"]])
      );
    else {
      if (realFilter["start"] === "This Season") {
        tmpData = tmpData.filter((race) => {
          if (
            Date.now() <
            new Date(new Date().getFullYear().toString() + "-08-01")
          )
            if (
              getDateObj(race["date"]) >
              new Date((new Date().getFullYear() - 1).toString() + "-07-31")
            )
              return true;
            else return false;
          else if (
            getDateObj(race["date"]) >
            new Date(new Date().getFullYear().toString() + "-08-01")
          )
            return true;
          else return false;
        });
      } else if (realFilter["start"] === "Last Season") {
        tmpData = tmpData.filter((race) => {
          if (
            Date.now() <
            new Date(new Date().getFullYear().toString() + "-08-01")
          )
            if (
              getDateObj(race["date"]) >
                new Date(
                  (new Date().getFullYear() - 2).toString() + "-07-31"
                ) &&
              getDateObj(race["date"]) <
                new Date((new Date().getFullYear() - 1).toString() + "-08-01")
            )
              return true;
            else return false;
          else if (
            getDateObj(race["date"]) >
              new Date((new Date().getFullYear() - 1).toString() + "-07-31") &&
            getDateObj(race["date"]) <
              new Date(new Date().getFullYear().toString() + "-08-01")
          )
            return true;
          else return false;
        });
      }
    }
    console.log("=>>>tmpData.lenght===", tmpData.length, "=tmpData==", tmpData);
    setData(tmpData);
  }, [filterObj, races]);

  return (
    <div className="p-[16px] 2xl:p-[58px] 4xl:p-[112px] bg-white min-w-[1440px]">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-12 bg-grey-4 border border-grey-2 rounded-[10px]">
          <div className="grid grid-cols-12 col-span-12 border-b border-grey-2">
            {homeRace ? (
              <div className="flex flex-row items-center col-span-2 text-2xl font-bold leading-6 py-6 px-5 w-full">
                {kind === "horse" && homeRace && homeRace["horse_name"]}
                {kind === "trainer" && homeRace && homeRace["trainer_name"]}
                {kind === "jockey" && homeRace && homeRace["jockey_name"]}
              </div>
            ) : (
              <div className="col-span-2 h-[30px] w-[200px] px-5 self-center">
                <Skeleton
                  baseColor="#EAECF0"
                  style={{ height: "100%" }}
                  highlightColor="#D9D9D9"
                />
              </div>
            )}
            <div className="col-span-10 grid grid-cols-12 gap-2 px-5 py-6">
              {kind === "horse" && (
                <>
                  <div className="col-span-2 flex flex-row items-center justify-center">
                    <DropDown
                      btnStr={initialValue["jockey"]}
                      data={jockeys}
                      kind="jockey"
                      setValue={(val) => setValue(val)}
                    />
                  </div>
                  <div className="col-span-2 flex flex-row items-center justify-center">
                    <DropDown
                      btnStr={initialValue["trainer"]}
                      data={trainers}
                      kind="trainer"
                      setValue={(val) => setValue(val)}
                    />
                  </div>
                </>
              )}
              {kind === "trainer" && (
                <>
                  <div className="col-span-2 flex flex-row items-center justify-center">
                    <DropDown
                      btnStr={initialValue["jockey"]}
                      data={jockeys}
                      kind="jockey"
                      setValue={(val) => setValue(val)}
                    />
                  </div>
                  <div className="col-span-2 flex flex-row items-center justify-center">
                    <DropDown
                      btnStr={initialValue["horse"]}
                      data={horses}
                      kind="horse"
                      setValue={(val) => setValue(val)}
                    />
                  </div>
                </>
              )}

              {kind === "jockey" && (
                <>
                  <div className="col-span-2 flex flex-row items-center justify-center">
                    <DropDown
                      btnStr={initialValue["trainer"]}
                      data={trainers}
                      kind="trainer"
                      setValue={(val) => setValue(val)}
                    />
                  </div>
                  <div className="col-span-2 flex flex-row items-center justify-center">
                    <DropDown
                      btnStr={initialValue["horse"]}
                      data={horses}
                      kind="horse"
                      setValue={(val) => setValue(val)}
                    />
                  </div>
                </>
              )}
              <div className="col-span-2 flex flex-row items-center justify-center">
                <TrackDropDown
                  btnStr={initialValue["track"]}
                  kind="track"
                  setValue={(val) => setValue(val)}
                />
              </div>
              <div className="col-span-2 flex flex-row items-center justify-center">
                <DropDown
                  btnStr={initialValue["condition"]}
                  data={conditions}
                  kind="condition"
                  setValue={(val) => setValue(val)}
                />
              </div>
              <div className="col-span-2 flex flex-row items-center justify-center">
                <DropDown
                  btnStr={initialValue["distance"]}
                  data={distances}
                  kind="distance"
                  setValue={(val) => setValue(val)}
                />
              </div>
              <div className="col-span-2 flex flex-row items-center justify-center">
                <DropDown
                  btnStr={initialValue["start"]}
                  data={starts}
                  kind="start"
                  setValue={(val) => setValue(val)}
                />
              </div>
            </div>
          </div>
          {kind === "horse" && (
            <>
              <div className="grid grid-cols-12 grid-rows-2 col-span-12">
                <div className="row-span-2 col-span-1 flex flex-row items-center justify-center border border-grey-2">
                  <img src={HorseSVG} className="w-16 h-16" />
                </div>
                <div className="horse-header-black">Country</div>
                <div className="horse-header-black">Age</div>
                <div className="horse-header-black">Sex</div>
                <div className="horse-header-black">Home Track</div>
                <div className="horse-header-black">600m</div>
                <div className="horse-header-black">Speed</div>
                <div className="horse-header-black">Finish %</div>
                <div className="horse-header-black">Win %</div>
                <div className="horse-header-black">Place %</div>
                <div className="horse-header-black">AVG BSP / W</div>
                <div className="horse-header-black">ROI</div>

                {homeRace ? (
                  <div className="horse-item-normal-black">
                    {homeRace["horse_country"]}
                  </div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {homeRace ? (
                  <div className="horse-item-normal-black">
                    {`${homeRace["horse_age"]}yo`}
                  </div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {homeRace ? (
                  <div className="horse-item-normal-black">{`${homeRace["horse_sex"]}`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {homeRace ? (
                  <div className="horse-item-normal-black">
                    {homeRace["home_track_name"]}
                  </div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">
                    {(sum["sumLast600"] / data.length).toFixed(2)}
                  </div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    (sum["sumSpeed"] * 3.6) /
                    data.length
                  ).toFixed(2)}km/h`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    sum["sumFinishPercent"] / data.length
                  ).toFixed(2)}%`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    sum["sumWinPercent"] / data.length
                  ).toFixed(2)}%`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    sum["sumPlacePercent"] / data.length
                  ).toFixed(2)}%`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">$3.50</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton baseColor="#EAECF0" highlightColor="#D9D9D9" />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">$3.50</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton baseColor="#EAECF0" highlightColor="#D9D9D9" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-12 grid-rows-2 col-span-12">
                <div className="row-span-2 col-span-1 flex flex-row items-center justify-center border border-grey-2">
                  <img src={SilkSVG} className="w-16 h-16" />
                </div>
                <div className="horse-header-black">Sire</div>
                <div className="horse-header-black">Dam</div>
                <div className="horse-header-black">Trainer</div>
                <div className="horse-header-black">Total $</div>
                <div className="horse-header-black">AVG $</div>
                <div className="horse-header-black">Settling</div>
                <div className="horse-header-gray">Synthetic</div>
                <div className="horse-header-black">Firm</div>
                <div className="horse-header-green">Good</div>
                <div className="horse-header-yellow">Soft</div>
                <div className="horse-header-red">Heavy</div>
                {homeRace ? (
                  <div className="horse-item-normal-black">
                    {homeRace["sire_name"]}
                  </div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {homeRace ? (
                  <div className="horse-item-normal-black">
                    {homeRace["dam_name"]}
                  </div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {homeRace ? (
                  <div className="horse-item-normal-black">
                    <a
                      className="text-link"
                      href={`/trainer/au/${homeRace["trainer_id"]}`}
                    >
                      {homeRace["trainer_name"]}
                    </a>
                  </div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum ? (
                  <div className="horse-item-normal-black">{`$${formattedNum(
                    sum["sumPrize"],
                    false
                  )}`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`$${formattedNum(
                    (sum["sumPrize"] / data.length).toFixed(2),
                    false
                  )}`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    sum["sumSettling"] / data.length
                  ).toFixed(2)}%`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    (sum["Synthetic"] * 100) /
                    data.length
                  ).toFixed(2)}%`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    (sum["Firm"] * 100) /
                    data.length
                  ).toFixed(2)}%`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    (sum["Good"] * 100) /
                    data.length
                  ).toFixed(2)}%`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    (sum["Soft"] * 100) /
                    data.length
                  ).toFixed(2)}%`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
                {sum && data.length > 0 ? (
                  <div className="horse-item-normal-black">{`${(
                    (sum["Heavy"] * 100) /
                    data.length
                  ).toFixed(2)}%`}</div>
                ) : (
                  <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                    <Skeleton
                      baseColor="#EAECF0"
                      style={{ height: "100%" }}
                      highlightColor="#D9D9D9"
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {(kind === "trainer" || kind === "jockey") && (
            <div className="grid grid-cols-12 grid-rows-2 col-span-12">
              <div className="horse-header-black">Total $</div>
              <div className="horse-header-black">AVG $</div>
              <div className="horse-header-gray">Synthetic</div>
              <div className="horse-header-black">Firm</div>
              <div className="horse-header-green">Good</div>
              <div className="horse-header-yellow">Soft</div>
              <div className="horse-header-red">Heavy</div>
              <div className="horse-header-black">Finish %</div>
              <div className="horse-header-black">Win %</div>
              <div className="horse-header-black">Place %</div>
              <div className="horse-header-black">AVG BSP / W</div>
              <div className="horse-header-black">ROI</div>

              {sum ? (
                <div className="horse-item-normal-black">
                  {`$${formattedNum(sum["sumPrize"], false)}`}
                </div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data.length > 0 ? (
                <div className="horse-item-normal-black">
                  {`$${formattedNum(sum["sumPrize"] / data.length, false)}`}
                </div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data.length > 0 ? (
                <div className="horse-item-normal-black">{`${(
                  (sum["Synthetic"] * 100) /
                  data.length
                ).toFixed(2)}%`}</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data.length ? (
                <div className="horse-item-normal-black">{`${(
                  (sum["Firm"] * 100) /
                  data.length
                ).toFixed(2)}%`}</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data ? (
                <div className="horse-item-normal-black">{`${(
                  (sum["Good"] * 100) /
                  data.length
                ).toFixed(2)}%`}</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data ? (
                <div className="horse-item-normal-black">{`${(
                  (sum["Soft"] * 100) /
                  data.length
                ).toFixed(2)}%`}</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data ? (
                <div className="horse-item-normal-black">{`${(
                  (sum["Heavy"] * 100) /
                  data.length
                ).toFixed(2)}%`}</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data ? (
                <div className="horse-item-normal-black">{`${(
                  sum["sumFinishPercent"] / data.length
                ).toFixed(2)}%`}</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data ? (
                <div className="horse-item-normal-black">{`${(
                  sum["sumWinPercent"] / data.length
                ).toFixed(2)}%`}</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data ? (
                <div className="horse-item-normal-black">{`${(
                  sum["sumPlacePercent"] / data.length
                ).toFixed(2)}%`}</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              )}
              {sum && data ? (
                <div className="horse-item-normal-black">$3.50</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton baseColor="#EAECF0" highlightColor="#D9D9D9" />
                </div>
              )}
              {sum && data ? (
                <div className="horse-item-normal-black">$3.50</div>
              ) : (
                <div className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                  <Skeleton baseColor="#EAECF0" highlightColor="#D9D9D9" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col bg-grey-4 border border-grey-2 rounded-[10px]">
          <div className="grid grid-cols-24">
            <div className="racehistory-header">Date</div>
            <div className="racehistory-header-start col-span-3 px-5">
              {kind === "horse" && "Jockey"}
              {(kind === "jockey" || kind === "trainer") && "Horse"}
            </div>
            <div className="racehistory-header-start col-span-3 px-5">
              Track
            </div>
            <div className="racehistory-header">Race</div>
            <div className="racehistory-header">Starters</div>
            <div className="racehistory-header">Class</div>
            <div className="racehistory-header">Barrier</div>
            <div className="racehistory-header">Weight</div>
            <div className="racehistory-header">Settling %</div>
            <div className="racehistory-header">Condition</div>
            <div className="racehistory-header">Distance</div>
            <div className="racehistory-header">BSP / W</div>
            <div className="racehistory-header">BSP / P</div>
            <div className="racehistory-header">600m</div>
            <div className="racehistory-header">Finish</div>
            <div className="racehistory-header">Finish %</div>
            <div className="racehistory-header">Time</div>
            <div className="racehistory-header">km/h</div>
            <div className="racehistory-header">Margin</div>
            <div className="racehistory-header">$ Won</div>
          </div>
          {data && data.length > 0
            ? data.map((item, idx) => (
                <div
                  className="grid grid-cols-24 border-t border-grey-2"
                  key={idx}
                >
                  <div className="racehistory-item text-black-2">
                    {item["date"]}
                  </div>
                  <a
                    className="racehistory-item-start text-link col-span-3 px-5"
                    href={
                      kind === "horse"
                        ? `/jockey/au/${item["jockey_id"]}`
                        : `/horse/au/${item["horse_id"]}`
                    }
                  >
                    {kind === "horse" && item["jockey_name"]}
                    {(kind === "jockey" || kind === "trainer") &&
                      item["horse_name"]}
                  </a>
                  <div className="racehistory-item-start text-black-2 col-span-3 px-5">
                    {item["track_name"]}
                  </div>
                  <div className="racehistory-item text-black-2">
                    {item["race_num"]}
                  </div>
                  <div className="racehistory-item text-black-2">
                    {item["starters"]}
                  </div>
                  <div className="racehistory-item text-black-2">
                    {CLASS_POINT[item["class"]]
                      ? CLASS_POINT[item["class"]]
                      : item["class"]}
                  </div>
                  <div className="racehistory-item text-black-2">
                    {item["barrier"]}
                  </div>
                  <div className="racehistory-item text-black-2">
                    {item["weight"]}
                  </div>
                  <div className="racehistory-item text-black-2">{`${parseInt(
                    item["settling"]
                  )}`}</div>
                  <div
                    className={clsx(
                      `racehistory-item ${
                        item["track_condition"] === "Good"
                          ? "text-green-3"
                          : item["track_condition"] === "Soft"
                          ? "text-yellow-1"
                          : "text-red-1"
                      }`
                    )}
                  >
                    {item["track_condition"]}
                  </div>
                  <div className="racehistory-item text-black-2">
                    {Math.round(item["distance"] / 100) * 100}
                  </div>
                  <div className="racehistory-item text-black-2">$14.31</div>
                  <div className="racehistory-item text-black-2">$14.31</div>
                  <div className="racehistory-item text-black-2">
                    {item["last_600"] ? item["last_600"] : 34.51}
                  </div>
                  <div className="racehistory-item text-black-2">
                    {item["finish_number"]}
                  </div>
                  <div className="racehistory-item text-black-2">{`${parseInt(
                    item["finish_percentage"]
                  )}`}</div>
                  <div className="racehistory-item text-black-2">{`${parseInt(
                    item["time"] / 60
                  )
                    .toString()
                    .padStart(2, "0")}:${(parseInt(item["time"]) % 60)
                    .toString()
                    .padStart(2, "0")}`}</div>
                  <div className="racehistory-item text-black-2">{`${(
                    (item["speed"] * 3600) /
                    1000
                  ).toFixed(2)}`}</div>
                  <div className="racehistory-item text-black-2">
                    {item["margin"]}
                  </div>
                  <div className="racehistory-item text-black-2">{`$${formattedNum(
                    parseInt(item["horse_prizemoney"]),
                    false
                  )}`}</div>
                </div>
              ))
            : Array.from({ length: 20 }).map((item, idx) => (
                <div className="py-4 px-2 border-t border-grey-2" key={idx}>
                  <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: "100%" }}
                    highlightColor="#D9D9D9"
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
