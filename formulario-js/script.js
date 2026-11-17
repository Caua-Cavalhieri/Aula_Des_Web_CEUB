const formulario = document.getElementById('formulario');
const nomeAluno = document.getElementById('nome_aluno');
const telefone = document.getElementById('telefone');
const cpf = document.getElementById('cpf');
const cep = document.getElementById('cep');
const serie = document.getElementById('serie');
const segundaLingua = document.getElementById('segunda_lingua');
const campoResponsavel = document.getElementById('campo_responsavel');
const botaoEnviar = document.getElementById('enviar');


// Máscaras

function mascaraCPF(valor) {
  valor = valor.replace(/\D/g, '').slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return valor;
}

function mascaraCEP(valor) {
  valor = valor.replace(/\D/g, '').slice(0, 8);
  valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
  return valor;
}

cpf.addEventListener('input', function () {
  cpf.value = mascaraCPF(cpf.value);
});

cep.addEventListener('input', function () {
  cep.value = mascaraCEP(cep.value);

  if (cep.value.length === 9) {
    buscarEndereco(cep.value.replace('-', ''));
  }
});

const matricula = document.getElementById('matricula');

matricula.addEventListener('input', function () {
  matricula.value = mascaraCPF(matricula.value);
});


// Endereço preenchido pelo CEP (ViaCEP)

function preencherEndereco(dados) {
  document.getElementById('logradouro').value = dados.logradouro || '';
  document.getElementById('complemento').value = dados.complemento || '';
  document.getElementById('bairro').value = dados.bairro || '';
  document.getElementById('cidade').value = dados.localidade || '';
  document.getElementById('estado').value = dados.uf || '';
  document.getElementById('ibge').value = dados.ibge || '';
}

function buscarEndereco(numeroCep) {
  fetch('https://viacep.com.br/ws/' + numeroCep + '/json/')
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {
      if (dados.erro) {
        preencherEndereco({});
        alert('CEP não encontrado.');
        return;
      }
      preencherEndereco(dados);
      document.getElementById('numero').focus();
    })
    .catch(function () {
      alert('Não foi possível buscar o CEP agora.');
    });
}


// Idade calculada pela data de nascimento

const nascimento = document.getElementById('nascimento');
const idade = document.getElementById('idade');

function calcularIdade() {
  if (!nascimento.value) {
    idade.value = '';
    return;
  }

  const hoje = new Date();
  const dataNascimento = new Date(nascimento.value + 'T00:00:00');
  let anos = hoje.getFullYear() - dataNascimento.getFullYear();
  const mes = hoje.getMonth() - dataNascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    anos--;
  }

  idade.value = anos >= 0 ? anos + ' anos' : '';
}

nascimento.addEventListener('change', calcularIdade);


// Estado e cidade (API do IBGE)

const estadoAluno = document.getElementById('estado_aluno');
const cidadeAluno = document.getElementById('cidade_aluno');

function limparCidades(texto) {
  cidadeAluno.innerHTML = '<option value="">' + texto + '</option>';
  cidadeAluno.disabled = true;
}

function carregarEstados() {
  fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (estados) {
      for (const estado of estados) {
        const opcao = document.createElement('option');
        opcao.value = estado.sigla;
        opcao.textContent = estado.nome;
        estadoAluno.appendChild(opcao);
      }
    });
}

function carregarCidades() {
  if (!estadoAluno.value) {
    limparCidades('Selecione primeiro o estado');
    return;
  }

  limparCidades('Carregando...');

  fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + estadoAluno.value + '/municipios?orderBy=nome')
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (cidades) {
      limparCidades('Selecione a cidade');
      for (const cidade of cidades) {
        const opcao = document.createElement('option');
        opcao.value = cidade.nome;
        opcao.textContent = cidade.nome;
        cidadeAluno.appendChild(opcao);
      }
      cidadeAluno.disabled = false;
    });
}

estadoAluno.addEventListener('change', carregarCidades);
carregarEstados();


// Botão de envio só habilita com nome e telefone preenchidos

function verificarNomeTelefone() {
  const preenchidos = nomeAluno.value.trim() !== '' && telefone.value.trim() !== '';
  botaoEnviar.disabled = !preenchidos;
}

nomeAluno.addEventListener('input', verificarNomeTelefone);
telefone.addEventListener('input', verificarNomeTelefone);


// Segunda língua só para o 5º ano

function mostrarSegundaLingua() {
  if (serie.value === '5ano') {
    segundaLingua.hidden = false;
  } else {
    segundaLingua.hidden = true;
    document.getElementById('ingles').checked = false;
    document.getElementById('espanhol').checked = false;
  }
}

serie.addEventListener('change', mostrarSegundaLingua);


// Turno da tarde pede o telefone do responsável

function mostrarTelefoneResponsavel() {
  if (document.getElementById('tarde').checked) {
    campoResponsavel.hidden = false;
  } else {
    campoResponsavel.hidden = true;
    document.getElementById('telefone_responsavel').value = '';
  }
}

document.getElementById('manha').addEventListener('change', mostrarTelefoneResponsavel);
document.getElementById('tarde').addEventListener('change', mostrarTelefoneResponsavel);


// Ao limpar, os campos voltam ao estado inicial

formulario.addEventListener('reset', function () {
  setTimeout(function () {
    verificarNomeTelefone();
    mostrarSegundaLingua();
    mostrarTelefoneResponsavel();
    limparCidades('Selecione primeiro o estado');
  }, 0);
});
