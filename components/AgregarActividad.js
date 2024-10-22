import { useState, useEffect } from "react";
import ModalFotosActividad from "./ModalFotosActividad";
import useUsuario from "@/hooks/useUsuario";
import Modal from 'react-modal';

const customStylesFotoAct = {
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

export const AgregarActividad = ({ id, nombresActividades, nombresUni }) => {

    const [agreAct, setAgreAct] = useState(false);
    const [editarAct, setEditarAct] = useState(false);
    const [idActividad, setIdActividad] = useState("");
    const [unidad, setUnidad] = useState("");

    const {
        crearFormActividad,
        actividades,
        formulariosActividades,
        setActividades,
        setFormulariosActividades,
        modalFotosActividad,
        changeModalFotosActividad,
        setIdActividadContext,
        capturasContext,
        setCapturasContext,
        setEditarContext,
        changeModalActividades,
    } = useUsuario();

    const crearActividad = () => {

        if ([idActividad, unidad].includes('')) {
            alert('Porfavor, Llena todos los campos');
            return
        }

        crearFormActividad({
            id,
            idActividad,
            fotosActividad: capturasContext,
        });

        setCapturasContext([])
        setAgreAct(true);
    };

    const editarActividad = () => {

        if ([idActividad, unidad].includes('')) {
            alert('Porfavor, Llena todos los campos');
            return
        }

        const nuevaAct = actividades.map((a) => {
            if (a.id === id) {
                a.idActividad = idActividad;
                a.fotosActividad = a.fotosActividad, capturasContext;
            }

            return a;
        });

        setActividades(nuevaAct);
        setIdActividadContext('');
        setCapturasContext([])
        setAgreAct(true);
        setEditarAct(false);
        setEditarContext(false);
    };

    const eliminarActividad = (id) => {

        const nuevoFormAct = formulariosActividades.filter(fa => fa !== id)
        const nuevaAct = actividades.filter(a => a.id !== id)

        setFormulariosActividades(nuevoFormAct)
        setActividades(nuevaAct)

    };

    const abrirModalCamara = () => {
        setIdActividadContext(id);
        changeModalFotosActividad();
    }


    return (
        <>
            <div
                className="flex flex-col gap-4 my-3 mx-2 border-b pb-4 border-b-gray-400 lg:flex-row lg:gap-8 lg:items-center"
            >

                <div className="w-full flex flex-col gap-4 md:flex-row md:gap-8 md:items-center">
                    <div className="flex flex-col gap-2 w-full">

                        <label htmlFor="descripcion_actividad" className="text-sm"><b>Actividad:</b></label>

                        {/* <input
                        id="descripcion_actividad"
                        type="text"
                        onChange={(e) => setActividad(e.target.value)}
                        disabled={agreAct ? !editarAct : null}
                        className={`${agreAct
                            ? editarAct
                                ? "bg-white text-black"
                                : "bg-transparent text-gray-500 border-[#F1F1F1]"
                            : "bg-white"
                            } px-2 py-1 outline-none rounded-sm w-full border-2 placeholder:text-red-400 ${actividad === "" ? "border-red-400" : ""
                            }`}
                    /> */}

                        <div
                            className="flex gap-4 w-full"
                        >
                            <select
                                id="descripcion_actividad"
                                onChange={(e) => setIdActividad(e.target.value)}
                                disabled={agreAct ? !editarAct : null}
                                className="text-sm w-full"
                            >
                                <option
                                    value=""
                                    defaultValue
                                >
                                    {`${nombresActividades && nombresActividades.length ? 'Seleccionar Actividad' : 'Sin Actividades'}`}
                                </option>
                                {
                                    nombresActividades && nombresActividades.length &&

                                    nombresActividades.map(c => (
                                        <option
                                            key={c._id}
                                            value={`${c._id}_${c.nombreActividad}`}
                                        >
                                            {c.nombreActividad}
                                        </option>
                                    ))
                                }
                            </select>

                            <button
                                type="button"
                                className="bg-blue-900 hover:bg-blue-600 rounded-md px-3 py-1"
                                onClick={() => changeModalActividades()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5 text-white"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <label htmlFor="id_actividad" className="text-sm"><b>Unidad:</b></label>

                        <select
                            id="id_actividad"
                            onChange={(e) => setUnidad(e.target.value)}
                            disabled={agreAct ? !editarAct : null}
                            className='text-sm'
                        >
                            <option
                                value=""
                                defaultValue
                            >
                                {`${nombresUni && nombresUni.length ? 'Seleccionar Unidad' : 'Sin Unidades'}`}
                            </option>
                            {
                                nombresUni && nombresUni.length &&

                                nombresUni.map(c => (
                                    <option
                                        key={c._id}
                                        value={c._id}
                                    >
                                        {c.nombreUnidad}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-5 v">

                    <button
                        type="button"
                        onClick={abrirModalCamara}
                        disabled={agreAct ? !editarAct : null}
                        className={`${agreAct ? editarAct ? "" : "cursor-not-allowed" : ""}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                            />
                        </svg>
                    </button>

                    {agreAct && (
                        <button
                            type="button"
                            className="bg-red-400 hover:bg-red-600 p-2 rounded-full"
                            onClick={() => eliminarActividad(id)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                        </button>
                    )}

                    <button
                        type="button"
                        className={`${agreAct ? "block" : "hidden"} ${editarAct ? "hidden" : "block"} bg-orange-400 hover:bg-orange-600 px-2 rounded-full p-2`}
                        onClick={() => {
                            setEditarAct(true);
                            setEditarContext(true);
                            setCapturasContext([])
                            setIdActividadContext(id);
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className={`bg-blue-900 hover:bg-blue-600 px-2 rounded-full p-2 ${agreAct ? "hidden" : "block"
                            } ${editarAct ? "hidden" : ""}`}
                        onClick={crearActividad}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className={`bg-orange-400 hover:bg-orange-600 px-2 rounded-full p-2 ${editarAct ? "block" : "hidden"}`}
                        onClick={editarActividad}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <Modal
                isOpen={modalFotosActividad}
                style={customStylesFotoAct}
            >
                <ModalFotosActividad />
            </Modal>
        </>
    );
};
