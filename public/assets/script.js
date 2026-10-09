function pegarCabecalhoToken() {
    return { Authorization: "Bearer " + localStorage.getItem("token") };
}

function irParaLogin() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ==========================================================
// MODAIS (substituem alert() e confirm())
// Uso:
//   await mostrarModal("Mensagem", { tipo: "sucesso" });       // tipos: sucesso | erro | aviso | info
//   const ok = await mostrarConfirmacao("Tem certeza?");       // true / false
// Não precisa mexer no HTML nem no CSS: o estilo é injetado aqui.
// Para trocar as cores, altere as variáveis no começo do CSS abaixo.
// ==========================================================
(function injetarEstiloModalAlerta() {
    if (document.getElementById("estilo_modal_alerta")) {
        return;
    }

    const estilo = document.createElement("style");
    estilo.id = "estilo_modal_alerta";
    estilo.textContent = `
        .modal_alerta_fundo {
            --modal_cor_principal: #0f5fa8;
            --modal_cor_sucesso: #1b8a4b;
            --modal_cor_erro: #d23b3b;
            --modal_cor_aviso: #c98200;
            --modal_cor_info: #0f5fa8;
            --modal_cor_texto: #1f2933;
            --modal_cor_texto_suave: #52606d;

            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(15, 23, 42, 0.55);
            animation: modal_alerta_fundo_entrar 0.18s ease-out;
            overflow-y: auto;
        }

        .modal_alerta_fundo.saindo {
            opacity: 0;
            transition: opacity 0.15s ease-in;
        }

        .modal_alerta_caixa {
            box-sizing: border-box;
            width: 100%;
            max-width: 420px;
            max-height: calc(100% - 8px);
            overflow-y: auto;
            padding: 28px 24px 22px;
            border-radius: 14px;
            background: #ffffff;
            color: var(--modal_cor_texto);
            text-align: center;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.3);
            animation: modal_alerta_caixa_entrar 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2);
            font-family: inherit;
        }

        .modal_alerta_icone {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
            margin: 0 auto 14px;
            border-radius: 50%;
            background: color-mix(in srgb, var(--modal_cor_tipo) 14%, #ffffff);
            color: var(--modal_cor_tipo);
        }

        .modal_alerta_icone svg {
            width: 30px;
            height: 30px;
        }

        .modal_alerta_sucesso { --modal_cor_tipo: var(--modal_cor_sucesso); }
        .modal_alerta_erro    { --modal_cor_tipo: var(--modal_cor_erro); }
        .modal_alerta_aviso   { --modal_cor_tipo: var(--modal_cor_aviso); }
        .modal_alerta_info    { --modal_cor_tipo: var(--modal_cor_info); }

        .modal_alerta_titulo {
            margin: 0 0 8px;
            font-size: 1.2rem;
            font-weight: 700;
            line-height: 1.3;
            color: var(--modal_cor_texto);
        }

        .modal_alerta_mensagem {
            margin: 0 0 22px;
            font-size: 0.98rem;
            line-height: 1.5;
            color: var(--modal_cor_texto_suave);
            white-space: pre-line;
            overflow-wrap: anywhere;
        }

        .modal_alerta_botoes {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .modal_alerta_botao {
            flex: 1 1 0;
            min-height: 44px;
            padding: 10px 18px;
            border: 2px solid transparent;
            border-radius: 10px;
            font: inherit;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s, border-color 0.15s, transform 0.05s;
        }

        .modal_alerta_botao:active {
            transform: scale(0.98);
        }

        .modal_alerta_botao:focus-visible {
            outline: 3px solid color-mix(in srgb, var(--modal_cor_principal) 45%, transparent);
            outline-offset: 2px;
        }

        .modal_alerta_botao_primario {
            background: var(--modal_cor_tipo);
            color: #ffffff;
        }

        .modal_alerta_botao_primario:hover {
            filter: brightness(0.92);
        }

        .modal_alerta_botao_secundario {
            background: #ffffff;
            border-color: #cbd2d9;
            color: var(--modal_cor_texto);
        }

        .modal_alerta_botao_secundario:hover {
            background: #f1f4f7;
        }

        @media (max-width: 480px) {
            .modal_alerta_fundo {
                padding: 12px;
                align-items: flex-end;
            }

            .modal_alerta_caixa {
                max-width: none;
                padding: 24px 18px 18px;
                border-radius: 16px;
            }

            .modal_alerta_botoes {
                flex-direction: column-reverse;
            }

            .modal_alerta_botao {
                flex: none;
                width: 100%;
            }
        }

        @keyframes modal_alerta_fundo_entrar {
            from { opacity: 0; }
            to   { opacity: 1; }
        }

        @keyframes modal_alerta_caixa_entrar {
            from { opacity: 0; transform: translateY(14px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
            .modal_alerta_fundo,
            .modal_alerta_caixa {
                animation: none;
            }
        }
    `;

    document.head.appendChild(estilo);
})();

