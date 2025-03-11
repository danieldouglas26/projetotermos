const formulario = document.getElementById('formulario');
const itensSelect = document.getElementById('itens');
const termo = document.getElementById('termo');
const nomeTermo = document.getElementById('nome-termo');
const cpfTermo = document.getElementById('cpf-termo');
const listaItensTermo = document.getElementById('lista-itens-termo');
const dataTermo = document.getElementById('data-termo');



document.addEventListener('DOMContentLoaded', () => {
    fetch('/config')
        .then(response => response.json())
        .then(data => {
            // Preenche o título do termo
            document.querySelector('#termo h2').textContent = data.termo.titulo;

            // Limpa os parágrafos existentes (exceto os fixos)
            const termoSection = document.getElementById('termo');
            const paragrafos = termoSection.querySelectorAll('p');
            for (let i = paragrafos.length - 1; i >= 0; i--) {
                const paragrafo = paragrafos[i];
                if (!paragrafo.querySelector('span#nome-termo') &&
                    !paragrafo.querySelector('span#cpf-termo') &&
                    !paragrafo.querySelector('ul#lista-itens-termo') &&
                    !paragrafo.querySelector('span#data-termo')) {
                    paragrafo.remove();
                }
            }

            // Adiciona os novos parágrafos dinamicamente com quebras de linha
            const referencia = document.getElementById('nome-termo').parentElement;
            data.termo.paragrafos.forEach(textoParagrafo => {
                const novoParagrafo = document.createElement('p');
                novoParagrafo.textContent = textoParagrafo;
                termoSection.insertBefore(novoParagrafo, referencia);
                termoSection.insertBefore(document.createElement('br'), referencia);
            });

            // Preenche a lista de itens no select
            const selectItens = document.getElementById('itens');
            data.itens.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nome;
                selectItens.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar config:', error));

    // Captura o formulário e adiciona evento de submit
    const formulario = document.getElementById('formulario');
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const itensSelecionados = Array.from(itensSelect.selectedOptions).map(option => option.text);
        nomeTermo.textContent = nome;
        cpfTermo.textContent = cpf;
        listaItensTermo.innerHTML = '';
        itensSelecionados.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listaItensTermo.appendChild(li);
        });
        dataTermo.textContent = new Date().toLocaleDateString();
        termo.style.display = 'block';
    });


    // Formatação do CPF
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

});


//função para gerar pdf e ler o json de configuração (data/config.json) - Debug = true (Ele abre o pdf pelo servidor) - Debug = false (Ele baixa com o número do cpf digitado no label 'cpf')
function gerarPDF(debug = true) {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const itensSelecionados = Array.from(itensSelect.selectedOptions).map(option => option.text);
    const data = new Date().toLocaleDateString();

    fetch('/config')
        .then(response => response.json())
        .then(config => {
            const documentDefinition = {
                background: [
                    {
                        image: config.pdfConfig.logoBase64Background, // Acessa config.pdfConfig.logoBase64Background (fundo do termo)
                        style: 'background',
                        width: 595,
                        height: 842
                    }
                ],
                content: [
                    { text: config.termo.titulo, style: 'header' },
                    { text: '\n\n' + config.termo.subtitulo, style: 'subheader' },
                    {
                        ul: itensSelecionados,
                        style: 'listItem'
                    },
                    { text: 'Declaro estar ciente e de acordo com as seguintes condições:', style: 'subheader' },
                    {
                        stack: config.termo.paragrafos.map(textocorpo => ({
                            text: textocorpo,
                            margin: [0, 10]
                        })),
                        style: 'normal'
                    },
                    { text: `\nEu, ${nome}, CPF ${cpf}, declaro ter recebido o(s) item(s) acima mencionados e concordo com os termos deste documento.`, style: 'normal', bold: 'true' },
                    { text: `\n\nData: \n\n\n\n\n`, style: 'normal' },
                    { text: config.termo.linhaAssinatura, style: 'assinatura' },
                    { text: 'Assinatura ', style: 'assinatura' }
                ],
                styles: config.pdfConfig.estilos
            };

            const createpdffunction = pdfMake.createPdf(documentDefinition)

            if (debug) {
                createpdffunction.open();
            } else {
                createpdffunction.download(`termo_de_responsabilidade_${cpf}.pdf`);
            }

            console.log(createpdffunction);

        });
}