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
});


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
  }, 0);
});
