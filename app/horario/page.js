"use client"

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import useUsuario from '@/hooks/useUsuario';
import axios from 'axios';
import { format, startOfToday } from 'date-fns';
import { formatearFecha, formatearHora } from '@/helpers';

export default function Horario() {

    const [horaEcuador, setHoraEcuador] = useState('00:00:00');
    const [fechaActual, setFechaActual] = useState('');
    const [coordenadas, setCoordenadas] = useState('');
    const [estado, setEstado] = useState('');

    const {
        datosUsuario,
        setBiometrico,
        biometrico
    } = useUsuario();

    // const fetcherBiometrico = () => axios.get(`${process.env.NEXT_PUBLIC_URI}/api/biometrico/obtener-biometrico-usuario/${datosUsuario?._id}`).then(datos => datos.data)
    // const { data: dataBiometrico, error: errorBiometrico, isLoading: isLoadingBiometrico } = useSWR(`${process.env.NEXT_PUBLIC_URI}/api/biometrico/obtener-biometrico-usuario/${datosUsuario?._id}`, fetcherBiometrico, { refreshInterval: 500 })


    const mostrarUbicacion = (position) => {
        var latitud = position.coords.latitude;
        var longitud = position.coords.longitude;
        var ubicacionTexto = latitud + ", " + longitud;

        // Establecer el valor del input de texto con la ubicación
        setCoordenadas(ubicacionTexto);
    }

    const obtenerUbicacion = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(mostrarUbicacion);
        } else {
            alert("Geolocalización no es soportada por este navegador.");
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (coordenadas === '') {
            alert('Porfavor obten las coordenadas')
            return
        }

        const [horasEntrada, minutosEntrada] = horaEcuador.split(':').map(Number);
        const horaEntrada = new Date(startOfToday());
        horaEntrada.setHours(horasEntrada, minutosEntrada);

        try {

            await axios.post(`${process.env.NEXT_PUBLIC_URI}/api/biometrico/ingresar`, {
                idUsuario: datosUsuario._id,
                fechaBiometrico: new Date(fechaActual),
                horaBiometrico: horaEntrada.toISOString(),
                coordenadas,
                estado
            })

            const { data: bio } = await axios.get(`${process.env.NEXT_PUBLIC_URI}/api/biometrico/obtener-biometrico-usuario/${datosUsuario._id}`)
            setBiometrico(bio);
            setCoordenadas('');


        } catch (error) { }
    }

    useEffect(() => {

        if (datosUsuario._id) {
            const datosBiometrico = async () => {

                try {

                    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_URI}/api/biometrico/obtener-biometrico-usuario/${datosUsuario._id}`)
                    setBiometrico(data);

                } catch (error) { console.log(error) }
            }

            datosBiometrico();
        }

    }, [datosUsuario._id])

    useEffect(() => {
        const actualizarReloj = () => {
            const ahora = new Date();

            const opciones = {
                timeZone: 'America/Guayaquil',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };

            const horaFormateada = new Intl.DateTimeFormat('es-EC', opciones).format(ahora);
            setHoraEcuador(horaFormateada);
        };

        // Actualiza la hora cada segundo
        const intervalo = setInterval(actualizarReloj, 1000);

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        const obtenerFechaActual = () => {
            const hoy = new Date();

            // Obtener el año, mes y día en formato correcto
            const año = hoy.getFullYear();
            const mes = ('0' + (hoy.getMonth() + 1)).slice(-2); // Los meses van de 0 a 11
            const dia = ('0' + hoy.getDate()).slice(-2);

            // Formatear la fecha como "YYYY-MM-DD"
            const fechaFormateada = `${año}-${mes}-${dia}`;
            setFechaActual(fechaFormateada);
        };

        obtenerFechaActual();
    }, []);

    return (
        <MainLayout>
            <div className="flex flex-col md:flex-row md:justify-between h-full" >

                <div className='flex-1 py-5 px-8 order-2 md:order-1'>
                    <h2 className='mb-2 text-xl'><b> Informacion de Empleado</b></h2>

                    <div
                        className='bg-[#d7d8e3] rounded-md my-5 px-3 py-1 text-sm w-fit'
                    >
                        <p><b>Nombres y Apellidos: </b></p>

                        <span>{datosUsuario.nombre}</span>
                    </div>

                    <div className='border border-gray-700 rounded-md px-2 py-4'>
                        {
                            biometrico && biometrico.length ?
                                <table
                                    className='w-full text-sm p-5'
                                >
                                    {/* ${isLoading ? 'hidden' : 'table'} */}
                                    <thead>
                                        <tr>
                                            <th className='text-center'>FECHA DE REGISTRO</th>
                                            <th className='text-center'>HORA DE REGISTRO</th>
                                            <th className='text-center'>TIPO</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            biometrico.map(b =>
                                                <tr
                                                    key={b._id}
                                                    className='border-b border-b-gray-300 last-of-type:border-b-transparent'
                                                >
                                                    <td className='text-center'>{formatearFecha(b.fechaBiometrico)}</td>
                                                    <td className='text-center'>{formatearHora(b.horaBiometrico)}</td>
                                                    <td className='flex flex-col text-center py-3'>
                                                        <span>{b.estado}</span>
                                                        <span>{b.coordenadas}</span>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                                :
                                <p className='text-center text-sm uppercase'>Sin Registros</p>
                        }

                    </div>
                </div>

                <form
                    method="POST"
                    className='bg-[#e9e9e9] block px-6 py-7 w-full md:max-w-[300px] lg:max-w-[400px] h-full order-1 md:order-2'
                    onSubmit={handleSubmit}
                >
                    <h2 className='mb-2 text-xl'><b>Datos de Entrada y Salida</b></h2>

                    <span
                        id="reloj"
                        className="text-4xl font-bold block my-5"
                    >
                        {horaEcuador}
                    </span>


                    {/* <span className='text-sm'>Hora actual*</span> */}

                    <span className='text-[#d71818] font-bold block mb-3'>Registra tu Entrada/Salida. </span>

                    <div
                        className='flex gap-2'
                    >
                        <div className='w-full relative'>
                            <input
                                value={fechaActual}
                                type="date"
                                readOnly
                                className='bg-white w-full rounded-md px-1 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                            />
                            <span className='absolute left-2 top-6 text-gray-500 text-[10px]'><b>Fecha de registro</b></span>
                        </div>

                        <div className='w-full relative'>
                            <input
                                value={horaEcuador}
                                type="time"
                                readOnly
                                className='bg-white w-full rounded-md px-1 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                            />
                            <span className='absolute text-gray-500 left-2 top-6 text-[10px]'><b>Hora</b></span>
                        </div>
                    </div>

                    <div className='my-3 relative'>
                        <input
                            type="text"
                            value={coordenadas}
                            readOnly
                            className='bg-white w-full rounded-md px-1 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                        />
                        <span className='absolute left-2 text-gray-500 top-6 text-[10px]'><b>COORDENADAS</b></span>
                    </div>

                    <div
                        className='flex gap-2'
                    >
                        <button
                            type="submit"
                            className='bg-[#d31818] w-full rounded-md text-white py-1 hover:bg-black transition-colors'
                            onClick={() => setEstado('ENTRADA')}
                        >
                            Registrar Entrada
                        </button>



                        <button
                            type="submit"
                            className='bg-[#41f18a] w-full rounded-md text-white py-1 hover:bg-black transition-colors'
                            onClick={() => setEstado('SALIDA')}
                        >
                            Registrar Salida
                        </button>
                    </div>

                    <button
                        type='button'
                        onClick={obtenerUbicacion}
                        className='bg-[#ff9600] w-full mt-8 rounded-md text-white py-1 hover:bg-black transition-colors'
                    >
                        Obtener Ubicación
                    </button>
                </form>

            </div>
        </MainLayout>
    )
}
