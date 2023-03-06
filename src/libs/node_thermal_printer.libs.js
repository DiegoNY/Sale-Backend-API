const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');

class Printer {


    constructor(impresora) {
        this.printer = this.ConectarImpresora(impresora);
    }

    ConectarImpresora(impresora) {
        let printer = new ThermalPrinter({
            type: PrinterTypes.EPSON,                                  // Printer type: 'star' or 'epson'
            interface: `tcp://${impresora}`,                       // Printer interface
            characterSet: CharacterSet.SLOVENIA,                      // Printer character set - default: SLOVENIA
            removeSpecialCharacters: false,                           // Removes special characters - default: false
            lineCharacter: "=",                                       // Set character for lines - default: "-"
            breakLine: BreakLine.WORD,                                // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
            options: {                                                 // Additional options
                timeout: 1000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
            }
        });

        return printer;
    }

}


module.exports = { Printer };