const ICONES_MODAL_ALERTA = {
    sucesso:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    erro:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    aviso:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v6"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>',
    info:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 11v6"/><circle cx="12" cy="7.4" r="0.6" fill="currentColor"/></svg>',
};

const TITULOS_MODAL_ALERTA = {
    sucesso: "Tudo certo",
    erro: "Algo deu errado",
    aviso: "Atenção",
    info: "Aviso",
};

function criarModalAlerta({ mensagem, tipo, titulo, botoes, valorAoDispensar }) {
    return new Promise((resolve) => {
        const elementoAnterior = document.activeElement;
        const textoMensagem = Array.isArray(mensagem) ? mensagem.join("\n") : String(mensagem ?? "");
        const idBase = "modal_alerta_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

        const fundo = document.createElement("div");
        fundo.className = "modal_alerta_fundo";

        const caixa = document.createElement("div");
        caixa.className = `modal_alerta_caixa modal_alerta_${tipo}`;
        caixa.setAttribute("role", "alertdialog");
        caixa.setAttribute("aria-modal", "true");
        caixa.setAttribute("aria-labelledby", idBase + "_titulo");
        caixa.setAttribute("aria-describedby", idBase + "_mensagem");

        const icone = document.createElement("div");
        icone.className = "modal_alerta_icone";
        icone.innerHTML = ICONES_MODAL_ALERTA[tipo];

        const tituloElemento = document.createElement("h2");
        tituloElemento.className = "modal_alerta_titulo";
        tituloElemento.id = idBase + "_titulo";
        tituloElemento.textContent = titulo || TITULOS_MODAL_ALERTA[tipo];

        const mensagemElemento = document.createElement("p");
        mensagemElemento.className = "modal_alerta_mensagem";
        mensagemElemento.id = idBase + "_mensagem";
        mensagemElemento.textContent = textoMensagem;

        const areaBotoes = document.createElement("div");
        areaBotoes.className = "modal_alerta_botoes";

        function fechar(resultado) {
            document.removeEventListener("keydown", aoPressionarTecla, true);

            fundo.classList.add("saindo");
            setTimeout(() => {
                fundo.remove();

                if (!document.querySelector(".modal_alerta_fundo")) {
                    document.body.style.overflow = "";
                }
            }, 150);

            if (elementoAnterior && typeof elementoAnterior.focus === "function") {
                elementoAnterior.focus();
            }

            resolve(resultado);
        }

        const elementosBotao = botoes.map((config) => {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.className =
                "modal_alerta_botao " +
                (config.primario ? "modal_alerta_botao_primario" : "modal_alerta_botao_secundario");
            botao.textContent = config.texto;
            botao.addEventListener("click", () => fechar(config.valor));
            areaBotoes.appendChild(botao);
            return botao;
        });

        function aoPressionarTecla(evento) {
            // só o modal mais acima reage ao teclado
            const abertos = document.querySelectorAll(".modal_alerta_fundo");
            if (abertos[abertos.length - 1] !== fundo) {
                return;
            }

            if (evento.key === "Escape") {
                evento.preventDefault();
                fechar(valorAoDispensar);
                return;
            }

            // mantém o foco dentro do modal
            if (evento.key === "Tab") {
                const primeiro = elementosBotao[0];
                const ultimo = elementosBotao[elementosBotao.length - 1];

                if (evento.shiftKey && document.activeElement === primeiro) {
                    evento.preventDefault();
                    ultimo.focus();
                } else if (!evento.shiftKey && document.activeElement === ultimo) {
                    evento.preventDefault();
                    primeiro.focus();
                }
            }
        }

        // clicar fora da caixa fecha
        fundo.addEventListener("click", (evento) => {
            if (evento.target === fundo) {
                fechar(valorAoDispensar);
            }
        });

        document.addEventListener("keydown", aoPressionarTecla, true);

        caixa.appendChild(icone);
        caixa.appendChild(tituloElemento);
        caixa.appendChild(mensagemElemento);
        caixa.appendChild(areaBotoes);
        fundo.appendChild(caixa);

        document.body.appendChild(fundo);
        document.body.style.overflow = "hidden";

        const botaoPrimario = botoes.findIndex((config) => config.primario);
        elementosBotao[botaoPrimario >= 0 ? botaoPrimario : 0].focus();
    });
}

