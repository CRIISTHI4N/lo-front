"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import axios from "axios"

export default function CreacionUsuarios() {

    const [cedula, setCedula] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [nombre, setNombre] = useState('');
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [tipo, setTipo] = useState('');
    const [alerta, setAlerta] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([cedula, correo, telefono, nombre, user, pass, tipo].includes('')) {
            alert('Porfavor, Lena todos los campos')
            return;
        }

        try {

            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_URI}/api/user/registrar`, {
                nombre: nombre,
                user: user,
                pass: pass,
                tipo: tipo
            })

            setAlerta(data.msg)

        } catch (e) { console.log(e) }

        setCedula('');
        setCorreo('');
        setTelefono('');
        setNombre('');
        setUser('');
        setPass('');
        setTipo('');

    }

    return (
        <MainLayout>

            <div className="px-6 py-5">
                <form
                    action="POST"
                    onSubmit={handleSubmit}
                    className='w-full'
                >

                    <h2 className='mb-5 text-xl'><b>Registro de Usuarios</b></h2>

                    <div className='flex flex-col gap-3'>

                        <div className='w-full relative'>
                            <input
                                type="text"
                                className='bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                                onChange={(e) => setCedula(e.target.value)}
                                maxLength={10}
                            />
                            <span className='absolute left-2 top-6 text-gray-500 text-[10px]'><b>Cedula</b></span>
                        </div>

                        <div className='w-full relative'>
                            <input
                                type="text"
                                className='bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                            <span className='absolute left-2 top-6 text-gray-500 text-[10px]'><b>Correo</b></span>
                        </div>

                        <div className='w-full relative'>
                            <input
                                type="text"
                                className='bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                            <span className='absolute left-2 top-6 text-gray-500 text-[10px]'><b>Teléfono</b></span>
                        </div>

                        <div className='w-full relative'>
                            <input
                                type="text"
                                className='bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            <span className='absolute left-2 top-6 text-gray-500 text-[10px]'><b>Nombres y Apellidos</b></span>
                        </div>

                        <div className='w-full relative'>
                            <input
                                type="text"
                                className='bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                                onChange={(e) => setUser(e.target.value)}
                            />
                            <span className='absolute left-2 top-6 text-gray-500 text-[10px]'><b>Usuario</b></span>
                        </div>

                        <div className='w-full relative'>
                            <input
                                type="text"
                                className='bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                                onChange={(e) => setPass(e.target.value)}
                            />
                            <span className='absolute left-2 top-6 text-gray-500 text-[10px]'><b>Contraseña</b></span>
                        </div>

                        <div className='w-full relative'>
                            <select
                                id="tipo-usuario"
                                className='bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <option value="">Seleccionar Tipo Usuario</option>
                                <option value="super admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="personal">Personal</option>
                            </select>
                            <span className='absolute left-2 top-6 text-gray-500 text-[10px]'><b>Tipo de Usuario</b></span>
                        </div>
                    </div>

                    {/* cedula, correo electronico y numero de telefono */}

                    {/* <h2 className='my-3'>Permisos</h2>

                    <div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id="libro-obra" name='libro-obra' />
                            <label htmlFor="libro-obra">Libro Obra</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id="biometrico" name='biometrico' />
                            <label htmlFor="biometrico">Biometrico</label>
                        </div>
                    </div> */}

                    {
                        alerta &&
                        <p
                            className='text-red-700 mt-3'
                        >
                            {alerta}
                        </p>
                    }

                    <button
                        type='submit'
                        className={`text-white bg-blue-900 rounded-md p-1 hover:bg-blue-700 my-7 transition-colors px-7 w-full md:w-auto `}
                    >
                        Crear
                    </button>

                </form>
            </div>
        </MainLayout>

    )
}
