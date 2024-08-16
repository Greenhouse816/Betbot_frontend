import clsx from 'clsx'

const PATHS = {
    TRAINER: "/board/trainer",
    JOCKEY: "/board/jockey",
    HORSE: "/board/horse",
    PREDICTOR: "/predictor"
}

const Header = () => {
    
    const active = 
        window.location.pathname === PATHS.PREDICTOR ? 0:
            window.location.pathname === PATHS.HORSE ? 1:
            window.location.pathname === PATHS.JOCKEY ? 2:
            window.location.pathname === PATHS.TRAINER ? 3: 4

    return (
        <div className="flex flex-row items-center justify-between bg-grey-4 border-b border-grey-2">
            <div className="flex flex-row px-12 gap-8 text-black-1 text-[16px]">
                <div className={clsx(`py-9 ${active === 0 && "border-b-[3px] border-blue-1"} cursor-pointer`)}>
                    <a href={PATHS.PREDICTOR}>Form Guide</a>
                </div>
                <div className={clsx(`py-9 ${active === 1 && "border-b-[3px] border-blue-1"} cursor-pointer`)}>
                    <a href={PATHS.HORSE}>Horses</a>
                </div>
                <div className={clsx(`py-9 ${active === 2 && "border-b-[3px] border-blue-1"} cursor-pointer`)}>
                    <a href={PATHS.JOCKEY}>Jockeys</a>
                </div>
                <div className={clsx(`py-9 ${active === 3 && "border-b-[3px] border-blue-1"} cursor-pointer`)}>
                    <a href={PATHS.TRAINER}>Trainers</a>
                </div>
            </div>
            <div className="flex flex-row px-8 py-[26px] text-[16px] gap-3">
                <button className="py-[10px] px-[18px] text-grey-2 rounded-lg">Login</button>
                <button className="py-[10px] px-[18px] text-white bg-blue-1 rounded-lg">Sign up</button>
            </div>
        </div>
    )
}

export default Header;