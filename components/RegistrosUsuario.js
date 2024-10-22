"use client"

import ImageNext from "next/image"

export const RegistrosUsuario = ({ imgUsurioUrl, firmaUrl }) => {



    return (

        <div
            className="border-2 border-[#1f242b] shadow-2xl rounded-xl"
        >
            <div className="flex flex-col b bg-gradient-to-t from-[#2e3133] to-[#202020] p-3 rounded-t-md">

                <ImageNext
                    width={300}
                    height={300}
                    src={imgUsurioUrl}
                    alt="foto_usuario"
                    className="w-full object-cover aspect-square rounded-full border-2 border-white p-1"
                    priority
                />
            </div>

            <div
                className="rounded-b-xl"
            >
                <ImageNext
                    width={300}
                    height={210}
                    src={firmaUrl}
                    alt="firma_usuario"
                    className="w-full object-cover rounded-b-xl"
                    priority
                />
            </div>
        </div>
    )
}