// substitui alert(): devolve uma Promise que resolve quando o modal fecha
function mostrarModal(mensagem, opcoes = {}) {
    const tipo = opcoes.tipo || "info";

    return criarModalAlerta({
        mensagem: mensagem,
        tipo: tipo,
        titulo: opcoes.titulo,
        botoes: [{ texto: opcoes.textoBotao || "Entendi", valor: true, primario: true }],
        valorAoDispensar: true,
    });
}

// substitui confirm(): devolve uma Promise com true (confirmou) ou false (cancelou)
function mostrarConfirmacao(mensagem, opcoes = {}) {
    return criarModalAlerta({
        mensagem: mensagem,
        tipo: opcoes.tipo || "aviso",
        titulo: opcoes.titulo,
        botoes: [
            { texto: opcoes.textoCancelar || "Cancelar", valor: false, primario: false },
            { texto: opcoes.textoConfirmar || "Confirmar", valor: true, primario: true },
        ],
        valorAoDispensar: false,
    });
}

// link "Denúncias" exige login
document.querySelectorAll('a[href="painelcidadao.html"]').forEach((link) => {
    link.addEventListener("click", (evento) => {
        if (!localStorage.getItem("token")) {
            evento.preventDefault();
            mostrarModal("Faça login para ver as denúncias.", {
                tipo: "aviso",
                titulo: "Login necessário",
                textoBotao: "Ir para o login",
            }).then(() => {
                window.location.href = "login.html";
            });
        }
    });
});

// menu mobile
const menuIcon = document.querySelector(".header_mobile_index .material-symbols-outlined");
const menu = document.querySelector(".menu");

if (menuIcon && menu) {
    menuIcon.addEventListener("click", () => {
        menu.classList.toggle("ativo");
    });
}

// faq
const perguntas = document.querySelectorAll(".caixa_de_perguntas");

perguntas.forEach((pergunta) => {
    pergunta.addEventListener("click", () => {
        const resposta = pergunta.nextElementSibling;

        document.querySelectorAll(".caixa_de_resposta_faq").forEach((r) => {
            if (r !== resposta) {
                r.classList.remove("ativo");
            }
        });

        document.querySelectorAll(".caixa_de_perguntas").forEach((p) => {
            if (p !== pergunta) {
                p.classList.remove("ativa");
            }
        });

        if (resposta) {
            resposta.classList.toggle("ativo");
        }

        pergunta.classList.toggle("ativa");
    });
});

// tipo de conta
const btnCidadao = document.getElementById("btn_cidadao");
const btnPrefeitura = document.getElementById("btn_prefeitura");
const camposCidadao = document.getElementById("campos_cidadao");
const camposPrefeitura = document.getElementById("campos_prefeitura");

function alternarTipoConta(tipo) {
    const ehCidadao = tipo === "cidadao";

    if (btnCidadao) {
        btnCidadao.classList.toggle("ativo", ehCidadao);
    }

    if (btnPrefeitura) {
        btnPrefeitura.classList.toggle("ativo", !ehCidadao);
    }

    if (camposCidadao) {
        camposCidadao.style.display = ehCidadao ? "block" : "none";
    }

    if (camposPrefeitura) {
        camposPrefeitura.style.display = ehCidadao ? "none" : "block";
    }

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const bairro = document.getElementById("bairro");

    if (name) {
        name.required = ehCidadao;
    }

    if (email) {
        email.required = ehCidadao;
    }

    if (bairro) {
        bairro.required = ehCidadao;
    }
}

if (btnCidadao) {
    btnCidadao.addEventListener("click", () => {
        alternarTipoConta("cidadao");
    });
}

if (btnPrefeitura) {
    btnPrefeitura.addEventListener("click", () => {
        alternarTipoConta("prefeitura");
    });
}

// formulário de perfil
const formPerfil = document.getElementById("form_perfil");

