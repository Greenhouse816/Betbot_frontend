import { useEffect, useState, useContext } from "react"

import { marketContext } from "../../contexts/marketContext"
import { clockContext } from '../../contexts/clockContext';
import {formattedNum} from "../../utils"

/* eslint-disable react/prop-types */
const Item = ({marketId, venue, pool, percent, startTime}) => {
    const {setMarket} = useContext (marketContext)
    const {clock} = useContext (clockContext)
    const [[h,m,s], setTime] = useState([0,0])

    useEffect(() => {
        const interval = setInterval(() => {
            const delta = (new Date(startTime) - clock.current)/1000
            let tmpH = parseInt (delta/3600)
            let tmpM = parseInt ((delta - tmpH * 3600)/60)
            let tmpS = parseInt (delta % 60)
            setTime ([tmpH, tmpM, tmpS])
        }, [1000])
        return () => clearInterval(interval)
    }, [startTime, clock.current])

    return (
        <div className="p-5 w-full bg-grey-4 rounded-[10px] border border-grey-2 cursor-pointer" onClick={() => setMarket({marketId, venue})}>
            <div className="text-black-2 text-sm font-bold leading-6">{venue}</div>
            <div className="text-black-1 text-sm font-medium leading-6">{`Pool: $${formattedNum(parseInt(pool))}`}</div>
            <div className="text-black-1 text-sm font-medium leading-6">{`Market: ${parseInt(percent)}%`}</div>
            <div className="text-green-2 text-sm font-medium leading-6">
                {h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m` : `${s}s`}
            </div>
        </div>
    )
}

export default Item