function pegarCabecalhoToken() {
    return { Authorization: "Bearer " + localStorage.getItem("token") };
}

function irParaLogin() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// link "Denúncias" exige login
document.querySelectorAll('a[href="painelcidadao.html"]').forEach((link) => {
    link.addEventListener("click", (evento) => {
        if (!localStorage.getItem("token")) {
            evento.preventDefault();
            alert("Faça login para ver as denúncias.");
            window.location.href = "login.html";
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

        const cep = document.getElementById("gestor").value.replace(/\D/g, "");

        if (cep.length !== 8) {
            mensagemStatus.textContent = "O CEP deve ter 8 dígitos";
            return;
        }

        const token = localStorage.getItem("token");

        const resposta = await fetch("/perfil", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                nome: document.getElementById("orgao").value.trim(),
                email: document.getElementById("email_institucional").value.trim(),
                cep: cep,
                complemento: document.getElementById("cidade").value.trim(),
            }),
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagemStatus.textContent = Array.isArray(dados.message)
                ? dados.message[0]
                : dados.message;
            return;
        }

        await carregarPerfil();
        mensagemStatus.textContent = "Alterações salvas.";
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
            alert('Você precisa aceitar os termos!');
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
            alert('Dados Inválidos!');
            return;
        }

        const nome = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const cep = document.getElementById('cep').value;
        const senha = document.getElementById('senha').value;
        const confirmar = document.getElementById('confirm_senha').value;

        if (senha !== confirmar) {
            alert('As senhas não são iguais');
            return;
        }

        if (senha.length < 6) {
            alert('A senha deve conter pelo menos seis caracteres');
            return;
        }

        if (cep.length !== 8) {
            alert('O CEP deve conter 8 dígitos');
            return;
        }

        const resposta = await fetch('/cadastrar.html', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, cep, senha }),
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert('Cadastro feito!');
            window.location.href = '/login.html';
        } else {
            alert(dados.message);
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
            const resposta = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, senha: senha }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.message);
                return;
            }

            localStorage.setItem('token', dados.token);
            window.location.href = '/painelcidadao.html';
        } catch (erro) {
            console.error(erro);
            alert('Erro ao conectar com o servidor.');
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
            alert("ID da ocorrência não encontrado.");
            return;
        }

        const confirmar = confirm("Tem certeza que deseja excluir esta denúncia?");

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

            alert("Denúncia excluída com sucesso!");
            window.location.href = "painelcidadao.html";
        } catch (erro) {
            console.error("Erro ao excluir denúncia:", erro);
            alert("Não foi possível excluir a denúncia.");
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
        alert("Ocorrência não encontrada.");
        window.location.href = "painelcidadao.html";
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

            .catch((erro) => {
                console.error("Erro ao carregar ocorrência:", erro);
                alert("Não foi possível carregar esta ocorrência.");
                window.location.href = "painelcidadao.html";
            });

        // salva as alterações
        formEditar.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const cep = document.getElementById("cep_ocorrencia").value.replace(/\D/g, "");

            // cep é opcional, mas se vier precisa ter 8 dígitos
            if (cep !== "" && cep.length !== 8) {
                alert("O CEP deve ter 8 dígitos");
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
                    alert(Array.isArray(dados.message) ? dados.message[0] : dados.message);
                    return;
                }

                alert("Denúncia atualizada com sucesso!");
                window.location.href = `ocorrencia.html?id=${idEditar}`;
            } catch (erro) {
                console.error("Erro ao atualizar denúncia:", erro);
                alert("Não foi possível atualizar a denúncia.");
            }
        });
    }
}