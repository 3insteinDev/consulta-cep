document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('cep-form');
  const cepInput = document.getElementById('cep');
  const resultado = document.getElementById('resultado');
  const mensagem = document.getElementById('mensagem');
  const limparBtn = document.getElementById('limpar-btn');
  const fields = ['logradouro', 'bairro', 'localidade', 'uf', 'ddd'];
  // Campos complementares (não vêm da API)
  const extraFields = ['numero', 'complemento', 'referencia'];

  // Mascara para CEP (99999-999)
  cepInput.addEventListener('input', function (e) {
    let v = cepInput.value.replace(/\D/g, '');
    if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5,8);
    cepInput.value = v;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    mensagem.textContent = '';
    resultado.classList.add('hidden');
    limparBtn.classList.add('hidden');
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      mensagem.textContent = 'Digite um CEP válido (8 dígitos).';
      return;
    }
    buscarCEP(cep);
  });

  function buscarCEP(cep) {
    mensagem.textContent = 'Consultando...';
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          mensagem.textContent = 'CEP não encontrado.';
          resultado.classList.add('hidden');
          return;
        }
        fields.forEach(f => {
          document.getElementById(f).value = data[f] || '';
        });
  mensagem.textContent = '';
  resultado.classList.remove('hidden');
  limparBtn.classList.remove('hidden');
      })
      .catch(() => {
        mensagem.textContent = 'Erro ao consultar o CEP.';
        resultado.classList.add('hidden');
  });
  }

  // Copiar valor ao clicar no ícone
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const field = btn.getAttribute('data-field');
      const input = document.getElementById(field);
      if (input && input.value) {
        navigator.clipboard.writeText(input.value).then(() => {
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i>';
          }, 1200);
        });
      }
    });
  });

  // Limpar dados / Nova consulta
  limparBtn.addEventListener('click', function () {
    cepInput.value = '';
    fields.concat(extraFields).forEach(f => {
      const el = document.getElementById(f);
      if (el) el.value = '';
    });
    resultado.classList.add('hidden');
    limparBtn.classList.add('hidden');
    mensagem.textContent = '';
    cepInput.focus();
  });
});
