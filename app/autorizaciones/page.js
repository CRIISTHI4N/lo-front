"use client"

import { useEffect, useRef } from "react";
import { MainLayout } from "@/components/MainLayout";

export default function Autorizaciones() {

    const canvasRef = useRef(null);
    const contextoRef = useRef(null);
    const btnDescargar = useRef(null);
    const colorFondo = "#ffff";
    const canvasWidth = 400;
    const canvasHeight = 250;

    const limpiarCanvas = () => {

        const contexto = contextoRef.current;
        contexto.fillStyle = colorFondo;
        contexto.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const descargarFirma = async () => {


        btnDescargar.current.href = canvasRef.current.toDataURL();
        btnDescargar.current.download = "Firma.png";

        // Aqui se almacena la imagen
        // canvasRef.current.toDataURL()


        const dataURL = canvasRef.current.toDataURL();
        const blob = await (await fetch(dataURL)).blob();
        console.log(blob);

        // const formData = new FormData();
        // formData.append()
        // formData.append("firma", blob, "firma.png");

    }

    useEffect(() => {

        const canvas = canvasRef.current;
        const contexto = canvasRef.current.getContext("2d");
        contextoRef.current = canvasRef.current.getContext("2d");

        canvas.width = canvasWidth; // Ajusta el ancho
        canvas.height = canvasHeight; // Ajusta la altura

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

            <h1 className="text-xl">Firmas Autorizadas</h1>

            <div className="w-full">
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    className="border-2 border-fuchsia-400 bg-white"
                ></canvas>

                <button
                    onClick={() => limpiarCanvas()}
                >
                    Limmpiar
                </button>

                <a
                    download={'adsfasdf.png'}
                    className="cursor-pointer"
                    onClick={() => descargarFirma()}
                    ref={btnDescargar}
                >
                    Descargar
                </a>
            </div>


        </MainLayout>
    )
}
