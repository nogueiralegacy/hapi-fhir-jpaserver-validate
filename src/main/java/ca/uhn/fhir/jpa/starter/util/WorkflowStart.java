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
	private final String diretorioObservado;
	private final String servidorFHIR = "http://localhost:8080/fhir";
	public WorkflowStart() {
		diretorioObservado = Paths.get(
			System.getProperty("user.home"), "temp").toString();
	}

	@PostConstruct
	public void start() {
		Thread threadFiscalFSH = new Thread(() -> subindoFiscalFSH());
		Thread threadFSH2FHIR = new Thread(() -> subindoConversorFSH2FHIR());
		Thread threadFiscalJSON = new Thread(() -> subindoFiscalJSON());

		threadFiscalFSH.start();
		threadFSH2FHIR.start();
		threadFiscalJSON.start();
	}

	private void tratandoDiretorio() {
		File diretorio = new File(diretorioObservado);

		if (!diretorio.exists()) {
			try {
				boolean diretorioCriado = diretorio.mkdirs();
				if (diretorioCriado) {
					System.out.println("Criado com sucesso diretorio" + diretorioObservado);
				} else {
					System.out.println("Erro ao criar o diretorio" + diretorioObservado);
				}

			} catch (Exception e) {
				System.out.println("Erro ao criar o diretorio" + diretorioObservado + e.getMessage());
			}
		}
	}

	public void subindoConversorFSH2FHIR() {
		Path diretorioFSH2FHIR = Paths.get(System.getProperty("user.dir"), "workflow", "fsh2fhir");

		Path diretorioExpress = Paths.get(diretorioFSH2FHIR.toString(), "express");

		List<String> comandos = new ArrayList<>();
		comandos.add("node");
		comandos.add("fsh2fhirExpress.js");

		try {
			subindoServico(comandos, diretorioExpress);

		} catch (IOException e) {
			System.out.println("Erro ao iniciar o conversor de fsh2fhir" + e.getMessage());
		}
	}

	public void subindoFiscalFSH() {
		Path diretorioFiscalFSH = Paths.get(System.getProperty("user.dir"), "workflow", "fiscal");

		List<String> comandos = new ArrayList<>();
		comandos.add("node");
		comandos.add("fiscal-fsh.js");
		comandos.add(diretorioObservado);

		try {
			subindoServico(comandos, diretorioFiscalFSH);

		} catch (IOException e) {
			System.out.println("Erro ao iniciar o fiscal de fsh" + e.getMessage());
		}
	}

	public void subindoFiscalJSON() {
		Path diretorioFiscalJSON = Paths.get(System.getProperty("user.dir"), "workflow", "fiscal");

		List<String> comandos = new ArrayList<>();
		comandos.add("node");
		comandos.add("fiscal.js");
		comandos.add(diretorioObservado);
		comandos.add(servidorFHIR);

		try {
			subindoServico(comandos, diretorioFiscalJSON);

		} catch (IOException e) {
			System.out.println("Erro ao iniciar o fiscal de json" + e.getMessage());
		}
	}

	private void subindoServico(List<String> comandosServico, Path diretorioServico) throws IOException{
		ProcessBuilder processBuilder = new ProcessBuilder(comandosServico);

		processBuilder.directory(diretorioServico.toFile());

		processBuilder.redirectErrorStream(true);

		Process processo = processBuilder.start();

		BufferedReader reader = new BufferedReader(new InputStreamReader(processo.getInputStream()));
		String linha;
		while ((linha = reader.readLine()) != null) {
			System.out.println(linha);
		}
	}
}