if (formPerfil) {
    const campos = [...formPerfil.querySelectorAll("input:not([readonly])")];
    const btnSalvar = document.getElementById("btnSalvarPerfil");
    const btnDescartar = document.getElementById("btnDescartarPerfil");
    const mensagemStatus = document.getElementById("status_form_perfil");

    let valoresSalvos = campos.map((campo) => campo.value);

    const inputNovaSenhaPerfil = document.getElementById("senha");
    const inputConfirmaPerfil = document.getElementById("senha_confirma");
    const erroConfirmaPerfil = document.getElementById("erro_senha_perfil");

    function conferirSenhasPerfil() {
        if (inputConfirmaPerfil.value === "") {
            inputConfirmaPerfil.classList.remove("campo_erro");
            erroConfirmaPerfil.textContent = "";
            return;
        }

        if (inputNovaSenhaPerfil.value !== inputConfirmaPerfil.value) {
            inputConfirmaPerfil.classList.add("campo_erro");
            erroConfirmaPerfil.textContent = "As senhas não são iguais";
        } else {
            inputConfirmaPerfil.classList.remove("campo_erro");
            erroConfirmaPerfil.textContent = "";
        }
    }

    inputNovaSenhaPerfil.addEventListener("input", conferirSenhasPerfil);
    inputConfirmaPerfil.addEventListener("input", conferirSenhasPerfil);

    function atualizarBotoes() {
        const houveMudanca = campos.some((campo, i) => {
            return campo.value.trim() !== valoresSalvos[i];
        });

        if (btnSalvar) {
            btnSalvar.disabled = !houveMudanca;
        }

        if (btnDescartar) {
            btnDescartar.disabled = !houveMudanca;
        }
    }

    window.guardarValoresAtuais = function () {
        valoresSalvos = campos.map((campo) => campo.value.trim());
        atualizarBotoes();
    };

    campos.forEach((campo) => {
        campo.addEventListener("input", () => {
            if (mensagemStatus) {
                mensagemStatus.textContent = "";
            }

            atualizarBotoes();
        });
    });

    if (btnDescartar) {
    btnDescartar.addEventListener("click", () => {
        campos.forEach((campo, i) => {
            campo.value = valoresSalvos[i];
        });

        inputConfirmaPerfil.classList.remove("campo_erro");
        erroConfirmaPerfil.textContent = "";

        if (mensagemStatus) {
            mensagemStatus.textContent = "";
        }

        atualizarBotoes();
    });
}

    formPerfil.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!formPerfil.checkValidity()) {
        formPerfil.reportValidity();
        return;
    }

    if (inputConfirmaPerfil.classList.contains("campo_erro")) {
    return;
}

    const cep = document.getElementById("gestor").value.replace(/\D/g, "");

    if (cep.length !== 8) {
        mensagemStatus.textContent = "O CEP deve ter 8 dígitos";
        return;
    }

    // senha (opcional)
    const senhaAtual = document.getElementById("senha_atual").value;
    const novaSenha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("senha_confirma").value;
    const trocandoSenha = novaSenha !== "" || confirmarSenha !== "";

    if (trocandoSenha) {
        if (!senhaAtual) {
            mensagemStatus.textContent = "Informe a senha atual";
            return;
        }
        if (novaSenha.length < 6) {
            mensagemStatus.textContent = "A nova senha deve ter pelo menos 6 caracteres";
            return;
        }
        if (novaSenha !== confirmarSenha) {
            mensagemStatus.textContent = "As senhas não são iguais";
            return;
        }
        if (novaSenha === senhaAtual) {
            mensagemStatus.textContent = "A nova senha deve ser diferente da atual";
            return;
        }
    }

    const corpo = {
        nome: document.getElementById("orgao").value.trim(),
        email: document.getElementById("email_institucional").value.trim(),
        cep: cep,
        complemento: document.getElementById("cidade").value.trim(),
    };

    if (trocandoSenha) {
        corpo.senhaAtual = senhaAtual;
        corpo.novaSenha = novaSenha;
    }

    const token = localStorage.getItem("token");

    const resposta = await fetch("/perfil", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify(corpo),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        mensagemStatus.textContent = Array.isArray(dados.message)
            ? dados.message[0]
            : dados.message;
        return;
    }

    // limpa os campos de senha antes de recarregar, senão o botão
    // "Salvar" continua habilitado com os valores antigos
    ["senha_atual", "senha", "senha_confirma"].forEach((id) => {
        document.getElementById(id).value = "";
    });

    await carregarPerfil();
    mensagemStatus.textContent = trocandoSenha
        ? "Dados e senha atualizados."
        : "Alterações salvas.";
});

    atualizarBotoes();
}

// modal de termos
const modal = document.getElementById("modalTermos");
const abrir = document.getElementById("abrirModal");
const fechar = document.getElementById("fecharModal");
const btnAceito = document.getElementById("btnAceito");
const checkbox = document.getElementById("checkboxTermos");
const btnSubmit = document.getElementById("btnSubmit");
const form = document.querySelector(".form_cadastrar");

if (abrir && modal) {
    abrir.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";
    });
}

