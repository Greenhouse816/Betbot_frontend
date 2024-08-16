/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Icon } from '@iconify/react'

const SearchableDropDown = ({btnStr, data, kind, setValue, setSearch}) => {
    const [selected, setSelected] = useState (false)
    const [width, setWidth] = useState (105)
    const [selectedVal, setSelectedVal] = useState (btnStr)
    const [inputVal, setInputVal] = useState ("")

    const wrapperRef = useRef(null);
    const searchInputRef = useRef(null);

    const handleClickOutside = (event) => {
        try {
            if (wrapperRef && !wrapperRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
                setSelected(false);
            }
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        setWidth (wrapperRef.current.offsetWidth)
    }, [wrapperRef.current]);

    const onChange = (val) => {
        setValue ([kind, val])
        setSelectedVal (val)
    }

    return (
        <div className="w-full">
            <button
                id="dropdownButton"
                data-dropdown-toggle="dropdown"
                className='text-black-2 w-full bg-white border border-grey-1 whitespace-nowrap text-ellipsis overflow-hidden font-medium rounded-md text-sm px-4 tracking-wide text-center inline-flex items-center justify-between leading-8'
                type="button"
                onClick={() => {
                    setSelected(!selected);
                }}
                ref={wrapperRef}
            >
                {selectedVal}
                <svg
                    className="w-2.5 h-2.5 ml-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="#6F6E84"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>
            <div
                id="dropdown"
                className={
                    selected
                        ? `z-20 bg-v3-primary border absolute border-primary divide-y divide-gray-100 rounded-lg shadow bg-gray-50 mt-[8px] overflow-y-auto max-h-[500px]`
                        : `hidden`
                }
                style={{ width: `${width}px` }}
            >
                <ul
                    className={`py-2 text-sm text-v3-primary font-medium dark:text-gray-200 px-2`}
                    aria-labelledby="dropdownButton"
                >
                    <input
                        type="search"
                        className="w-full px-2 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none"
                        placeholder="Search names..."
                        ref={searchInputRef}
                        value={inputVal}
                        onChange={(e) => {setInputVal(e.target.value); setSearch({k: kind, v:e.target.value})}}
                    />
                    {
                        data && Array.from(data).length > 0 && Array.from(data).map((item, idx) =>
                            <li key={idx} onClick={() => onChange(item)}>
                                <a className="flex flex-row items-center px-2 py-2 hover:bg-dropdown cursor-pointer">
                                    {item}
                                </a>
                            </li>
                        )
                    }
                    {
                        (!data || (data && Array.from(data).length <= 1)) &&
                        <div className="flex flex-row items-center justify-center text-gray-800"><Icon icon="eos-icons:three-dots-loading" style={{fontSize: 36}} /></div>
                    }
                </ul>
            </div>
        </div>
    )
}

export default SearchableDropDown