import { Outlet } from "react-router-dom"

import Header from "./header";

const LeaderboardLayout = () => {
    return (
        <div className="w-full h-screen flex flex-col bg-white">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default LeaderboardLayout;