if (fechar && modal) {
    fechar.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

if (modal) {
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

function verificarCheckbox() {
    if (btnSubmit && checkbox) {
        btnSubmit.disabled = !checkbox.checked;
    }
}

if (btnAceito && checkbox && modal) {
    btnAceito.addEventListener("click", () => {
        checkbox.checked = true;
        localStorage.setItem("termosAceitos", "true");
        modal.style.display = "none";
        verificarCheckbox();
    });
}

if (checkbox) {
    checkbox.addEventListener("change", verificarCheckbox);
}

window.addEventListener("load", () => {
    if (checkbox) {
        if (localStorage.getItem("termosAceitos")) {
            checkbox.checked = true;
        }

        verificarCheckbox();
    }
});

// validação ao vivo do cadastro
const inputCep = document.getElementById('cep');
const inputSenha = document.getElementById('senha');
const inputConfirmar = document.getElementById('confirm_senha');
const erroCep = document.getElementById('erro_cep');
const erroSenha = document.getElementById('erro_senha');

function marcarErro(input, aviso, mensagem) {
    input.classList.add('campo_erro');
    aviso.textContent = mensagem;
}

function limparErro(input, aviso) {
    input.classList.remove('campo_erro');
    aviso.textContent = '';
}

if (inputCep && erroCep) {
    inputCep.addEventListener('input', () => {
        inputCep.value = inputCep.value.replace(/\D/g, '');

        if (inputCep.value.length > 8) {
            marcarErro(inputCep, erroCep, 'O CEP deve ter 8 dígitos');
        } else {
            limparErro(inputCep, erroCep);
        }
    });

    inputCep.addEventListener('blur', () => {
        if (inputCep.value !== '' && inputCep.value.length !== 8) {
            marcarErro(inputCep, erroCep, 'O CEP deve ter 8 dígitos');
        }
    });
}

function conferirSenhas() {
    if (inputConfirmar.value === '') {
        limparErro(inputConfirmar, erroSenha);
        return;
    }

    if (inputSenha.value !== inputConfirmar.value) {
        marcarErro(inputConfirmar, erroSenha, 'As senhas não são iguais');
    } else {
        limparErro(inputConfirmar, erroSenha);
    }
}

if (inputSenha && inputConfirmar && erroSenha) {
    inputSenha.addEventListener('input', conferirSenhas);
    inputConfirmar.addEventListener('input', conferirSenhas);
}

// validação de prefeitura
function emailDePrefeitura(email) {
    return email.trim().toLowerCase().endsWith(".gov.br");
}

function validarCnpj(valor) {
    const cnpj = valor.replace(/\D/g, "");

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
        return false;
    }

    function calcularDigito(base) {
        const pesos = base.length === 12
            ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        let soma = 0;

        for (let i = 0; i < pesos.length; i++) {
            soma += Number(base[i]) * pesos[i];
        }

        const resto = soma % 11;

        return resto < 2 ? 0 : 11 - resto;
    }

    const digito1 = calcularDigito(cnpj.slice(0, 12));
    const digito2 = calcularDigito(cnpj.slice(0, 13));

    return digito1 === Number(cnpj[12]) && digito2 === Number(cnpj[13]);
}

// cadastro
const formCadastro = document.querySelector('.form_cadastrar');

if (formCadastro) {
    formCadastro.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        if (document.querySelector('.campo_erro')) {
            return;
        }

        if (!checkbox.checked) {
            await mostrarModal('Você precisa aceitar os termos!', { tipo: 'aviso' });
            return;
        }

        if (btnPrefeitura.classList.contains('ativo')) {
            const emailPref = document.getElementById('email_pref').value;
            const cnpjPref = document.getElementById('cnpj').value;
            const erroPref = document.getElementById('erro_prefeitura');

            if (!emailDePrefeitura(emailPref)) {
                erroPref.textContent = 'Este não é um e-mail de prefeitura. Use o e-mail institucional (terminado em .gov.br).';
                return;
            }

            if (!validarCnpj(cnpjPref)) {
                erroPref.textContent = 'Este CNPJ não é válido. Confira o CNPJ da prefeitura.';
                return;
            }

            erroPref.textContent = '';
            await mostrarModal('Dados Inválidos!', { tipo: 'erro' });
            return;
        }

        const nome = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const cep = document.getElementById('cep').value;
        const senha = document.getElementById('senha').value;
        const confirmar = document.getElementById('confirm_senha').value;

        if (senha !== confirmar) {
            await mostrarModal('As senhas não são iguais', { tipo: 'erro' });
            return;
        }

        if (senha.length < 6) {
            await mostrarModal('A senha deve conter pelo menos seis caracteres', { tipo: 'erro' });
            return;
        }

        if (cep.length !== 8) {
            await mostrarModal('O CEP deve conter 8 dígitos', { tipo: 'erro' });
            return;
        }

        const resposta = await fetch('https://cidademais.projetostit.com/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, cep, senha }),
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            await mostrarModal('Cadastro feito!', {
                tipo: 'sucesso',
                titulo: 'Conta criada',
                textoBotao: 'Ir para o login',
            });
            window.location.href = '/login.html';
        } else {
            await mostrarModal(dados.message, { tipo: 'erro' });
        }
    });
}

// login
const formLogin = document.querySelector('#form_login');

