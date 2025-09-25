export function formatValue(value: string | number | undefined): number | undefined {
    if (value === undefined || value === null) return undefined;
  
    let stringValue: string;
  
    // Se o valor for um número, converta-o para string
    if (typeof value === 'number') {
      stringValue = value.toString();
    } else {
      stringValue = value.toString();
    }
  
    // Verificar se o valor contém vírgula (para tratar como decimal)
    if (stringValue.includes(',')) {
      // Remover possíveis separadores de milhar
      stringValue = stringValue.replace(/\./g, '');
  
      // Substituir a vírgula por ponto para usar como separador decimal
      stringValue = stringValue.replace(',', '.');
    }
  
    // Converter a string para número
    const formattedValue = parseFloat(stringValue);
  
    // Retornar o valor se for um número válido, senão undefined
    return isNaN(formattedValue) ? undefined : formattedValue;
  }
  