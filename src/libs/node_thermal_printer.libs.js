const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');

const { EMPRESA, MEDIDAS } = require('../config');
const { numberInFullConverterES } = require('./numero_es/writer/writeNumberInFullES');

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

        // const total = this.numberToName(data.total)
        let moneda;
        let dineroVenta;
        let centimos = '00';

        if (data.tipo_moneda == 'SOLES') moneda = 'SOLES';
        if (data.tipo_moneda == 'DOLARES') moneda = 'DÓLARES AMERICANOS';

        if (Number.isInteger(data.total)) {
            dineroVenta = this.numberToName(data.total);
            if (dineroVenta === 'uno') {
                dineroVenta = 'UNO';
                if (moneda == 'SOLES') moneda = 'SOL';
                if (moneda == 'DÓLARES AMERICANOS') moneda = 'DOLAR';
            };
        } else {
            let total = data.total?.toString()?.split('.') || [];
            dineroVenta = this.numberToName(total[0]);
            if (dineroVenta == 'uno') {
                dineroVenta = 'UNO';
                if (moneda == 'SOLES') moneda = 'SOL';
                if (moneda == 'DÓLARES AMERICANOS') moneda = 'DOLAR';
            };
            centimos = total[1]?.toString()?.padEnd(2, '0');
        }


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
        this.printer.leftRight(`DESCRIPCION      `, `TOTAL  `)
        this.printer.println("===============================================");
        data?.productos?.map((producto) => {

            let medida = '';

            for (let key in MEDIDAS) {
                if (MEDIDAS[key].identificador === producto?.medida) {
                    medida = MEDIDAS[key].nombre
                }
            }
            this.printer.leftRight(`${producto.descripcion} ${producto.cantidad_comprada} ${producto.nombre}`, `${producto.precio}   `)
            this.printer.leftRight(`Total :`, `${producto.total}   `)

        })

        this.printer.leftRight('', `Total:   ${data.total}   `);
        this.printer.alignLeft();
        this.printer.println("===============================================");
        this.printer.println(`SON : ${dineroVenta.toUpperCase()} CON ${centimos}/100 ${data.tipo_moneda}`);
        this.printer.println("===============================================");
        this.printer.alignCenter();


        let tipoDocumento;

        switch (data.tipo_documento) {
            case 'TICKET ELECTRONICO':
                tipoDocumento = 'TICKET ELECTRONICO';
                break;

            case 'BOLETA ELECTRONICA':
                tipoDocumento = '03';
                break;

            case 'FACTURA ELECTRONICA':
                tipoDocumento = '01';
                break;

            default:
                break;
        }


        if (tipoDocumento != 'TICKET ELECTRONICO') {

            this.printer.printQR(`${EMPRESA.RUC}|${tipoDocumento}|${data.igv.toString().split('.')[0]}.${data.igv.toString().split('.')[1].substring(0, 2)}|${data.subtotal.toString().split('.')[0]}${data.subtotal.toString().split('.')[1].substring(0, 2)}|${`${hoy.toISOString()}`.substring(0, 10)}|${data?.tipo_identificacion}|${data.identificacion}`, {
                cellSize: 8,             // 1 - 8
                correction: 'H',         // L(7%), M(15%), Q(25%), H(30%)
                model: 1                 // 1 - Model 1
                // 2 - Model 2 (standard)
                // 3 - Micro QR
            })

        }

        this.printer.println(`Autorizado con resolucion N°${EMPRESA.AUTORIZACION} `);
        this.printer.println(`Representante impresa del documento electronico `);
        this.printer.println(`${EMPRESA.REPRESENTANTE}`);
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

    numberToName(num) {
        const numero = numberInFullConverterES(num || 0);
        return numero;
    }

}


module.exports = { Printer };