if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#email_login').value;
        const senha = document.querySelector('#senha_login').value;

        try {
            const resposta = await fetch('https://cidademais.projetostit.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, senha: senha }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                await mostrarModal(dados.message, { tipo: 'erro', titulo: 'Não foi possível entrar' });
                return;
            }

            localStorage.setItem('token', dados.token);
            window.location.href = '/painelcidadao.html';
        } catch (erro) {
            console.error(erro);
            await mostrarModal('Erro ao conectar com o servidor.', { tipo: 'erro' });
        }
    });
}

// perfil
async function carregarPerfil() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const resposta = await fetch('/perfil', {
        headers: { Authorization: 'Bearer ' + token },
    });

    if (!resposta.ok) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }

    const usuario = await resposta.json();

    document.getElementById('orgao').value = usuario.nome;
    document.getElementById('email_institucional').value = usuario.email;
    document.getElementById('gestor').value = usuario.cep || '';
    document.getElementById('cidade').value = usuario.complemento || '';

    document.getElementById('titulo_prefeitura').textContent = usuario.nome;

    const partes = usuario.nome.trim().split(' ');
    const iniciais = partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '');
    document.querySelector('.avatar_prefeitura').firstChild.textContent = iniciais.toUpperCase();

    const meta = document.querySelector('.meta_perfil');
    if (usuario.bairro && usuario.cidade) {
        meta.textContent = 'Bairro ' + usuario.bairro + ' · ' + usuario.cidade + ', ' + usuario.estado;
    } else {
        meta.textContent = 'Complete seu perfil para receber notificações da sua região';
    }

    if (window.guardarValoresAtuais) {
        window.guardarValoresAtuais();
    }
}

if (document.getElementById('form_perfil')) {
    carregarPerfil();
}

// menu logado / deslogado
const tokenSalvo = localStorage.getItem('token');
const linkEntrar = document.querySelector('.menu a[href*="login.html"]');
const itemBaixar = document.querySelector('.menu .baixar_agora');

if (tokenSalvo && linkEntrar) {
    const itemEntrar = linkEntrar.parentElement;
    itemEntrar.classList.remove('entrar_botao_index', 'entrar_botao_index_atual');
    itemEntrar.classList.add('menu_perfil_logado');

    linkEntrar.href = 'perfil_cidadao.html';
    linkEntrar.title = 'Meu perfil';
    linkEntrar.setAttribute('aria-label', 'Meu perfil');
    linkEntrar.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"/>' +
        '</svg>';

    if (itemBaixar) {
        itemBaixar.style.display = 'none';
    }

    const itemSair = document.createElement('li');
    itemSair.classList.add('menu_sair');

    const linkSair = document.createElement('a');
    linkSair.href = '#';
    linkSair.textContent = 'Sair';

    linkSair.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    itemSair.appendChild(linkSair);
    itemEntrar.after(itemSair);
}

if (tokenSalvo && document.querySelector('#form_login')) {
    window.location.href = 'perfil_cidadao.html';
}

// ajudantes da ocorrência
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function tempoAtras(dataTexto) {
    const segundos = Math.floor((Date.now() - new Date(dataTexto).getTime()) / 1000);

    if (isNaN(segundos) || segundos < 60) {
        return "Reportado agora há pouco";
    }

    const minutos = Math.floor(segundos / 60);

    if (minutos < 60) {
        return `Reportado há ${minutos} min`;
    }

    const horas = Math.floor(minutos / 60);

    if (horas < 24) {
        return `Reportado há ${horas} h`;
    }

    const dias = Math.floor(horas / 24);

    return `Reportado há ${dias} ${dias === 1 ? "dia" : "dias"}`;
}

// página de ocorrência (a de edição também tem #titulo_ocorrencia)
const tituloOcorrencia = document.querySelector("#local_ocorrencia") ? document.querySelector("#titulo_ocorrencia") : null;

