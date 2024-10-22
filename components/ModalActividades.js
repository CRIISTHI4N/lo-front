'use client'

import { useState } from "react";
import useUsuario from "@/hooks/useUsuario"
import axios from "axios";

export default function ModalActividades() {

    const [nombreActividad, setNombreActividad] = useState('')

    const {
        changeModalActividades
    } = useUsuario();

    const controlModal = () => {
        //setEditar(false)
        changeModalActividades()
        //setStockState({})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const as = await axios.post(`${process.env.NEXT_PUBLIC_URI}/api/actividades/ingresar`, {
                nombreActividad
            })

            console.log(as);


            changeModalActividades();

        } catch (error) {
            console.log(error.message);
        }

    }

    return (
        <>
            <div className="py-10 px-5 border-b border-gray-300">
                <div className="text-center">
                    <button onClick={controlModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-red-100 hover:bg-red-600 hover:text-white p-1 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <span className="block text-center text-2xl">Agregrar Actividad</span>
            </div>

            <form
                className="py-10 px-12 bg-[#F1F1F1]"
                onSubmit={handleSubmit}
            >
                <div className="mb-3">
                    <label
                        className="block mb-3"
                        htmlFor="nombre"
                    >
                        Nombre:
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        onChange={(e) => setNombreActividad(e.target.value)}
                    />
                </div>

                <div
                    className="flex gap-5"
                >
                    <button
                        type="submit"
                        className="bg-[#3f94b9] rounded-md p-2 hover:bg-[#3d7e9a] font-bold"
                    >
                        Agregar
                    </button>

                    <button
                        type="button"
                        onClick={controlModal}
                        className="cursor-pointer bg-[#ff6347] rounded-md p-2 hover:bg-[#d6553e] font-bold"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </>
    )
}
