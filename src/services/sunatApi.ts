export interface ResultadoDNI {
    dni: string;
    nombreCompleto: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
}

export interface ResultadoRUC {
    ruc: string;
    razonSocial: string;
    estado: string;
    condicion: string;
    direccion: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
}

export async function consultarDNI(dni: string): Promise<ResultadoDNI> {
    const limpio = dni.trim().replace(/\D/g, "");
    if (limpio.length !== 8) {
        throw new Error("El DNI debe contener exactamente 8 dígitos numéricos");
    }

    const urls = [
        `/api-peru/reniec/dni?numero=${limpio}`,
        `https://api.apis.net.pe/v2/reniec/dni?numero=${limpio}`,
    ];

    let ultimoError = "No se pudo conectar con el servicio de RENIEC";

    for (const url of urls) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);

            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    Accept: "application/json",
                },
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data && (data.nombreCompleto || data.nombres)) {
                    const nombreCompleto =
                        data.nombreCompleto ||
                        `${data.nombres || ""} ${data.apellidoPaterno || ""} ${data.apellidoMaterno || ""}`.trim();

                    return {
                        dni: limpio,
                        nombreCompleto,
                        nombres: data.nombres || "",
                        apellidoPaterno: data.apellidoPaterno || "",
                        apellidoMaterno: data.apellidoMaterno || "",
                    };
                }
            } else if (response.status === 404 || response.status === 422) {
                throw new Error(`El DNI ${limpio} no fue encontrado en los registros de RENIEC.`);
            }
        } catch (err: unknown) {
            const error = err as Error;
            if (error.message && error.message.includes("no fue encontrado")) {
                throw error;
            }
            ultimoError = error.message;
        }
    }

    throw new Error(
        `No se pudo obtener datos para el DNI ${limpio} (${ultimoError}). Verifica el número ingresado o digita tu nombre manualmente.`
    );
}

export async function consultarRUC(ruc: string): Promise<ResultadoRUC> {
    const limpio = ruc.trim().replace(/\D/g, "");
    if (limpio.length !== 11) {
        throw new Error("El RUC debe contener exactamente 11 dígitos numéricos");
    }

    if (!["10", "15", "17", "20"].includes(limpio.slice(0, 2))) {
        throw new Error("El RUC debe iniciar con 10, 15, 17 o 20");
    }

    const urls = [
        `/api-peru/sunat/ruc?numero=${limpio}`,
        `https://api.apis.net.pe/v2/sunat/ruc?numero=${limpio}`,
    ];

    let ultimoError = "No se pudo conectar con el servicio de SUNAT";

    for (const url of urls) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);

            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    Accept: "application/json",
                },
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data && (data.razonSocial || data.nombre)) {
                    const razonSocial = data.razonSocial || data.nombre;
                    const direccion =
                        data.direccion ||
                        `${data.distrito || ""}, ${data.provincia || "LIMA"}, ${data.departamento || "LIMA"}`.trim();

                    return {
                        ruc: limpio,
                        razonSocial,
                        estado: data.estado || "ACTIVO",
                        condicion: data.condicion || "HABIDO",
                        direccion: direccion || "LIMA - PERÚ",
                        departamento: data.departamento,
                        provincia: data.provincia,
                        distrito: data.distrito,
                    };
                }
            } else if (response.status === 404 || response.status === 422) {
                throw new Error(`El RUC ${limpio} no fue encontrado en el padrón de SUNAT.`);
            }
        } catch (err: unknown) {
            const error = err as Error;
            if (error.message && error.message.includes("no fue encontrado")) {
                throw error;
            }
            ultimoError = error.message;
        }
    }

    throw new Error(
        `No se pudo obtener datos para el RUC ${limpio} (${ultimoError}). Verifica el número ingresado o digita tu razón social manualmente.`
    );
}
