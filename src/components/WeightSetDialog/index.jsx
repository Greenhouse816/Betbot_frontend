import { useState, useEffect } from "react"

import {
    Dialog,
    Card,
    Slider,
    CardBody,
    slider,
} from "@material-tailwind/react";

import {
    getStatisticalWeights,
    updateStatisticalWeight,
} from "../../apis";
import { getDateString } from "../../utils";

import LoaderGif from "../../assets/gifs/loader.gif"

const WeightSetDialog = ({ toggle, toggleChange, sliderValue, setSliderValue, startDate, venue, raceNum,curData }) => {

    const [pending, setPending] = useState (false)

    useEffect(() => {
        setPending (true)
        if (!startDate) return;
        // If the dialog is supposed to be open, fetch or update the data
        if (toggle) {
            handleFetchData();
        } else {
            handleUpdateData ();
        }
    }, [toggle, startDate, venue, raceNum]);

    const handleFetchData = async () => {
        const strdata = await getStatisticalWeights(
            getDateString(startDate),
            venue,
            raceNum
        );

        if (strdata != null) {
            const data = JSON.parse(strdata);
            let tmpSliderValue = {};
            tmpSliderValue["horse_barrier"] = data["horse_barrier"];
            tmpSliderValue["weight"] = data["weight"];
            tmpSliderValue["class"] = data["class"];
            tmpSliderValue["average"] = data["average"];
            tmpSliderValue["finishPercent"] = data["finishPercent"];
            tmpSliderValue["winPercent"] = data["winPercent"];
            tmpSliderValue["placePercent"] = data["placePercent"];
            tmpSliderValue["condition"] = data["condition"];
            tmpSliderValue["distance"] = data["distance"];
            tmpSliderValue["track"] = data["track"];
            tmpSliderValue["jockey"] = data["jockey"];
            tmpSliderValue["trainer"] = data["trainer"];
            tmpSliderValue["settling"] = data["settling"];
            tmpSliderValue["last_600"] = data["last_600"];
            tmpSliderValue["speed"] = data["speed"];
            tmpSliderValue["lastFn"] = data["lastFn"];
            tmpSliderValue["lastMgn"] = data["lastMgn"];

            if (curData) { 
                console.log("curData = ", curData);
                let horseCnt = curData.horses.length;
                let sumConditionCnt = 0;
                let sumTrackCnt = 0;
                let sumDistanceCnt = 0;

                for (let i = 0; i < horseCnt; i++) { 
                    let horse = curData.horses[i];
                    if (horse.condition > 0) sumConditionCnt++;
                    if (horse.track > 0) sumTrackCnt++;
                    if (horse.distance > 0) sumDistanceCnt++;
                }
                if (sumConditionCnt > horseCnt / 2) {
                    tmpSliderValue["condition"] = 0.5;
                } else { 
                    tmpSliderValue["condition"] = 0;
                }
                if (sumDistanceCnt > horseCnt / 2) {
                    tmpSliderValue["distance"] = 0.5;
                } else { 
                    tmpSliderValue["distance"] = 0;
                }
                if (sumTrackCnt > horseCnt / 2) {
                    tmpSliderValue["track"] = 0.5;
                } else { 
                    tmpSliderValue["track"] = 0;
                }
            }
            setSliderValue(tmpSliderValue);
        }
        setPending (false)
    };

    const handleUpdateData = async() => {
        setPending (true)
        const statisticalwights = { ...sliderValue };
        await updateStatisticalWeight(
            getDateString(startDate),
            venue,
            raceNum,
            statisticalwights
        );
        setPending (false)
    }

    return (
        <Dialog
            size="md"
            open={toggle}
            handler={() => toggleChange(!toggle)}
            className="bg-transparent shadow-none mx-auto w-full"
        >
            <Card className="mx-auto w-full p-5 bg-grey-2">
                {
                    pending === false ?
                    <CardBody className="flex flex-col gap-4 bg-white h-[500px] overflow-y-auto">
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Barrier
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["horse_barrier"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        horse_barrier: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Weight
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["weight"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        weight: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Class
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["class"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        class: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                AVG$
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["average"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        average: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Finish
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["finishPercent"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        finishPercent: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Win
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["winPercent"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        winPercent: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Place
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["placePercent"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        placePercent: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Condition
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["condition"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        condition: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Distance
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["distance"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        distance: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Track
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["track"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        track: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Jockey
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["jockey"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        jockey: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Trainer
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["trainer"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        trainer: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Settling
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["settling"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        settling: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                600m
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["last_600"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        last_600: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Speed
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["speed"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        speed: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Lst/Fn
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["lastFn"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        lastFn: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-12 items-center justify-between">
                            <span className="col-span-2 text-black text-right text-xs font-semibold leading-4 mr-3">
                                Lst/Mgn
                            </span>
                            <Slider
                                className="col-span-10"
                                step={10}
                                min={0}
                                color="blue"
                                defaultValue={sliderValue["lastMgn"] * 100}
                                onChange={(e) =>
                                    setSliderValue({
                                        ...sliderValue,
                                        lastMgn: e.target.value / 100,
                                    })
                                }
                            />
                        </div>
                    </CardBody> : 
                    <div className="flex justify-center items-center h-[500px]">
                        {/* <img src={LoaderGif} className="w-16 h-16"/> */}
                        Loading ...
                    </div>
                }
            </Card>
        </Dialog>
    )
}

export default WeightSetDialog