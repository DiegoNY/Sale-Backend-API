const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');
const { EMPRESA, MEDIDAS } = require('../config');

class Printer {


    constructor(impresora, data) {
        this.impresora = impresora;
        this.printer = this.ConectarImpresora(impresora);
        this.Imprimir(data);
    }

    ConectarImpresora(impresora) {
        try {
            let printer = new ThermalPrinter({
                type: PrinterTypes.EPSON,                                  // Printer type: 'star' or 'epson'
                interface: `tcp://${impresora}`,
                characterSet: CharacterSet.PC850_MULTILINGUAL,                      // Printer character set - default: SLOVENIA
                removeSpecialCharacters: false,                           // Removes special characters - default: false
                lineCharacter: "=",                                       // Set character for lines - default: "-"
                breakLine: BreakLine.WORD,                                // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
                options: {                                                 // Additional options
                    timeout: 2000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
                }
            });

            // Check if printer is connected, return bool of status

            return printer;
        } catch (Error) {
            console.log("Error en la libreria Thermal printer ", Error)
            return this.informacion = { error: true, message: Error };
        }

    }

    async Imprimir(data) {

        let isConnected = await this.printer.isPrinterConnected();
        if (!isConnected) {
            console.log("Error al conectarse a la impresora ", this.impresora);
            return this.informacion = { error: true, message: `Error al conectarse a la impresora${this.impresora}` }
        }

        let hoy = new Date();
        let hora = hoy.toLocaleTimeString();

        this.printer.alignCenter();
        this.printer.println(`${EMPRESA.NOMBRE}`);
        this.printer.println(`${EMPRESA.RUC}`);
        this.printer.println(`${EMPRESA.DIRECCION}`);
        this.printer.println(`TELF ${EMPRESA.TELEFONO}`);
        this.printer.println("===============================================");
        this.printer.println(`${data.tipo_documento}`);
        this.printer.println(`${data.numero_venta}`);
        this.printer.println("===============================================");
        this.printer.alignLeft();
        this.printer.println(`Fecha:                  ${`${hoy.toISOString()}`.substring(0, 10)}  ${hora}`);
        this.printer.println(`CLIENTE                 ${data.cliente}`);
        this.printer.println(`DNI                     ${data.identificacion}`);
        this.printer.println(`VENDEDOR                ${data.nombre_usuario}`);
        this.printer.println("===============================================");
        data?.productos?.map((producto) => {

            let medida = '';

            for (let key in MEDIDAS) {
                if (MEDIDAS[key].identificador === producto?.medida) {
                    medida = MEDIDAS[key].nombre
                }
            }
            this.printer.leftRight(`${producto.descripcion} ${producto.cantidad_comprada} ${medida}`, `S/${producto.precio}`)
            this.printer.leftRight(`Total :`, `S/${producto.total}`)

        })

        this.printer.alignLeft();
        this.printer.println("===============================================");
        this.printer.println(`SON : DOS CON TANTO TANTO`);
        this.printer.println("===============================================");
        this.printer.alignCenter();

        this.printer.printQR("http://192.168.1.11/puntoventa", {
            cellSize: 8,             // 1 - 8
            correction: 'H',         // L(7%), M(15%), Q(25%), H(30%)
            model: 1                 // 1 - Model 1
            // 2 - Model 2 (standard)
            // 3 - Micro QR
        })

        this.printer.println(`Autorizado con resolucion N°${EMPRESA.AUTORIZACION} `);
        this.printer.println(`Representante impresa del documento electronico `);
        this.printer.println(`http://rcingenieros.sac.com`);
        this.printer.println(`Gracias por su compra`);


        this.printer.cut()

        this.printer.execute((err) => {

            if (err) {
                console.error("Error al imprimir", err)
                return this.informacion = { error: true, message: err };
            }

            return this.informacion = { error: false, message: data };
        })
    }

}


module.exports = { Printer };