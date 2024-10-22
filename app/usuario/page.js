"use client"

import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/MainLayout"
import { RegistrosUsuario } from "@/components/RegistrosUsuario";
import ImageNext from "next/image";
import axios from "axios";
import useSWR from "swr";
import useUsuario from "@/hooks/useUsuario";

export default function Usuario() {

    const [camara, setCamara] = useState(false);

    // Firma
    const canvasRef = useRef(null);
    const contextoRef = useRef(null);

    //Foto Desktop
    const video = useRef(null);
    const photo = useRef(null);
    const userPhoto = useRef(null);
    const contextoPhoto = useRef(null);

    //Foto Movil
    const imagenPhone = useRef(null);

    const { deviceType } = useUsuario();

    //Actualizacion en tiempo real
    const fetcher = () => axios(`${process.env.NEXT_PUBLIC_URI}/api/usuario/obtener-usuarios`).then(datos => datos.data)
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_URI}/api/usuario/obtener-usuarios`, fetcher, { refreshInterval: 100 })

    const limpiarCanvas = (e) => {

        e.preventDefault();
        const contexto = contextoRef.current;
        contexto.fillStyle = "white";
        contexto.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const limpiarForm = (e) => {

        limpiarCanvas(e);

        const contexto2 = contextoPhoto.current;
        contexto2.fillStyle = "white";
        contexto2.fillRect(0, 0, userPhoto.current.width, userPhoto.current.height);
    }

    const tomarFoto = async (e, dispositivo) => {

        e.preventDefault();

        const canvas = userPhoto.current;
        const contexto = userPhoto.current.getContext("2d");

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        canvas.width = width * 2;
        canvas.height = height * 2;

        contexto.scale(2, 2);
        contexto.fillRect(0, 0, width, height);

        if (dispositivo === "movil") {

            const file = imagenPhone.current.files[0];

            if (file) {

                const reader = new FileReader();

                reader.onload = (e) => {

                    const img = new Image();
                    img.src = e.target.result;

                    img.onload = () => {

                        contexto.drawImage(img, 0, 0, width, height); // Dibujar la imagen en el canvas
                    };
                };

                reader.readAsDataURL(file); // Leer el archivo como una URL en base64
            }

        } else if (dispositivo === "desktop") {

            contexto.drawImage(video.current, 0, 0, width, height);
            let data = canvas.toDataURL('image/png');
            userPhoto.current.setAttribute('src', data);

            cerrarCamara();
        }

        setCamara(false);

    }

    const abrirCamara = async (e) => {
        e.preventDefault();

        setCamara(true)

        const constrain = {
            audio: false,
            video: true
        }

        const handleSucces = (stream) => {
            video.current.srcObject = stream
            video.current.play();
        }

        try {

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.log("El navegador no soporta getUserMedia.");
                alert("Tu navegador no soporta acceso a la cámara.");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia(constrain);

            handleSucces(stream)

        } catch (e) {
            console.log(e);
        }
    }

    const cerrarCamara = () => {

        const stream = video.current.srcObject;

        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.current.srcObject = null;
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        const canvas = userPhoto.current;
        let data = canvas.toDataURL('image/png');

        const blobUsuario = await (await fetch(data)).blob();

        const dataURL = canvasRef.current.toDataURL();
        const blobFirm = await (await fetch(dataURL)).blob();

        console.log(blobFirm);

        const datosUsuario = new FormData();
        datosUsuario.append("usuario", blobUsuario, "photo.jpeg");
        datosUsuario.append("usuario", blobFirm, "firma.jpeg");

        try {

            await axios.post(`${process.env.NEXT_PUBLIC_URI}/api/usuario/ingresar`, datosUsuario, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

        } catch (error) { console.log(error.message) }

        limpiarForm(e);

    }

    const ajustar = (e) => {
        e.preventDefault();

        const canvas = canvasRef.current;
        const contexto = canvasRef.current.getContext("2d");
        contextoRef.current = canvasRef.current.getContext("2d");

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        canvas.width = width * 2;
        canvas.height = height * 2;

        contexto.scale(2, 2);
        contexto.fillStyle = "white";

        contexto.fillRect(0, 0, width, height);
    }

    // Firma del canvas
    useEffect(() => {

        const canvas = canvasRef.current;
        const contexto = canvasRef.current.getContext("2d");
        contextoRef.current = canvasRef.current.getContext("2d");
        contextoPhoto.current = userPhoto.current.getContext("2d");

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        canvas.width = width * 2;
        canvas.height = height * 2;

        contexto.scale(2, 2);
        contexto.fillStyle = "white";

        contexto.fillRect(0, 0, width, height);

        const COLOR_PINCEL = "black";
        const GROSOR = 2;
        let xAnterior = 0, yAnterior = 0, xActual = 0, yActual = 0;

        const obtenerXReal = (clientX) => clientX - canvas.getBoundingClientRect().left;
        const obtenerYReal = (clientY) => clientY - canvas.getBoundingClientRect().top;
        let haComenzadoDibujo = false;

        const onClicOToqueIniciado = evento => {
            xAnterior = xActual;
            yAnterior = yActual;
            xActual = obtenerXReal(evento.clientX);
            yActual = obtenerYReal(evento.clientY);
            contexto.beginPath();
            contexto.fillStyle = COLOR_PINCEL;
            contexto.fillRect(xActual, yActual, GROSOR, GROSOR);
            contexto.closePath();
            haComenzadoDibujo = true;
        }

        const onMouseODedoMovido = evento => {
            evento.preventDefault();
            if (!haComenzadoDibujo) {
                return;
            }
            let target = evento;
            if (evento.type.includes("touch")) {
                target = evento.touches[0];
            }
            xAnterior = xActual;
            yAnterior = yActual;
            xActual = obtenerXReal(target.clientX);
            yActual = obtenerYReal(target.clientY);
            contexto.beginPath();
            contexto.moveTo(xAnterior, yAnterior);
            contexto.lineTo(xActual, yActual);
            contexto.strokeStyle = COLOR_PINCEL;
            contexto.lineWidth = GROSOR;
            contexto.stroke();
            contexto.closePath();
        }
        const onMouseODedoLevantado = () => {
            haComenzadoDibujo = false;
        };

        ["mousedown", "touchstart"].forEach(nombreDeEvento => {
            canvas.addEventListener(nombreDeEvento, onClicOToqueIniciado);
        });

        ["mousemove", "touchmove"].forEach(nombreDeEvento => {
            canvas.addEventListener(nombreDeEvento, onMouseODedoMovido);
        });
        ["mouseup", "touchend"].forEach(nombreDeEvento => {
            canvas.addEventListener(nombreDeEvento, onMouseODedoLevantado);
        });

    }, [])

    return (
        <MainLayout>

            <h1 className="text-xl">Usuarios</h1>

            <form
                onSubmit={handleSubmit}
            >

                {deviceType === 'mobile' ? (
                    <div>
                        <label
                            htmlFor="iser"
                            className="w-full flex flex-col items-center my-7"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>

                            Abrir Cámara
                        </label>

                        <input
                            className="hidden"
                            type="file"
                            src=""
                            alt=""
                            id="iser"
                            capture="user"
                            accept="image/*"
                            ref={imagenPhone}
                            name="usuario"
                            onChange={(e) => tomarFoto(e, "movil")}
                        />
                    </div>
                )
                    :
                    (
                        <div>
                            <button
                                onClick={(e) => abrirCamara(e)}
                                className="mb-3 mt-5"

                            >
                                Abrir Cámara
                            </button>

                            {camara && (
                                <div>
                                    <div
                                        className="w-full sm:w-[300px] h-[300px]"
                                    >
                                        <video
                                            ref={video}
                                            className="w-full h-full object-cover aspect-square"
                                        >
                                        </video>
                                    </div>

                                    <button
                                        onClick={(e) => tomarFoto(e, "desktop")}
                                        className="block my-5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                        </div>
                    )
                }

                <div
                    className={`w-full sm:w-[300px] h-[300px]`}
                >
                    <canvas
                        ref={userPhoto}
                        className={`border-2 border-dashed border-black w-full h-full object-cover aspect-square`}
                    >
                        <img
                            ref={photo}
                            className="w-full object-cover aspect-square"
                        />
                    </canvas>
                </div>

                <h2 className="mb-3 mt-5">Firma:</h2>

                <div className="w-full sm:w-[300px] h-[210px]">
                    <canvas
                        id="canvas"
                        ref={canvasRef}
                        className="border-2 border-dashed border-black w-full h-full"
                    ></canvas>
                </div>

                <div
                    className="w-full sm:w-[300px] flex justify-between my-7">
                    <button
                        onClick={(e) => limpiarCanvas(e)}
                        className="bg-[#3f94b9] rounded-md p-3 hover:bg-[#3d7e9a] font-bold"
                    >
                        Limpiar
                    </button>

                    <button
                        onClick={(e) => ajustar(e)}
                        className="bg-[#3f94b9] rounded-md p-3 hover:bg-[#3d7e9a] font-bold"
                    >
                        Ajustar
                    </button>
                </div>

                <input
                    type="submit"
                    value="Registrar"
                    className="cursor-pointer bg-[#ff6347] rounded-md p-3 hover:bg-[#d6553e] font-bold"
                />

            </form>

            <div
                className="w-full mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
            >
                {error?.response?.data?.msg ?
                    <h2>Ups! Ocurrio un error, por favor intenta mas tarde</h2>
                    :
                    data && data.length ?
                        data.map(fu =>

                            <RegistrosUsuario
                                key={fu._id}
                                imgUsurioUrl={fu.fotoUsuario}
                                firmaUrl={fu.firmaUrl}
                            />
                        )
                        :
                        <h1
                            className="text-xl my-7"
                        >Sin usuarios</h1>
                }
            </div>

        </MainLayout>
    )
}