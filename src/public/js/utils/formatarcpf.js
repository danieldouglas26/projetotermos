const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', function (e) {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    let formattedValue = '';

    // Formata o CPF com pontos e traço
    for (let i = 0; i < value.length; i++) {
        if (i === 3 || i === 6) {
            formattedValue += '.';
        } else if (i === 9) {
            formattedValue += '-';
        }
        formattedValue += value[i];
    }
    e.target.value = formattedValue;

    // Validação completa do CPF
    if (value.length === 11) {
        if (!isValidCPF(value)) {
            cpfInput.setCustomValidity('CPF inválido. Verifique os números digitados.');
        } else {
            cpfInput.setCustomValidity(''); // Limpa a mensagem de erro se o CPF for válido
        }
    } else {
        cpfInput.setCustomValidity('CPF deve ter 11 dígitos.');
    }
});

// Função para verificar a validade do CPF
function isValidCPF(cpf) {
    if (/^(\d)\1*$/.test(cpf)) return false; // Verifica se todos os dígitos são iguais

    let sum = 0;
    let remainder;

    // Verifica o primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;

    // Verifica o segundo dígito verificador
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true; // CPF válido
}

const nomeInput = document.getElementById('nome');
nomeInput.addEventListener('input', function (e) {
    let value = e.target.value;
    // Remove caracteres não alfabéticos e espaços em branco
    value = value.replace(/[^a-zA-Z\s]/g, '');
    // Converte o valor para maiúsculas
    value = value.toUpperCase();
    e.target.value = value;
});
