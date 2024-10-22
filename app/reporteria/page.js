"use client"

import { useState } from 'react'
import useUsuario from '@/hooks/useUsuario';
import { formatearHora, formatearFecha } from '@/helpers';
import { MainLayout } from '@/components/MainLayout'
import axios from 'axios';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'


export default function Reporteria() {

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFinal, setFechaFinal] = useState('');

    const { datosUsuario } = useUsuario();

    const generarReporteGeneral = async () => {

        try {

            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_URI}/api/biometrico/obtener-biometrico-usuario/${datosUsuario._id}`)
            generatePDF(data);

        } catch (e) { console.log(e) }

    }

    const generatePDF = async (bio) => {
        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        // Agregar una página
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;
        const mainFontColor = rgb(0, 0, 0);

        page.drawText('Reporte General', {
            x: 270,
            y: height - 4 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText(`${datosUsuario.nombre}`, {
            x: 50,
            y: height - 6 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText(`${datosUsuario.tipo}`, {
            x: 50,
            y: height - 7 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('Cemetsi', {
            x: 50,
            y: height - 8 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('FECHA DE REGISTRO', {
            x: 50,
            y: height - 10 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('HORA DE REGISTRO', {
            x: 220,
            y: height - 10 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('TIPO', {
            x: 420,
            y: height - 10 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        let starYBiometrico = 12


        for (const biometrico of bio) {

            page.drawText(`${formatearFecha(biometrico.fechaBiometrico)}`, {
                x: 50,
                y: height - starYBiometrico * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });
            formatearHora
            page.drawText(`${formatearHora(biometrico.horaBiometrico)}`, {
                x: 220,
                y: height - starYBiometrico * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            page.drawText(`${biometrico.estado}`, {
                x: 420,
                y: height - starYBiometrico * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            page.drawText(`${biometrico.coordenadas}`, {
                x: 420,
                y: height - (starYBiometrico + 1) * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            starYBiometrico = starYBiometrico + 3
        }


        // ==============================================================
        // Serializar el PDF a bytes
        const pdfBytes = await pdfDoc.save();

        // Crear un Blob y un enlace temporal para la descarga
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Abrir el PDF en una nueva pestaña
        window.open(url);
        return
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf'; // Nombre del archivo a descargar
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Limpiar el objeto URL
    }

    const filtrarReporte = async () => {

        if (fechaInicio === '' || fechaFinal === '') {
            alert('Lena ambos campos mi compa')
            return
        }

        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_URI}/api/biometrico/obtener-biometrico-filtrado/${datosUsuario._id}/${fechaInicio}/${fechaFinal}`)
            generarPDFFiltrado(data);

        } catch (e) { console.log(e) }
    }

    const generarPDFFiltrado = async (bio) => {

        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        // Agregar una página
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;
        const mainFontColor = rgb(0, 0, 0);

        page.drawText('Reporte General', {
            x: 270,
            y: height - 4 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText(`${datosUsuario.nombre}`, {
            x: 50,
            y: height - 6 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText(`${datosUsuario.tipo}`, {
            x: 50,
            y: height - 7 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('Cemetsi', {
            x: 50,
            y: height - 8 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('FECHA DE REGISTRO', {
            x: 50,
            y: height - 10 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('HORA DE REGISTRO', {
            x: 220,
            y: height - 10 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('TIPO', {
            x: 420,
            y: height - 10 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        if (bio && bio.length) {
            let starYBiometrico = 12
            for (const biometrico of bio) {

                page.drawText(`${formatearFecha(biometrico.fechaBiometrico)}`, {
                    x: 50,
                    y: height - starYBiometrico * fontSize,
                    size: fontSize,
                    font: timesRomanFont,
                    color: mainFontColor
                });
                formatearHora
                page.drawText(`${formatearHora(biometrico.horaBiometrico)}`, {
                    x: 220,
                    y: height - starYBiometrico * fontSize,
                    size: fontSize,
                    font: timesRomanFont,
                    color: mainFontColor
                });

                page.drawText(`${biometrico.estado}`, {
                    x: 420,
                    y: height - starYBiometrico * fontSize,
                    size: fontSize,
                    font: timesRomanFont,
                    color: mainFontColor
                });

                page.drawText(`${biometrico.coordenadas}`, {
                    x: 420,
                    y: height - (starYBiometrico + 1) * fontSize,
                    size: fontSize,
                    font: timesRomanFont,
                    color: mainFontColor
                });

                starYBiometrico = starYBiometrico + 3
            }
        } else {
            page.drawText('SIN REGISTROS EN EL RANGO DE FECHAS', {
                x: 180,
                y: height - 14 * fontSize,
                size: 14,
                font: timesRomanFont,
                color: mainFontColor
            });
        }



        // ==============================================================
        // Serializar el PDF a bytes
        const pdfBytes = await pdfDoc.save();

        // Crear un Blob y un enlace temporal para la descarga
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Abrir el PDF en una nueva pestaña
        window.open(url);
        return
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf'; // Nombre del archivo a descargar
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Limpiar el objeto URL
    }

    return (
        <MainLayout>
            <div className="px-6 py-5">

                <h2 className='mb-5 text-xl'><b>Reportes</b></h2>

                <div className='w-full bg-white p-7 rounded-xl shadow-md'>
                    <h2 className='text-lg mb-5'>Biometrico</h2>

                    <div className='flex flex-col md:flex md:flex-row gap-4 mb-5'>
                        <div className='w-full relative'>
                            <input
                                onChange={(e) => setFechaInicio(e.target.value)}
                                type="date"
                                className='bg-white w-full rounded-md px-1 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                            />
                            <span className='absolute left-2 top-6 text-[10px] text-gray-500'><b>Fecha Inicio</b></span>
                        </div>

                        <div className='w-full relative'>
                            <input
                                onChange={(e) => setFechaFinal(e.target.value)}
                                type="date"
                                className='bg-white w-full rounded-md px-1 pt-2 pb-5 text-[12px] outline-none border border-gray-400'
                            />
                            <span className='absolute left-2 top-6 text-[10px] text-gray-500'><b>Fecha Final</b></span>
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row gap-4'>
                        <button
                            type='button'
                            className='bg-[#ff9600] w-full rounded-md text-white py-1 hover:bg-black transition-colors md:max-w-52'
                            onClick={generarReporteGeneral}
                        >
                            Generar Reporte
                        </button>

                        <button
                            type='button'
                            className='bg-[#d31818] w-full rounded-md text-white py-1 hover:bg-black transition-colors md:max-w-52'
                            onClick={filtrarReporte}
                        >
                            Filtrar Reporte
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
