import Link from "next/link"
import Image from "next/image";
import { usePathname } from "next/navigation";
import useUsuario from "@/hooks/useUsuario";

export const SideBar = () => {

    const {
        cerrarSesion,
        changeNavBar,
        navBar,
        datosUsuario
    } = useUsuario();

    const pathname = usePathname();

    const navBarOp = () => {
        changeNavBar()
    }

    return (
        <nav className={`${navBar ? 'w-[75px]' : 'w-[250px]'} w-[250px] bg-white p-5 h-full`}>

            <div
                className="h-full flex flex-col justify-between"
            >
                <div>
                    <div
                        className="relative flex items-center gap-3 pb-3 border-b border-b-gray-300"
                    >

                        <div className="rounded-full w-10">
                            <img
                                src="img/CM-Icono.png"
                                alt=""
                                className="rounded-full w-full"
                            />
                        </div>

                        <div
                            className={`${navBar ? 'hidden' : 'flex flex-col text-[8px] text-center'}`}
                        >
                            <span className="text-gray-600">{datosUsuario?.nombre}</span>
                            <span className="text-black font-bold">{datosUsuario?.tipo}</span>
                            <span className="text-gray-600">Cemetsi</span>
                        </div>

                        <button
                            type="button"
                            className="absolute flex items-center justify-center w-6 h-6 bg-white right-[-35px] rounded-md border border-gray-300"
                            onClick={navBarOp}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${navBar ? 'rotate-0' : 'rotate-180'} size-3`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>

                        </button>

                    </div>

                    <Link
                        href="/inicio"
                        className={`relative flex gap-2 text-[12px] items-center mt-3 border-l-[2px] transition-colors hover:border-l-black hover:text-black ${pathname === "/inicio" ? 'border-l-black text-black' : 'text-gray-600 border-l-white'}`}
                    >
                        <div className="relative group p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                className={`size-4`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span className={`${navBar ? 'hidden group-hover:absolute group-hover:block group-hover:left-10 group-hover:top-1 group-hover:px-6 group-hover:py-1 z-10 bg-black group-hover:text-white group-hover:rounded-md' : 'hidden'} `}>Inicio</span>
                        </div>
                        <span className={`${navBar ? 'hidden ' : 'block'}`}>Inicio</span>
                    </Link>


                    <Link
                        href="/horario"
                        className={`flex gap-2 text-[12px] items-center mt-1 border-l-[2px] transition-colors hover:border-l-black hover:text-black ${pathname === "/horario" ? 'border-l-black text-black' : 'text-gray-600 border-l-white'}`}
                    >
                        <div className="relative group p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span className={`${navBar ? 'hidden group-hover:absolute group-hover:block group-hover:left-10 group-hover:top-1 group-hover:px-6 group-hover:py-1 z-10 bg-black group-hover:text-white group-hover:rounded-md' : 'hidden'} whitespace-nowrap`}>Entrada / Salida</span>
                        </div>
                        <span className={`${navBar ? 'hidden' : 'block'}`}>Entrada / Salida</span>
                    </Link>

                    {
                        datosUsuario.tipo === 'admin' &&
                        <Link
                            href="/libroobra"
                            className={`flex gap-2 text-[12px] items-center mt-1 border-l-[2px] transition-colors hover:border-l-black hover:text-black ${pathname === "/libroobra" ? 'border-l-black text-black' : 'text-gray-600 border-l-white'}`}
                        >
                            <div className="relative group p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                                <span className={`${navBar ? 'hidden group-hover:absolute group-hover:block group-hover:left-10 group-hover:top-1 group-hover:px-6 group-hover:py-1 z-10 bg-black group-hover:text-white group-hover:rounded-md' : 'hidden'} whitespace-nowrap`}>Libro Obra</span>
                            </div>
                            <span className={`${navBar ? 'hidden' : 'block'}`}>Libro Obra</span>
                        </Link>
                    }

                    <Link
                        href="/reporteria"
                        className={`flex gap-2 text-[12px] items-center mt-1 border-l-[2px] transition-colors hover:border-l-black hover:text-black ${pathname === "/reporteria" ? 'border-l-black text-black' : 'text-gray-600 border-l-white'}`}
                    >
                        <div className="relative group p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <span className={`${navBar ? 'hidden group-hover:absolute group-hover:block group-hover:left-10 group-hover:top-1 group-hover:px-6 group-hover:py-1 z-10 bg-black group-hover:text-white group-hover:rounded-md' : 'hidden'} `}>Reportería</span>
                        </div>
                        <span className={`${navBar ? 'hidden' : 'block'}`}>Reportería</span>
                    </Link>

                    <Link
                        href="/creacionusuarios"
                        className={`flex gap-2 text-[12px] items-center mt-1 border-l-[2px] transition-colors hover:border-l-black hover:text-black ${pathname === "/creacionusuarios" ? 'border-l-black text-black' : 'text-gray-600 border-l-white'}`}
                    >
                        <div className="relative group p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span className={`${navBar ? 'hidden group-hover:absolute group-hover:block group-hover:left-10 group-hover:top-1 group-hover:px-6 group-hover:py-1 z-10 bg-black group-hover:text-white group-hover:rounded-md' : 'hidden'} `}>Usuarios</span>
                        </div>

                        <span className={`${navBar ? 'hidden' : 'block'}`}>Usuarios</span>
                    </Link>
                </div>

                <div
                    className=""
                >
                    <Link
                        href="/soporte"
                        className={`flex gap-2 text-[12px] items-center border-l-[2px] transition-colors hover:border-l-black hover:text-black ${pathname === "/soporte" ? 'border-l-black text-black' : 'text-gray-600 border-l-white'}`}
                    >
                        <div className="relative group p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            <span className={`${navBar ? 'hidden group-hover:absolute group-hover:block group-hover:left-10 group-hover:top-1 group-hover:px-6 group-hover:py-1 z-10 bg-black group-hover:text-white group-hover:rounded-md' : 'hidden'} whitespace-nowrap`}>Soporte Técnico</span>

                        </div>
                        <span className={`${navBar ? 'hidden' : 'block'}`}>Soporte Técnico</span>
                    </Link>

                    <Link
                        href="/"
                        className="flex gap-2 text-[12px] border-l-white items-center mt-1 text-gray-600 border-l-[2px] transition-colors hover:border-l-black hover:text-black"
                        onClick={cerrarSesion}
                    >
                        <div className="relative group p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 rotate-[270deg]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <span className={`${navBar ? 'hidden group-hover:absolute group-hover:block group-hover:left-10 group-hover:top-1 group-hover:px-6 group-hover:py-1 z-10 bg-black group-hover:text-white group-hover:rounded-md' : 'hidden'} whitespace-nowrap`}>Cerrar Sesión</span>

                        </div>
                        <span className={`${navBar ? 'hidden' : 'block'}`}>Cerrar Sesión</span>
                    </Link>
                </div>

            </div>
        </nav>
    )
}