if (tituloOcorrencia) {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
    } else if (!id) {
        tituloOcorrencia.textContent = "Ocorrência não encontrada";
    } else {
        const botaoEditar = document.querySelector("#btn_editar");

        if (botaoEditar) {
            const destinoEditar = `editarocorrencia.html?id=${id}`;

            botaoEditar.closest("a").href = destinoEditar;

            botaoEditar.addEventListener("click", () => {
                window.location.href = destinoEditar;
            });
        }

        fetch(`/problemas/${id}`, {
            headers: pegarCabecalhoToken(),
        })
            .then(async (resposta) => {
                if (resposta.status === 401) {
                    irParaLogin();
                    return;
                }

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar ocorrência");
                }

                return resposta.json();
            })

            .then((problema) => {
                document.querySelector("#status_ocorrencia").textContent =
                    capitalizar(problema.status);

                document.querySelector("#tempo_ocorrencia").textContent =
                    tempoAtras(problema.criado_em);

                const complementoTexto = document.querySelector("#complemento_texto");

                complementoTexto.textContent = problema.complemento
                    ? `Complemento: ${problema.complemento}`
                    : "";

                document.title =
                    `Ocorrência #URB-${String(problema.id).padStart(4, "0")} | Cidades+`;

                if (!problema) {
                    return;
                }

                document.querySelector("#titulo_ocorrencia").textContent =
                    problema.titulo;

                document.querySelector("#local_ocorrencia").textContent =
                    `${problema.endereco}, ${problema.bairro}`;

                document.querySelector("#imagem_ocorrencia").src =
                    problema.imagem_url;

                document.querySelector("#descricao_ocorrencia").textContent =
                    problema.descricao;

                document.querySelector("#bairro_ocorrencia").textContent =
                    problema.bairro;

                document.querySelector("#endereco_ocorrencia").textContent =
                    problema.endereco;

                document.querySelector("#protocolo_ocorrencia").textContent =
                    `#URB-${String(problema.id).padStart(4, "0")}`;

                document.querySelector("#protocolo_navegacao").textContent =
                    `Ocorrência #URB-${String(problema.id).padStart(4, "0")}`;

                const enderecoMapa =
                    `${problema.endereco}, ${problema.bairro}, ${problema.cidade}, ${problema.estado}`;

                document.querySelector("#mapa_ocorrencia").src =
                    `https://www.google.com/maps?q=${encodeURIComponent(enderecoMapa)}&output=embed`;

                document.querySelector("#link_mapa_ocorrencia").href =
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoMapa)}`;
            })

            .catch((erro) => {
                console.error("Erro:", erro);

                document.querySelector("#titulo_ocorrencia").textContent =
                    "Erro ao carregar ocorrência";

                document.querySelector("#descricao_ocorrencia").textContent =
                    "Não foi possível carregar os dados desta ocorrência.";
            });
    }
}

// painel do cidadão
const listaDemandas = document.querySelector(".lista_demandas_painelcidadao");

if (listaDemandas) {
    async function carregarDenuncias() {
        if (!localStorage.getItem("token")) {
            window.location.href = "login.html";
            return;
        }

        try {
            const resposta = await fetch("/problemas", {
                headers: pegarCabecalhoToken(),
            });

            if (resposta.status === 401) {
                irParaLogin();
                return;
            }

            if (!resposta.ok) {
                throw new Error("Erro ao buscar denúncias");
            }

            const problemas = await resposta.json();

            listaDemandas.innerHTML = "";

            problemas.forEach((problema) => {
                const link = document.createElement("a");
                link.href = `ocorrencia.html?id=${problema.id}`;

                const article = document.createElement("article");
                article.className = "card_demanda_painelcidadao";

                const divImagem = document.createElement("div");
                divImagem.className = "imagem_demanda_painelcidadao";

                const imagem = document.createElement("img");
                imagem.src = problema.imagem_url;
                imagem.alt = problema.titulo;

                const status = document.createElement("span");
                status.className = "status_badge_painelcidadao status_andamento_painelcidadao";
                status.textContent = problema.status;

                divImagem.appendChild(imagem);
                divImagem.appendChild(status);

                const divConteudo = document.createElement("div");
                divConteudo.className = "conteudo_demanda_painelcidadao";

                const bairro = document.createElement("span");
                bairro.className = "local_demanda_painelcidadao";
                bairro.textContent = problema.bairro;

                const titulo = document.createElement("h2");
                titulo.className = "titulo_demanda_painelcidadao";
                titulo.textContent = problema.titulo;

                const descricao = document.createElement("p");
                descricao.className = "texto_demanda_painelcidadao";
                descricao.textContent = problema.descricao;

                divConteudo.appendChild(bairro);
                divConteudo.appendChild(titulo);
                divConteudo.appendChild(descricao);

                article.appendChild(divImagem);
                article.appendChild(divConteudo);

                link.appendChild(article);
                listaDemandas.appendChild(link);
            });
        } catch (erro) {
            console.error("Erro ao carregar denúncias:", erro);

            listaDemandas.innerHTML = `
                <p>Não foi possível carregar as denúncias.</p>
            `;
        }
    }

    carregarDenuncias();
}

// excluir ocorrência
const botaoDelete = document.querySelector("#btn_delete");

if (botaoDelete) {
    botaoDelete.addEventListener("click", async () => {
        const parametros = new URLSearchParams(window.location.search);
        const id = parametros.get("id");

        if (!id) {
            await mostrarModal("ID da ocorrência não encontrado.", { tipo: "erro" });
            return;
        }

        const confirmar = await mostrarConfirmacao("Tem certeza que deseja excluir esta denúncia?", {
            tipo: "aviso",
            titulo: "Excluir denúncia",
            textoConfirmar: "Excluir",
            textoCancelar: "Cancelar",
        });

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(`/problemas/${id}`, {
                method: "DELETE",
                headers: pegarCabecalhoToken(),
            });

            if (resposta.status === 401) {
                irParaLogin();
                return;
            }

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || "Erro ao excluir denúncia");
            }

            await mostrarModal("Denúncia excluída com sucesso!", { tipo: "sucesso" });
            window.location.href = "painelcidadao.html";
        } catch (erro) {
            console.error("Erro ao excluir denúncia:", erro);
            await mostrarModal("Não foi possível excluir a denúncia.", { tipo: "erro" });
        }
    });
}

function alternarTipoConta(tipo) {
    const ehCidadao = tipo === "cidadao";

    if (btnCidadao) {
        btnCidadao.classList.toggle("ativo", ehCidadao);
    }

    if (btnPrefeitura) {
        btnPrefeitura.classList.toggle("ativo", !ehCidadao);
    }

    if (camposCidadao) {
        camposCidadao.style.display = ehCidadao ? "block" : "none";
    }

    if (camposPrefeitura) {
        camposPrefeitura.style.display = ehCidadao ? "none" : "block";
    }

    // campo escondido não pode ser obrigatório
    ["name", "email", "cep"].forEach((id) => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.required = ehCidadao;
        }
    });

    ["orgao", "cnpj", "email_pref"].forEach((id) => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.required = !ehCidadao;
        }
    });
}

// editar ocorrência
const formEditar = document.querySelector(".form_editar_ocorrencia");

if (formEditar) {
    const parametrosEditar = new URLSearchParams(window.location.search);
    const idEditar = parametrosEditar.get("id");

    if (!localStorage.getItem("token")) {
        window.location.href = "/login.html";
    } else if (!idEditar) {
        mostrarModal("Ocorrência não encontrada.", { tipo: "erro" }).then(() => {
            window.location.href = "painelcidadao.html";
        });
    } else {
        // preenche o formulário com os dados atuais
        fetch(`/problemas/${idEditar}`, {
            headers: pegarCabecalhoToken(),
        })
            .then(async (resposta) => {
                if (resposta.status === 401) {
                    irParaLogin();
                    return;
                }

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar ocorrência");
                }

                return resposta.json();
            })

            .then((problema) => {
                if (!problema) {
                    return;
                }

                document.getElementById("titulo_ocorrencia").value = problema.titulo;
                document.getElementById("descricao_ocorrencia").value = problema.descricao;
                document.getElementById("cep_ocorrencia").value = problema.cep || "";
                document.getElementById("complemento_ocorrencia").value = problema.complemento || "";

                document.querySelector(".cidade_estado_local").textContent =
                    `${problema.bairro}, ${problema.cidade} - ${problema.estado}`;
            })

            .catch(async (erro) => {
                console.error("Erro ao carregar ocorrência:", erro);
                await mostrarModal("Não foi possível carregar esta ocorrência.", { tipo: "erro" });
                window.location.href = "painelcidadao.html";
            });

        // salva as alterações
        formEditar.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const cep = document.getElementById("cep_ocorrencia").value.replace(/\D/g, "");

            // cep é opcional, mas se vier precisa ter 8 dígitos
            if (cep !== "" && cep.length !== 8) {
                await mostrarModal("O CEP deve ter 8 dígitos", { tipo: "erro" });
                return;
            }

            try {
                const resposta = await fetch(`/problemas/${idEditar}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...pegarCabecalhoToken(),
                    },
                    body: JSON.stringify({
                        titulo: document.getElementById("titulo_ocorrencia").value.trim(),
                        descricao: document.getElementById("descricao_ocorrencia").value.trim(),
                        cep: cep,
                        complemento: document.getElementById("complemento_ocorrencia").value.trim(),
                    }),
                });

                if (resposta.status === 401) {
                    irParaLogin();
                    return;
                }

                const dados = await resposta.json();

                if (!resposta.ok) {
                    await mostrarModal(Array.isArray(dados.message) ? dados.message[0] : dados.message, { tipo: "erro" });
                    return;
                }

                await mostrarModal("Denúncia atualizada com sucesso!", { tipo: "sucesso" });
                window.location.href = `ocorrencia.html?id=${idEditar}`;
            } catch (erro) {
                console.error("Erro ao atualizar denúncia:", erro);
                await mostrarModal("Não foi possível atualizar a denúncia.", { tipo: "erro" });
            }
        });
    }
}