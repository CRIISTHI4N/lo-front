import useUsuario from "@/hooks/useUsuario"
import { useRef, useState, useEffect } from "react"
import { generarId } from "@/helpers";

export default function ModalFotosActividad() {

    const [cerrarCamara, setCerrarCamara] = useState(false);
    const [capturas, setCapturas] = useState([]);
    const [opcion, setOpcion] = useState(true);

    const {
        changeModalFotosActividad,
        deviceType,
        actividades,
        idActividadContext,
        setIdActividadContext,
        setCapturasContext,
        capturasContext,
        editarContext,
        setEditarContext
    } = useUsuario()

    //Foto Desktop
    const video = useRef(null);

    //Foto Movil
    const imagenPhone = useRef(null);

    const cerrarCamaraModal = () => {

        if (video.current !== null) {

            const stream = video.current.srcObject;

            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                video.current.srcObject = null;
            }
        }
    }

    const controlModal = () => {

        if (editarContext) {

            // setCapturasContext(capturas);

            actividades.map(a => {
                if (a.id === idActividadContext) {
                    a.fotosActividad = capturas;
                }
            });

            setEditarContext(false);

        } else {
            setCapturasContext(capturas);
        }

        cerrarCamaraModal();

        setIdActividadContext('');
        setCerrarCamara(false);
        changeModalFotosActividad();

    }

    const abrirCamara = async () => {

        setCerrarCamara(true)

        const constrain = {
            audio: false,
            video: true
        }

        const handleSucces = async (stream) => {

            video.current.srcObject = stream

            try {
                await video.current.play();
            } catch (error) {
                console.error('Error al reproducir el video:', error);
            }
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

    const tomarFoto = async (e, dispositivo) => {

        e.preventDefault();

        if (dispositivo === "movil" || dispositivo === "desktop_input") {

            const imagenes = imagenPhone.current.files;

            const nuevasCapturas = [];

            for (let i = 0; i < imagenes.length; i++) {
                const file = imagenes[i];

                // Guardar directamente el archivo (blob) en el array de capturas
                nuevasCapturas.push({ id: generarId(), fotoActividadUrl: file });
            }

            setCapturas([...capturas, ...nuevasCapturas]);

        } else if (dispositivo === "desktop") {

            const canvas = document.createElement('canvas');
            const contexto = canvas.getContext("2d");

            const width = video.current.videoWidth;
            const height = video.current.videoHeight;

            canvas.width = width;
            canvas.height = height;

            contexto.drawImage(video.current, 0, 0, width, height);

            canvas.toBlob((blob) => {
                // Añadir id único para cada imagen
                const newImage = { id: Date.now(), fotoActividadUrl: blob };
                // Guardar el blob en el estado
                setCapturas([...capturas, newImage]);
            }, 'image/png');

        }
    }

    const eliminarImagen = (id) => {

        if (editarContext) {
            const actividad = actividades.find(a => a.id === idActividadContext);

            if (actividad.fotosActividad.length) {
                const imagenesFiltradas = actividad.fotosActividad.filter(q => q.id !== id);
                actividad.fotosActividad = imagenesFiltradas
                setCapturas(imagenesFiltradas)
            }

        } else {
            const nuevasImagenes = capturas.filter(c => c.id !== id)
            setCapturas(nuevasImagenes)
        }

    }


    // Guardar Fotos
    const enviarDatos = () => {

        if (editarContext) {

            // setCapturasContext(capturas);

            actividades.map(a => {
                if (a.id === idActividadContext) {
                    a.fotosActividad = capturas;
                }
            });

            setEditarContext(false);

        } else {
            setCapturasContext(capturas);
        }

        controlModal();

    }

    useEffect(() => {

        if (editarContext) {
            return
        }

        if (capturasContext) {
            setCapturas(capturasContext);
        }

    }, [capturasContext])

    useEffect(() => {

        actividades.map((a) => {
            if (a.id === idActividadContext) {
                setCapturas(a.fotosActividad);
                return
            }
        });

    }, [idActividadContext])


    return (
        <>
            <div className="py-5 px-5 border-b-2 border-b-gray-800">
                <div className="text-center">
                    <button onClick={controlModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-red-100 hover:bg-red-600 hover:text-white p-1 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <h2 className='text-xl text-center'><b>Fotografías</b></h2>
            </div>

            <div className="py-10 px-12">

                <div
                    className="flex justify-center w-[50%] m-auto mb-5"
                >
                    <button
                        type="button"
                        className="px-5 py-3 bg-blue-900 hover:bg-blue-600 text-white rounded-l-full cursor-pointer text-sm"
                        onClick={() => setOpcion(false)}
                    >
                        Tomar Foto
                    </button>

                    <span
                        type="button"
                        className="px-5 py-3 bg-blue-900 hover:bg-blue-600 text-white rounded-r-full cursor-pointer text-sm"
                        onClick={() => setOpcion(true)}
                    >
                        Subir Foto
                    </span>
                </div>


                {deviceType === 'mobile' ? (

                    opcion ?

                        <>

                            <label htmlFor="iser"
                                className="flex gap-3 bg-white hover:bg-blue-300 transition-colors px-6 py-4 border-2 border-black border-dashed hover:cursor-pointer w-fit m-auto mb-5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                </svg>

                                <span>Eleguir archivos</span>
                            </label>

                            <input
                                type="file"
                                id="iser"
                                ref={imagenPhone}
                                accept="image/*"
                                onChange={(e) => tomarFoto(e, "desktop_input")}
                                multiple
                                hidden
                            />
                        </>

                        :

                        <>
                            <label
                                htmlFor="iser"
                                className="w-full flex flex-col items-center my-7"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                </svg>

                                Abrir Cámara Celular
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
                                multiple
                            />
                        </>

                )
                    :
                    (

                        opcion ?
                            <>

                                <label htmlFor="iser"
                                    className="flex gap-3 bg-white hover:bg-blue-300 transition-colors px-6 py-4 border-2 border-black border-dashed hover:cursor-pointer w-fit m-auto mb-5"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                    </svg>

                                    <span>Eleguir archivos</span>
                                </label>

                                <input
                                    type="file"
                                    id="iser"
                                    ref={imagenPhone}
                                    accept="image/*"
                                    onChange={(e) => tomarFoto(e, "desktop_input")}
                                    multiple
                                    hidden
                                />
                            </>
                            :

                            cerrarCamara ?
                                <>
                                    <div
                                        className="w-full sm:w-[300px] h-[300px] m-auto"
                                    >
                                        <video
                                            ref={video}
                                            className="w-full h-full object-cover aspect-square border-2 border-black border-dashed"
                                        >
                                        </video>
                                    </div>

                                    <div
                                        className="flex gap-5 justify-center my-5"
                                    >
                                        <button
                                            type="button"
                                            onClick={(e) => tomarFoto(e, "desktop")}
                                            className="bg-[#3f94b9] rounded-md p-3 hover:bg-[#3d7e9a] font-bold text-sm"
                                        >
                                            Tomar Foto
                                        </button>

                                        <button
                                            type="button"
                                            onClick={controlModal}
                                            className="cursor-pointer bg-[#ff6347] rounded-md p-3 hover:bg-[#d6553e] font-bold text-sm"
                                        >
                                            Cerrar Cámara
                                        </button>
                                    </div>
                                </>
                                :
                                <>
                                    <button
                                        type="button"
                                        onClick={abrirCamara}
                                        className="flex flex-col gap-2 items-center m-auto mb-5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                        </svg>
                                        <span className="text-sm">Abrir Cámara Compu</span>
                                    </button>
                                </>
                    )
                }

                <span>capturas modal</span>

                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {capturas.map(c =>

                        c.fotoActividadUrl &&

                        <div
                            className="w-full relative"
                            key={c.id}
                        >
                            <img
                                className="w-full object-cover aspect-square"
                                // Crear un URL para mostrar el blob
                                src={URL.createObjectURL(c.fotoActividadUrl)}
                            />

                            <button
                                type="button"
                                onClick={() => eliminarImagen(c.id)}
                                className="absolute bottom-4 w-fit cursor-pointer text-white text-sm bg-gray-900 py-1 px-6 hover:bg-red-600 rounded-r-md"
                            >
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>

                <span>editarContext</span>

                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                    {editarContext && capturasContext && capturasContext.length &&

                        capturasContext.map(c =>
                            <div
                                className="w-full relative"
                                key={c.id}
                            >
                                <img
                                    className="w-full object-cover aspect-square"
                                    // Crear un URL para mostrar el blob
                                    src={URL.createObjectURL(c.fotoActividadUrl)}
                                />

                                <button
                                    type="button"
                                    onClick={() => eliminarImagen(c.id)}
                                    className="absolute bottom-4 w-fit cursor-pointer text-white text-sm bg-gray-900 py-1 px-6 hover:bg-red-600 rounded-r-md"
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}
                </div>

                {/* <button
                    type="button"
                    className={`${capturas.length ? 'block m-auto' : 'hidden'} text-white bg-blue-900 rounded-md p-1 hover:bg-blue-700 px-8 mt-5`}
                    onClick={enviarDatos}
                >
                    Guardar Fotos
                </button> */}
            </div>
        </>
    )
}
