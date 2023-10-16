package ca.uhn.fhir.jpa.starter.util;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
public class WorkflowStart {
	private static final String diretorioName = ".validate";
	private List<String> comandos = new ArrayList<>();
	public WorkflowStart() {
		String sistemaOperacional = System.getProperty("os.name").toLowerCase();

		if (sistemaOperacional.contains("win")) {
			comandos.add("cmd");
			comandos.add("/c");
			comandos.add("start");
		} else if (sistemaOperacional.contains("mac")) {
			comandos.add("open");
			comandos.add("-a");
			comandos.add("Terminal");
		} else if (sistemaOperacional.contains("nix") || sistemaOperacional.contains("nux")) {
			comandos.add("gnome-terminal");
		} else {
			System.out.println("Sistema operacional nao suportado");
		}
	}

	@PostConstruct
	public void starConversorFSH2FHIR() {
		Thread threadConversorFSH2FHIR = new Thread(() -> subindoConversorFSH2FHIR());

		threadConversorFSH2FHIR.start();
	}

	@PostConstruct
	public void starFiscalFSH() {
		Thread threadFiscalFSH = new Thread(() -> subindoFiscalFSH());

		threadFiscalFSH.start();
	}

	@PostConstruct
	public void starFiscalJSON() {
		Thread threadFiscalJSON = new Thread(() -> subindoFiscalJSON());

		threadFiscalJSON.start();
	}


	private Path tratandoDiretorio() {
		Path diretorioUsuario = Paths.get(System.getProperty("user.home"));
		Path diretorioObservado = diretorioUsuario.resolve(diretorioName);

		File diretorio = new File(diretorioObservado.toString());

		if (!diretorio.exists()) {
			try {
				boolean diretorioCriado = diretorio.mkdirs();
				if (diretorioCriado) {
					System.out.println("Diretorio .validate criado com sucesso!");
				} else {
					System.out.println("Erro ao criar o diretorio .validate");
				}

			} catch (Exception e) {
				System.out.println("Erro ao criar o diretorio .validate: " + e.getMessage());
			}
		}
		return diretorioObservado;
	}

	public void subindoConversorFSH2FHIR() {
		Path diretorioFSH2FHIR = Paths.get(System.getProperty("user.dir"), "workflow", "fsh2fhir");

		Path diretorioServico = Paths.get(diretorioFSH2FHIR.toString(), "servico");

		//instalarDependenciasNode(diretorioServico);

		Path diretorioExpress = Paths.get(diretorioFSH2FHIR.toString(), "express");

		//instalarDependenciasNode(diretorioExpress);

		List<String> comandosSufixo = new ArrayList<>();
		comandosSufixo.add("node");
		comandosSufixo.add("fsh2fhirExpress.js");

		try {
			subindoServico(comandosSufixo, diretorioExpress);

		} catch (IOException e) {
			System.out.println("Erro ao iniciar o conversor de fsh2fhir" + e.getMessage());
		}
	}

	public void subindoFiscalFSH() {
		Path diretorioFiscalFSH = Paths.get(System.getProperty("user.dir"), "workflow", "fiscal");

		//instalarDependenciasNode(diretorioFiscalFSH);

		List<String> comandosSufixo = new ArrayList<>();
		comandosSufixo.add("node");
		comandosSufixo.add("fiscal-fsh.js");
		// Indicar o diretorio a ser monitorado
		comandosSufixo.add(tratandoDiretorio().toString());

		try {
			subindoServico(comandosSufixo, diretorioFiscalFSH);

		} catch (IOException e) {
			System.out.println("Erro ao iniciar o fiscal de fsh" + e.getMessage());
		}
	}

	public void subindoFiscalJSON() {
		String servidorValidador = "http://localhost:8080/fhir";

		Path diretorioFiscalJSON = Paths.get(System.getProperty("user.dir"), "workflow", "fiscal");

		//instalarDependenciasNode(diretorioFiscalJSON);

		List<String> comandosSufixo = new ArrayList<>();
		comandosSufixo.add("node");
		comandosSufixo.add("fiscal.js");
		// Indicar o diretorio a ser monitorado
		comandosSufixo.add(tratandoDiretorio().toString());
		// Indicar o servidor de validacao
		comandosSufixo.add(servidorValidador);

		try {
			subindoServico(comandosSufixo, diretorioFiscalJSON);

		} catch (IOException e) {
			System.out.println("Erro ao iniciar o fiscal de json" + e.getMessage());
		}
	}


	private void subindoServico(List<String> comandosServico, Path diretorioServico) throws IOException{
		this.comandos.addAll(comandosServico);

		ProcessBuilder processBuilder = new ProcessBuilder(this.comandos);

		processBuilder.directory(diretorioServico.toFile());

		processBuilder.redirectErrorStream(true);

		Process processo = processBuilder.start();

		BufferedReader reader = new BufferedReader(new InputStreamReader(processo.getInputStream()));
		String linha;
		while ((linha = reader.readLine()) != null) {
			System.out.println(linha);
		}
	}

//	private void instalarDependenciasNode(Path diretorioServico) {
//		try {
//			ProcessBuilder processBuilder = new ProcessBuilder("npm", "install");
//
//			processBuilder.directory(diretorioServico.toFile());
//
//			processBuilder.redirectErrorStream(true);
//
//			Process processo = processBuilder.start();
//
//			BufferedReader reader = new BufferedReader(new InputStreamReader(processo.getInputStream()));
//			String linha;
//			while ((linha = reader.readLine()) != null) {
//				System.out.println(linha);
//			}
//
//			int exitCode = processo.waitFor();
//			if (exitCode == 0) {
//				System.out.println("\nInstalacao dos modulos feita com sucesso! " + diretorioServico);
//			} else {
//				System.out.println("\nErro ao instalar modulos " +  diretorioServico);
//			}
//		} catch (InterruptedException | IOException e) {
//			System.out.println("\nInstalacao dos modulos node falhou " + diretorioServico + e.getMessage());
//		}
//    }
}
