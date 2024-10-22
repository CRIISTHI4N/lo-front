"use client";

import { generarId } from "@/helpers";
import { isTablet, isBrowser, isMobile } from 'react-device-detect';
import { createContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';


export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {

    const [deviceType, setDeviceType] = useState('desktop');
    const [borrarEsto, setborrarEsto] = useState('');
    const [idActividadContext, setIdActividadContext] = useState('');
    const [idAnexoContext, setIdAnexoContext] = useState('');
    const [capturasContext, setCapturasContext] = useState([]);
    const [capturasContextAnexo, setCapturasContextAnexo] = useState([]);
    const [editarContext, setEditarContext] = useState(false);
    const [datosUsuario, setDatosUsuario] = useState({});
    const [navBar, setNavBar] = useState(false);
    const [biometrico, setBiometrico] = useState({});
    const [fechaActualContext, setFechaActualContext] = useState('');

    const router = useRouter();

    //Actividades final
    const [actividades, setActividades] = useState([]);
    // Datos Actividades
    const [formulariosActividades, setFormulariosActividades] = useState([]);

    // Equipos finlaes
    const [equipos, setEquipos] = useState([]);
    // Datos equipo
    const [formulariosEquipo, setFormulariosEquipo] = useState([]);

    // Mano de obra
    const [manoObras, setManoObras] = useState([]);
    // Datos mano de obra
    const [formulariosManoObra, setFormulariosManoObra] = useState([]);

    // Anexo Dificultad
    const [anexoDificultad, setAnexoDificultad] = useState([]);
    // Datos mano de obra
    const [formulariosAnexoDificultad, setFormulariosAnexoDificultad] = useState([]);

    //Modales
    const [modalCrearEquipo, setModalCrearEquipo] = useState(false);
    const [modalFotosActividad, setModalFotosActividad] = useState(false);
    const [modalAnexoDificultad, setModalAnexoDificultad] = useState(false);
    const [modalActividades, setModalActividades] = useState(false);

    const crearFormActividad = (actividad) => {
        setActividades([...actividades, actividad])
        setFormulariosActividades([...formulariosActividades, generarId()])
    }

    const crearFormEquipo = (equipo) => {
        setEquipos([...equipos, equipo])
        setFormulariosEquipo([...formulariosEquipo, generarId()])
    }

    const crearFormManoObra = (manoObra) => {
        setManoObras([...manoObras, manoObra])
        setFormulariosManoObra([...formulariosManoObra, generarId()])
    }

    const crearFormAnexoDificultad = (anexo) => {
        setAnexoDificultad([...anexoDificultad, anexo])
        setFormulariosAnexoDificultad([...formulariosAnexoDificultad, generarId()])
    }

    const changeModalCrearEquipo = () => {
        setModalCrearEquipo(!modalCrearEquipo)
    }

    const changeModalFotosActividad = () => {
        setModalFotosActividad(!modalFotosActividad)
    }

    const changeModalAnexoDifucultad = () => {
        setModalAnexoDificultad(!modalAnexoDificultad)
    }

    const changeModalActividades = () => {
        setModalActividades(!modalActividades)
    }

    const changeNavBar = () => {
        setNavBar(!navBar)
        localStorage.setItem('navbar', !navBar)
    }



    // Detectar tipo de pantalla (móvil / desktop)
    useEffect(() => {
        if (isMobile) {
            setDeviceType('mobile');
        } else if (isTablet) {
            setDeviceType('tablet');
        } else if (isBrowser) {
            setDeviceType('desktop');
        }
    }, []);

    const cerrarSesion = () => {
        router.push('/')
        localStorage.removeItem('user')
        setDatosUsuario({})
    }

    useEffect(() => {
        setNavBar(JSON.parse(localStorage.getItem('navbar')) || false)
        setDatosUsuario(JSON.parse(localStorage.getItem('user')) || [])
    }, [])

    useEffect(() => {
        const obtenerFechaActual = () => {
            const hoy = new Date();

            // Obtener el año, mes y día en formato correcto
            const año = hoy.getFullYear();
            const mes = ('0' + (hoy.getMonth() + 1)).slice(-2); // Los meses van de 0 a 11
            const dia = ('0' + hoy.getDate()).slice(-2);

            // Formatear la fecha como "YYYY-MM-DD"
            const fechaFormateada = `${año}-${mes}-${dia}`;
            setFechaActualContext(fechaFormateada);
        };

        obtenerFechaActual();
    }, []);


    return (
        <UsuarioContext.Provider
            value={{
                formulariosActividades,
                actividades,
                modalCrearEquipo,
                modalFotosActividad,
                deviceType,
                idActividadContext,
                modalAnexoDificultad,
                capturasContext,
                editarContext,
                modalActividades,
                equipos,
                formulariosEquipo,
                formulariosManoObra,
                manoObras,
                formulariosAnexoDificultad,
                anexoDificultad,
                idAnexoContext,
                capturasContextAnexo,
                datosUsuario,
                navBar,
                biometrico,
                fechaActualContext,
                setActividades,
                setFormulariosActividades,
                setIdActividadContext,
                setCapturasContext,
                setEditarContext,
                setModalActividades,
                setEquipos,
                setFormulariosEquipo,
                setFormulariosManoObra,
                setManoObras,
                crearFormActividad,
                changeModalCrearEquipo,
                changeModalFotosActividad,
                changeModalAnexoDifucultad,
                changeModalActividades,
                crearFormEquipo,
                crearFormManoObra,
                crearFormAnexoDificultad,
                setFormulariosAnexoDificultad,
                setAnexoDificultad,
                setIdAnexoContext,
                setCapturasContextAnexo,
                setDatosUsuario,
                cerrarSesion,
                changeNavBar,
                setBiometrico
            }}
        >
            {children}
        </UsuarioContext.Provider>
    )
}