class BD {

	constructor() {
		let id = localStorage.getItem("id");

		if(id === null) {
			localStorage.setItem("id", 0);
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem("id");
		return parseInt(proximoId) + 1;
	}

	gravar(dados) {
		let id = this.getProximoId();
		localStorage.setItem(id, JSON.stringify(dados));
		localStorage.setItem("id", id);
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array();

		let id = localStorage.getItem("id");
		
		//Recupera todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar despesa
			let despesa = JSON.parse(localStorage.getItem(i));

			//verifica a possibilidade de haver indices que foram pulados/removidos
			//neste caso Pular estes indices
			if(despesa === null) {
				continue;
			}

			despesa.id = i;
			despesas.push(despesa);
		}

		return despesas;
	}

	pesquisar(despesa) {
		let despesasFiltradas = Array();
		despesasFiltradas = this.recuperarTodosRegistros();
		console.log(despesa);
		console.log(despesasFiltradas);

		//filtrar ano
		if(despesa.ano != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
		}

		//filtrar mes
		if(despesa.mes != "") {
		    despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
		}

		//filtrar dia
		if(despesa.dia!= "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
		}

		//filtrar tipo
		if(despesa.tipo != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
		}

		//filtrar descriçao
		if(despesa.descricao != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
		}

		//filtrar valor
		if(despesa.valor != "") {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
	   }

		return despesasFiltradas;
	}	

	removerRegistroDeDespesa(id) {
		localStorage.removeItem(id);
	}

}


let bd = new BD() ;


class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano;
		this.mes = mes;
		this.dia = dia;
		this.tipo = tipo;
		this.descricao = descricao;
		this.valor = valor;
	}

	validarDados() {
		for(let atributos in this) {
			if(this[atributos] == undefined || this[atributos] == '' || this[atributos] == null) {
				return false
			} 
		}

		return true;
	}
}


function cadastrarDespesa() {
	let ano = document.getElementById("ano").value;
	let mes = document.getElementById("mes").value;
	let dia = document.getElementById("dia").value;
	let tipo = document.getElementById("tipo").value;
	let descricao = document.getElementById("descricao").value;
	let valor = document.getElementById("valor").value;

	let despesa = new Despesa(
		ano,
		mes, 
		dia, 
		tipo, 
		descricao, 
		valor
	);

	if(despesa.validarDados()){
		bd.gravar(despesa);
		caixaDialogoSuccess();
	}

	else {
		caixaDialogoFail();
	}
}


function carregaListaDespesas(despesas = Array(), filtro = false) {

	if(despesas.length == 0 && filtro == false)  {
		despesas = bd.recuperarTodosRegistros();
	}

	//selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById("listaDespesas");

	//Limpando tabela
	listaDespesas.innerHTML = "";

	//percorrer o array despesas, listando cada despesa de forma dinamica
	despesas.forEach(function(despesa) {

		//criando as linhas (tr)
		let linha = listaDespesas.insertRow();

		//criando as colunas(td)
		linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`;
		
		//ajustar o tipo
		switch(parseInt(despesa.tipo)) {
			case 1: 
				despesa.tipo = "Alimentação";
			break;
			
			case 2:
				despesa.tipo = "Educação";
			break;
			
			case 3:
				despesa.tipo = "Lazer";
			break;	

			case 4:
				despesa.tipo = "Saúde";
			break;	

			case 5:
				despesa.tipo = "Transporte";
			break;			
		}

		linha.insertCell(1).innerHTML = `${despesa.tipo}`;
		linha.insertCell(2).innerHTML = `${despesa.descricao}`;
		linha.insertCell(3).innerHTML = `${despesa.valor}`;

		//criar o botao de exclusao
		let excluirDespesa = document.createElement("button");
		excluirDespesa.className = "btn btn-danger";
		excluirDespesa.innerHTML = "<i class = 'fas fa-times'></i>";
		excluirDespesa.id = `id_despesa_${despesa.id}`;
		excluirDespesa.onclick = function() {
			let id = this.id.replace("id_despesa_", "");
			alert(id);
			bd.removerRegistroDeDespesa(id);
			window.location.reload();
		}
		linha.insertCell(4).append(excluirDespesa);

		console.log(despesa);

	});
}


function caixaDialogoSuccess() {
	document.getElementById("modal_titulo").innerHTML = "Registro inserido com sucesso";
	document.getElementById("modal_botao").innerHTML = "Voltar";
	document.getElementById("modal_status").innerHTML = "Despesa Cadastrada";
	document.getElementById("modal_botao").className = "btn btn-success";
	document.getElementById("modal_titulo_div").className = "modal-header text-success";
	$("#modalRegistrarDespesa").modal("show");

	ano.value = "";
	mes.value = "";
	dia.value = "";
	tipo.value = "";
	descricao.value = "";
	valor.value = "";
}


function caixaDialogoFail() {
	document.getElementById("modal_titulo").innerHTML = "Dados Inválidos";
	document.getElementById("modal_botao").innerHTML = "Voltar e Corrigir";
	document.getElementById("modal_status").innerHTML = "Falha ao cadastrar despesa";
	document.getElementById("modal_botao").className = "btn btn-danger";
	document.getElementById("modal_titulo_div").className = "modal-header text-danger";	
	$("#modalRegistrarDespesa").modal("show");
}


function pesquisarDespesa() {	
	let ano = document.getElementById("ano").value;
	let mes = document.getElementById("mes").value;
	let dia = document.getElementById("dia").value;
	let tipo = document.getElementById("tipo").value;
	let descricao = document.getElementById("descricao").value;
	let valor = document.getElementById("valor").value;	

	let despesa = new Despesa(
		ano,
		mes, 
		dia, 
		tipo, 
		descricao, 
		valor
	);

	let despesas = bd.pesquisar(despesa);
	carregaListaDespesas(despesas, true);	

}