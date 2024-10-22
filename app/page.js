"use client"

import styles from "../styles/login.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useUsuario from '@/hooks/useUsuario';
import Image from 'next/image';
import axios from "axios";

export default function Home() {

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [alerta, setAlerta] = useState('')

  const router = useRouter();

  const { setDatosUsuario } = useUsuario();

  const handleLogin = async (e) => {
    e.preventDefault()

    try {

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_URI}/api/user/validar-usuario`, {
        user,
        pass
      })

      localStorage.setItem('user', JSON.stringify(data))
      router.push('/horario')
      setDatosUsuario(data)

    } catch (e) {
      setAlerta(e.response.data.msg)
    }

  }

  return (
    <div className='md:w-screen h-screen grid grid-cols-1 md:grid-rows-1 md:grid-cols-2'>

      <div className="relative flex justify-center items-center">
        <img src="/img/waves.svg" alt="" className="absolute z-10 top-0 rotate-180 md:hidden" />
        <div className='w-[70%] m-auto z-20' >
          <Image
            src={'img/LogoCemetsi.svg'}
            width={500}
            height={500}
            alt='logo'
          />
        </div>

        <div className="absolute  bg-[#1d2045] w-full h-full hidden md:block rounded-br-[500px]"></div>
      </div>

      <div className="relative">
        <form
          onSubmit={handleLogin}
          className="w-full px-14 pb-24 md:h-full md:flex flex-col justify-center"
        >

          <h2 className="text-[#142241] text-4xl mb-8">Bienvenido</h2>

          <div className="flex flex-col gap-5 mb-3">

            <input
              type="text"
              id="user"
              className="w-full rounded-full bg-[#f0f0f0] px-14 py-4 outline-none"
              onChange={e => setUser(e.target.value)}
              value={user}
              placeholder='Usuario'
            />

            <input
              type="password"
              id="usuario"
              className="w-full rounded-full bg-[#f0f0f0] px-14 py-4 outline-none"
              onChange={e => setPass(e.target.value)}
              value={pass}
              placeholder='Contraseña'
            />

          </div>

          <div className='flex gap-3'>
            <input type="checkbox" name="t_c" id="terminos_condiciones" />
            <label htmlFor="terminos_condiciones flex-1">Estoy de acuerdo con los Terminos y Condiciones de Pay & PlaY S.A.S.</label>
          </div>

          <input
            type="submit"
            value="INICIAR SESION"
            className="block rounded-full bg-[#1d2045] px-5 py-3 hover:bg-[#ff9600] font-bold text-white text-sm transition-colors m-auto mt-3 mb-6"
          />

          {alerta &&
            <p className='text-center text-red-800'>{alerta}</p>
          }

          <span className='block text-center mb-3'>Redes sociales</span>

          <div className='flex gap-3 justify-center'>
            <div className='w-14 h-14 bg-red-900 rounded-full'></div>
            <div className='w-14 h-14 bg-red-900 rounded-full'></div>
            <div className='w-14 h-14 bg-red-900 rounded-full'></div>
          </div>
        </form>

        <img src="/img/waves.svg" alt="" className="absolute bottom-0 w-full md:hidden" />
      </div>

    </div>
  );
}
