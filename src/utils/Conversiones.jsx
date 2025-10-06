
export function ConvertirCapitalize(input) {
    return (input.charAt(0).toUpperCase()+input.slice(1).toLowerCase());
  }
  export function ConvertirMinusculas(input){
    return input.toLowerCase()
  }
  export function FormatearNumeroDinero(numero,currency,iso){
    if(currency===undefined){
      return;
    }
    const esiso="es-" + iso
    const numeroconvertido=numero.toLocaleString(esiso,{style:"currency",currency:`${currency}` })
    return numeroconvertido
  }
  export  const urlToBase64 = async(imageUrl)=>{
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const reader = new FileReader()
    return new Promise ((resolve,reject)=>{
      reader.onloadend=()=>{
        resolve(reader.result)
      }
      reader.onerror = reject;
      reader.readAsDataURL(blob)
    })
  }
  export function numeroALetras(num,nombreMoneda) {
    const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const especiales = {
      10: "DIEZ", 11: "ONCE", 12: "DOCE", 13: "TRECE", 14: "CATORCE", 15: "QUINCE",
      16: "DIECISÉIS", 17: "DIECISIETE", 18: "DIECIOCHO", 19: "DIECINUEVE",
      20: "VEINTE"
    };
  
    const [entero, decimal] = num.toFixed(2).split(".");
    const n = parseInt(entero, 10);
  
    let texto = "";
  
    if (n === 0) texto = "CERO";
    else if (n < 10) texto = unidades[n];
    else if (n < 21) texto = especiales[n];
    else {
      const dec = Math.floor(n / 10);
      const uni = n % 10;
      texto = decenas[dec];
      if (uni > 0) texto += " Y " + unidades[uni];
    }
  
    return `SON: ${texto} CON ${decimal}/100 ${nombreMoneda}`;
  }
  