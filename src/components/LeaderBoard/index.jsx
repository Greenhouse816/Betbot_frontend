/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from 'react'

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import DropDown from "../DropDown";
import TrackDropDown from "../DropDown/TrackDropDown";
import SearchableDropDown from "../DropDown/SearchableDropDown";

import { getLeaderboards, getTrainersInBoard, getJockeysInBoard, getHorsesInBoard } from "../../apis";

const SORT_FIELD = {
    NAME: 'name',
    WIN_PERCENT: 'winPercent',
    AVG_BSPW: 'averageBspw',
    WIN_ROI: 'winRoi',
    PLACE_PERCENT: 'placePercent',
    AVG_BSPP: 'averageBspp',
    PLACE_ROI: 'placeRoi',
    FINISH_PERCENT: 'finishPercent',
    AVG: 'average',
    TOTAL: 'total'
}

const LeaderBoard = ({kind}) => {

    const initialValue = {
        jockey: "ALL JOCKEYS",
        trainer: "ALL TRAINERS",
        horse: "ALL HORSES",
        track: ["Australia", "ALL"],
        condition: "ALL CONDITIONS",
        distance: "ALL DISTANCES",
        start: kind === "horse" ? "Last 50" : "Last 500",
    };

    let jockeys = new Set([initialValue["jockey"]]),
        horses = new Set([initialValue["horse"]]),
        trainers = new Set([initialValue["trainer"]]),
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

    const [filterObj, setFilter] = useState(initialValue);
    const [records, setRecords] = useState ()
    const [trainernames, setTrainernames] = useState ()
    const [jockeynames, setJockeyNames] = useState ()
    const [horsenames, setHorseNames] = useState ()
    const [data, setData] = useState ()

    const [page, setPage] = useState (0)
    const [loadingMore, setLoadingMore] = useState (false)
    const [loading, setLoading] = useState (false)
    const [sortedCol, setSortedCol] = useState (SORT_FIELD.TOTAL)
    const [sortDirection, setSortDirection] = useState(1)
    const [searchStr, setSearchStr] = useState ({})
    
    const setValue = (val) => {
        setData (undefined)
        let [kind, value] = val;
        let tmp = { ...filterObj };
        tmp[kind] = value;
        setFilter(tmp);
    };

    jockeynames && jockeynames.map ((jockey) => {jockeys.add(jockey)})
    horsenames && horsenames.map ((horse) => {horses.add(horse)})
    trainernames && trainernames.map ((trainer) => {trainers.add(trainer)})

    const initialize = useCallback(async() => {
        setLoading (true)
        setRecords ([])
        const tmpRecords = await getLeaderboards (filterObj, kind, page, sortedCol, sortDirection)
        setRecords (tmpRecords)
        setLoading (false)
    }, [filterObj, kind, sortedCol, sortDirection])

    useEffect (()=>{
        initialize ()
    }, [initialize])

    const loadMore = useCallback(async() => {
        if (page === 0) return
        setLoading (true)
        setLoadingMore (true)
        const tmpRecords = await getLeaderboards (filterObj, kind, page, sortedCol, sortDirection)
        if (tmpRecords.length > 0) setRecords ([...records, ...tmpRecords])
        setLoadingMore (false)
        setLoading (false)
    }, [page])

    useEffect (() => {
        loadMore ()
    }, [loadMore])

    useEffect (() => {
        const delayFn = setTimeout(async() => {
            const {k, v} = searchStr
            if (k && k !== "trainer") return
            setTrainernames([initialValue["trainer"]])
            const tmpTrainers = await getTrainersInBoard(v ? v : "")
            setTrainernames (tmpTrainers)
        }, 300)
        return () => clearTimeout(delayFn);
    }, [searchStr])

    useEffect (() => {
        const delayFn = setTimeout(async() => {
            const {k, v} = searchStr
            if (k && k !== "jockey") return
            setJockeyNames([initialValue["jockey"]])
            const tmpJockeys = await getJockeysInBoard(v ? v : "")
            setJockeyNames (tmpJockeys)
        }, 300)
        return () => clearTimeout(delayFn);
    }, [searchStr])

    useEffect (() => {
        const delayFn = setTimeout(async() => {
            const {k, v} = searchStr
            if (k && k !== "horse") return
            setHorseNames([initialValue["horse"]])
            const tmpHorses = await getHorsesInBoard(v ? v : "")
            setHorseNames (tmpHorses)
        }, 300)
        return () => clearTimeout(delayFn);
    }, [searchStr])

    const onLoadMoreClick = () => {
        if (loading) return
        setPage (page + 1)
    }

    useEffect (() => {
        setData (records)
    }, [records])

    return (
        <div className="p-[16px] 2xl:p-[58px] 4xl:p-[112px] bg-white min-w-[1024px]">
            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-12 bg-grey-4 border border-grey-2 rounded-[10px]">
                    <div className="grid grid-cols-12 col-span-12">
                        <div className="flex flex-row items-center col-span-2 text-2xl font-bold leading-6 py-6 px-5 w-full">
                            {kind === "trainer" ? "Trainers" : kind === "jockey" ? "Jockeys" : "Horses"}
                        </div>
                        <div className="col-span-10 grid grid-cols-12 gap-2 px-5 py-6">
                            {
                                (kind === "trainer" || kind === "horse") &&
                                <div className="col-span-2 flex flex-row items-center justify-center">
                                    <SearchableDropDown
                                        btnStr={initialValue["jockey"]}
                                        data={jockeys}
                                        kind="jockey"
                                        setValue={(val) => setValue(val)}
                                        setSearch={(val) => setSearchStr (val)}
                                    />
                                </div>
                            }
                            {
                                (kind === "jockey" || kind === "horse") &&
                                <div className="col-span-2 flex flex-row items-center justify-center">
                                    <SearchableDropDown
                                        btnStr={initialValue["trainer"]}
                                        data={trainers}
                                        kind="trainer"
                                        setValue={(val) => setValue(val)}
                                        setSearch={(val) => setSearchStr (val)}
                                    />
                                </div>
                            }
                            { kind !== "horse" &&
                                <div className="col-span-2 flex flex-row items-center justify-center">
                                    <SearchableDropDown
                                        btnStr={initialValue["horse"]}
                                        data={horses}
                                        kind="horse"
                                        setValue={(val) => setValue(val)}
                                        setSearch={(val) => setSearchStr (val)}
                                    />
                                </div>
                            }
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
                </div>
                <div className="flex flex-col bg-grey-4 border border-grey-2 rounded-[10px]">
                    <div className="grid grid-cols-11">
                        <div
                            className="racehistory-header-start col-span-2 px-5 cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.NAME)
                                setSortDirection(sortedCol !== SORT_FIELD.NAME ? true : !sortDirection)
                            }}
                        >
                            Name {sortedCol === SORT_FIELD.NAME ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                        <div
                            className="racehistory-header cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.WIN_PERCENT)
                                setSortDirection(sortedCol !== SORT_FIELD.WIN_PERCENT ? true : !sortDirection)
                            }}
                        >
                            Win %  {sortedCol === SORT_FIELD.WIN_PERCENT ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                        <div
                            className="racehistory-header cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.AVG_BSPW)
                                setSortDirection(sortedCol !== SORT_FIELD.AVG_BSPW ? true : !sortDirection)
                            }}
                        >
                            AVG BSP / W  {sortedCol === SORT_FIELD.AVG_BSPW ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                        <div
                            className="racehistory-header cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.WIN_ROI)
                                setSortDirection(sortedCol !== SORT_FIELD.WIN_ROI ? true : !sortDirection)
                            }}
                        >
                                Win ROI  {sortedCol === SORT_FIELD.WIN_ROI ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                        <div 
                            className="racehistory-header cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.PLACE_PERCENT)
                                setSortDirection(sortedCol !== SORT_FIELD.PLACE_PERCENT ? true : !sortDirection)
                            }}
                        >
                            Place % {sortedCol === SORT_FIELD.PLACE_PERCENT ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                        <div
                            className="racehistory-header cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.AVG_BSPP)
                                setSortDirection(sortedCol !== SORT_FIELD.AVG_BSPP ? true : !sortDirection)
                            }}
                        >
                            AVG BSP / P {sortedCol === SORT_FIELD.AVG_BSPP ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                        <div
                            className="racehistory-header cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.PLACE_ROI)
                                setSortDirection(sortedCol !== SORT_FIELD.PLACE_ROI ? true : !sortDirection)
                            }}
                        >
                            Place ROI {sortedCol === SORT_FIELD.PLACE_ROI ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                        <div
                            className="racehistory-header cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.FINISH_PERCENT)
                                setSortDirection(sortedCol !== SORT_FIELD.FINISH_PERCENT ? true : !sortDirection)
                            }}
                        >
                            Finish %  {sortedCol === SORT_FIELD.FINISH_PERCENT ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                        <div
                            className="racehistory-header cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.AVG)
                                setSortDirection(sortedCol !== SORT_FIELD.AVG ? true : !sortDirection)
                            }}
                        >
                            AVG $ {sortedCol === SORT_FIELD.AVG ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                        <div
                            className="racehistory-header cursor-pointer"
                            onClick={() => {
                                setSortedCol(SORT_FIELD.TOTAL)
                                setSortDirection(sortedCol !== SORT_FIELD.TOTAL ? true : !sortDirection)
                            }}
                        >
                            Total $ {sortedCol === SORT_FIELD.TOTAL ? (!sortDirection ? '↑' : '↓') : ''}
                        </div>
                    </div>
                    {
                        data && data.length > 0 && data.map ((t, idx) => 
                        <div  key={idx} className="grid grid-cols-11 border-t border-grey-2">
                            <a
                                className="racehistory-item-start text-link col-span-2 px-5"
                                href={`/${kind}/au/${t["id"]}`}
                            >
                                {t?.name}
                            </a>
                            <div className="racehistory-item text-black-2">
                                {t?.winPercent}
                            </div>
                            <div className="racehistory-item text-black-2">
                                0
                            </div>
                            <div className="racehistory-item text-black-2">
                                0
                            </div>
                            <div className="racehistory-item text-black-2">
                                {t?.placePercent}
                            </div>
                            <div className="racehistory-item text-black-2">
                                0
                            </div>
                            <div className="racehistory-item text-black-2">
                                0
                            </div>
                            <div className="racehistory-item text-black-2">
                                {t?.finishPercent}
                            </div>
                            <div className="racehistory-item text-black-2">
                                {t?.average}
                            </div>
                            <div className="racehistory-item text-black-2">
                                {t?.total}
                            </div>
                        </div>
                        )
                    }
                    {
                        (!data || (data && data.length === 0)) && Array.from({length: 20}).map((item, idx) => 
                            <div key={idx} className="pt-1 pb-3 px-2 w-full h-full border-t border-grey-2 self-center">
                                <Skeleton
                                baseColor="#EAECF0"
                                style={{ height: "100%" }}
                                highlightColor="#D9D9D9"
                                />
                            </div>
                        )
                    }
                </div>
                <button 
                    className='flex flex-row items-center justify-center bg-grey-4 border border-grey-2 rounded-[10px] text-sm text-blue-1 h-12 text-center cursor-pointer' 
                    disabled={loadingMore}
                    onClick={onLoadMoreClick}
                >
                    {!loadingMore && "Load More"}
                    {loadingMore && <FontAwesomeIcon icon={faSpinner} size="xl" className="animate-spin" />}
                </button>
            </div>
        </div>
    );
};

export default LeaderBoard;
