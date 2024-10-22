import { useState } from 'react'
import useUsuario from '@/hooks/useUsuario';

export default function AgregarManoObra({ id }) {

    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState(0);
    const [agreMO, setAgreMO] = useState(false);
    const [editarMO, setEditarMO] = useState(false);

    const {
        crearFormManoObra,
        formulariosManoObra,
        manoObras,
        setFormulariosManoObra,
        setManoObras
    } = useUsuario()

    const crearManoObra = () => {

        if ([descripcion, cantidad].includes('')) {
            alert('Porfavor, Llena todos los campos');
            return
        }

        crearFormManoObra({
            id,
            descripcion,
            cantidad
        })

        setAgreMO(true);
    };

    const eliminarManoObra = (id) => {

        const nuevoFormManoObra = formulariosManoObra.filter(mo => mo !== id);
        const nuevoManoObras = manoObras.filter(mo => mo.id !== id);

        setFormulariosManoObra(nuevoFormManoObra);
        setManoObras(nuevoManoObras);

    };

    const editarManoObra = () => {

        if ([descripcion, cantidad].includes('')) {
            alert('Porfavor, Llena todos los campos');
            return
        }

        const nuevoManoObra = manoObras.map((mo) => {
            if (mo.id === id) {
                mo.descripcion = descripcion,
                    mo.cantidad = cantidad
            }

            return mo;
        });

        setManoObras(nuevoManoObra);
        setAgreMO(true);
        setEditarMO(false);
        //setEditarContext(false);
    };

    return (
        <div
            className="flex flex-col gap-4 my-3 mx-2 border-b pb-4 border-b-gray-400 lg:flex-row lg:gap-8 lg:items-center"
        >
            <div className="w-full flex flex-col gap-4 md:flex-row md:gap-8 md:items-center">
                <div
                    className="w-full flex flex-col gap-2"
                >
                    <label
                        htmlFor="descripcion_mano_obra"
                        className='text-sm'
                    >
                        <b>Descripcion:</b>
                    </label>

                    <input
                        id="descripcion_mano_obra"
                        className='text-sm w-full'
                        type="text"
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder='Seleccionar Opcion'
                    />
                </div>

                <div
                    className="w-full flex flex-col gap-2"
                >
                    <label
                        htmlFor="cantidad_mano_obra"
                        className='text-sm'
                    >
                        <b>Cantidad:</b>
                    </label>

                    <input
                        id="cantidad_mano_obra"
                        className='text-sm w-full'
                        type="text"
                        onChange={(e) => setCantidad(e.target.value)}
                        placeholder='Cantidad'
                    />
                </div>
            </div>

            <div className="flex gap-3">
                {agreMO && (
                    <button
                        type="button"
                        className="bg-red-400 hover:bg-red-600 p-2 rounded-full"
                        onClick={() => eliminarManoObra(id)}
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
                    className={`${agreMO ? "block" : "hidden"} ${editarMO ? "hidden" : "block"} bg-orange-400 hover:bg-orange-600 px-2 rounded-full p-2`}
                    onClick={() => {
                        setEditarMO(true);
                        // setEditarContext(true);
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
                    className={`bg-blue-900 hover:bg-blue-600 px-2 rounded-full p-2 ${agreMO ? "hidden" : "block"
                        } ${editarMO ? "hidden" : ""}`}
                    onClick={crearManoObra}
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
                    className={`bg-orange-400 hover:bg-orange-600 px-2 rounded-full p-2 ${editarMO ? "block" : "hidden"}`}
                    onClick={editarManoObra}
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
    )
}
