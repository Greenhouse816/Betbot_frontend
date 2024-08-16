import { useContext, useCallback, useEffect, useState, useRef } from 'react'
import clsx from 'clsx';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// import successSvg from '../../assets/success.svg'
// import uploadSvg from '../../assets/upload.svg'

import { marketContext } from '../../contexts/marketContext'
import { clockContext } from '../../contexts/clockContext'
import { getRunnersInfo } from '../../apis'

const RaceTable = () => {
    
    const {market} = useContext(marketContext)
    const {clock} = useContext(clockContext)
    const [runners, setRunners] = useState ([])
    const [loading, setLoading] = useState (0) // 0: loading, -1: no display data, 1: display data

    let marketRef = useRef ()

    useEffect (() => {
        marketRef.current = market
    }, [market])

    const initialize = useCallback(async() => {
        if (marketRef.current === undefined) { return}
        if (marketRef.current?.marketId === undefined) {return}
        if (marketRef.current?.marketId.length === 0) {return}
        setLoading (0)
        const resp = await getRunnersInfo(marketRef.current?.marketId)
        if (!resp) setLoading (-1)
        if (resp.success) {
            setRunners (resp.data)
        } else {
            setLoading (-1)
        }
    }, [marketRef.current])

    useEffect(() => {
        initialize ()
    }, [initialize])

    useEffect (() => {
        async function fetchRunners(){
            if (marketRef.current === undefined) {return}
            if (marketRef.current?.marketId === undefined) {return}
            if (marketRef.current?.marketId.length === 0) {return}
            const resp = await getRunnersInfo(marketRef.current?.marketId)
            if (!resp) return
            if (resp.success) {
                setRunners (resp.data)
            } else {
                return
            }
        }
        fetchRunners ()
    }, [clock])

    useEffect(() => {
        if (runners.length > 0) setLoading (1)
    }, [runners])

    return (
        <div className={clsx(`grid grid-flow-row ${loading===0?"bg-pink-1":"bg-grey-2"} border rounded-[10px] gap-[1px] w-full`)}>
            <div className="p-5 grid grid-cols-2 bg-pink-1 rounded-t-[10px]">
                <div className="text-black-2 text-xl leading-6 font-bold">{market?.venue}</div>
                {/* <div className="flex flex-row items-center justify-end gap-2 ">
                    <div className="text-blue-1 text-base font-normal cursor-pointer">flemington-r5.csv</div>
                    <img src={successSvg} className='w-6 h-6' />
                    <div className='cursor-pointer'><img src={uploadSvg} className='w-6 h-6' /></div>
                </div> */}
            </div>
            <div className='grid grid-flow-row gap-[1px]'>
                <div className='race-table-header'>
                    <div className='race-table-header-item-1'>Silk</div>
                    <div className='race-table-header-item-1'>Num</div>
                    <div className='race-table-header-item-2'>Form Data</div>
                    <div className='race-table-header-item-2'>Framed Odds</div>
                    <div className='race-table-header-item-2'>BSP</div>
                    <div className='race-table-header-item-2'>Odds Diff%</div>
                    <div className='race-table-header-item-2'>Contender</div>
                    <div className='race-table-header-item-2'>Combined</div>
                </div>
                {loading === 1 &&
                    <div className='race-table-body'>{
                        runners.slice(0, runners.length - 1).map ((item, idx) =>
                            <div className='race-table-row' key={idx}>
                                <div className='race-table-col-1'>
                                    <img src={`https://content.betfair.com.au/feeds_images/Horses/SilkColours/${item?.file}`} className='w-[26px] h-[21px]' />
                                </div>
                                <div className='race-table-col-1'>{item.clothNum}</div>
                                <div className='race-table-col-2'>0</div>
                                <div className='race-table-col-2'>$0</div>
                                <div className='race-table-col-2'>{`$${item?.betfairOdds}`}</div>
                                <div className='race-table-col-2'>0%</div>
                                <div className='race-table-col-2'>0</div>
                                <div className='race-table-col-2'>0</div>
                            </div>
                        )}
                        <div className='race-table-row'>
                            <div className='race-table-col-1 rounded-bl-[10px]'>
                                <img src={`https://content.betfair.com.au/feeds_images/Horses/SilkColours/${runners[runners.length - 1]?.file}`} className='w-[26px] h-[21px]' />
                            </div>
                            <div className='race-table-col-1'>{runners[runners.length - 1]?.clothNum}</div>
                            <div className='race-table-col-2'>0</div>
                            <div className='race-table-col-2'>$0</div>
                            <div className='race-table-col-2'>{`$${runners[runners.length - 1]?.betfairOdds}`}</div>
                            <div className='race-table-col-2'>0%</div>
                            <div className='race-table-col-2'>0</div>
                            <div className='race-table-col-2 rounded-br-[10px]'>0</div>
                        </div>
                    </div>
                }{ loading === 0 &&
                    <div className='race-table-body text-2xl p-5 mx-auto w-full h-[300px]'>
                        <Skeleton
                                baseColor="#EAECF0"
                                style={{ height: "100%" }}
                                highlightColor="#D9D9D9"
                        />
                    </div>
                }{ loading === -1 &&
                    <div className='race-table-body text-grey-2 text-2xl py-5 mx-auto h-[300px]'>No display data</div>
                }
            </div>
        </div>
    )
}

export default RaceTable