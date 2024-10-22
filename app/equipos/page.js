'use client'

import { MainLayout } from "@/components/MainLayout"

export default function Equipos() {
    return (
        <MainLayout>
            <h1 className="text-xl my-5">Equipo:</h1>

            <div
                className="flex gap-5 mb-5"
            >
                <label
                    htmlFor="equipos_almacenados"
                >
                    Nombre:
                </label>

                <input
                    type="text"
                />

            </div>
        </MainLayout>
    )
}
