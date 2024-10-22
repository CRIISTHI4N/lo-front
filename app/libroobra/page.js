"use client"

import { useEffect, useState, useRef } from "react";

import { MainLayout } from "@/components/MainLayout"
import { AgregarActividad } from "@/components/AgregarActividad"
import AgregarEquipo from "@/components/AgregarEquipo";
import ModalCrearEquipos from "@/components/ModalCrearEquipos";
import ModalActividades from "@/components/ModalActividades";
import AgregarManoObra from "@/components/AgregarManoObra";

import useUsuario from "@/hooks/useUsuario"
import { formatearHora } from "@/helpers";

import Modal from 'react-modal';
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import { format, startOfToday } from 'date-fns';
import axios from "axios";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import AgregarAnexoDificultad from "@/components/AgregarAnexoDificultad";

const customStylesFactura = {
    overlay: {
        backgroundColor: 'rgba(6, 6, 6, 0.45)',
        height: '100vh',
        width: '100vw',
        scrollbarColor: 'red',
        zIndex: '21'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        padding: '0',
        width: '90%',
        height: '90%',
        overflowY: 'hidden',
        overflowY: 'auto',
    },
};

Modal.setAppElement('#__next');

export default function LibroObra() {

    const [botonMas, setBotonMas] = useState(true);
    const [botonMasEquipo, setBotonMasEquipo] = useState(true);
    const [botonMasManoObra, setBotonMasManoObra] = useState(true);
    const [botonMasAnexo, setBotonMasAnexo] = useState(true);
    const [desabilitarHorario, setDesabilitarHorario] = useState(false);

    const [nombreProyecto, setNombreProyecto] = useState('');
    const [residentes, setResidentes] = useState([]);
    const [horaEntradaPersonal, setHoraEntradaPersonal] = useState('');
    const [horaSalidaPersonal, setHoraSalidaPersonal] = useState('');
    const [clima, setClima] = useState([]);

    const formRef = useRef(null);

    const router = useRouter();

    const {
        formulariosActividades,
        formulariosEquipo,
        crearFormActividad,
        actividades,
        modalCrearEquipo,
        modalActividades,
        crearFormEquipo,
        equipos,
        formulariosManoObra,
        crearFormManoObra,
        manoObras,
        crearFormAnexoDificultad,
        formulariosAnexoDificultad,
        anexoDificultad,
        fechaActualContext,
        setEquipos,
        setFormulariosEquipo,
        setManoObras,
        setFormulariosManoObra,
        setActividades,
        setFormulariosActividades,
        setAnexoDificultad,
        setFormulariosAnexoDificultad

    } = useUsuario();

    const fetcherNombreEO = () => axios.get(`${process.env.NEXT_PUBLIC_URI}/api/equipos-obra/obtener-nombre-eo`).then(datos => datos.data)
    const { data: nombresEO, error: errorEO, isLoading: isLoadingEO } = useSWR(`${process.env.NEXT_PUBLIC_URI}/api/equipos-obra/obtener-nombre-eo`, fetcherNombreEO, { refreshInterval: 500 })

    const fetcherNombresActividades = () => axios.get(`${process.env.NEXT_PUBLIC_URI}/api/actividades/obtener-nombres-actividad`).then(datos => datos.data)
    const { data: nombresActividades, error: errorAct, isLoading: isLoadingAct } = useSWR(`${process.env.NEXT_PUBLIC_URI}/api/actividades/obtener-nombres-actividad`, fetcherNombresActividades, { refreshInterval: 500 })

    const fetcherUnidades = () => axios.get(`${process.env.NEXT_PUBLIC_URI}/api/unidades/obtener`).then(datos => datos.data)
    const { data: nombresUni, error: errorUni, isLoading: isLoadingUni } = useSWR(`${process.env.NEXT_PUBLIC_URI}/api/unidades/obtener`, fetcherUnidades, { refreshInterval: 500 })

    const mostrarFormActividad = () => {
        crearFormActividad({
            id: "sinid",
            idActividad: '',
            fotosActividad: [],
        })

        setBotonMas(false)
    }

    const mostrarFormEquipo = () => {
        crearFormEquipo({
            id: 'sinid',
            descripcion: 'Herramientas menores',
            cantidad: '5',
            horaSalida: '17:30',
            horaEntrega: '04:41'
        })

        setBotonMasEquipo(false)
    }

    const mostrarFormManoObra = () => {
        crearFormManoObra({
            id: 'sinid',
            descripcion: '',
            cantidad: ''
        })

        setBotonMasManoObra(false)
    }

    const mostrarFormAnexo = () => {

        crearFormAnexoDificultad({
            id: "sinid",
            idActividad: '',
            nombreAnexo: '',
            fotosAnexo: [],
        })

        setBotonMasAnexo(false);
    }

    const filtrarClima = (climaCheck) => {

        const climaFiltrado = clima.filter(c => c !== climaCheck);
        setClima(climaFiltrado);
    }

    const filtrarResidentes = (residenteCheck) => {

        const residentesFiltrados = residentes.filter(c => c !== residenteCheck);
        setResidentes(residentesFiltrados);
    }

    const desabilitarFormHorario = () => {
        setDesabilitarHorario(true);
    }

    const createPdf = async () => {
        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        // Agregar una página
        const page = pdfDoc.addPage();
        const page2 = pdfDoc.addPage();
        const page3 = pdfDoc.addPage();
        const page4 = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;
        const mainFontColor = rgb(0, 0, 0);

        page.drawText('[Nombre del Proyecto]', {
            x: 230,
            y: height - 4 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText(`Hora Inicio: ${horaEntradaPersonal}`, {
            x: 50,
            y: height - 6 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText(`Hora Salida: ${horaSalidaPersonal}`, {
            x: 50,
            y: height - 8 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('Clima:', {
            x: 50,
            y: height - 10 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        let startXClima = 95;
        clima.map((item) => {

            page.drawText(`${item}`, {
                x: startXClima,
                y: height - 10 * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            startXClima = startXClima + 50;
        });

        page.drawText('EQUIPO:', {
            x: 50,
            y: height - 12 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('Descripción:', {
            x: 50,
            y: height - 14 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('Cantidad:', {
            x: 220,
            y: height - 14 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('Hora Salida:', {
            x: 310,
            y: height - 14 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('Hora Entrega:', {
            x: 410,
            y: height - 14 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        const equiposSinId = equipos.filter(e => e.id !== 'sinid');
        let starYEquipos = 16
        equiposSinId.map(item => {

            page.drawText(`${item.equipoId}`, {
                x: 50,
                y: height - starYEquipos * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            page.drawText(`${item.cantidad}`, {
                x: 220,
                y: height - starYEquipos * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            page.drawText(`${formatearHora(item.horaSalida)}`, {
                x: 310,
                y: height - starYEquipos * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            page.drawText(`${formatearHora(item.horaEntrega)}`, {
                x: 410,
                y: height - starYEquipos * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            starYEquipos = starYEquipos + 2
        });

        page.drawText('MANO DE OBRA:', {
            x: 50,
            y: height - starYEquipos * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('Descripción:', {
            x: 50,
            y: height - (starYEquipos + 2) * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page.drawText('Cantidad:', {
            x: 220,
            y: height - (starYEquipos + 2) * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        manoObras.map(m => {

            page.drawText(`${m.descripcion}`, {
                x: 50,
                y: height - (starYEquipos + 2) * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            page.drawText(`${m.cantidad}`, {
                x: 220,
                y: height - (starYEquipos + 2) * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: mainFontColor
            });

            starYEquipos = starYEquipos + 2
        })


        // ACTIVIDADES

        page2.drawText('[Nombre del Proyecto]', {
            x: 230,
            y: height - 4 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page2.drawText('ACTIVIDADES:', {
            x: 50,
            y: height - 6 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        let starYActividades = 8
        let starYActividadesImg = 17
        let starXActividadesImg = 50

        const actividadesSinId = actividades.filter(e => e.id !== 'sinid');

        // Manejar las imágenes
        for (const actividad of actividadesSinId) {

            const activityName = actividad.idActividad.split('_')[1];

            page2.drawText(`${activityName}`, {
                x: 50,
                y: height - starYActividades * fontSize,
                size: 14,
                font: timesRomanFont,
                color: mainFontColor
            });

            for (const foto of actividad.fotosActividad) {

                const imageBlob = foto.fotoActividadUrl;

                // Convertir el BLOB a ArrayBuffer
                const arrayBuffer = await imageBlob.arrayBuffer();

                // Embebiendo la imagen según su tipo
                let image;

                if (imageBlob.type === 'image/jpeg') {
                    image = await pdfDoc.embedJpg(arrayBuffer);
                } else if (imageBlob.type === 'image/png') {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else if (imageBlob.type === 'image/jpg') {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    console.warn('Unsupported image type: ', imageBlob.type);
                    continue; // Saltar si el tipo de imagen no es soportado
                }

                page2.drawImage(image, {
                    x: starXActividadesImg,
                    y: height - starYActividadesImg * fontSize,
                    width: 100,
                    height: 100,
                });

                starXActividadesImg = starXActividadesImg + 110

            }

            starYActividadesImg = starYActividadesImg + 12
            starXActividadesImg = 50;
            starYActividades = starYActividades + 12
        }

        page3.drawText('[Nombre del Proyecto]', {
            x: 230,
            y: height - 4 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page3.drawText('Anexo Dificulltad', {
            x: 50,
            y: height - 6 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        let starYAnexo = 8
        let starYAnexoImg = 20
        let starXAnexoImg = 50

        // ANEXOS

        const anexoSinId = anexoDificultad.filter(e => e.id !== 'sinid');

        // Manejar las imágenes
        for (const anexo of anexoSinId) {

            const activityName = anexo.idActividad.split('_')[1];

            page3.drawText(`${activityName}`, {
                x: 50,
                y: height - starYAnexo * fontSize,
                size: 14,
                font: timesRomanFont,
                color: mainFontColor
            });

            page3.drawText(`${anexo.nombreAnexo}`, {
                x: 50,
                y: height - (starYAnexo + 2) * fontSize,
                size: 14,
                font: timesRomanFont,
                color: mainFontColor
            });

            for (const foto of anexo.fotosAnexo) {

                const imageBlob = foto.fotoAnexoUrl;

                // Convertir el BLOB a ArrayBuffer
                const arrayBuffer = await imageBlob.arrayBuffer();

                // Embebiendo la imagen según su tipo
                let image;

                if (imageBlob.type === 'image/jpeg') {
                    image = await pdfDoc.embedJpg(arrayBuffer);
                } else if (imageBlob.type === 'image/png') {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else if (imageBlob.type === 'image/jpg') {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    console.warn('Unsupported image type: ', imageBlob.type);
                    continue; // Saltar si el tipo de imagen no es soportado
                }

                page3.drawImage(image, {
                    x: starXAnexoImg,
                    y: height - starYAnexoImg * fontSize,
                    width: 100,
                    height: 100,
                });

                starXAnexoImg = starXAnexoImg + 110

            }

            starYAnexoImg = starYAnexoImg + 13
            starXAnexoImg = 50;
            starYAnexo = starYAnexo + 14
        }


        page4.drawText('[Nombre del Proyecto]', {
            x: 230,
            y: height - 4 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page4.drawText('_______________________', {
            x: 110,
            y: height - 58 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page4.drawText('Fiscalización', {
            x: 152,
            y: height - 60 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page4.drawText('_______________________', {
            x: 310,
            y: height - 58 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });

        page4.drawText('Residente de Obra', {
            x: 340,
            y: height - 60 * fontSize,
            size: 14,
            font: timesRomanFont,
            color: mainFontColor
        });



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
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        // Verifica que las horas no estén vacías
        if ([horaSalidaPersonal, nombreProyecto].includes('')) {
            alert('Porfavor, Llena todos los campos');
            return
        }

        const [horasEntrada, minutosEntrada] = horaEntradaPersonal.split(':').map(Number);
        const [horasSalida, minutosSalida] = horaSalidaPersonal.split(':').map(Number);

        const fechaHoraEntrada = new Date(startOfToday());
        const fechaHoraSalida = new Date(startOfToday());

        fechaHoraEntrada.setHours(horasEntrada, minutosEntrada);
        fechaHoraSalida.setHours(horasSalida, minutosSalida);

        const equiposFiltradoSinId = equipos.filter(e => e.id !== 'sinid')
            .map(({ id, ...datos }) => datos);

        const manoObraFiltradaSinId = manoObras.filter(mo => mo.id !== 'sinid')
            .map(({ id, ...datos }) => datos);

        const actividadesFiltradasSinId = actividades.filter(a => a.id !== 'sinid') // Filtrar por idActividad
            .map(({ id, idActividad, fotosActividad, ...datos }) => ({
                ...datos,
                idActividad: idActividad.split('_')[0],
                fotosActividad: fotosActividad.map(({ id, fotoActividadUrl }) => ({
                    fotoActividadUrl: '' // Inicializa como string vacío
                })) // eliminar el ID de fotos y establecer la URL vacía
            }));

        const anexosFiltradasSinId = anexoDificultad.filter(a => a.id !== 'sinid') // Filtrar por idActividad
            .map(({ id, idActividad, fotosAnexo, ...datos }) => ({
                ...datos,
                idActividad: idActividad.split('_')[0],
                fotosAnexo: fotosAnexo.map(({ id, fotoAnexoUrl }) => ({
                    fotoAnexoUrl: '' // Inicializa como string vacío
                })) // eliminar el ID de fotos y establecer la URL vacía
            }));

        const urlsDeFotos = actividades
            .filter(a => a.id !== 'sinid') // Filtra actividades
            .map(actividad => ({
                id: actividad.id,
                fotosActividad: actividad.fotosActividad.map(({ id, fotoActividadUrl }) => ({
                    id,
                    fotoActividadUrl
                }))
            }));

        const urlsDeAnexo = anexoDificultad
            .filter(a => a.id !== 'sinid') // Filtra actividades
            .map(anexo => ({
                id: anexo.id,
                fotosAnexo: anexo.fotosAnexo.map(({ id, fotoAnexoUrl }) => ({
                    id,
                    fotoAnexoUrl
                }))
            }));


        const formData = new FormData();
        formData.append('nombreProyecto', nombreProyecto);
        formData.append('residentes', JSON.stringify(residentes));
        formData.append('horaInicio', fechaHoraEntrada.toISOString());
        formData.append('horaSalida', fechaHoraSalida.toISOString());
        formData.append('clima', JSON.stringify(clima));
        formData.append('equipos', JSON.stringify(equiposFiltradoSinId));
        formData.append('manosObra', JSON.stringify(manoObraFiltradaSinId));
        formData.append('actividades', JSON.stringify(actividadesFiltradasSinId));
        formData.append('anexo', JSON.stringify(anexosFiltradasSinId));

        urlsDeFotos.map((urlF, j) => {
            urlF.fotosActividad.map((foto, i) => {
                formData.append('actividad', foto.fotoActividadUrl, `${urlF.id}-image${i}.jpeg`);
            });
        });

        urlsDeAnexo.map((urlF, j) => {
            urlF.fotosAnexo.map((foto, i) => {
                formData.append('anexo', foto.fotoAnexoUrl, `${urlF.id}-image${i}.jpeg`);
            });
        });

        try {

            const response = axios.post(`${process.env.NEXT_PUBLIC_URI}/api/formulario-libro-obra/ingresar`, formData)
            console.log(response);

            formRef.current.reset();
            setDesabilitarHorario(false);
            setNombreProyecto('');
            setResidentes([]);
            setHoraEntradaPersonal('07:00');
            setHoraSalidaPersonal();
            setClima([]);
            setEquipos([]);
            setFormulariosEquipo([]);
            setManoObras([]);
            setFormulariosManoObra([]);
            setActividades([]);
            setFormulariosActividades([]);
            setAnexoDificultad([]);
            setFormulariosAnexoDificultad([]);
            setBotonMasEquipo(true);
            setBotonMasManoObra(true);
            setBotonMas(true);
            setBotonMasAnexo(true);


        } catch (e) { console.log(e) }
    }

    useEffect(() => {
        setHoraEntradaPersonal('07:00');
    }, [])

    return (
        <MainLayout>
            <div
                className="px-6 py-5"
            >

                <form
                    onSubmit={handleSubmit}
                    ref={formRef}
                >

                    <h2 className='text-xl'><b>Libro de Obra</b></h2>

                    <div className='max-w-52 relative my-5'>
                        <input
                            value='CMT0025'
                            type="text"
                            readOnly
                            className='bg-gray-300 w-full rounded-md px-2 pt-5 pb-2 text-[12px] outline-none'
                        />
                        <span className='absolute left-2 top-2 text-[10px]'><b>Código CMT:</b></span>
                    </div>

                    <div
                        className="relative"
                    >
                        <label
                            htmlFor="nombre_proyecto"
                            className="absolute left-2 top-2 text-[10px]"
                        >
                            Nombre proyecto
                        </label>

                        <select
                            id="nombre_proyecto"
                            className="bg-white w-full rounded-md px-1 pt-5 pb-2 text-[12px] outline-none border border-gray-400"
                            onChange={(e) => setNombreProyecto(e.target.value)}
                            disabled={desabilitarHorario}
                        >
                            <option value="">Proyecto:</option>
                            <option value="proyecto farmacia">Proyecto Farmacia</option>
                            <option value="proyecto playas">Proyecto Playas</option>
                            <option value="proyecto quito">Proyecto Quito</option>
                        </select>
                    </div>

                    <div
                        className="relative my-5 px-3 pt-4 pb-3 border border-blue-900 rounded-md"
                    >
                        <div
                            className="flex flex-col gap-3"
                        >
                            <span
                                className="text-blue-900 absolute top-[-13px] px-2 bg-[#f5f7f9]"
                            ><b>Residentes:</b>
                            </span>

                            <div className="flex gap-4">
                                <div className="flex items-center gap-1">
                                    <input type="checkbox" disabled={desabilitarHorario} name="residentes" id="residente1" value="andres prado" onClick={(e) => e.target.checked ? setResidentes([...residentes, e.target.value]) : filtrarResidentes(e.target.value)} />
                                    <label className="text-sm" htmlFor="residente1">ANDRES PRADO</label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <input type="checkbox" disabled={desabilitarHorario} name="residentes" id="residente2" value="roberth cardenas" onClick={(e) => e.target.checked ? setResidentes([...residentes, e.target.value]) : filtrarResidentes(e.target.value)} />
                                    <label className="text-sm" htmlFor="residente2">ROBERTH CARDENAS</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex flex-wrap md:flex-nowrap gap-3"
                    >
                        <div
                            className="relative w-full"
                        >
                            <label
                                htmlFor="fecha_personal"
                                className="absolute left-2 bottom-2 text-[10px]"
                            >
                                Fecha:
                            </label>

                            <input
                                id="fecha_personal"
                                className="bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400"
                                type="date"
                                value={fechaActualContext}
                                disabled={desabilitarHorario}
                                readOnly
                                onChange={(e) => setHoraSalidaPersonal(e.target.value)}
                            />
                        </div>

                        <div
                            className="relative w-full"
                        >
                            <label
                                htmlFor="hora_inicio_personal"
                                className="absolute left-2 bottom-2 text-[10px]"
                            >
                                Hora de inicio:
                            </label>

                            <input
                                id="hora_inicio_personal"
                                className="bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400"
                                type="time"
                                defaultValue={'07:00'}
                                disabled={desabilitarHorario}
                                onChange={(e) => setHoraEntradaPersonal(e.target.value)}
                            />
                        </div>

                        <div
                            className="relative w-full"
                        >
                            <label
                                htmlFor="hora_salida_personal"
                                className="absolute left-2 bottom-2 text-[10px]"
                            >
                                Hora de salida:
                            </label>

                            <input
                                id="hora_salida_personal"
                                className="bg-white w-full rounded-md px-2 pt-2 pb-5 text-[12px] outline-none border border-gray-400"
                                type="time"
                                disabled={desabilitarHorario}
                                onChange={(e) => setHoraSalidaPersonal(e.target.value)}
                            />
                        </div>

                    </div>

                    <div
                        className="relative my-5 px-3 pt-4 pb-3 border border-blue-900 rounded-md"
                    >
                        <div
                            className="flex flex-col gap-3"
                        >
                            <span
                                className="text-blue-900 absolute top-[-13px] px-2 bg-[#f5f7f9]"
                            ><b>Clima:</b>
                            </span>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-1">
                                    <input type="checkbox" disabled={desabilitarHorario} name="clima" id="clima1" value="soleado" onClick={(e) => e.target.checked ? setClima([...clima, e.target.value]) : filtrarClima(e.target.value)} />
                                    <label htmlFor="clima1">Soleado</label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <input type="checkbox" disabled={desabilitarHorario} name="clima" id="clima2" value="nublado" onClick={(e) => e.target.checked ? setClima([...clima, e.target.value]) : filtrarClima(e.target.value)} />
                                    <label htmlFor="clima2">Nublado</label>
                                </div>
                                <div className="flex items-center gap-1">
                                    <input type="checkbox" disabled={desabilitarHorario} name="clima" id="clima3" value="lluvioso" onClick={(e) => e.target.checked ? setClima([...clima, e.target.value]) : filtrarClima(e.target.value)} />
                                    <label htmlFor="clima3">Lluvioso</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={desabilitarFormHorario}
                        disabled={desabilitarHorario}
                        className={`${desabilitarHorario ? 'cursor-not-allowed' : ''} text-white bg-blue-900 rounded-md p-1 hover:bg-blue-700 mb-10 px-7 w-full md:w-auto `}>
                        Crear
                    </button>

                    <h2 className="text-xl"><b>Registrar Equipo:</b></h2>

                    <div className='max-w-52 my-5 relative'>
                        <input
                            value='CMT0025'
                            type="text"
                            readOnly
                            className='bg-gray-300 w-full rounded-md px-2 pt-5 pb-2 text-[12px] outline-none'
                        />
                        <span className='absolute left-2 top-2 text-[10px]'><b>Código CMT:</b></span>
                    </div>

                    {botonMasEquipo &&
                        <button
                            type="button"
                            className="bg-blue-900 hover:bg-blue-600 rounded-full p-2"
                            onClick={mostrarFormEquipo}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    }

                    <div className={`${formulariosEquipo && formulariosEquipo.length ? 'bg-white shadow-md mb-5' : 'bg-transparent'} p-2 rounded-md `}>
                        {
                            formulariosEquipo.map(id => (
                                <AgregarEquipo
                                    key={id}
                                    id={id}
                                    nombresEO={nombresEO}
                                />
                            ))
                        }
                    </div>

                    <h2 className="text-xl"><b>Registrar Mano de Obra:</b></h2>

                    {botonMasManoObra &&
                        <button
                            type="button"
                            className="bg-blue-900 hover:bg-blue-600 rounded-full p-2 mt-5"
                            onClick={mostrarFormManoObra}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    }

                    <div className={`${formulariosManoObra && formulariosManoObra.length ? 'bg-white shadow-md mb-5' : 'bg-transparent'} p-2 rounded-md `}>
                        {
                            formulariosManoObra.map(id => (
                                <AgregarManoObra
                                    key={id}
                                    id={id}
                                //nombresActividades={nombresActividades}
                                />
                            ))
                        }
                    </div>

                    <h2 className="text-xl"><b>Actividades:</b></h2>

                    {botonMas &&
                        <button
                            type="button"
                            className="bg-blue-900 hover:bg-blue-600 rounded-full p-2 mt-5"
                            onClick={mostrarFormActividad}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    }

                    <div className={`${formulariosActividades && formulariosActividades.length ? 'bg-white shadow-md mb-5' : 'bg-transparent'}  p-2 rounded-md `}>

                        {formulariosActividades.map(id => (
                            <AgregarActividad
                                key={id}
                                id={id}
                                nombresActividades={nombresActividades}
                                nombresUni={nombresUni}
                            />
                        ))}
                    </div>

                    <h2 className="text-xl"><b>Anexos Dificultad:</b></h2>

                    {botonMasAnexo &&
                        <button
                            type="button"
                            className="bg-blue-900 hover:bg-blue-600 rounded-full p-2 mt-5"
                            onClick={mostrarFormAnexo}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    }

                    <div className={`${formulariosAnexoDificultad && formulariosAnexoDificultad.length ? 'bg-white shadow-md mb-5' : 'bg-transparent'}  p-2 rounded-md `}>
                        {formulariosAnexoDificultad.map(id => (
                            <AgregarAnexoDificultad
                                key={id}
                                id={id}
                                nombresActividades={nombresActividades}
                            />
                        ))}
                    </div>

                    <div className='flex flex-col md:flex-row gap-4 mt-10'>
                        <button
                            type="submit"
                            className='bg-[#ff9600] rounded-md text-white py-1 px-3 hover:bg-black transition-colors'
                        >
                            Registrar Libro Obra
                        </button>

                        <button
                            type="button"
                            className='bg-[#d31818] rounded-md text-white py-1 px-3 hover:bg-black transition-colors'
                            onClick={() => createPdf()}
                        >
                            Generar PDF
                        </button>
                    </div>


                </form>

                <Modal
                    isOpen={modalCrearEquipo}
                    style={customStylesFactura}
                >
                    <ModalCrearEquipos />
                </Modal>

                <Modal
                    isOpen={modalActividades}
                    style={customStylesFactura}
                >
                    <ModalActividades />
                </Modal>
            </div>
        </MainLayout>
    )
}
