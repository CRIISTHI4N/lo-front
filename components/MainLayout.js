import { SideBar } from "./SideBar"

export const MainLayout = ({ children }) => {
    return (
        <div
            className="w-screen h-screen flex"
        >
            <SideBar />

            <div
                className="bg-[#f5f7f9] w-full h-full overflow-y-scroll"
            >
                {children}
            </div>
        </div>
    )
}
